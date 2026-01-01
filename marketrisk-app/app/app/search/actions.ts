'use server'

import { createClient } from '@/lib/supabase/server'
import { fetchCompanyByCUI, parseANAFResponse, validateCUI } from '@/lib/anaf/client'
import { calculateRiskScore } from '@/lib/anaf/risk-calculator'
import type { CompanySearchResult } from '@/lib/anaf/types'

export interface SearchResult {
  success: boolean
  data?: CompanySearchResult
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
    const { data: profile } = await supabase
      .from('profiles')
      .select('subscription_plan, searches_used, searches_limit')
      .eq('id', user.id)
      .single()

    if (!profile) {
      return {
        success: false,
        error: 'Profil utilizator negăsit'
      }
    }

    // Check if user has reached their limit
    if (profile.searches_used >= profile.searches_limit) {
      return {
        success: false,
        error: `Ai atins limita de ${profile.searches_limit} căutări pentru planul ${profile.subscription_plan}`,
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

    // Calculate risk score
    const riskScore = calculateRiskScore(companyData)

    // Prepare result
    const result: CompanySearchResult = {
      company: companyData,
      riskScore,
      lastUpdated: new Date().toISOString()
    }

    // Increment searches_used counter
    await supabase
      .from('profiles')
      .update({
        searches_used: profile.searches_used + 1,
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id)

    // Save to search history
    await supabase
      .from('search_history')
      .insert({
        user_id: user.id,
        cui: companyData.cui,
        company_name: companyData.name,
        risk_level: riskScore.level,
        risk_score: riskScore.value,
        search_data: result
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
 * Get remaining searches for current user
 */
export async function getRemainingSearches(): Promise<{ used: number; limit: number; remaining: number }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { used: 0, limit: 0, remaining: 0 }
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('searches_used, searches_limit')
    .eq('id', user.id)
    .single()

  if (!profile) {
    return { used: 0, limit: 0, remaining: 0 }
  }

  return {
    used: profile.searches_used || 0,
    limit: profile.searches_limit || 0,
    remaining: Math.max(0, (profile.searches_limit || 0) - (profile.searches_used || 0))
  }
}
