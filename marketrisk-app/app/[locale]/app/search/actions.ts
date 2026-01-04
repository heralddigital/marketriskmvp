'use server'

import { createClient } from '@/lib/supabase/server'
import { fetchCompanyByCUI, parseANAFResponse, validateCUI } from '@/lib/anaf/client'
import type { CompanySearchResult } from '@/lib/anaf/types'
import type { Database } from '@/types/supabase'
import { saveCompanyHistory, detectChanges } from '@/lib/company-history/service'
import { fetchPortalJustData, calculateLitigationRisk } from '@/lib/portaljust/client'
import { calculateMarketRiskScore } from '@/lib/risk-algorithm/calculator'
import { transformLitigationToRiskData } from '@/lib/risk-algorithm/litigation-transformer'
import type { CompanyRiskData } from '@/lib/risk-algorithm/factors'
import { calculateFinancialRiskFactors } from '@/lib/mfinante/service'

export interface SearchResult {
  success: boolean
  data?: CompanySearchResult & { 
    companyId?: string
    litigation?: {
      lawsuits: any[]
      total: number
      riskMetrics: {
        activeLawsuits: number
        lostCases2y: number
        totalLawsuits: number
        hasBankruptcyFiling: boolean
        hasExecutionProceedings: boolean
      }
    }
  }
  error?: string
  limitReached?: boolean
}

/**
 * Search for a company by CUI using ANAF API
 * Also tracks usage and enforces plan limits
 */
export async function searchCompany(cui: string): Promise<SearchResult> {
  try {
    // Validate CUI format
    const validation = validateCUI(cui)
    if (!validation.valid) {
      return {
        success: false,
        error: validation.error
      }
    }

    // Get current user and check limits
    const supabase = await createClient()
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
      return {
        success: false,
        error: 'Trebuie să fii autentificat pentru a căuta'
      }
    }

    // Get user profile to check plan limits
    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('plan, searches_this_month, search_limit_monthly')
      .eq('id', user.id)
      .single() as { 
        data: { plan: string; searches_this_month: number; search_limit_monthly: number } | null;
        error: any;
      }

    if (!profile || profileError) {
      return {
        success: false,
        error: 'Profil utilizator negăsit'
      }
    }

    // Check if user has reached their limit
    // -1 means unlimited, so skip limit check
    if (profile.search_limit_monthly !== -1 && profile.searches_this_month >= profile.search_limit_monthly) {
      return {
        success: false,
        error: `Ai atins limita de ${profile.search_limit_monthly} căutări pentru planul ${profile.plan}`,
        limitReached: true
      }
    }

    // Fetch company data from ANAF
    const anafResponse = await fetchCompanyByCUI(cui)

    if (!anafResponse || anafResponse.found.length === 0) {
      return {
        success: false,
        error: 'Companie negăsită în baza de date ANAF'
      }
    }

    // Parse ANAF response
    const companyData = parseANAFResponse(anafResponse)

    if (!companyData) {
      return {
        success: false,
        error: 'Eroare la procesarea datelor companiei'
      }
    }

    // Fetch PortalJust litigation data (non-blocking)
    let litigationData: SearchResult['data']['litigation'] | undefined
    let portalJustLawsuits: any[] = []
    
    try {
      const portalJustResponse = await fetchPortalJustData(
        companyData.name,
        companyData.cui,
        {
          includeClosed: true, // Include closed cases for risk calculation
        }
      )

      if (portalJustResponse.success && portalJustResponse.lawsuits.length > 0) {
        portalJustLawsuits = portalJustResponse.lawsuits
        const riskMetrics = calculateLitigationRisk(portalJustResponse.lawsuits)
        litigationData = {
          lawsuits: portalJustResponse.lawsuits,
          total: portalJustResponse.total,
          riskMetrics,
        }
      }
    } catch (error) {
      console.warn('Error fetching PortalJust data:', error)
      // Continue without litigation data
    }

    // Prepare risk data for comprehensive risk calculation
    const registrationDate = companyData.registrationDate 
      ? new Date(companyData.registrationDate) 
      : new Date()
    const companyAgeMonths = Math.floor(
      (Date.now() - registrationDate.getTime()) / (1000 * 60 * 60 * 24 * 30)
    )

    // Transform PortalJust data to risk calculation format
    const portalJustRiskData = transformLitigationToRiskData(portalJustLawsuits)

    // Fetch financial risk factors from MFinante (non-blocking)
    let financialRiskFactors
    try {
      financialRiskFactors = await calculateFinancialRiskFactors(companyData.cui)
    } catch (error) {
      console.warn('Error fetching financial risk factors:', error)
      // Use safe defaults if fetch fails
      financialRiskFactors = {
        missingStatements: true,
        delayedFiling: false,
        negativeEquity: false,
        revenueDrop50: false,
      }
    }

    // Build comprehensive risk data
    const riskData: CompanyRiskData = {
      anaf: {
        stare_firma: companyData.status || 'NECUNOSCUT',
        vat_deregistered: !companyData.vatRegistration?.isRegistered,
        split_vat_regime: companyData.isVATSplit || false,
        state_debts_eur: 0, // Would need additional ANAF endpoint
        company_age_months: companyAgeMonths,
        address_changes_2y: 0, // Would need history tracking
        employees: 0, // Not available from ANAF
      },
      bpi: {
        active_insolvency: false, // Would need BPI integration
        insolvency_history_3y: false,
      },
      portaljust: portalJustRiskData,
      mfinante: financialRiskFactors ? {
        missing_statements: financialRiskFactors.missingStatements,
        delayed_filing: financialRiskFactors.delayedFiling,
        negative_equity: financialRiskFactors.negativeEquity,
        revenue_drop_50: financialRiskFactors.revenueDrop50,
      } : undefined,
      additional: {
        certified_accounts: false,
        is_exporter: false,
      },
    }

    // Calculate comprehensive risk score using main algorithm
    const riskScoreResult = calculateMarketRiskScore(riskData)

    // Transform to expected format (matching CompanySearchResult.riskScore from lib/anaf/types.ts)
    // The riskScoreResult uses points-based system (higher points = higher risk)
    // We convert to 0-100 score where higher = better (inverse of points)
    const totalPoints = riskScoreResult.details.reduce((sum, d) => sum + d.points, 0)
    // Clamp points to reasonable range (0-150) and invert to score
    const clampedPoints = Math.max(0, Math.min(150, totalPoints))
    const normalizedScore = Math.max(0, Math.min(100, Math.round(100 - (clampedPoints / 150) * 100)))
    
    // Determine level based on score (matching the algorithm thresholds)
    let level: 'GREEN' | 'YELLOW' | 'RED'
    if (normalizedScore >= 75) {
      level = 'GREEN'
    } else if (normalizedScore >= 50) {
      level = 'YELLOW'
    } else {
      level = 'RED'
    }
    
    const riskScore = {
      level,
      value: normalizedScore,
      factors: riskScoreResult.details.map((detail) => ({
        name: detail.factor,
        description: detail.factor,
        impact: detail.points > 0 ? ('negative' as const) : detail.points < 0 ? ('positive' as const) : ('neutral' as const),
        weight: Math.abs(detail.points),
        points: detail.points,
        score: 0, // Not used in this format
        category: detail.category,
      })),
      lastCalculated: riskScoreResult.calculatedAt,
    }

    // Detect changes from last snapshot (non-blocking)
    let changesDetected: string[] = []
    try {
      changesDetected = await detectChanges(cui, companyData)
    } catch (error) {
      console.warn('Error detecting changes:', error)
      // Continue without change detection
    }

    // Save or update company in database (non-blocking)
    let companyId: string | null = null
    try {
      const { data: existingCompany, error: fetchError } = await supabase
        .from('companies')
        .select('id')
        .eq('cui', companyData.cui)
        .single() as { data: { id: string } | null; error: any }

      if (existingCompany) {
        companyId = existingCompany.id
        // Update existing company
        await (supabase.from('companies') as any).update({
          company_name: companyData.name,
          registration_number: companyData.registrationNumber,
          anaf_data: companyData,
          vat_active: companyData.vatRegistration?.isRegistered ?? false,
          vat_split_regime: companyData.isVATSplit,
          company_active: !companyData.isInactive,
          current_risk_score: riskScore.value,
          current_risk_level: riskScore.level,
          risk_details: riskScore,
          last_anaf_check: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }).eq('id', companyId)
      } else {
        // Create new company
        const { data: newCompany, error: insertError } = await (supabase.from('companies') as any).insert({
          cui: companyData.cui,
          company_name: companyData.name,
          registration_number: companyData.registrationNumber,
          anaf_data: companyData,
          vat_active: companyData.vatRegistration?.isRegistered ?? false,
          vat_split_regime: companyData.isVATSplit,
          company_active: !companyData.isInactive,
          current_risk_score: riskScore.value,
          current_risk_level: riskScore.level,
          risk_details: riskScore,
          last_anaf_check: new Date().toISOString()
        }).select('id').single() as { data: { id: string } | null; error: any }

        if (insertError || !newCompany) {
          console.warn('Error creating company record:', insertError)
          // Try to fetch again in case it was created by another request
          const { data: retryCompany } = await supabase
            .from('companies')
            .select('id')
            .eq('cui', companyData.cui)
            .single() as { data: { id: string } | null }
          if (retryCompany) {
            companyId = retryCompany.id
          }
        } else {
          companyId = newCompany.id
        }
      }

      // Save to company history (only if we have a companyId)
      if (companyId) {
        try {
          await saveCompanyHistory(
            companyId,
            cui,
            companyData,
            { value: riskScore.value, level: riskScore.level },
            changesDetected
          )
        } catch (historyError) {
          console.warn('Error saving company history:', historyError)
          // Continue - history saving is non-critical
        }
      }
    } catch (dbError) {
      console.warn('Error saving company to database:', dbError)
      // Continue - database saving is non-critical for search results
    }

    // Prepare result (include companyId and litigation if available)
    const result = {
      company: companyData,
      riskScore,
      lastUpdated: new Date().toISOString(),
      companyId: companyId || undefined,
      litigation: litigationData,
    } as CompanySearchResult & { 
      companyId?: string
      litigation?: SearchResult['data']['litigation']
    }

    // Increment searches counter
    const updatePayload = {
      searches_this_month: profile.searches_this_month + 1,
      updated_at: new Date().toISOString()
    }
    await (supabase.from('users') as any).update(updatePayload).eq('id', user.id)

    // Save to search history
    const { error: historyInsertError } = await (supabase.from('search_history') as any).insert({
        user_id: user.id,
        cui: companyData.cui,
        company_name: companyData.name,
        risk_level: riskScore.level,
        risk_score: riskScore.value,
        search_data: result
      })

    if (historyInsertError) {
      console.error('Error saving to search_history:', historyInsertError)
      // Don't fail the search if history save fails
    } else {
      console.log('Search history saved successfully for CUI:', companyData.cui)
    }

    // Save to risk score history for trend analysis
    await (supabase.from('risk_score_history') as any).insert({
        cui: companyData.cui,
        company_name: companyData.name,
        risk_level: riskScore.level,
        risk_score: riskScore.value,
        risk_factors: riskScore.factors,
        company_snapshot: companyData,
        triggered_by: user.id
      })

    return {
      success: true,
      data: result
    }

  } catch (error) {
    console.error('Search error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Eroare necunoscută la căutare'
    }
  }
}

/**
 * Get risk score history for a company
 */
export async function getRiskHistory(cui: string): Promise<{
  success: boolean
  data?: Array<{
    calculated_at: string
    risk_level: string
    risk_score: number
    risk_factors: any
  }>
  trend?: {
    trend: string
    current_score: number
    previous_score: number
    score_change: number
    days_since_last: number
  }
  error?: string
}> {
  try {
    const supabase = await createClient()

    // Get historical data (last 30 entries or 1 year)
    const { data: history, error: historyError } = await (supabase.rpc as any)('get_risk_score_history', {
        p_cui: cui,
        p_limit: 30,
        p_days: 365
      })

    if (historyError) {
      console.error('Error fetching risk history:', historyError)
      return { success: false, error: 'Eroare la încărcarea istoricului' }
    }

    // Get trend analysis
    const { data: trendData, error: trendError } = await (supabase.rpc as any)('get_risk_trend', { p_cui: cui })
      .single()

    if (trendError) {
      console.error('Error fetching risk trend:', trendError)
    }

    return {
      success: true,
      data: history || [],
      trend: trendData || undefined
    }

  } catch (error) {
    console.error('Get risk history error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Eroare necunoscută'
    }
  }
}

/**
 * Get remaining searches for current user
 */
export async function getRemainingSearches(): Promise<{ used: number; limit: number; remaining: number }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { used: 0, limit: 0, remaining: 0 }
  }

  const { data: profile } = await supabase
    .from('users')
    .select('searches_this_month, search_limit_monthly')
    .eq('id', user.id)
    .single() as { 
      data: { searches_this_month: number; search_limit_monthly: number } | null;
    }

  if (!profile) {
    return { used: 0, limit: 0, remaining: 0 }
  }

  // Handle unlimited (-1) limits
  const limit = profile.search_limit_monthly === -1 ? Infinity : (profile.search_limit_monthly || 0)
  const used = profile.searches_this_month || 0
  const remaining = limit === Infinity ? Infinity : Math.max(0, limit - used)
  
  return {
    used,
    limit: limit === Infinity ? -1 : limit, // Return -1 for unlimited to match database
    remaining: remaining === Infinity ? -1 : remaining // Return -1 for unlimited
  }
}
