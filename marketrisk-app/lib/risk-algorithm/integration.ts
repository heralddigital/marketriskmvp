// Risk Algorithm Data Integration
// Transforms data from ANAF, BPI, and PortalJust into CompanyRiskData format

import type { CompanyRiskData } from './factors'
import type { CompanyData } from '../anaf/types'
import type { BPIResponse } from '../bpi/client'
import type { PortalJustResponse } from '../portaljust/types'

/**
 * Transform ANAF data into risk algorithm format
 */
function transformANAFData(anafData: CompanyData): CompanyRiskData['anaf'] {
  // Calculate company age from registration date
  const getCompanyAgeMonths = (): number => {
    if (!anafData.registrationDate) return 0

    const registrationDate = new Date(anafData.registrationDate)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - registrationDate.getTime())
    const diffMonths = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30))
    return diffMonths
  }

  // Check if VAT is deregistered (no active VAT periods)
  const isVATDeregistered = (): boolean => {
    if (!anafData.vatRegistration) return true
    return !anafData.vatRegistration.isRegistered
  }

  // Check split VAT regime
  const hasSplitVAT = (): boolean => {
    return anafData.isVATSplit || false
  }

  // Company active status
  const stare_firma = anafData.isInactive ? 'INACTIVA' : 'ACTIVA'

  return {
    stare_firma,
    vat_deregistered: isVATDeregistered(),
    split_vat_regime: hasSplitVAT(),
    state_debts_eur: 0, // TODO: Integrate state debts data when available
    company_age_months: getCompanyAgeMonths(),
    address_changes_2y: 0, // TODO: Track address changes from company history
    employees: 0, // TODO: Get employee count from additional source
  }
}

/**
 * Transform BPI data into risk algorithm format
 */
function transformBPIData(bpiData: BPIResponse): CompanyRiskData['bpi'] {
  const { notices } = bpiData

  // Check for active insolvency proceedings
  const hasActive = notices.some(n => n.status === 'active')

  // Check for insolvency history in last 3 years
  const threeYearsAgo = new Date()
  threeYearsAgo.setFullYear(threeYearsAgo.getFullYear() - 3)

  const hasHistory = notices.some(n => {
    try {
      const noticeDate = new Date(n.publicationDate)
      return noticeDate >= threeYearsAgo
    } catch {
      return false
    }
  })

  return {
    active_insolvency: hasActive,
    insolvency_history_3y: hasHistory && !hasActive, // Only count as history if not currently active
  }
}

/**
 * Transform PortalJust data into risk algorithm format
 */
function transformPortalJustData(portalJustData: PortalJustResponse): CompanyRiskData['portaljust'] {
  const { lawsuits } = portalJustData

  // Count active lawsuits by role
  const activeAsDefendant = lawsuits.filter(l =>
    l.status === 'active' && l.parties.some(p => p.role === 'defendant')
  ).length

  const activeAsPlaintiff = lawsuits.filter(l =>
    l.status === 'active' && l.parties.some(p => p.role === 'plaintiff')
  ).length

  const totalActive = lawsuits.filter(l => l.status === 'active').length

  // Count lost cases in last 2 years (where company was defendant)
  const twoYearsAgo = new Date()
  twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 2)

  const lostCases2y = lawsuits.filter(l => {
    if (l.status !== 'closed' || !l.endDate) return false
    const endDate = new Date(l.endDate)
    return endDate >= twoYearsAgo &&
           l.parties.some(p => p.role === 'defendant')
  }).length

  // Count won cases in last 2 years (where company was plaintiff)
  const wonCases2y = lawsuits.filter(l => {
    if (l.status !== 'closed' || !l.endDate) return false
    const endDate = new Date(l.endDate)
    return endDate >= twoYearsAgo &&
           l.parties.some(p => p.role === 'plaintiff')
  }).length

  // Check for bankruptcy/insolvency filings
  const hasBankruptcy = lawsuits.some(l =>
    l.caseType.toLowerCase().includes('insolvență') ||
    l.caseType.toLowerCase().includes('faliment') ||
    l.caseType.toLowerCase().includes('insolventa')
  )

  // Check for execution proceedings
  const hasExecution = lawsuits.some(l =>
    l.caseType.toLowerCase().includes('executare') ||
    l.proceduralStage?.toLowerCase().includes('executare')
  )

  // Count labor disputes
  const laborDisputes = lawsuits.filter(l =>
    l.caseType.toLowerCase().includes('munc') ||
    l.caseType.toLowerCase().includes('labor')
  ).length

  // Count commercial disputes
  const commercialDisputes = lawsuits.filter(l =>
    l.caseType.toLowerCase().includes('comercial')
  ).length

  // Count high-value cases (those with "valoare" or significant amounts in description)
  const highValueCases = lawsuits.filter(l =>
    l.description?.toLowerCase().includes('valoare') ||
    l.caseType.toLowerCase().includes('valoare mare')
  ).length

  return {
    active_lawsuits: totalActive,
    active_as_defendant: activeAsDefendant,
    active_as_plaintiff: activeAsPlaintiff,
    lost_cases_2y: lostCases2y,
    won_cases_2y: wonCases2y,
    bankruptcy_filing: hasBankruptcy,
    execution_proceedings: hasExecution,
    labor_disputes: laborDisputes,
    commercial_disputes: commercialDisputes,
    high_value_cases: highValueCases,
  }
}

/**
 * Integrate all data sources into CompanyRiskData format
 * @param anafData - Data from ANAF API
 * @param bpiData - Data from BPI (insolvency)
 * @param portalJustData - Data from PortalJust (litigation)
 * @param mfinanteData - Optional data from Ministry of Finance
 * @param additionalData - Optional additional data
 * @returns CompanyRiskData ready for risk calculation
 */
export function integrateCompanyData(
  anafData: CompanyData,
  bpiData: BPIResponse,
  portalJustData: PortalJustResponse,
  mfinanteData?: CompanyRiskData['mfinante'],
  additionalData?: CompanyRiskData['additional']
): CompanyRiskData {
  return {
    anaf: transformANAFData(anafData),
    bpi: transformBPIData(bpiData),
    portaljust: transformPortalJustData(portalJustData),
    mfinante: mfinanteData,
    additional: additionalData,
  }
}

/**
 * Helper to determine if company is high risk (RED level trigger)
 */
export function isHighRiskCompany(data: CompanyRiskData): boolean {
  // Red flags that immediately indicate high risk:
  return (
    data.anaf.stare_firma !== 'ACTIVA' ||
    data.bpi.active_insolvency ||
    data.portaljust.bankruptcy_filing ||
    data.anaf.state_debts_eur > 10000 ||
    (data.portaljust.active_as_defendant && data.portaljust.active_as_defendant >= 5)
  )
}

/**
 * Get summary of risk factors for quick display
 */
export function getRiskFactorsSummary(data: CompanyRiskData): {
  totalRedFlags: number
  totalYellowFlags: number
  redFlags: string[]
  yellowFlags: string[]
} {
  const redFlags: string[] = []
  const yellowFlags: string[] = []

  // Red flags
  if (data.anaf.stare_firma !== 'ACTIVA') {
    redFlags.push('Companie inactivă')
  }
  if (data.bpi.active_insolvency) {
    redFlags.push('Insolvență activă')
  }
  if (data.portaljust.bankruptcy_filing) {
    redFlags.push('Cerere de faliment')
  }
  if (data.anaf.vat_deregistered) {
    redFlags.push('TVA radiat')
  }
  if (data.anaf.state_debts_eur > 10000) {
    redFlags.push('Datorii mari la stat')
  }

  // Yellow flags
  if (data.bpi.insolvency_history_3y) {
    yellowFlags.push('Istoric insolvență')
  }
  if (data.anaf.split_vat_regime) {
    yellowFlags.push('TVA la încasare')
  }
  if (data.portaljust.active_lawsuits > 0) {
    yellowFlags.push(`${data.portaljust.active_lawsuits} procese active`)
  }
  if (data.portaljust.execution_proceedings) {
    yellowFlags.push('Executare silită')
  }
  if (data.anaf.company_age_months < 6) {
    yellowFlags.push('Companie foarte nouă')
  }

  return {
    totalRedFlags: redFlags.length,
    totalYellowFlags: yellowFlags.length,
    redFlags,
    yellowFlags,
  }
}
