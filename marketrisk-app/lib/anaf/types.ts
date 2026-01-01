// ANAF API Response Types
export interface ANAFCompanyInfo {
  cui: number
  data: string
  denumire: string
  adresa: string
  nrRegCom: string
  telefon: string
  fax: string
  codPostal: string
  act: string
  stare_inregistrare: string
  data_inregistrare: string
  cod_CAEN: string
  iban: string
  statusRO_e_Factura: boolean
  organFiscalCompetent: string
  forma_de_proprietate: string
  forma_organizare: string
  forma_juridica: string
}

export interface ANAFInactiveInfo {
  cui: number
  data_inceput_ScpTVA?: string
  data_sfarsit_ScpTVA?: string
  data_anul_imp_ScpTVA?: string
  mesaj_ScpTVA?: string
  dataInceputTvaInc?: string
  dataSfarsitTvaInc?: string
  dataActualizareTvaInc?: string
  dataPublicareTvaInc?: string
  tipActTvaInc?: string
  statusTvaIncasare?: boolean
  statusInactivi?: boolean
  dataInactivare?: string
  dataReactivare?: string
  dataPublicareInactivi?: string
  dataRadiere?: string
  statusSplitTVA?: boolean
  dataAnulareSplitTVA?: string
}

export interface ANAFResponse {
  cod: number
  message: string
  found: ANAFCompanyInfo[]
  notfound: number[]
}

// Internal Company Data Types
export interface CompanyData {
  cui: string
  name: string
  registrationNumber: string
  address: string
  phone?: string
  fax?: string
  postalCode?: string
  status: string
  registrationDate: string
  caenCode: string
  iban?: string
  eInvoiceStatus: boolean
  taxAuthority: string
  legalForm: string
  organizationForm: string
  propertyForm: string

  // Inactive/Special status data
  isInactive: boolean
  inactiveDate?: string
  reactivationDate?: string
  isVATSplit: boolean
  isTVAIncasare: boolean
}

// Risk Score Types
export type RiskLevel = 'GREEN' | 'YELLOW' | 'RED'

export interface RiskScore {
  level: RiskLevel
  value: number // 0-100
  factors: RiskFactor[]
  lastCalculated: string
}

export interface RiskFactor {
  category: string
  name: string
  impact: 'positive' | 'negative' | 'neutral'
  weight: number
  score: number
  description: string
}

// Search Result Type
export interface CompanySearchResult {
  company: CompanyData
  riskScore: RiskScore
  lastUpdated: string
}
