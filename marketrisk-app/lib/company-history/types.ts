// Company History Types
// Type definitions for company history (no server-side imports)

import type { CompanyData } from '@/lib/anaf/types'

export interface CompanyHistoryEntry {
  id: string
  recorded_at: string
  snapshot_data: CompanyData
  changes_detected?: string[]
  company_name?: string
  status?: string
  fiscal_address?: any
  social_address?: any
  risk_score?: number
  risk_level?: string
}

export interface AddressChange {
  change_date: string
  change_type: string
  old_value: string
  new_value: string
  field_name: string
}

export interface ChangeSummary {
  total_changes: number
  address_changes: number
  status_changes: number
  vat_changes: number
  last_change_date: string | null
  changes_by_type: Record<string, number>
}

