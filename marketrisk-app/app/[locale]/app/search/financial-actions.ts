'use server'

import { getCompanyFinancialSummary } from '@/lib/mfinante/service'
import type { CompanyFinancialSummary } from '@/lib/mfinante/types'

export async function getFinancialSummary(cui: string): Promise<CompanyFinancialSummary | null> {
  try {
    return await getCompanyFinancialSummary(cui)
  } catch (error) {
    console.error('Error fetching financial summary:', error)
    return null
  }
}

