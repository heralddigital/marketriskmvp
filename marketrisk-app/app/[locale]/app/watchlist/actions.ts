'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export interface WatchlistItem {
  id: string
  company_id: string
  cui: string
  company_name: string
  current_risk_level: string | null
  current_risk_score: number | null
  added_at: string
  last_check: string | null
  last_status: string | null
  alert_on_change: boolean
}

/**
 * Add company to watchlist
 * Can use either companyId or cui to find the company
 */
export async function addToWatchlist(
  companyIdOrCui: string, 
  cui: string, 
  companyName: string,
  useCui: boolean = false,
  riskData?: { level: string; score: number } | null
): Promise<{
  success: boolean
  error?: string
  limitReached?: boolean
}> {
  try {
    const supabase = await createClient()
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
      redirect('/login')
    }

    // Get user profile to check limits and plan
    const { data: profile } = await supabase
      .from('users')
      .select('watchlist_limit, plan')
      .eq('id', user.id)
      .single() as { data: { watchlist_limit: number; plan: string } | null }

    if (!profile) {
      return { success: false, error: 'Profil utilizator negăsit' }
    }

    // Set limits based on plan (always recalculate to ensure consistency)
    const planLimits: Record<string, number> = {
      free: 0,
      starter: 10,
      pro: 250,
      enterprise: -1, // unlimited
    }
    
    const userPlan = (profile.plan || 'free').toLowerCase()
    let watchlistLimit = planLimits[userPlan] ?? 0
    
    // If the stored limit doesn't match the plan limit, update it
    // (unless it's free plan which should be 0)
    if (profile.watchlist_limit !== watchlistLimit) {
      // Update the user's watchlist_limit to match their plan
      const { error: updateError } = await (supabase.from('users') as any).update({
        watchlist_limit: watchlistLimit,
        updated_at: new Date().toISOString()
      }).eq('id', user.id)
      
      if (updateError) {
        console.error('Error updating watchlist limit:', updateError)
        // Continue anyway with the calculated limit
      }
    } else {
      // Use the stored limit if it matches
      watchlistLimit = profile.watchlist_limit
    }

    // Check current watchlist count
    const { count: currentCount } = await supabase
      .from('watchlist')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id) as { count: number | null }

    const watchlistCount = currentCount || 0

    // Check if limit reached (watchlist_limit of -1 means unlimited)
    // Also check if limit is 0 (free plan)
    if (watchlistLimit === 0) {
      return {
        success: false,
        error: `Planul tău (${userPlan}) nu include watchlist. Upgrade la Starter pentru 10 companii în watchlist.`,
        limitReached: true
      }
    }
    
    if (watchlistLimit !== -1 && watchlistCount >= watchlistLimit) {
      return {
        success: false,
        error: `Ai atins limita de ${watchlistLimit} companii în watchlist pentru planul tău (${userPlan}).`,
        limitReached: true
      }
    }

    // Find or create company record
    let companyId: string | null = null

    if (useCui || !companyIdOrCui) {
      // Find company by CUI
      const { data: companyByCui } = await supabase
        .from('companies')
        .select('id')
        .eq('cui', cui)
        .single() as { data: { id: string } | null }

      if (companyByCui) {
        companyId = companyByCui.id
        // Update risk data if provided and company exists but doesn't have risk data
        if (riskData) {
          const { data: existingCompany } = await supabase
            .from('companies')
            .select('current_risk_level, current_risk_score')
            .eq('id', companyId)
            .single() as { data: { current_risk_level: string | null; current_risk_score: number | null } | null }
          
          if (existingCompany && (!existingCompany.current_risk_level || !existingCompany.current_risk_score)) {
            // Update with risk data
            await (supabase.from('companies') as any).update({
              current_risk_level: riskData.level,
              current_risk_score: riskData.score,
              updated_at: new Date().toISOString()
            }).eq('id', companyId)
          }
        }
      } else {
        // Company doesn't exist in database, create it
        const companyData: any = {
          cui: cui,
          company_name: companyName || 'N/A',
          anaf_data: {} as any, // Empty JSONB object
          company_active: true,
          vat_active: false,
          vat_split_regime: false,
          state_debts: 0,
          active_lawsuits: 0,
          lost_cases_2y: 0,
          bankruptcy_filing: false,
          insolvency_status: 'none',
          last_anaf_check: new Date().toISOString()
        }
        
        // Add risk data if provided
        if (riskData) {
          companyData.current_risk_level = riskData.level
          companyData.current_risk_score = riskData.score
        }
        
        const { data: newCompany, error: createError } = await (supabase.from('companies') as any).insert(companyData).select('id').single() as { data: { id: string } | null; error: any }

        if (createError) {
          console.error('Error creating company:', createError)
          // If it's a duplicate key error, try to fetch the company again
          if (createError.code === '23505' || createError.message?.includes('duplicate')) {
            const { data: existingCompany } = await supabase
              .from('companies')
              .select('id')
              .eq('cui', cui)
              .single() as { data: { id: string } | null }
            if (existingCompany) {
              companyId = existingCompany.id
            } else {
              return { 
                success: false, 
                error: `Eroare la crearea înregistrării companiei: ${createError.message || 'Eroare necunoscută'}` 
              }
            }
          } else {
            return { 
              success: false, 
              error: `Eroare la crearea înregistrării companiei: ${createError.message || 'Eroare necunoscută'}` 
            }
          }
        } else if (!newCompany) {
          return { success: false, error: 'Eroare la crearea înregistrării companiei: Nu s-a returnat ID-ul companiei' }
        } else {
          companyId = newCompany.id
        }
      }
    } else {
      companyId = companyIdOrCui
    }

    if (!companyId) {
      return { success: false, error: 'Nu s-a putut identifica compania' }
    }

    // Check if already in watchlist
    const { data: existing } = await supabase
      .from('watchlist')
      .select('id')
      .eq('user_id', user.id)
      .eq('company_id', companyId)
      .single() as { data: { id: string } | null }

    if (existing) {
      return { success: false, error: 'Compania este deja în watchlist-ul tău' }
    }

    // Add to watchlist
    const { error: insertError } = await (supabase.from('watchlist') as any).insert({
      user_id: user.id,
      company_id: companyId,
      alert_on_change: true,
      added_at: new Date().toISOString(),
      last_check: new Date().toISOString(),
      last_status: 'GREEN'
    })

    if (insertError) {
      console.error('Error adding to watchlist:', insertError)
      return { success: false, error: 'Eroare la adăugarea în watchlist' }
    }

    return { success: true }
  } catch (error) {
    console.error('Add to watchlist error:', error)
    return { success: false, error: 'Eroare necunoscută' }
  }
}

/**
 * Remove company from watchlist
 */
export async function removeFromWatchlist(watchlistId: string): Promise<{
  success: boolean
  error?: string
}> {
  try {
    const supabase = await createClient()
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
      redirect('/login')
    }

    // Verify ownership and delete
    const { error } = await supabase
      .from('watchlist')
      .delete()
      .eq('id', watchlistId)
      .eq('user_id', user.id)

    if (error) {
      return { success: false, error: 'Eroare la ștergerea din watchlist' }
    }

    return { success: true }
  } catch (error) {
    console.error('Remove from watchlist error:', error)
    return { success: false, error: 'Eroare necunoscută' }
  }
}

/**
 * Toggle alerts for a watchlist item
 */
export async function toggleWatchlistAlerts(watchlistId: string, enabled: boolean): Promise<{
  success: boolean
  error?: string
}> {
  try {
    const supabase = await createClient()
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
      redirect('/login')
    }

    const { error } = await (supabase.from('watchlist') as any).update({
      alert_on_change: enabled
    })
      .eq('id', watchlistId)
      .eq('user_id', user.id)

    if (error) {
      return { success: false, error: 'Eroare la actualizarea alerțelor' }
    }

    return { success: true }
  } catch (error) {
    console.error('Toggle alerts error:', error)
    return { success: false, error: 'Eroare necunoscută' }
  }
}

/**
 * Get user's watchlist
 */
export async function getWatchlist(): Promise<{
  success: boolean
  data?: WatchlistItem[]
  watchlistLimit?: number
  error?: string
}> {
  try {
    const supabase = await createClient()
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
      redirect('/login')
    }

    const { data, error } = await supabase
      .from('watchlist')
      .select(`
        id,
        company_id,
        added_at,
        last_check,
        last_status,
        alert_on_change,
        companies!inner (
          cui,
          company_name,
          current_risk_level,
          current_risk_score
        )
      `)
      .eq('user_id', user.id)
      .order('added_at', { ascending: false }) as {
        data: any[] | null
        error: any
      }

    // For companies without risk data, try to get latest from risk_score_history
    if (data) {
      for (const item of data) {
        if (!item.companies?.current_risk_level || !item.companies?.current_risk_score) {
          const cui = item.companies?.cui
          if (cui) {
            // Get latest risk score from history
            const { data: latestRisk } = await supabase
              .from('risk_score_history')
              .select('risk_level, risk_score')
              .eq('cui', cui)
              .order('calculated_at', { ascending: false })
              .limit(1)
              .single() as { data: { risk_level: string; risk_score: number } | null }
            
            if (latestRisk) {
              // Update the company with risk data
              await (supabase.from('companies') as any).update({
                current_risk_level: latestRisk.risk_level,
                current_risk_score: latestRisk.risk_score,
                updated_at: new Date().toISOString()
              }).eq('id', item.company_id)
              
              // Update the item data for this response
              item.companies.current_risk_level = latestRisk.risk_level
              item.companies.current_risk_score = latestRisk.risk_score
            }
          }
        }
      }
    }

    if (error) {
      return { success: false, error: 'Eroare la încărcarea watchlist-ului' }
    }

    // Get user's watchlist limit
    const { data: profile } = await supabase
      .from('users')
      .select('watchlist_limit')
      .eq('id', user.id)
      .single() as { data: { watchlist_limit: number } | null }

    // Transform data to match WatchlistItem interface
    const watchlistItems: WatchlistItem[] = (data || []).map((item: any) => ({
      id: item.id,
      company_id: item.company_id,
      cui: item.companies?.cui || '',
      company_name: item.companies?.company_name || 'N/A',
      current_risk_level: item.companies?.current_risk_level || null,
      current_risk_score: item.companies?.current_risk_score || null,
      added_at: item.added_at,
      last_check: item.last_check,
      last_status: item.last_status,
      alert_on_change: item.alert_on_change,
    }))

    return { 
      success: true, 
      data: watchlistItems,
      watchlistLimit: profile?.watchlist_limit || 10
    }
  } catch (error) {
    console.error('Get watchlist error:', error)
    return { success: false, error: 'Eroare necunoscută' }
  }
}

/**
 * Check if company is in watchlist
 * Can check by companyId or CUI
 */
export async function isInWatchlist(companyIdOrCui: string): Promise<boolean> {
  try {
    const supabase = await createClient()
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
      return false
    }

    // Try to find company by CUI first (in case companyId is actually a CUI)
    const { data: company } = await supabase
      .from('companies')
      .select('id')
      .eq('cui', companyIdOrCui)
      .single() as { data: { id: string } | null }

    const actualCompanyId = company?.id || companyIdOrCui

    const { data } = await supabase
      .from('watchlist')
      .select('id')
      .eq('user_id', user.id)
      .eq('company_id', actualCompanyId)
      .single() as { data: { id: string } | null }

    return !!data
  } catch (error) {
    return false
  }
}

