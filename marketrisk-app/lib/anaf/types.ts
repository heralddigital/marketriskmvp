// ANAF API v9 Response Types

// V9 Response - nested structure with date_generale
export interface ANAFV9DateGenerale {
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

export interface ANAFV9TVAPeriod {
  data_inceput_ScpTVA: string
  data_sfarsit_ScpTVA: string
  data_anul_imp_ScpTVA: string
  mesaj_ScpTVA: string
}

export interface ANAFV9InregistrareTVA {
  scpTVA: boolean
  perioade_TVA: ANAFV9TVAPeriod[]
}

export interface ANAFV9InregistrareRTVAI {
  dataInceputTvaInc: string
  dataSfarsitTvaInc: string
  dataActualizareTvaInc: string
  dataPublicareTvaInc: string
  tipActTvaInc: string
  statusTvaIncasare: boolean
}

export interface ANAFV9StareInactiv {
  dataInactivare: string
  dataReactivare: string
  dataPublicare: string
  dataRadiere: string
  statusInactivi: boolean
}

export interface ANAFV9SplitTVA {
  dataInceputSplitTVA: string
  dataAnulareSplitTVA: string
  statusSplitTVA: boolean
}

export interface ANAFV9Address {
  sdenumire_Strada: string
  snumar_Strada: string
  sdenumire_Localitate: string
  sdenumire_Judet: string
  sstara: string
  scod_Postal: string
  sdetalii_Adresa: string
}

export interface ANAFV9CompanyInfo {
  date_generale: ANAFV9DateGenerale
  inregistrare_scop_Tva?: ANAFV9InregistrareTVA
  inregistrare_RTVAI?: ANAFV9InregistrareRTVAI
  stare_inactiv?: ANAFV9StareInactiv
  inregistrare_SplitTVA?: ANAFV9SplitTVA
  adresa_sediu_social?: ANAFV9Address
  adresa_domiciliu_fiscal?: ANAFV9Address
}

export interface ANAFV9Response {
  cod: number
  message: string
  found: ANAFV9CompanyInfo[]
  notfound: number[]
}

// Keep legacy type for backward compatibility
export type ANAFResponse = ANAFV9Response
export type ANAFCompanyInfo = ANAFV9CompanyInfo

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
