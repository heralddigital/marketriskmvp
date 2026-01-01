// MarketRisk Credit Score (MRCS) - Main Calculator

import { RiskScore, RiskLevel } from '@/types';
import {
  CompanyRiskData,
  calculateLegalRegulatoryPoints,
  calculateLitigationPoints,
  calculateFinancialPoints,
  calculateOperationalPoints,
  calculatePositiveAdjustments,
} from './factors';

// =============================================
// Risk Level Thresholds
// =============================================
const RISK_THRESHOLDS = {
  GREEN: { min: 0, max: 14 },
  YELLOW: { min: 15, max: 49 },
  RED: { min: 50, max: Infinity },
} as const;

// =============================================
// Main Risk Score Calculator
// =============================================
export function calculateMarketRiskScore(
  companyData: CompanyRiskData
): RiskScore {
  // Calculate points from each category
  const legalRegulatory = calculateLegalRegulatoryPoints(companyData);
  const litigation = calculateLitigationPoints(companyData);
  const financial = calculateFinancialPoints(companyData);
  const operational = calculateOperationalPoints(companyData);
  const positiveAdjustments = calculatePositiveAdjustments(companyData);

  // Combine all factors
  const allDetails = [
    ...legalRegulatory,
    ...litigation,
    ...financial,
    ...operational,
    ...positiveAdjustments,
  ];

  // Calculate total score
  const totalScore = allDetails.reduce((sum, detail) => sum + detail.points, 0);

  // Score can't be negative
  const finalScore = Math.max(totalScore, 0);

  // Determine risk level
  const { riskLevel, color, recommendation } = getRiskLevel(finalScore);

  return {
    score: finalScore,
    riskLevel,
    color,
    recommendation,
    details: allDetails,
    calculatedAt: new Date().toISOString(),
  };
}

// =============================================
// Determine Risk Level from Score
// =============================================
function getRiskLevel(score: number): {
  riskLevel: RiskLevel;
  color: 'success' | 'warning' | 'danger';
  recommendation: string;
} {
  if (score >= RISK_THRESHOLDS.RED.min) {
    return {
      riskLevel: 'RED',
      color: 'danger',
      recommendation:
        'Risc ridicat - Evitați colaborarea sau solicitați garanții substanțiale. Compania prezintă multiple semne de alarmă.',
    };
  } else if (score >= RISK_THRESHOLDS.YELLOW.min) {
    return {
      riskLevel: 'YELLOW',
      color: 'warning',
      recommendation:
        'Risc mediu - Monitorizare atentă necesară. Verificați periodic evoluția indicatorilor și limitați expunerea financiară.',
    };
  } else {
    return {
      riskLevel: 'GREEN',
      color: 'success',
      recommendation:
        'Risc scăzut - Companie cu indicatori favorabili. Monitorizare de rutină recomandată.',
    };
  }
}

// =============================================
// Risk Trend Analysis
// =============================================
export interface RiskTrend {
  direction: 'improving' | 'worsening' | 'stable';
  scoreChange: number;
  levelChange: boolean;
  previousLevel: RiskLevel | null;
  currentLevel: RiskLevel;
  daysAnalyzed: number;
}

export function analyzeRiskTrend(
  currentScore: number,
  currentLevel: RiskLevel,
  previousScore: number | null,
  previousLevel: RiskLevel | null,
  daysBetween: number
): RiskTrend {
  if (previousScore === null || previousLevel === null) {
    return {
      direction: 'stable',
      scoreChange: 0,
      levelChange: false,
      previousLevel: null,
      currentLevel,
      daysAnalyzed: 0,
    };
  }

  const scoreChange = currentScore - previousScore;
  const levelChange = currentLevel !== previousLevel;

  let direction: 'improving' | 'worsening' | 'stable';

  if (scoreChange > 5) {
    direction = 'worsening';
  } else if (scoreChange < -5) {
    direction = 'improving';
  } else {
    direction = 'stable';
  }

  return {
    direction,
    scoreChange,
    levelChange,
    previousLevel,
    currentLevel,
    daysAnalyzed: daysBetween,
  };
}

// =============================================
// Score Explanation Generator
// =============================================
export function generateScoreExplanation(score: RiskScore): string {
  const { riskLevel, score: points, details } = score;

  const categoryBreakdown = details.reduce((acc, detail) => {
    if (!acc[detail.category]) {
      acc[detail.category] = {
        total: 0,
        factors: [],
      };
    }
    acc[detail.category].total += detail.points;
    acc[detail.category].factors.push(detail);
    return acc;
  }, {} as Record<string, { total: number; factors: typeof details }>);

  let explanation = `**Scor risc: ${points} puncte - Nivel ${riskLevel}**\n\n`;

  // Sort categories by absolute total points
  const sortedCategories = Object.entries(categoryBreakdown).sort(
    ([, a], [, b]) => Math.abs(b.total) - Math.abs(a.total)
  );

  for (const [category, data] of sortedCategories) {
    if (data.total === 0) continue;

    explanation += `**${getCategoryName(category)}** (${data.total > 0 ? '+' : ''}${data.total} puncte):\n`;

    for (const factor of data.factors) {
      explanation += `- ${factor.factor}: ${factor.points > 0 ? '+' : ''}${factor.points} puncte\n`;
    }
    explanation += '\n';
  }

  return explanation;
}

function getCategoryName(category: string): string {
  const names: Record<string, string> = {
    legal_regulatory: 'Legal & Reglementare',
    litigation: 'Litigii',
    financial_behavior: 'Comportament Financiar',
    operational: 'Semnale Operaționale',
    positive_adjustment: 'Ajustări Pozitive',
  };
  return names[category] || category;
}

// =============================================
// Export Risk Level Helpers
// =============================================
export function getRiskLevelColor(
  level: RiskLevel | null
): 'success' | 'warning' | 'danger' | 'default' {
  if (!level) return 'default';

  switch (level) {
    case 'GREEN':
      return 'success';
    case 'YELLOW':
      return 'warning';
    case 'RED':
      return 'danger';
    default:
      return 'default';
  }
}

export function getRiskLevelBadgeText(level: RiskLevel | null): string {
  if (!level) return 'Necalculat';

  switch (level) {
    case 'GREEN':
      return 'Risc Scăzut';
    case 'YELLOW':
      return 'Risc Mediu';
    case 'RED':
      return 'Risc Ridicat';
    default:
      return 'Necunoscut';
  }
}

export { RISK_THRESHOLDS };
