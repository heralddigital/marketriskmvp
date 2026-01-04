/**
 * Ministerul de Finanțe (MFinante) Client
 * Downloads and processes financial statements from data.gov.ro
 * 
 * Note: data.gov.ro uses CKAN platform. This client handles:
 * 1. Querying CKAN API for financial statement datasets
 * 2. Downloading CSV/TXT files
 * 3. Parsing and transforming data
 * 4. Storing in database
 */

import type { FinancialStatement, RawFinancialData, DataGovRoDataset } from './types'

// CKAN API endpoint for data.gov.ro
const DATA_GOV_RO_API = 'https://data.gov.ro/api/3/action'
const DATA_GOV_RO_BASE = 'https://data.gov.ro'

/**
 * Search for financial statement datasets on data.gov.ro
 */
export async function searchFinancialStatementsDatasets(year?: number): Promise<DataGovRoDataset[]> {
  try {
    const searchQuery = year 
      ? `Situații financiare ${year}`
      : 'Situații financiare'
    
    const url = `${DATA_GOV_RO_API}/package_search?q=${encodeURIComponent(searchQuery)}&rows=20`
    
    const response = await fetch(url, {
      next: { revalidate: 86400 } // Cache for 24 hours
    })
    
    if (!response.ok) {
      throw new Error(`data.gov.ro API error: ${response.status}`)
    }
    
    const data = await response.json()
    
    if (!data.success || !data.result || !data.result.results) {
      return []
    }
    
    // Filter and map results
    return data.result.results
      .filter((pkg: any) => 
        pkg.name?.toLowerCase().includes('situatii') || 
        pkg.title?.toLowerCase().includes('situații')
      )
      .map((pkg: any) => {
        // Find CSV or TXT resources
        const resource = pkg.resources?.find((r: any) => 
          r.format?.toLowerCase() === 'csv' || 
          r.format?.toLowerCase() === 'txt' ||
          r.url?.endsWith('.csv') ||
          r.url?.endsWith('.txt')
        )
        
        return {
          id: pkg.id,
          name: pkg.name,
          title: pkg.title || pkg.name,
          url: resource?.url || '',
          format: resource?.format || 'csv',
          created: pkg.metadata_created,
          updated: pkg.metadata_modified || pkg.metadata_created,
        } as DataGovRoDataset
      })
      .filter((ds: DataGovRoDataset) => ds.url) // Only datasets with downloadable resources
      
  } catch (error) {
    console.error('Error searching data.gov.ro datasets:', error)
    return []
  }
}

/**
 * Download a dataset file from data.gov.ro
 */
export async function downloadDatasetFile(url: string): Promise<string> {
  try {
    const response = await fetch(url, {
      next: { revalidate: 86400 } // Cache for 24 hours
    })
    
    if (!response.ok) {
      throw new Error(`Failed to download file: ${response.status}`)
    }
    
    return await response.text()
  } catch (error) {
    console.error('Error downloading dataset file:', error)
    throw error
  }
}

/**
 * Parse CSV line (handles quoted fields)
 */
function parseCSVLine(line: string): string[] {
  const result: string[] = []
  let current = ''
  let inQuotes = false
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i]
    
    if (char === '"') {
      inQuotes = !inQuotes
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim())
      current = ''
    } else {
      current += char
    }
  }
  
  result.push(current.trim())
  return result
}

/**
 * Parse CSV content into rows
 */
function parseCSV(content: string): string[][] {
  const lines = content.split('\n').filter(line => line.trim())
  if (lines.length === 0) return []
  
  return lines.map(line => parseCSVLine(line))
}

/**
 * Parse TXT content (tab-separated or fixed-width)
 * For now, we'll try tab-separated first
 */
function parseTXT(content: string): string[][] {
  const lines = content.split('\n').filter(line => line.trim())
  if (lines.length === 0) return []
  
  return lines.map(line => line.split('\t'))
}

/**
 * Extract year from dataset name or filename
 */
function extractYear(datasetName: string, filename?: string): number | null {
  const yearMatch = (datasetName + ' ' + (filename || '')).match(/\b(20\d{2})\b/)
  return yearMatch ? parseInt(yearMatch[1], 10) : null
}

/**
 * Map raw CSV/TXT row to FinancialStatement
 * This is a generic mapper - you may need to adjust based on actual file structure
 */
function mapRowToFinancialStatement(
  row: string[],
  headers: string[],
  year: number,
  cuiIndex: number
): FinancialStatement | null {
  if (row.length < cuiIndex + 1) return null
  
  const cui = row[cuiIndex]?.trim()
  if (!cui || !/^\d+$/.test(cui)) return null
  
  // Map common column names to our structure
  // Note: Actual column names may vary - adjust based on data.gov.ro file structure
  const getValue = (fieldName: string): number | undefined => {
    const index = headers.findIndex(h => 
      h.toLowerCase().includes(fieldName.toLowerCase())
    )
    if (index === -1 || !row[index]) return undefined
    const value = parseFloat(row[index].replace(/[^\d.-]/g, ''))
    return isNaN(value) ? undefined : value
  }
  
  const totalAssets = getValue('total active') || getValue('active total')
  const equity = getValue('capital propriu') || getValue('capital')
  const revenue = getValue('cifra de afaceri') || getValue('venituri') || getValue('revenue')
  const netProfit = getValue('profit net')
  const netLoss = getValue('pierdere neta') || getValue('pierdere')
  
  // Calculate ratios if we have the data
  const currentAssets = getValue('active circulante')
  const currentLiabilities = getValue('datorii curente')
  const currentRatio = currentAssets && currentLiabilities && currentLiabilities > 0
    ? currentAssets / currentLiabilities
    : undefined
  
  const totalLiabilities = getValue('total datorii') || getValue('datorii total')
  const debtToEquity = equity && equity !== 0 && totalLiabilities
    ? totalLiabilities / equity
    : undefined
  
  const returnOnAssets = totalAssets && totalAssets > 0 && netProfit
    ? (netProfit / totalAssets) * 100
    : undefined
  
  const returnOnEquity = equity && equity !== 0 && netProfit
    ? (netProfit / equity) * 100
    : undefined
  
  return {
    cui,
    year,
    periodType: 'annual', // Default to annual, adjust if file contains quarterly/semiannual data
    totalAssets,
    currentAssets,
    fixedAssets: getValue('active imobilizate'),
    totalLiabilities,
    currentLiabilities,
    longTermLiabilities: getValue('datorii termen lung'),
    equity,
    shareCapital: getValue('capital social'),
    revenue,
    operatingExpenses: getValue('cheltuieli exploatare'),
    operatingProfit: getValue('profit exploatare'),
    netProfit,
    netLoss,
    currentRatio,
    debtToEquity,
    returnOnAssets,
    returnOnEquity,
    negativeEquity: equity !== undefined && equity < 0,
    delayedFiling: false, // Will be calculated based on filing date vs deadline
    source: 'mfinante',
    rawData: Object.fromEntries(
      headers.map((h, i) => [h, row[i]])
    ),
  }
}

/**
 * Process downloaded CSV/TXT file and extract financial statements
 */
export async function processFinancialStatementsFile(
  content: string,
  format: 'csv' | 'txt',
  year: number
): Promise<FinancialStatement[]> {
  try {
    // Parse file content
    const rows = format === 'csv' ? parseCSV(content) : parseTXT(content)
    
    if (rows.length === 0) {
      console.warn('Empty file or no data rows')
      return []
    }
    
    // First row should be headers
    const headers = rows[0].map(h => h.trim().toLowerCase())
    
    // Find CUI column index
    const cuiIndex = headers.findIndex(h => 
      h.includes('cui') || 
      h.includes('cod unic') ||
      h === 'cui'
    )
    
    if (cuiIndex === -1) {
      console.warn('CUI column not found in file')
      return []
    }
    
    // Process data rows (skip header)
    const statements: FinancialStatement[] = []
    
    for (let i = 1; i < rows.length; i++) {
      const statement = mapRowToFinancialStatement(rows[i], headers, year, cuiIndex)
      if (statement) {
        statements.push(statement)
      }
    }
    
    return statements
    
  } catch (error) {
    console.error('Error processing financial statements file:', error)
    throw error
  }
}

/**
 * Main function to import financial statements from data.gov.ro
 * This would typically be run as a cron job or admin task
 */
export async function importFinancialStatementsFromDataGovRo(
  year?: number
): Promise<{ imported: number; errors: number }> {
  try {
    // Search for datasets
    const datasets = await searchFinancialStatementsDatasets(year)
    
    if (datasets.length === 0) {
      console.warn('No financial statement datasets found')
      return { imported: 0, errors: 0 }
    }
    
    let totalImported = 0
    let totalErrors = 0
    
    // Process each dataset
    for (const dataset of datasets) {
      try {
        console.log(`Processing dataset: ${dataset.title}`)
        
        // Download file
        const content = await downloadDatasetFile(dataset.url)
        
        // Extract year if not provided
        const fileYear = year || extractYear(dataset.title, dataset.url) || new Date().getFullYear()
        
        // Process file
        const statements = await processFinancialStatementsFile(
          content,
          dataset.format as 'csv' | 'txt',
          fileYear
        )
        
        totalImported += statements.length
        console.log(`Imported ${statements.length} statements from ${dataset.title}`)
        
      } catch (error) {
        console.error(`Error processing dataset ${dataset.title}:`, error)
        totalErrors++
      }
    }
    
    return { imported: totalImported, errors: totalErrors }
    
  } catch (error) {
    console.error('Error importing financial statements:', error)
    throw error
  }
}

