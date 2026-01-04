// PortalJust SOAP API Client
// Official Romanian Ministry of Justice court portal
// WSDL: http://portalquery.just.ro/query.asmx?WSDL

import type {
  CautareDosareRequest,
  CautareDosareResponse,
  Dosar,
  PortalJustLawsuit,
  PortalJustResponse,
  Institutie,
} from './types'

const PORTALJUST_SOAP_URL = 'http://portalquery.just.ro/query.asmx'
const SOAP_ACTION = 'portalquery.just.ro/CautareDosare'

/**
 * Build SOAP envelope for CautareDosare request
 */
function buildSoapEnvelope(request: CautareDosareRequest): string {
  const formatDate = (date: Date | null): string => {
    if (!date) return ''
    // PortalJust expects dateTime format: YYYY-MM-DDTHH:mm:ss
    return date.toISOString().split('.')[0] // Remove milliseconds
  }

  const numarDosar = request.numarDosar || ''
  const obiectDosar = request.obiectDosar || ''
  const numeParte = request.numeParte || ''
  const institutie = request.institutie || ''
  const dataStart = formatDate(request.dataStart)
  const dataStop = formatDate(request.dataStop)

  return `<?xml version="1.0" encoding="utf-8"?>
<soap12:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap12="http://www.w3.org/2003/05/soap-envelope">
  <soap12:Body>
    <CautareDosare xmlns="portalquery.just.ro">
      <numarDosar>${escapeXml(numarDosar)}</numarDosar>
      <obiectDosar>${escapeXml(obiectDosar)}</obiectDosar>
      <numeParte>${escapeXml(numeParte)}</numeParte>
      <institutie${institutie ? '' : ' xsi:nil="true"'}>${escapeXml(institutie)}</institutie>
      <dataStart${dataStart ? '' : ' xsi:nil="true"'}>${dataStart}</dataStart>
      <dataStop${dataStop ? '' : ' xsi:nil="true"'}>${dataStop}</dataStop>
    </CautareDosare>
  </soap12:Body>
</soap12:Envelope>`
}

/**
 * Escape XML special characters
 */
function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

/**
 * Parse SOAP response XML
 * Uses regex-based parsing for server-side compatibility
 */
function parseSoapResponse(xmlText: string): CautareDosareResponse {
  try {
    const dosare: Dosar[] = []

    // Extract the body content (remove SOAP envelope)
    const bodyMatch = xmlText.match(/<soap:Body[^>]*>(.*?)<\/soap:Body>/is) ||
      xmlText.match(/<soap12:Body[^>]*>(.*?)<\/soap12:Body>/is) ||
      xmlText.match(/<CautareDosareResponse[^>]*>(.*?)<\/CautareDosareResponse>/is)

    const bodyContent = bodyMatch ? bodyMatch[1] : xmlText

    // Match all <Dosar>...</Dosar> blocks
    const dosarRegex = /<Dosar[^>]*>(.*?)<\/Dosar>/gis
    let match

    while ((match = dosarRegex.exec(bodyContent)) !== null) {
      const dosarContent = match[1]

      const extractField = (fieldName: string): string | undefined => {
        // Handle both <field>value</field> and <field xsi:nil="true"/>
        const regex = new RegExp(`<${fieldName}(?:\\s+xsi:nil="true")?[^>]*>(.*?)<\/${fieldName}>`, 'is')
        const fieldMatch = dosarContent.match(regex)
        if (!fieldMatch) return undefined
        const value = fieldMatch[1]?.trim()
        return value && value.length > 0 ? value : undefined
      }

      dosare.push({
        numarDosar: extractField('numarDosar') || '',
        numarVechi: extractField('numarVechi'),
        numarGeneral: extractField('numarGeneral'),
        data: extractField('data'),
        dataModificare: extractField('dataModificare'),
        institutie: extractField('institutie'),
        departament: extractField('departament'),
        categorieCaz: extractField('categorieCaz') as any,
        stadiuProcesual: extractField('stadiuProcesual') as any,
        categorieCazNume: extractField('categorieCazNume'),
        stadiuProcesualNume: extractField('stadiuProcesualNume'),
        obiect: extractField('obiect'),
        numeParte: extractField('numeParte'),
        numeParte2: extractField('numeParte2'),
        dataUltimaModificare: extractField('dataUltimaModificare'),
      })
    }

    return { dosare }
  } catch (error) {
    console.error('Error parsing SOAP response:', error)
    return { dosare: [] }
  }
}

/**
 * Transform PortalJust Dosar to PortalJustLawsuit
 */
function transformDosarToLawsuit(dosar: Dosar, companyName: string): PortalJustLawsuit {
  // Determine status from stadiuProcesual
  let status: 'active' | 'closed' | 'suspended' | 'cancelled' = 'active'
  const stadiu = dosar.stadiuProcesualNume || dosar.stadiuProcesual || ''

  if (stadiu.toLowerCase().includes('solutionat') || stadiu.toLowerCase().includes('închis')) {
    status = 'closed'
  } else if (stadiu.toLowerCase().includes('suspens')) {
    status = 'suspended'
  } else if (stadiu.toLowerCase().includes('anulat')) {
    status = 'cancelled'
  }

  // Parse parties
  const parties: PortalJustLawsuit['parties'] = []

  if (dosar.numeParte) {
    // Try to determine role - if company name matches, likely defendant
    const isDefendant = dosar.numeParte.toLowerCase().includes(companyName.toLowerCase())
    parties.push({
      role: isDefendant ? 'defendant' : 'plaintiff',
      name: dosar.numeParte,
    })
  }

  if (dosar.numeParte2) {
    parties.push({
      role: 'third_party',
      name: dosar.numeParte2,
    })
  }

  // If no parties found, add company as unknown
  if (parties.length === 0) {
    parties.push({
      role: 'unknown',
      name: companyName,
    })
  }

  return {
    caseNumber: dosar.numarDosar,
    oldCaseNumber: dosar.numarVechi,
    generalNumber: dosar.numarGeneral,
    court: dosar.institutie || 'Necunoscut',
    department: dosar.departament,
    caseType: dosar.categorieCazNume || dosar.categorieCaz || 'Necunoscut',
    status,
    startDate: dosar.data,
    endDate: dosar.dataModificare,
    lastUpdate: dosar.dataUltimaModificare || dosar.dataModificare,
    parties,
    description: dosar.obiect,
    category: dosar.categorieCazNume,
    proceduralStage: dosar.stadiuProcesualNume,
  }
}

/**
 * Fetch litigation data from PortalJust SOAP API
 * @param companyName - Company name to search for
 * @param cui - Company CUI (optional, for logging)
 * @param options - Search options
 */
export async function fetchPortalJustData(
  companyName: string,
  cui?: string,
  options?: {
    includeClosed?: boolean
    dateRange?: { start: Date; end: Date }
    institution?: Institutie | null
  }
): Promise<PortalJustResponse> {
  try {
    // Prepare date range (default: last 5 years)
    const endDate = new Date()
    const startDate = new Date()
    startDate.setFullYear(startDate.getFullYear() - 2)

    const request: CautareDosareRequest = {
      numeParte: companyName,
      institutie: options?.institution || null,
      dataStart: options?.dateRange?.start || startDate,
      dataStop: options?.dateRange?.end || endDate,
    }

    // Build SOAP request
    const soapBody = buildSoapEnvelope(request)

    // Make SOAP request
    const response = await fetch(PORTALJUST_SOAP_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/soap+xml; charset=utf-8',
        'SOAPAction': `"${SOAP_ACTION}"`,
      },
      body: soapBody,
      // Change to no-store because PortalJust responses can exceed 2MB Next.js cache limit
      cache: 'no-store',
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('PortalJust SOAP error:', response.status, errorText)
      return {
        success: false,
        lawsuits: [],
        total: 0,
        lastCheck: new Date().toISOString(),
        error: `PortalJust API error: ${response.status} ${response.statusText}`,
      }
    }

    const xmlText = await response.text()

    // Parse SOAP response
    const soapResponse = parseSoapResponse(xmlText)

    if (!soapResponse.dosare || soapResponse.dosare.length === 0) {
      return {
        success: true,
        lawsuits: [],
        total: 0,
        lastCheck: new Date().toISOString(),
      }
    }

    // Transform to our format
    const lawsuits = soapResponse.dosare
      .map((dosar) => transformDosarToLawsuit(dosar, companyName))
      .filter((lawsuit) => {
        // Filter closed cases if not requested
        if (!options?.includeClosed && lawsuit.status === 'closed') {
          return false
        }
        return true
      })

    return {
      success: true,
      lawsuits,
      total: lawsuits.length,
      lastCheck: new Date().toISOString(),
    }
  } catch (error) {
    console.error('PortalJust fetch error:', error)
    return {
      success: false,
      lawsuits: [],
      total: 0,
      lastCheck: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Eroare necunoscută',
    }
  }
}

/**
 * Calculate litigation risk metrics
 */
export function calculateLitigationRisk(lawsuits: PortalJustLawsuit[]) {
  const active = lawsuits.filter((l) => l.status === 'active').length
  const closed = lawsuits.filter((l) => l.status === 'closed').length

  // Filter lawsuits from last 2 years where company was defendant
  const twoYearsAgo = new Date()
  twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 2)

  const recentLost = lawsuits.filter((l) => {
    if (l.status !== 'closed' || !l.endDate) return false
    const endDate = new Date(l.endDate)
    return (
      endDate >= twoYearsAgo &&
      l.parties.some((p) => p.role === 'defendant')
    )
  }).length

  const hasBankruptcyFiling = lawsuits.some(
    (l) =>
      l.caseType.toLowerCase().includes('insolvență') ||
      l.caseType.toLowerCase().includes('faliment') ||
      l.caseType.toLowerCase().includes('insolventa')
  )

  const hasExecutionProceedings = lawsuits.some(
    (l) =>
      l.caseType.toLowerCase().includes('executare') ||
      l.proceduralStage?.toLowerCase().includes('executare')
  )

  return {
    activeLawsuits: active,
    lostCases2y: recentLost,
    totalLawsuits: lawsuits.length,
    closedLawsuits: closed,
    hasBankruptcyFiling,
    hasExecutionProceedings,
  }
}
