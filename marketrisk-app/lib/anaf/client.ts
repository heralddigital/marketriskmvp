import type { ANAFResponse, CompanyData } from './types'

// ANAF API v9 endpoint (updated January 2026)
const ANAF_API_URL = 'https://webservicesp.anaf.ro/api/PlatitorTvaRest/v9/tva'

/**
 * Fetch company information from ANAF by CUI
 * @param cui - Company CUI (numeric or with RO prefix)
 * @returns ANAF API response
 */
export async function fetchCompanyByCUI(cui: string): Promise<ANAFResponse> {
  // Clean CUI: remove RO prefix and any spaces
  const cleanCUI = cui.replace(/^RO/i, '').replace(/\s/g, '')

  // Validate CUI is numeric
  if (!/^\d+$/.test(cleanCUI)) {
    throw new Error('CUI invalid: trebuie să conțină doar cifre')
  }

  const requestBody = [{
    cui: parseInt(cleanCUI, 10),
    data: new Date().toISOString().split('T')[0] // YYYY-MM-DD
  }]

  try {
    const response = await fetch(ANAF_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
      // Add timeout and cache control
      next: { revalidate: 3600 } // Cache for 1 hour
    })

    if (!response.ok) {
      throw new Error(`ANAF API error: ${response.status} ${response.statusText}`)
    }

    const data: ANAFResponse = await response.json()
    return data

  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Eroare la accesarea ANAF: ${error.message}`)
    }
    throw new Error('Eroare necunoscută la accesarea ANAF')
  }
}

/**
 * Search company by name (requires CUI for actual ANAF query)
 * Note: ANAF API only supports CUI-based searches
 * This is a helper that validates and provides user feedback
 */
export async function searchCompanyByName(name: string): Promise<never> {
  throw new Error(
    'Căutarea după denumire nu este disponibilă în ANAF API. ' +
    'Vă rugăm să introduceți CUI-ul companiei.'
  )
}

/**
 * Parse ANAF response to internal CompanyData format
 */
export function parseANAFResponse(response: ANAFResponse): CompanyData | null {
  if (response.found.length === 0) {
    return null
  }

  const anafData = response.found[0]

  return {
    cui: anafData.cui.toString(),
    name: anafData.denumire,
    registrationNumber: anafData.nrRegCom,
    address: anafData.adresa,
    phone: anafData.telefon || undefined,
    fax: anafData.fax || undefined,
    postalCode: anafData.codPostal,
    status: anafData.stare_inregistrare,
    registrationDate: anafData.data_inregistrare,
    caenCode: anafData.cod_CAEN,
    iban: anafData.iban || undefined,
    eInvoiceStatus: anafData.statusRO_e_Factura,
    taxAuthority: anafData.organFiscalCompetent,
    legalForm: anafData.forma_juridica,
    organizationForm: anafData.forma_organizare,
    propertyForm: anafData.forma_de_proprietate,

    // Default values for inactive status (would come from additional ANAF endpoints)
    isInactive: false,
    isVATSplit: false,
    isTVAIncasare: false,
  }
}

/**
 * Check if CUI exists and is valid
 */
export function validateCUI(cui: string): { valid: boolean; error?: string } {
  const cleanCUI = cui.replace(/^RO/i, '').replace(/\s/g, '')

  if (!cleanCUI) {
    return { valid: false, error: 'CUI este obligatoriu' }
  }

  if (!/^\d+$/.test(cleanCUI)) {
    return { valid: false, error: 'CUI trebuie să conțină doar cifre' }
  }

  if (cleanCUI.length < 2 || cleanCUI.length > 10) {
    return { valid: false, error: 'CUI trebuie să aibă între 2 și 10 cifre' }
  }

  return { valid: true }
}
