// Financial Statements Types from Ministerul de Finanțe (data.gov.ro)

export type PeriodType = 'annual' | 'semiannual' | 'quarterly'

/**
 * Financial Statement data structure
 * Based on data.gov.ro financial statements datasets
 */
export interface FinancialStatement {
  id?: string
  cui: string
  year: number
  periodType: PeriodType
  periodNumber?: number // 1-4 for quarterly, 1-2 for semiannual
  
  // Balance Sheet (Bilanț)
  totalAssets?: number // Total active
  currentAssets?: number // Active circulante
  fixedAssets?: number // Active imobilizate
  totalLiabilities?: number // Total datorii
  currentLiabilities?: number // Datorii curente
  longTermLiabilities?: number // Datorii pe termen lung
  equity?: number // Capital propriu
  shareCapital?: number // Capital social
  
  // Profit & Loss (Cont de profit și pierdere)
  revenue?: number // Cifra de afaceri / Venituri
  operatingExpenses?: number // Cheltuieli de exploatare
  operatingProfit?: number // Profit din exploatare
  netProfit?: number // Profit net
  netLoss?: number // Pierdere netă
  
  // Financial Ratios (calculated)
  currentRatio?: number // Current assets / Current liabilities
  debtToEquity?: number // Total liabilities / Equity
  returnOnAssets?: number // Net profit / Total assets
  returnOnEquity?: number // Net profit / Equity
  
  // Risk Indicators
  negativeEquity: boolean
  filingDate?: string // ISO date string
  filingDeadline?: string // ISO date string
  delayedFiling: boolean
  
  // Metadata
  source?: string
  rawData?: Record<string, unknown>
  importedAt?: string
  updatedAt?: string
}

/**
 * Financial risk factors for risk calculation
 */
export interface FinancialRiskFactors {
  missingStatements: boolean // Missing statements for last 2 years
  delayedFiling: boolean // Delayed filing in last 2 years
  negativeEquity: boolean // Negative equity in last 2 years
  revenueDrop50: boolean // Revenue dropped >50% year-over-year
}

/**
 * Raw data structure from data.gov.ro CSV/TXT files
 * This structure may vary based on the actual file format
 */
export interface RawFinancialData {
  cui: string
  year: number
  period?: string
  // Balance sheet fields (will map from CSV columns)
  [key: string]: string | number | undefined
}

/**
 * Data.gov.ro dataset metadata
 */
export interface DataGovRoDataset {
  id: string
  name: string
  title: string
  url: string
  format: string
  created: string
  updated: string
}

/**
 * Financial statements summary for a company
 */
export interface CompanyFinancialSummary {
  cui: string
  latestStatement?: FinancialStatement
  statements: FinancialStatement[]
  riskFactors: FinancialRiskFactors
  // Calculated metrics
  revenueTrend?: {
    current: number
    previous: number
    change: number
    changePercent: number
  }
  equityTrend?: {
    current: number
    previous: number
    change: number
  }
}

