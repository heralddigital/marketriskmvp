// MarketRisk Credit Score (MRCS) - Risk Factor Definitions

import { RiskDetail, RiskCategory } from '@/types';

export interface CompanyRiskData {
  // ANAF data
  anaf: {
    stare_firma: string;
    vat_deregistered: boolean;
    split_vat_regime: boolean;
    state_debts_eur: number;
    company_age_months: number;
    address_changes_2y: number;
    employees: number;
  };

  // BPI data
  bpi: {
    active_insolvency: boolean;
    insolvency_history_3y: boolean;
  };

  // PortalJust data
  portaljust: {
    active_lawsuits: number;
    lost_cases_2y: number;
    bankruptcy_filing: boolean;
    execution_proceedings: boolean;
    labor_disputes: number;
    // Enhanced metrics
    active_as_defendant?: number;
    active_as_plaintiff?: number;
    won_cases_2y?: number;
    commercial_disputes?: number;
    high_value_cases?: number;
  };

  // MFinante (Ministry of Finance) data
  mfinante?: {
    missing_statements: boolean;
    delayed_filing: boolean;
    negative_equity: boolean;
    revenue_drop_50: boolean;
  };

  // Additional data
  additional?: {
    certified_accounts: boolean;
    is_exporter: boolean;
  };
}

// =============================================
// CATEGORY 1: Legal & Regulatory Status (60 points max)
// =============================================
export function calculateLegalRegulatoryPoints(
  data: CompanyRiskData
): RiskDetail[] {
  const details: RiskDetail[] = [];

  // Inactive company (+50)
  if (data.anaf.stare_firma !== 'ACTIVA') {
    details.push({
      factor: 'Companie inactivă',
      points: 50,
      category: 'legal_regulatory',
    });
  }

  // Active insolvency (+40)
  if (data.bpi.active_insolvency) {
    details.push({
      factor: 'Procedură de insolvență activă',
      points: 40,
      category: 'legal_regulatory',
    });
  }

  // Insolvency history (+20)
  if (data.bpi.insolvency_history_3y && !data.bpi.active_insolvency) {
    details.push({
      factor: 'Istoric insolvență (ultimi 3 ani)',
      points: 20,
      category: 'legal_regulatory',
    });
  }

  // VAT deregistered (+35)
  if (data.anaf.vat_deregistered) {
    details.push({
      factor: 'TVA radiat',
      points: 35,
      category: 'legal_regulatory',
    });
  }

  // Split VAT regime (+15)
  if (data.anaf.split_vat_regime) {
    details.push({
      factor: 'Regim TVA la încasare',
      points: 15,
      category: 'legal_regulatory',
    });
  }

  // State debts
  const debts = data.anaf.state_debts_eur;
  if (debts > 10000) {
    details.push({
      factor: `Datorii la stat: €${debts.toLocaleString('ro-RO')} (mari)`,
      points: 30,
      category: 'legal_regulatory',
    });
  } else if (debts > 1000) {
    details.push({
      factor: `Datorii la stat: €${debts.toLocaleString('ro-RO')} (medii)`,
      points: 15,
      category: 'legal_regulatory',
    });
  } else if (debts > 0) {
    details.push({
      factor: `Datorii la stat: €${debts.toLocaleString('ro-RO')} (mici)`,
      points: 5,
      category: 'legal_regulatory',
    });
  }

  return details;
}

// =============================================
// CATEGORY 2: Litigation & Legal Risk (40 points max)
// Enhanced with plaintiff/defendant differentiation
// =============================================
export function calculateLitigationPoints(
  data: CompanyRiskData
): RiskDetail[] {
  const details: RiskDetail[] = [];

  // Active lawsuits as DEFENDANT - Higher risk (10 points each, max 40)
  // Being a defendant indicates the company is being sued, which is a financial risk
  const activeAsDefendant = data.portaljust.active_as_defendant || 0;
  if (activeAsDefendant > 0) {
    const points = Math.min(activeAsDefendant * 10, 40);
    details.push({
      factor: `${activeAsDefendant} proces${activeAsDefendant > 1 ? 'e' : ''} activ${activeAsDefendant > 1 ? 'e' : ''} ca pârât`,
      points,
      category: 'litigation',
    });
  }

  // Active lawsuits as PLAINTIFF - Lower risk (3 points each, max 15)
  // Being a plaintiff means the company is pursuing claims, less risky but still indicates disputes
  const activeAsPlaintiff = data.portaljust.active_as_plaintiff || 0;
  if (activeAsPlaintiff > 0) {
    const points = Math.min(activeAsPlaintiff * 3, 15);
    details.push({
      factor: `${activeAsPlaintiff} proces${activeAsPlaintiff > 1 ? 'e' : ''} activ${activeAsPlaintiff > 1 ? 'e' : ''} ca reclamant`,
      points,
      category: 'litigation',
    });
  }

  // Fallback: If no role-specific data, use total active lawsuits (conservative approach)
  if (activeAsDefendant === 0 && activeAsPlaintiff === 0) {
    const lawsuits = data.portaljust.active_lawsuits || 0;
    if (lawsuits > 0) {
      // Assume worst case: all are as defendant
      const points = Math.min(lawsuits * 10, 40);
      details.push({
        factor: `${lawsuits} proces${lawsuits > 1 ? 'e' : ''} activ${lawsuits > 1 ? 'e' : ''} (rol necunoscut)`,
        points,
        category: 'litigation',
      });
    }
  }

  // Lost cases in last 2 years (as defendant) - 15 points each, max 45
  // Lost cases indicate financial liability and poor legal outcomes
  const lostCases = data.portaljust.lost_cases_2y || 0;
  if (lostCases > 0) {
    const points = Math.min(lostCases * 15, 45);
    details.push({
      factor: `${lostCases} proces${lostCases > 1 ? 'e' : ''} pierdut${lostCases > 1 ? 'e' : ''} ca pârât (ultimi 2 ani)`,
      points,
      category: 'litigation',
    });
  }

  // Won cases as plaintiff - Small positive adjustment (negative points)
  // Shows company can successfully pursue claims, but too many lawsuits still a concern
  const wonCases = data.portaljust.won_cases_2y || 0;
  if (wonCases > 0 && wonCases <= 2) {
    // Only small positive if 1-2 won cases (shows competence, not excessive litigation)
    details.push({
      factor: `${wonCases} proces${wonCases > 1 ? 'e' : ''} câștigat${wonCases > 1 ? 'e' : ''} ca reclamant`,
      points: -2,
      category: 'positive_adjustment',
    });
  }

  // Bankruptcy filing (+40) - Critical financial risk
  if (data.portaljust.bankruptcy_filing) {
    details.push({
      factor: 'Cerere de faliment activă',
      points: 40,
      category: 'litigation',
    });
  }

  // Execution proceedings (+30) - High financial risk
  // Execution means assets can be seized, severe financial distress
  if (data.portaljust.execution_proceedings) {
    details.push({
      factor: 'Executare silită activă',
      points: 30,
      category: 'litigation',
    });
  }

  // Commercial disputes - 8 points each (max 24)
  // Commercial disputes often involve significant financial amounts
  const commercialDisputes = data.portaljust.commercial_disputes || 0;
  if (commercialDisputes > 0) {
    const points = Math.min(commercialDisputes * 8, 24);
    details.push({
      factor: `${commercialDisputes} litig${commercialDisputes > 1 ? 'ii' : 'iu'} comercial${commercialDisputes > 1 ? 'e' : ''}`,
      points,
      category: 'litigation',
    });
  }

  // High-value cases - Additional 5 points per case (max 15)
  // Cases with significant financial impact
  const highValueCases = data.portaljust.high_value_cases || 0;
  if (highValueCases > 0) {
    const points = Math.min(highValueCases * 5, 15);
    details.push({
      factor: `${highValueCases} proces${highValueCases > 1 ? 'e' : ''} cu impact financiar semnificativ`,
      points,
      category: 'litigation',
    });
  }

  // Labor disputes - 6 points each (max 18)
  // Labor disputes indicate operational issues and potential financial liability
  const laborDisputes = data.portaljust.labor_disputes || 0;
  if (laborDisputes > 0) {
    const points = Math.min(laborDisputes * 6, 18);
    details.push({
      factor: `${laborDisputes} litig${laborDisputes > 1 ? 'ii' : 'iu'} de muncă`,
      points,
      category: 'litigation',
    });
  }

  return details;
}

// =============================================
// CATEGORY 3: Financial Behavior (30 points max)
// =============================================
export function calculateFinancialPoints(
  data: CompanyRiskData
): RiskDetail[] {
  const details: RiskDetail[] = [];

  if (!data.mfinante) return details;

  // Missing financial statements (+20)
  if (data.mfinante.missing_statements) {
    details.push({
      factor: 'Lipsă situații financiare (ultimi 2 ani)',
      points: 20,
      category: 'financial_behavior',
    });
  }

  // Delayed filing (+10)
  if (data.mfinante.delayed_filing) {
    details.push({
      factor: 'Depunere întârziată situații financiare',
      points: 10,
      category: 'financial_behavior',
    });
  }

  // Negative equity (+25)
  if (data.mfinante.negative_equity) {
    details.push({
      factor: 'Capital propriu negativ',
      points: 25,
      category: 'financial_behavior',
    });
  }

  // Revenue drop >50% (+15)
  if (data.mfinante.revenue_drop_50) {
    details.push({
      factor: 'Scădere cifră afaceri >50% (an/an)',
      points: 15,
      category: 'financial_behavior',
    });
  }

  return details;
}

// =============================================
// CATEGORY 4: Operational Red Flags (20 points max)
// =============================================
export function calculateOperationalPoints(
  data: CompanyRiskData
): RiskDetail[] {
  const details: RiskDetail[] = [];

  // Company age < 6 months (+15)
  if (data.anaf.company_age_months < 6) {
    details.push({
      factor: 'Companie nouă (sub 6 luni)',
      points: 15,
      category: 'operational',
    });
  }

  // Frequent address changes (+10)
  if (data.anaf.address_changes_2y >= 3) {
    details.push({
      factor: `${data.anaf.address_changes_2y} schimbări de adresă (2 ani)`,
      points: 10,
      category: 'operational',
    });
  }

  // No employees (+8)
  if (data.anaf.employees === 0) {
    details.push({
      factor: 'Fără angajați declarați',
      points: 8,
      category: 'operational',
    });
  }

  return details;
}

// =============================================
// CATEGORY 5: Positive Adjustments (negative points)
// =============================================
export function calculatePositiveAdjustments(
  data: CompanyRiskData
): RiskDetail[] {
  const details: RiskDetail[] = [];

  // Company age >10 years (-10)
  if (data.anaf.company_age_months > 120) {
    details.push({
      factor: 'Companie înființată de peste 10 ani',
      points: -10,
      category: 'positive_adjustment',
    });
  }

  // Large company (50+ employees) (-15)
  if (data.anaf.employees >= 50) {
    details.push({
      factor: `Companie mare (${data.anaf.employees} angajați)`,
      points: -15,
      category: 'positive_adjustment',
    });
  }

  // Certified accounts (-10)
  if (data.additional?.certified_accounts) {
    details.push({
      factor: 'Conturi certificate de auditor',
      points: -10,
      category: 'positive_adjustment',
    });
  }

  // Exporter (-8)
  if (data.additional?.is_exporter) {
    details.push({
      factor: 'Activitate de export',
      points: -8,
      category: 'positive_adjustment',
    });
  }

  return details;
}

// =============================================
// Risk Category Descriptions (Romanian)
// =============================================
export const RISK_CATEGORY_NAMES: Record<RiskCategory, string> = {
  legal_regulatory: 'Legal & Reglementare',
  litigation: 'Litigii',
  financial_behavior: 'Comportament Financiar',
  operational: 'Semnale Operaționale',
  positive_adjustment: 'Ajustări Pozitive',
};
