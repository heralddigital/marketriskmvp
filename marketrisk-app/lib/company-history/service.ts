// Company History Service
// Tracks and retrieves historical company data

import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/types/supabase'
import type { CompanyData } from '@/lib/anaf/types'
import type { CompanyHistoryEntry, AddressChange, ChangeSummary } from './types'
export type { CompanyHistoryEntry, AddressChange, ChangeSummary }

// AddressChange is exported from types.ts

/**
 * Save a snapshot of company data to history
 */
export async function saveCompanyHistory(
  companyId: string,
  cui: string,
  companyData: CompanyData,
  riskScore?: { value: number; level: string },
  changesDetected?: string[]
): Promise<void> {
  const supabase = await createClient()

  // Prepare snapshot data
  const snapshot = {
    ...companyData,
    recorded_at: new Date().toISOString(),
  }

  // Extract addresses for easy querying
  const fiscalAddress = companyData.fiscalAddress ? {
    street: companyData.fiscalAddress.sdenumire_Strada,
    number: companyData.fiscalAddress.snumar_Strada,
    city: companyData.fiscalAddress.sdenumire_Localitate,
    county: companyData.fiscalAddress.sdenumire_Judet,
    postal_code: companyData.fiscalAddress.scod_Postal,
    full: `${companyData.fiscalAddress.sdenumire_Strada} ${companyData.fiscalAddress.snumar_Strada}, ${companyData.fiscalAddress.scod_Postal} ${companyData.fiscalAddress.sdenumire_Localitate}, ${companyData.fiscalAddress.sdenumire_Judet}`
  } : null

  const socialAddress = companyData.socialAddress ? {
    street: companyData.socialAddress.sdenumire_Strada,
    number: companyData.socialAddress.snumar_Strada,
    city: companyData.socialAddress.sdenumire_Localitate,
    county: companyData.socialAddress.sdenumire_Judet,
    postal_code: companyData.socialAddress.scod_Postal,
    full: `${companyData.socialAddress.sdenumire_Strada} ${companyData.socialAddress.snumar_Strada}, ${companyData.socialAddress.scod_Postal} ${companyData.socialAddress.sdenumire_Localitate}, ${companyData.socialAddress.sdenumire_Judet}`
  } : null

  const historyEntry = {
    company_id: companyId,
    cui,
    snapshot_data: snapshot,
    company_name: companyData.name,
    registration_number: companyData.registrationNumber,
    status: companyData.status,
    company_active: !companyData.isInactive,
    vat_active: companyData.vatRegistration?.isRegistered ?? false,
    vat_split_regime: companyData.isVATSplit,
    fiscal_address: fiscalAddress,
    social_address: socialAddress,
    vat_registration: companyData.vatRegistration,
    vat_incasare_details: companyData.vatIncasareDetails,
    split_tva_details: companyData.splitTVADetails,
    is_inactive: companyData.isInactive,
    inactive_date: companyData.inactiveDate,
    reactivation_date: companyData.reactivationDate,
    risk_score: riskScore?.value,
    risk_level: riskScore?.level,
    data_source: 'anaf',
    changes_detected: changesDetected || [],
  }

  await (supabase.from('company_history') as any).insert(historyEntry)
}

/**
 * Get company history for the past N years
 */
export async function getCompanyHistory(
  cui: string,
  years: number = 5
): Promise<CompanyHistoryEntry[]> {
  const supabase = await createClient()
  const cutoffDate = new Date()
  cutoffDate.setFullYear(cutoffDate.getFullYear() - years)

  const { data, error } = await supabase
    .from('company_history')
    .select('*')
    .eq('cui', cui)
    .gte('recorded_at', cutoffDate.toISOString())
    .order('recorded_at', { ascending: false }) as {
      data: any[] | null
      error: any
    }

  if (error || !data) {
    return []
  }

  return data.map(entry => ({
    id: entry.id,
    recorded_at: entry.recorded_at,
    snapshot_data: entry.snapshot_data as CompanyData,
    changes_detected: entry.changes_detected || [],
    company_name: entry.company_name,
    status: entry.status,
    fiscal_address: entry.fiscal_address,
    social_address: entry.social_address,
    risk_score: entry.risk_score,
    risk_level: entry.risk_level,
  }))
}

/**
 * Get address change history
 */
export async function getAddressChanges(
  cui: string,
  years: number = 5
): Promise<AddressChange[]> {
  const supabase = await createClient()

  const { data, error } = await (supabase.rpc as any)('get_address_changes', {
    p_cui: cui,
    p_years: years
  })

  if (error || !data) {
    return []
  }

  return data.map((change: any) => ({
    change_date: change.change_date,
    change_type: change.change_type,
    old_value: change.old_value,
    new_value: change.new_value,
    field_name: change.field_name,
  }))
}

/**
 * Compare current data with last snapshot and detect changes
 */
export async function detectChanges(
  cui: string,
  currentData: CompanyData
): Promise<string[]> {
  const history = await getCompanyHistory(cui, 1) // Get last year for comparison
  
  if (history.length === 0) {
    return [] // No history to compare
  }

  const lastSnapshot = history[0].snapshot_data
  const changes: string[] = []

  // Compare key fields
  if (lastSnapshot.name !== currentData.name) changes.push('company_name')
  if (lastSnapshot.status !== currentData.status) changes.push('status')
  if (lastSnapshot.isInactive !== currentData.isInactive) changes.push('is_inactive')
  if (lastSnapshot.isVATSplit !== currentData.isVATSplit) changes.push('vat_split')
  if (lastSnapshot.isTVAIncasare !== currentData.isTVAIncasare) changes.push('vat_incasare')
  
  // Compare addresses
  const lastFiscal = JSON.stringify(lastSnapshot.fiscalAddress)
  const currentFiscal = JSON.stringify(currentData.fiscalAddress)
  if (lastFiscal !== currentFiscal) changes.push('fiscal_address')

  const lastSocial = JSON.stringify(lastSnapshot.socialAddress)
  const currentSocial = JSON.stringify(currentData.socialAddress)
  if (lastSocial !== currentSocial) changes.push('social_address')

  // Compare VAT registration
  const lastVAT = JSON.stringify(lastSnapshot.vatRegistration)
  const currentVAT = JSON.stringify(currentData.vatRegistration)
  if (lastVAT !== currentVAT) changes.push('vat_registration')

  return changes
}

/**
 * Get change summary for a company
 */
export async function getChangeSummary(
  cui: string,
  years: number = 5
): Promise<ChangeSummary> {
  const history = await getCompanyHistory(cui, years)
  const addressChanges = await getAddressChanges(cui, years)

  const changesByType: Record<string, number> = {}
  let lastChangeDate: string | undefined

  history.forEach(entry => {
    if (entry.changes_detected && entry.changes_detected.length > 0) {
      entry.changes_detected.forEach(change => {
        changesByType[change] = (changesByType[change] || 0) + 1
      })
      if (!lastChangeDate || entry.recorded_at > lastChangeDate) {
        lastChangeDate = entry.recorded_at
      }
    }
  })

  return {
    total_changes: history.filter(h => h.changes_detected && h.changes_detected.length > 0).length,
    address_changes: addressChanges.length,
    status_changes: changesByType['status'] || 0 + (changesByType['is_inactive'] || 0),
    vat_changes: (changesByType['vat_registration'] || 0) + (changesByType['vat_split'] || 0) + (changesByType['vat_incasare'] || 0),
    last_change_date: lastChangeDate || null,
    changes_by_type: changesByType,
  }
}

