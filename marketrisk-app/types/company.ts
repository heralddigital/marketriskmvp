// Company and Risk-Related Types

export interface Company {
  id: string;
  cui: string; // Romanian VAT ID
  company_name: string;
  registration_number: string | null;

  // ANAF data
  anaf_data: ANAFData;
  vat_active: boolean | null;
  vat_split_regime: boolean | null; // TVA la incasare
  company_active: boolean | null;
  state_debts: number;

  // PortalJust data
  active_lawsuits: number;
  lost_cases_2y: number;
  bankruptcy_filing: boolean;

  // BPI insolvency
  insolvency_status: 'none' | 'active' | 'history' | null;

  // Risk score
  current_risk_score: number | null;
  current_risk_level: RiskLevel | null;
  risk_details: RiskDetail[] | null;

  // Cache management
  last_anaf_check: string | null;
  last_portaljust_check: string | null;
  last_risk_calculation: string | null;

  created_at: string;
  updated_at: string;
}

export interface ANAFData {
  cui: string;
  denumire: string;
  adresa: string;
  nrRegCom: string;
  telefon?: string;
  fax?: string;
  codPostal?: string;
  act?: string;
  stare_inregistrare?: string;
  data_inregistrare?: string;
  cod_CAEN?: string;
  iban?: string;
  statusRO_e_Factura?: boolean;
  organFiscalCompetent?: string;
  forma_de_proprietate?: string;
  forma_organizare?: string;
  forma_juridica?: string;

  // Split VAT regime (TVA la incasare)
  scpTVA?: boolean;
  perioade_TVA?: Array<{
    data_inceput_ScpTVA: string;
    data_sfarsit_ScpTVA?: string;
    data_anul_imp_ScpTVA?: string;
  }>;

  // VAT registration
  dataInactivare?: string;
  dataReactivare?: string;
  dataPublicare?: string;
  dataRadiere?: string;
  statusInactivi?: string;
  dataInceputTvaInc?: string;
  dataSfarsitTvaInc?: string;
  statusTvaIncasare?: boolean;

  // Debts
  dataActualizare?: string;
  _embedded?: {
    debite?: Array<{
      an: number;
      suma: number;
    }>;
  };
}

export type RiskLevel = 'GREEN' | 'YELLOW' | 'RED';

export interface RiskDetail {
  factor: string;
  points: number;
  category: RiskCategory;
}

export type RiskCategory =
  | 'legal_regulatory'
  | 'litigation'
  | 'financial_behavior'
  | 'operational'
  | 'positive_adjustment';

export interface RiskScore {
  score: number;
  riskLevel: RiskLevel;
  color: 'success' | 'warning' | 'danger';
  recommendation: string;
  details: RiskDetail[];
  calculatedAt: string;
}

export interface RiskScoreHistory {
  id: string;
  company_id: string;
  score: number;
  risk_level: RiskLevel;
  details: RiskDetail[];
  calculated_at: string;
}

export interface Litigation {
  id: string;
  company_id: string;
  case_number: string;
  court_name: string | null;
  case_type: 'civil' | 'commercial' | 'insolvency' | 'labor' | null;
  role: 'plaintiff' | 'defendant' | null;
  status: 'active' | 'closed' | 'appeal' | null;
  outcome: 'won' | 'lost' | 'settled' | 'pending' | null;
  filing_date: string | null;
  closing_date: string | null;
  amount: number | null;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface CompanySearchResult {
  cui: string;
  company_name: string;
  vat_active: boolean;
  company_active: boolean;
  current_risk_level: RiskLevel | null;
}
