'use server'

import { createClient } from '@/lib/supabase/server'
import { fetchPortalJustData } from '@/lib/portaljust/client'
import type { PortalJustLawsuit } from '@/lib/portaljust/types'
import { cache } from 'react'

export interface LatestLitigationCase {
  lawsuit: PortalJustLawsuit
  companyName: string
  companyCui: string
}

/**
 * Get the 5 latest court cases from companies in user's watchlist
 */
export const getLatestLitigationCases = cache(async function getLatestLitigationCases(): Promise<{
  success: boolean
  cases: LatestLitigationCase[]
  error?: string
}> {
  try {
    const supabase = await createClient()
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
      return { success: false, cases: [], error: 'Not authenticated' }
    }

    // Get companies from watchlist
    const { data: watchlistData } = await supabase
      .from('watchlist')
      .select(`
        companies!inner (
          cui,
          company_name
        )
      `)
      .eq('user_id', user.id)
      .limit(3) // Reduced from 10 to 3 for better dashboard performance

    if (!watchlistData || watchlistData.length === 0) {
      return { success: true, cases: [] }
    }

    // Fetch litigation data for all companies in parallel
    const litigationPromises = watchlistData.map(async (item) => {
      const company = (item as any).companies
      if (!company || !company.company_name) return []

      try {
        const portalJustData = await fetchPortalJustData(
          company.company_name,
          company.cui,
          {
            includeClosed: true,
          }
        )

        if (portalJustData.success && portalJustData.lawsuits.length > 0) {
          return portalJustData.lawsuits.map((lawsuit) => ({
            lawsuit,
            companyName: company.company_name,
            companyCui: company.cui,
          }))
        }
      } catch (error) {
        console.warn(`Error fetching PortalJust data for ${company.company_name}:`, error)
      }
      return []
    })

    const results = await Promise.all(litigationPromises)
    const allCases: LatestLitigationCase[] = results.flat()

    // Sort by last update date (most recent first)
    allCases.sort((a, b) => {
      const dateA = a.lawsuit.lastUpdate || a.lawsuit.startDate || ''
      const dateB = b.lawsuit.lastUpdate || b.lawsuit.startDate || ''
      return dateB.localeCompare(dateA)
    })

    // Return top 5
    return {
      success: true,
      cases: allCases.slice(0, 5),
    }
  } catch (error) {
    console.error('Error fetching latest litigation cases:', error)
    return {
      success: false,
      cases: [],
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
})

/**
 * Get market analytics for the combined Dashboard & Analytics view
 */
export const getMarketAnalytics = cache(async function getMarketAnalytics() {
  const supabase = await createClient()

  // In a real app, these would be calculated from the database
  // Mocking search trends for the last 6 months
  const searchTrends = [
    { month: 'Jul', count: 120 },
    { month: 'Aug', count: 180 },
    { month: 'Sep', count: 250 },
    { month: 'Oct', count: 210 },
    { month: 'Nov', count: 320 },
    { month: 'Dec', count: 450 },
  ]

  // Mocking risk score distribution in the current watchlist vs market
  const riskDistribution = [
    { level: 'Green', percentage: 45, color: '#22C55E' },
    { level: 'Yellow', percentage: 35, color: '#F59E0B' },
    { level: 'Red', percentage: 20, color: '#EF4444' },
  ]

  // Mocking market sentiment
  const marketSentiment = {
    level: 'Moderate',
    score: 64,
    trend: 'improving',
    description: 'The overall business environment shows signs of stability with a slight decrease in insolvency filings.'
  }

  return {
    searchTrends,
    riskDistribution,
    marketSentiment,
  }
})
