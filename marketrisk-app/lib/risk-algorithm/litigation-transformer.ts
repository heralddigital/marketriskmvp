// Transform PortalJust litigation data into CompanyRiskData format
// for use in risk calculation algorithm

import type { PortalJustLawsuit } from '@/lib/portaljust/types'
import type { CompanyRiskData } from './factors'

export interface LitigationMetrics {
  activeLawsuits: number
  activeAsDefendant: number
  activeAsPlaintiff: number
  lostCases2y: number
  wonCases2y: number
  bankruptcyFiling: boolean
  executionProceedings: boolean
  laborDisputes: number
  commercialDisputes: number
  civilDisputes: number
  highValueCases: number // Cases with significant financial impact
}

/**
 * Analyze PortalJust lawsuits and extract metrics for risk calculation
 */
export function analyzeLitigationData(
  lawsuits: PortalJustLawsuit[]
): LitigationMetrics {
  const metrics: LitigationMetrics = {
    activeLawsuits: 0,
    activeAsDefendant: 0,
    activeAsPlaintiff: 0,
    lostCases2y: 0,
    wonCases2y: 0,
    bankruptcyFiling: false,
    executionProceedings: false,
    laborDisputes: 0,
    commercialDisputes: 0,
    civilDisputes: 0,
    highValueCases: 0,
  }

  const twoYearsAgo = new Date()
  twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 2)

  for (const lawsuit of lawsuits) {
    // Active lawsuits
    if (lawsuit.status === 'active') {
      metrics.activeLawsuits++

      // Count by role
      const isDefendant = lawsuit.parties.some((p) => p.role === 'defendant')
      const isPlaintiff = lawsuit.parties.some((p) => p.role === 'plaintiff')

      if (isDefendant) {
        metrics.activeAsDefendant++
      }
      if (isPlaintiff) {
        metrics.activeAsPlaintiff++
      }
    }

    // Closed cases in last 2 years
    if (lawsuit.status === 'closed' && lawsuit.endDate) {
      const endDate = new Date(lawsuit.endDate)
      if (endDate >= twoYearsAgo) {
        const isDefendant = lawsuit.parties.some((p) => p.role === 'defendant')
        const isPlaintiff = lawsuit.parties.some((p) => p.role === 'plaintiff')

        // If defendant and closed, likely lost (unless explicitly won)
        if (isDefendant) {
          // Check if there's explicit outcome data
          // For now, assume closed as defendant = lost (conservative approach)
          metrics.lostCases2y++
        } else if (isPlaintiff) {
          // If plaintiff and closed, likely won
          metrics.wonCases2y++
        }
      }
    }

    // Bankruptcy filings
    if (
      lawsuit.caseType.toLowerCase().includes('faliment') ||
      lawsuit.caseType.toLowerCase().includes('insolvență') ||
      lawsuit.caseType.toLowerCase().includes('insolventa')
    ) {
      metrics.bankruptcyFiling = true
    }

    // Execution proceedings
    if (
      lawsuit.caseType.toLowerCase().includes('executare') ||
      lawsuit.proceduralStage?.toLowerCase().includes('executare')
    ) {
      metrics.executionProceedings = true
    }

    // Case type categorization
    const caseTypeLower = lawsuit.caseType.toLowerCase()
    if (caseTypeLower.includes('laboral') || caseTypeLower.includes('muncă')) {
      metrics.laborDisputes++
    } else if (
      caseTypeLower.includes('comercial') ||
      caseTypeLower.includes('comercial')
    ) {
      metrics.commercialDisputes++
    } else if (caseTypeLower.includes('civil')) {
      metrics.civilDisputes++
    }

    // High-value cases (commercial disputes, execution proceedings are typically high-value)
    if (
      metrics.commercialDisputes > 0 ||
      metrics.executionProceedings ||
      lawsuit.caseType.toLowerCase().includes('comercial')
    ) {
      metrics.highValueCases++
    }
  }

  return metrics
}

/**
 * Transform PortalJust data into CompanyRiskData.portaljust format
 */
export function transformLitigationToRiskData(
  lawsuits: PortalJustLawsuit[]
): CompanyRiskData['portaljust'] {
  const metrics = analyzeLitigationData(lawsuits)

  return {
    active_lawsuits: metrics.activeLawsuits,
    lost_cases_2y: metrics.lostCases2y,
    bankruptcy_filing: metrics.bankruptcyFiling,
    execution_proceedings: metrics.executionProceedings,
    labor_disputes: metrics.laborDisputes,
    // Additional metrics for enhanced scoring
    active_as_defendant: metrics.activeAsDefendant,
    active_as_plaintiff: metrics.activeAsPlaintiff,
    won_cases_2y: metrics.wonCases2y,
    commercial_disputes: metrics.commercialDisputes,
    high_value_cases: metrics.highValueCases,
  } as any // Extended type with additional fields
}

