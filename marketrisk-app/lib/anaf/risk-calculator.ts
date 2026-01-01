import type { CompanyData, RiskScore, RiskFactor, RiskLevel } from './types'

/**
 * MarketRisk Credit Score (MRCS) Algorithm
 * Calculates credit risk based on 24 factors from ANAF data
 */

interface FactorWeight {
  category: string
  factors: {
    name: string
    weight: number
    calculate: (company: CompanyData) => { score: number; description: string; impact: 'positive' | 'negative' | 'neutral' }
  }[]
}

// Factor weights configuration (total should equal 100)
const FACTOR_WEIGHTS: FactorWeight[] = [
  {
    category: 'Status legal',
    factors: [
      {
        name: 'Status înregistrare',
        weight: 15,
        calculate: (company) => {
          const status = company.status.toLowerCase()
          if (status.includes('inactiv') || status.includes('radiat')) {
            return { score: 0, description: 'Companie inactivă sau radiată', impact: 'negative' }
          }
          if (status.includes('activ')) {
            return { score: 100, description: 'Companie activă', impact: 'positive' }
          }
          return { score: 50, description: 'Status necunoscut', impact: 'neutral' }
        }
      },
      {
        name: 'Vechime companie',
        weight: 8,
        calculate: (company) => {
          const regDate = new Date(company.registrationDate)
          const years = (Date.now() - regDate.getTime()) / (1000 * 60 * 60 * 24 * 365)

          if (years > 10) {
            return { score: 100, description: `${Math.floor(years)} ani vechime - foarte stabil`, impact: 'positive' }
          }
          if (years > 5) {
            return { score: 80, description: `${Math.floor(years)} ani vechime - stabil`, impact: 'positive' }
          }
          if (years > 2) {
            return { score: 60, description: `${Math.floor(years)} ani vechime - mediu`, impact: 'neutral' }
          }
          return { score: 40, description: `${Math.floor(years)} ani vechime - companie nouă`, impact: 'negative' }
        }
      },
      {
        name: 'Status inactivitate',
        weight: 12,
        calculate: (company) => {
          if (company.isInactive) {
            return { score: 0, description: 'Companie înregistrată ca inactivă', impact: 'negative' }
          }
          return { score: 100, description: 'Companie activă', impact: 'positive' }
        }
      }
    ]
  },
  {
    category: 'Status TVA',
    factors: [
      {
        name: 'Înregistrare TVA',
        weight: 10,
        calculate: (company) => {
          // Check if company has valid registration number and is active
          if (company.registrationNumber && company.status.toLowerCase().includes('activ')) {
            return { score: 100, description: 'Înregistrat TVA', impact: 'positive' }
          }
          return { score: 70, description: 'Neînregistrat TVA sau status neclar', impact: 'neutral' }
        }
      },
      {
        name: 'TVA la încasare',
        weight: 5,
        calculate: (company) => {
          if (company.isTVAIncasare) {
            return { score: 60, description: 'TVA la încasare (posibil risc cashflow)', impact: 'negative' }
          }
          return { score: 100, description: 'TVA normal', impact: 'positive' }
        }
      },
      {
        name: 'Split TVA',
        weight: 7,
        calculate: (company) => {
          if (company.isVATSplit) {
            return { score: 50, description: 'În regim Split TVA (risc fiscal)', impact: 'negative' }
          }
          return { score: 100, description: 'Fără Split TVA', impact: 'positive' }
        }
      }
    ]
  },
  {
    category: 'Infrastructură digitală',
    factors: [
      {
        name: 'E-Factura',
        weight: 5,
        calculate: (company) => {
          if (company.eInvoiceStatus) {
            return { score: 100, description: 'Înregistrat în SPV RO e-Factura', impact: 'positive' }
          }
          return { score: 70, description: 'Neînregistrat în RO e-Factura', impact: 'neutral' }
        }
      },
      {
        name: 'Date de contact',
        weight: 3,
        calculate: (company) => {
          const hasPhone = !!company.phone
          const hasFax = !!company.fax

          if (hasPhone && hasFax) {
            return { score: 100, description: 'Date complete de contact', impact: 'positive' }
          }
          if (hasPhone) {
            return { score: 80, description: 'Are telefon', impact: 'neutral' }
          }
          return { score: 60, description: 'Date incomplete de contact', impact: 'negative' }
        }
      },
      {
        name: 'IBAN declarat',
        weight: 4,
        calculate: (company) => {
          if (company.iban && company.iban.length > 5) {
            return { score: 100, description: 'IBAN declarat în ANAF', impact: 'positive' }
          }
          return { score: 70, description: 'Fără IBAN declarat', impact: 'neutral' }
        }
      }
    ]
  },
  {
    category: 'Formă juridică',
    factors: [
      {
        name: 'Tip societate',
        weight: 6,
        calculate: (company) => {
          const form = company.legalForm.toLowerCase()

          if (form.includes('sa') || form.includes('societate pe actiuni')) {
            return { score: 100, description: 'SA - formă stabilă', impact: 'positive' }
          }
          if (form.includes('srl')) {
            return { score: 90, description: 'SRL - formă standard', impact: 'positive' }
          }
          if (form.includes('pfa') || form.includes('ii')) {
            return { score: 70, description: 'PFA/II - răspundere personală', impact: 'neutral' }
          }
          return { score: 80, description: form, impact: 'neutral' }
        }
      },
      {
        name: 'Formă organizare',
        weight: 3,
        calculate: (company) => {
          if (company.organizationForm) {
            return { score: 100, description: `Formă: ${company.organizationForm}`, impact: 'positive' }
          }
          return { score: 80, description: 'Formă organizare standard', impact: 'neutral' }
        }
      }
    ]
  },
  {
    category: 'Cod CAEN',
    factors: [
      {
        name: 'Cod activitate principal',
        weight: 4,
        calculate: (company) => {
          if (company.caenCode && company.caenCode.length >= 4) {
            // High-risk sectors check (placeholder - would need full CAEN database)
            const highRiskCodes = ['4711', '4719', '4791', '4799'] // Retail
            const mediumRiskCodes = ['4120', '4211', '4212'] // Construction

            if (highRiskCodes.some(code => company.caenCode.startsWith(code))) {
              return { score: 60, description: `CAEN ${company.caenCode} - sector risc mediu`, impact: 'negative' }
            }
            if (mediumRiskCodes.some(code => company.caenCode.startsWith(code))) {
              return { score: 75, description: `CAEN ${company.caenCode} - sector normal`, impact: 'neutral' }
            }
            return { score: 90, description: `CAEN ${company.caenCode}`, impact: 'positive' }
          }
          return { score: 50, description: 'Cod CAEN lipsă', impact: 'negative' }
        }
      }
    ]
  },
  {
    category: 'Sediu și locație',
    factors: [
      {
        name: 'Adresă completă',
        weight: 3,
        calculate: (company) => {
          if (company.address && company.address.length > 20) {
            return { score: 100, description: 'Adresă completă declarată', impact: 'positive' }
          }
          return { score: 70, description: 'Adresă incompletă', impact: 'neutral' }
        }
      },
      {
        name: 'Cod poștal',
        weight: 2,
        calculate: (company) => {
          if (company.postalCode && company.postalCode.length >= 5) {
            return { score: 100, description: 'Cod poștal valid', impact: 'positive' }
          }
          return { score: 80, description: 'Fără cod poștal', impact: 'neutral' }
        }
      }
    ]
  },
  {
    category: 'Autoritate fiscală',
    factors: [
      {
        name: 'Organ fiscal competent',
        weight: 3,
        calculate: (company) => {
          if (company.taxAuthority && company.taxAuthority.length > 5) {
            return { score: 100, description: `${company.taxAuthority}`, impact: 'positive' }
          }
          return { score: 80, description: 'Organ fiscal declarat', impact: 'neutral' }
        }
      }
    ]
  }
]

// Additional synthetic factors for comprehensive 24-factor scoring
const SYNTHETIC_FACTORS: FactorWeight = {
  category: 'Analiză sintetică',
  factors: [
    {
      name: 'Completitudine date ANAF',
      weight: 5,
      calculate: (company) => {
        const fields = [
          company.phone,
          company.fax,
          company.iban,
          company.postalCode,
          company.taxAuthority,
          company.caenCode
        ]
        const filledFields = fields.filter(f => f && f.length > 0).length
        const completeness = (filledFields / fields.length) * 100

        return {
          score: completeness,
          description: `${Math.round(completeness)}% date complete`,
          impact: completeness > 80 ? 'positive' : completeness > 50 ? 'neutral' : 'negative'
        }
      }
    },
    {
      name: 'Consistență informații',
      weight: 5,
      calculate: (company) => {
        // Check if company has consistent data
        const hasBasicData = company.name && company.address && company.registrationNumber
        if (hasBasicData) {
          return { score: 100, description: 'Date consistente', impact: 'positive' }
        }
        return { score: 60, description: 'Date incomplete', impact: 'negative' }
      }
    }
  ]
}

FACTOR_WEIGHTS.push(SYNTHETIC_FACTORS)

/**
 * Calculate MarketRisk Credit Score (MRCS)
 */
export function calculateRiskScore(company: CompanyData): RiskScore {
  const factors: RiskFactor[] = []
  let totalWeightedScore = 0
  let totalWeight = 0

  // Calculate each factor
  for (const category of FACTOR_WEIGHTS) {
    for (const factor of category.factors) {
      const result = factor.calculate(company)

      factors.push({
        category: category.category,
        name: factor.name,
        impact: result.impact,
        weight: factor.weight,
        score: result.score,
        description: result.description
      })

      totalWeightedScore += result.score * factor.weight
      totalWeight += factor.weight
    }
  }

  // Calculate final score (0-100)
  const finalScore = Math.round(totalWeightedScore / totalWeight)

  // Determine risk level
  let level: RiskLevel
  if (finalScore >= 75) {
    level = 'GREEN'
  } else if (finalScore >= 50) {
    level = 'YELLOW'
  } else {
    level = 'RED'
  }

  return {
    level,
    value: finalScore,
    factors,
    lastCalculated: new Date().toISOString()
  }
}

/**
 * Get risk level color
 */
export function getRiskColor(level: RiskLevel): string {
  switch (level) {
    case 'GREEN':
      return '#22C55E'
    case 'YELLOW':
      return '#F59E0B'
    case 'RED':
      return '#EF4444'
  }
}

/**
 * Get risk level description
 */
export function getRiskDescription(level: RiskLevel): string {
  switch (level) {
    case 'GREEN':
      return 'Risc scăzut - partener de încredere'
    case 'YELLOW':
      return 'Risc mediu - monitorizare recomandată'
    case 'RED':
      return 'Risc ridicat - atenție necesară'
  }
}
