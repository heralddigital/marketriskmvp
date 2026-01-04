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
    console.log('ANAF Request:', {
      url: ANAF_API_URL,
      body: requestBody
    })

    const response = await fetch(ANAF_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
      // Add timeout and cache control
      next: { revalidate: 3600 } // Cache for 1 hour
    })

    console.log('ANAF Response status:', response.status, response.statusText)

    if (!response.ok) {
      const errorText = await response.text()
      console.error('ANAF API error response:', errorText)
      throw new Error(`ANAF API error: ${response.status} ${response.statusText}`)
    }

    const data: ANAFResponse = await response.json()
    console.log('ANAF Response data:', JSON.stringify(data, null, 2))
    return data

  } catch (error) {
    console.error('ANAF fetch error:', error)
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
 * Parse ANAF v9 response to internal CompanyData format
 * V9 has nested structure with date_generale
 */
export function parseANAFResponse(response: ANAFResponse): CompanyData | null {
  // Check if we have any results
  if (!response || !response.found || response.found.length === 0) {
    console.log('ANAF Response (no results):', JSON.stringify(response, null, 2))
    return null
  }

  const anafCompany = response.found[0]

  // Log the actual response structure for debugging
  console.log('ANAF v9 Company Data:', JSON.stringify(anafCompany, null, 2))

  // V9 API has data nested under date_generale
  const dateGenerale = anafCompany.date_generale

  if (!dateGenerale) {
    console.error('Missing date_generale in ANAF v9 response')
    throw new Error('Date invalide primite de la ANAF: structură invalidă')
  }

  // Safely extract CUI - handle both number and string formats
  const cui = dateGenerale.cui !== undefined && dateGenerale.cui !== null
    ? dateGenerale.cui.toString()
    : ''

  if (!cui) {
    console.error('Missing CUI in ANAF v9 date_generale')
    throw new Error('Date invalide primite de la ANAF: lipsește CUI-ul')
  }

  // Extract inactive status from stare_inactiv section
  const isInactive = anafCompany.stare_inactiv?.statusInactivi || false
  const inactiveDate = anafCompany.stare_inactiv?.dataInactivare || undefined
  const reactivationDate = anafCompany.stare_inactiv?.dataReactivare || undefined

  // Extract Split TVA status
  const isVATSplit = anafCompany.inregistrare_SplitTVA?.statusSplitTVA || false

  // Extract TVA la incasare status
  const isTVAIncasare = anafCompany.inregistrare_RTVAI?.statusTvaIncasare || false

  // Extract VAT registration details
  const vatRegistration = anafCompany.inregistrare_scop_Tva ? {
    isRegistered: anafCompany.inregistrare_scop_Tva.scpTVA || false,
    periods: anafCompany.inregistrare_scop_Tva.perioade_TVA || [],
    startDate: anafCompany.inregistrare_scop_Tva.perioade_TVA?.[0]?.data_inceput_ScpTVA,
    endDate: anafCompany.inregistrare_scop_Tva.perioade_TVA?.[anafCompany.inregistrare_scop_Tva.perioade_TVA.length - 1]?.data_sfarsit_ScpTVA,
  } : undefined

  // Extract VAT Incasare details
  const vatIncasareDetails = anafCompany.inregistrare_RTVAI ? {
    startDate: anafCompany.inregistrare_RTVAI.dataInceputTvaInc,
    endDate: anafCompany.inregistrare_RTVAI.dataSfarsitTvaInc,
    updateDate: anafCompany.inregistrare_RTVAI.dataActualizareTvaInc,
    publicationDate: anafCompany.inregistrare_RTVAI.dataPublicareTvaInc,
    actType: anafCompany.inregistrare_RTVAI.tipActTvaInc,
  } : undefined

  // Extract Split TVA details
  const splitTVADetails = anafCompany.inregistrare_SplitTVA ? {
    startDate: anafCompany.inregistrare_SplitTVA.dataInceputSplitTVA,
    cancellationDate: anafCompany.inregistrare_SplitTVA.dataAnulareSplitTVA,
  } : undefined

  return {
    cui,
    name: dateGenerale.denumire || 'N/A',
    registrationNumber: dateGenerale.nrRegCom || '',
    address: dateGenerale.adresa || 'N/A',
    phone: dateGenerale.telefon || undefined,
    fax: dateGenerale.fax || undefined,
    postalCode: dateGenerale.codPostal || '',
    status: dateGenerale.stare_inregistrare || 'NECUNOSCUT',
    registrationDate: dateGenerale.data_inregistrare || '',
    caenCode: dateGenerale.cod_CAEN || '',
    iban: dateGenerale.iban || undefined,
    eInvoiceStatus: dateGenerale.statusRO_e_Factura || false,
    taxAuthority: dateGenerale.organFiscalCompetent || '',
    legalForm: dateGenerale.forma_juridica || 'NECUNOSCUTĂ',
    organizationForm: dateGenerale.forma_organizare || '',
    propertyForm: dateGenerale.forma_de_proprietate || '',

    // V9 provides real inactive/special status data
    isInactive,
    inactiveDate,
    reactivationDate,
    isVATSplit,
    isTVAIncasare,

    // Enhanced Financial Data
    vatRegistration,
    vatIncasareDetails,
    splitTVADetails,
    fiscalAddress: anafCompany.adresa_domiciliu_fiscal,
    socialAddress: anafCompany.adresa_sediu_social,
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
