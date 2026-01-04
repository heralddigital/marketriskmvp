// PortalJust SOAP API Types
// Based on WSDL: http://portalquery.just.ro/query.asmx?WSDL

export type Institutie = 
  | 'CurteadeApelBUCURESTI'
  | 'TribunalulBUCURESTI'
  | 'JudecatoriaSECTORUL4BUCURESTI'
  | 'TribunalulTIMIS'
  | 'CurteadeApelBACAU'
  | 'CurteadeApelCLUJ'
  | 'CurteadeApelORADEA'
  | 'CurteadeApelCONSTANTA'
  | 'CurteadeApelSUCEAVA'
  | 'TribunalulBOTOSANI'
  | 'CurteadeApelPLOIESTI'
  | 'CurteadeApelTARGUMURES'
  | 'CurteadeApelGALATI'
  | 'CurteadeApelIASI'
  | 'CurteadeApelPITESTI'
  | 'CurteadeApelCRAIOVA'
  | 'JudecatoriaARAD'
  | 'CurteadeApelALBAIULIA'
  | 'CurteadeApelTIMISOARA'
  | 'TribunalulBRASOV'
  | 'TribunalulDOLJ'
  | 'CurteadeApelBRASOV'
  | 'CurteaMilitaradeApelBUCURESTI'
  | 'TribunalulSATUMARE'
  | 'TribunalulSALAJ'
  | 'TribunalulSIBIU'
  | 'TribunalulSUCEAVA'
  | 'TribunalulTELEORMAN'
  | 'TribunalulTULCEA'
  | 'TribunalulVASLUI'
  | 'TribunalulVALCEA'
  | 'TribunalulVRANCEA'
  | 'TribunalulMilitarBUCURESTI'
  | 'TribunalulILFOV'
  | 'JudecatoriaBUFTEA'
  | 'TribunalulGORJ'
  | 'TribunalulHARGHITA'
  | 'TribunalulHUNEDOARA'
  | 'TribunalulIALOMITA'
  | 'TribunalulIASI'
  | 'TribunalulMARAMURES'
  | 'TribunalulMEHEDINTI'
  | 'TribunalulMURES'
  | 'TribunalulNEAMT'
  | 'TribunalulOLT'
  | 'TribunalulPRAHOVA'
  | 'TribunalulALBA'
  | 'TribunalulARAD'
  | 'TribunalulARGES'
  | 'TribunalulBACAU'
  | 'TribunalulBIHOR'
  | 'TribunalulBISTRITANASAUD'
  | 'TribunalulBRAILA'
  | 'TribunalulBUZAU'
  | 'TribunalulCARASSEVERIN'
  | 'TribunalulCALARASI'
  | 'TribunalulCLUJ'
  | 'TribunalulCONSTANTA'
  | 'TribunalulCOVASNA'
  | 'TribunalulDAMBOVITA'
  | 'TribunalulGALATI'
  | 'TribunalulGIURGIU'
  | string // Allow any string for future compatibility

export type CategorieCaz =
  | 'Civil'
  | 'Comercial'
  | 'Contencios'
  | 'Faliment'
  | 'Insolventa'
  | 'Penal'
  | 'Laboral'
  | string

export type StadiuProcesual =
  | 'In curs'
  | 'Solutionat'
  | 'Suspens'
  | 'Anulat'
  | string

// SOAP Request Types
export interface CautareDosareRequest {
  numarDosar?: string | null
  obiectDosar?: string | null
  numeParte?: string | null
  institutie: Institutie | null
  dataStart: Date | null
  dataStop: Date | null
}

// SOAP Response Types (parsed from XML)
export interface Dosar {
  numarDosar: string
  numarVechi?: string
  numarGeneral?: string
  data?: string
  dataModificare?: string
  institutie?: string
  departament?: string
  categorieCaz?: CategorieCaz
  stadiuProcesual?: StadiuProcesual
  categorieCazNume?: string
  stadiuProcesualNume?: string
  obiect?: string
  numeParte?: string
  numeParte2?: string
  dataUltimaModificare?: string
}

export interface CautareDosareResponse {
  dosare?: Dosar[]
}

// Transformed types (matching existing interface)
export interface PortalJustLawsuit {
  caseNumber: string
  oldCaseNumber?: string
  generalNumber?: string
  court: string
  department?: string
  caseType: string
  status: 'active' | 'closed' | 'suspended' | 'cancelled'
  startDate?: string
  endDate?: string
  lastUpdate?: string
  parties: {
    role: 'plaintiff' | 'defendant' | 'third_party' | 'unknown'
    name: string
    cui?: string
  }[]
  description?: string
  category?: string
  proceduralStage?: string
}

export interface PortalJustResponse {
  success: boolean
  lawsuits: PortalJustLawsuit[]
  total: number
  lastCheck: string
  error?: string
}

