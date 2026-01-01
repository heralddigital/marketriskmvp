// Alert and Notification Types

export type AlertType =
  | 'risk_change'
  | 'lawsuit'
  | 'insolvency'
  | 'debt'
  | 'vat_change'
  | 'status_change';

export type AlertSeverity = 'info' | 'warning' | 'critical';

export interface Alert {
  id: string;
  user_id: string;
  company_id: string | null;
  alert_type: AlertType;
  severity: AlertSeverity | null;
  message: string;
  details: Record<string, any> | null;
  read_at: string | null;
  email_sent: boolean;
  email_sent_at: string | null;
  created_at: string;
}

export interface AlertWithCompany extends Alert {
  company: {
    cui: string;
    company_name: string;
  } | null;
}

export interface AlertDetails {
  // Risk change details
  previousRiskLevel?: string;
  newRiskLevel?: string;
  scoreChange?: number;

  // Lawsuit details
  caseNumber?: string;
  courtName?: string;
  caseType?: string;

  // Debt details
  debtAmount?: number;
  debtYear?: number;

  // General
  changeDate?: string;
  description?: string;
}

export interface SearchHistory {
  id: string;
  user_id: string;
  cui: string;
  company_name: string | null;
  search_date: string;
  created_at: string;
}
