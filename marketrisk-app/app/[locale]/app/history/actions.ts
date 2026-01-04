'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export interface SearchHistoryItem {
  id: string
  cui: string
  company_name: string
  risk_level: string | null
  risk_score: number | null
  created_at: string
  search_data?: any
}

/**
 * Get user's search history
 */
export async function getSearchHistory(): Promise<{
  success: boolean
  data?: SearchHistoryItem[]
  error?: string
}> {
  try {
    const supabase = await createClient()
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
      redirect('/login')
    }

    // Fetch search history for the current user, ordered by most recent first
    // Use * to select all columns in case column names differ
    const { data, error } = await supabase
      .from('search_history')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(100)

    if (error) {
      console.error('Error fetching search history:', error)
      console.error('Error details:', JSON.stringify(error, null, 2))
      console.error('User ID:', user.id)
      return { success: false, error: `Eroare la încărcarea istoricului: ${error.message || 'Eroare necunoscută'}` }
    }

    console.log('Search history fetched:', { count: data?.length || 0, userId: user.id })
    
    // Map the data to match our interface, handling different possible column names
    // If risk_level/risk_score columns don't exist, extract from search_data JSONB
    const mappedData: SearchHistoryItem[] = (data || []).map((item: any) => {
      // Try to get risk data from columns first, then fall back to search_data
      let riskLevel = item.risk_level || null
      let riskScore = item.risk_score || null
      
      // If columns don't exist, try to extract from search_data
      if (!riskLevel && item.search_data && item.search_data.riskScore) {
        riskLevel = item.search_data.riskScore.level || null
        riskScore = item.search_data.riskScore.value || null
      }
      
      return {
        id: item.id,
        cui: item.cui,
        company_name: item.company_name,
        risk_level: riskLevel,
        risk_score: riskScore,
        created_at: item.created_at,
        search_data: item.search_data
      }
    })

    return {
      success: true,
      data: mappedData
    }
  } catch (error) {
    console.error('Get search history error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Eroare necunoscută'
    }
  }
}

/**
 * Get search history statistics
 */
export async function getSearchHistoryStats(): Promise<{
  success: boolean
  stats?: {
    total: number
    thisMonth: number
    exported: number
  }
  error?: string
}> {
  try {
    const supabase = await createClient()
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
      redirect('/login')
    }

    // Get total searches
    const { count: totalCount, error: countError } = await supabase
      .from('search_history')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)

    if (countError) {
      console.error('Error counting search history:', countError)
    }

    // Get searches this month
    const startOfMonth = new Date()
    startOfMonth.setDate(1)
    startOfMonth.setHours(0, 0, 0, 0)

    const { count: monthCount, error: monthCountError } = await supabase
      .from('search_history')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .gte('created_at', startOfMonth.toISOString())

    if (monthCountError) {
      console.error('Error counting monthly search history:', monthCountError)
    }

    // For now, exported count is 0 (PDF export feature not yet implemented)
    // TODO: Add exported column to search_history or create separate export tracking

    return {
      success: true,
      stats: {
        total: totalCount || 0,
        thisMonth: monthCount || 0,
        exported: 0 // Placeholder until export tracking is implemented
      }
    }
  } catch (error) {
    console.error('Get search history stats error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Eroare necunoscută'
    }
  }
}

