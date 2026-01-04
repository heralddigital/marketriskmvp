// BPI (Biroul de Publicitate a Insolvenței) API Client
// BPI is Romania's official insolvency bulletin
// Note: This requires API access or web scraping

export interface BPIInsolvencyNotice {
  noticeNumber: string
  publicationDate: string
  companyName: string
  cui: string
  noticeType: 'insolvență' | 'reorganizare' | 'lichidare' | 'faliment'
  status: 'active' | 'closed'
  court: string
  description: string
  documents?: string[]
}

export interface BPIResponse {
  success: boolean
  notices: BPIInsolvencyNotice[]
  total: number
  lastCheck: string
}

/**
 * Fetch insolvency data from BPI
 * Uses web scraping as BPI doesn't have a public API
 * @param cui - Company CUI
 * @param forceRefresh - Force refresh even if cache is valid
 * @returns BPI insolvency notices
 */
export async function fetchBPIData(
  cui: string,
  forceRefresh: boolean = false
): Promise<BPIResponse> {
  const cleanCui = cui.replace(/^RO/i, '').replace(/\s/g, '').trim()

  if (!cleanCui) {
    return {
      success: false,
      notices: [],
      total: 0,
      lastCheck: new Date().toISOString()
    }
  }

  try {
    // Import scraper dynamically
    const { scrapeBPIData, filterRecentNotices } = await import('./scraper')

    // Scrape BPI website for insolvency data
    console.log(`[BPI] Scraping data for CUI: ${cleanCui}`)
    const notices = await scrapeBPIData(cleanCui)

    // Filter to only include recent notices (last 3 years)
    const recentNotices = filterRecentNotices(notices, 3)

    console.log(`[BPI] Found ${recentNotices.length} recent insolvency notices`)

    return {
      success: true,
      notices: recentNotices,
      total: recentNotices.length,
      lastCheck: new Date().toISOString()
    }
  } catch (error) {
    console.error('[BPI] Fetch error:', error)
    return {
      success: false,
      notices: [],
      total: 0,
      lastCheck: new Date().toISOString()
    }
  }
}

/**
 * Determine insolvency status for risk scoring
 * @param notices - Array of BPI notices
 * @returns Insolvency status (none, active, history)
 */
export function getInsolvencyStatus(
  notices: BPIInsolvencyNotice[]
): 'none' | 'active' | 'history' {
  if (notices.length === 0) return 'none'

  const hasActive = notices.some(n => n.status === 'active')
  if (hasActive) return 'active'

  return 'history'
}

/**
 * Check if company has active insolvency proceedings
 */
export function hasActiveInsolvency(notices: BPIInsolvencyNotice[]): boolean {
  return notices.some(notice => notice.status === 'active')
}

/**
 * Get latest insolvency notice
 */
export function getLatestNotice(notices: BPIInsolvencyNotice[]): BPIInsolvencyNotice | null {
  if (notices.length === 0) return null
  
  return notices.sort((a, b) => 
    new Date(b.publicationDate).getTime() - new Date(a.publicationDate).getTime()
  )[0]
}

