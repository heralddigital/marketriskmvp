// BPI Web Scraper
// Scrapes insolvency data from bpi.ro (Biroul de Publicitate a Insolvenței)
// Note: Web scraping should be used respectfully with rate limiting

import type { BPIInsolvencyNotice } from './client'

// Rate limiting: Track last request time
let lastRequestTime = 0
const MIN_REQUEST_INTERVAL = 6000 // 6 seconds between requests (max 10/min)

/**
 * Rate limiter - ensures we don't overload BPI website
 */
async function rateLimit(): Promise<void> {
  const now = Date.now()
  const timeSinceLastRequest = now - lastRequestTime

  if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
    const waitTime = MIN_REQUEST_INTERVAL - timeSinceLastRequest
    await new Promise(resolve => setTimeout(resolve, waitTime))
  }

  lastRequestTime = Date.now()
}

/**
 * Scrape BPI website for insolvency data
 * @param cui - Company CUI (cleaned, without RO prefix)
 * @returns Array of insolvency notices
 */
export async function scrapeBPIData(cui: string): Promise<BPIInsolvencyNotice[]> {
  // Only import puppeteer when needed (optional dependency)
  let puppeteer: any
  try {
    puppeteer = require('puppeteer')
  } catch (error) {
    console.warn('Puppeteer not installed. BPI scraping unavailable.')
    return []
  }

  // Apply rate limiting
  await rateLimit()

  let browser = null

  try {
    // Clean CUI (remove RO prefix, spaces, etc.)
    const cleanCui = cui.replace(/^RO/i, '').replace(/\s/g, '').trim()

    if (!cleanCui) {
      throw new Error('Invalid CUI provided')
    }

    // Launch headless browser
    browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu'
      ]
    })

    const page = await browser.newPage()

    // Set user agent to avoid detection
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36')

    // Set viewport
    await page.setViewport({ width: 1280, height: 800 })

    // Navigate to BPI search page
    const BPI_SEARCH_URL = 'https://www.bpi.ro'
    await page.goto(BPI_SEARCH_URL, {
      waitUntil: 'networkidle2',
      timeout: 30000
    })

    console.log(`[BPI Scraper] Searching for CUI: ${cleanCui}`)

    // TODO: This is a template - adjust selectors based on actual BPI website structure
    // The following code needs to be updated based on bpi.ro's actual HTML structure

    // Example: Fill in search form (adjust selector based on actual site)
    const searchInputSelector = 'input[name="cui"], input[name="search"], #search-input'
    await page.waitForSelector(searchInputSelector, { timeout: 10000 }).catch(() => {
      console.warn('[BPI Scraper] Search input not found with default selectors')
    })

    // Type CUI into search field
    await page.type(searchInputSelector, cleanCui)

    // Submit search (adjust selector based on actual site)
    const searchButtonSelector = 'button[type="submit"], input[type="submit"], .search-button'
    await page.click(searchButtonSelector)

    // Wait for results to load
    await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 15000 }).catch(() => {
      console.log('[BPI Scraper] Navigation timeout, continuing...')
    })

    // Extract insolvency notices from results page
    // TODO: Update selectors based on actual BPI website structure
    const notices = await page.evaluate((searchCui) => {
      const results: any[] = []

      // Example selector - adjust based on actual site structure
      const noticeElements = document.querySelectorAll('.notice-item, .insolvency-notice, tr.notice-row')

      noticeElements.forEach((element: Element) => {
        try {
          // Extract data from each notice element
          // Adjust these selectors based on actual HTML structure
          const noticeNumber = element.querySelector('.notice-number, .nr-publicare')?.textContent?.trim() || ''
          const publicationDate = element.querySelector('.date, .data-publicare')?.textContent?.trim() || ''
          const companyName = element.querySelector('.company-name, .denumire')?.textContent?.trim() || ''
          const noticeType = element.querySelector('.notice-type, .tip')?.textContent?.trim() || ''
          const court = element.querySelector('.court, .instanta')?.textContent?.trim() || ''
          const description = element.querySelector('.description, .descriere')?.textContent?.trim() || ''

          // Determine status (active or closed)
          const statusText = element.querySelector('.status, .stare')?.textContent?.trim().toLowerCase() || ''
          const status = statusText.includes('închis') || statusText.includes('closed') ? 'closed' : 'active'

          // Map notice type to standard values
          let mappedType: 'insolvență' | 'reorganizare' | 'lichidare' | 'faliment' = 'insolvență'
          if (noticeType.toLowerCase().includes('reorganiz')) mappedType = 'reorganizare'
          else if (noticeType.toLowerCase().includes('lichid')) mappedType = 'lichidare'
          else if (noticeType.toLowerCase().includes('faliment')) mappedType = 'faliment'

          if (noticeNumber && companyName) {
            results.push({
              noticeNumber,
              publicationDate,
              companyName,
              cui: searchCui,
              noticeType: mappedType,
              status,
              court,
              description
            })
          }
        } catch (err) {
          console.error('[BPI Scraper] Error parsing notice element:', err)
        }
      })

      return results
    }, cleanCui)

    console.log(`[BPI Scraper] Found ${notices.length} notices for CUI ${cleanCui}`)

    return notices

  } catch (error) {
    console.error('[BPI Scraper] Error:', error)

    // Return empty array on error, don't throw
    // This allows the app to continue functioning even if scraping fails
    return []

  } finally {
    // Always close browser
    if (browser) {
      await browser.close().catch((err: any) => {
        console.error('[BPI Scraper] Error closing browser:', err)
      })
    }
  }
}

/**
 * Filter notices to only include those from last N years
 */
export function filterRecentNotices(
  notices: BPIInsolvencyNotice[],
  years: number = 3
): BPIInsolvencyNotice[] {
  const cutoffDate = new Date()
  cutoffDate.setFullYear(cutoffDate.getFullYear() - years)

  return notices.filter(notice => {
    try {
      const noticeDate = new Date(notice.publicationDate)
      return noticeDate >= cutoffDate
    } catch {
      // If date parsing fails, include the notice
      return true
    }
  })
}

/**
 * Count active insolvency proceedings
 */
export function countActiveInsolvencies(notices: BPIInsolvencyNotice[]): number {
  return notices.filter(n => n.status === 'active').length
}

/**
 * Check if company has insolvency history (in last 3 years)
 */
export function hasInsolvencyHistory(notices: BPIInsolvencyNotice[]): boolean {
  const recentNotices = filterRecentNotices(notices, 3)
  return recentNotices.length > 0
}
