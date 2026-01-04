// Protected API endpoint for company search
// Requires valid API key (Business tier)
// Example: GET /api/v1/companies/search?cui=12345678

import { NextRequest, NextResponse } from 'next/server'
import { withApiAuth, requireScope } from '@/lib/api-keys/middleware'
import { searchCompanyByCUI } from '@/lib/anaf/client'
import { calculateRiskScore } from '@/lib/risk-algorithm/risk-calculator'

/**
 * GET /api/v1/companies/search?cui=<cui>
 * Search for a company by CUI (fiscal code)
 * Requires API key with 'read:companies' scope
 */
export const GET = withApiAuth(async (request, { key, userId }) => {
  // Check if API key has required scope
  if (!requireScope(key, ['read:companies'])) {
    return NextResponse.json(
      { error: 'Missing required scope: read:companies' },
      { status: 403 }
    )
  }

  const { searchParams } = new URL(request.url)
  const cui = searchParams.get('cui')

  if (!cui) {
    return NextResponse.json(
      {
        error: 'Missing required parameter: cui',
        message: 'Provide a CUI (fiscal code) to search for a company',
        example: '/api/v1/companies/search?cui=12345678',
      },
      { status: 400 }
    )
  }

  try {
    // Search for company using ANAF API
    const companyData = await searchCompanyByCUI(cui)

    if (!companyData) {
      return NextResponse.json(
        {
          error: 'Company not found',
          message: `No company found with CUI: ${cui}`,
        },
        { status: 404 }
      )
    }

    // Calculate risk score
    const riskScore = calculateRiskScore(companyData)

    // Return company data with risk score
    return NextResponse.json({
      company: {
        cui: companyData.cui,
        name: companyData.companyName,
        registration_number: companyData.registrationNumber,
        address: companyData.address,
        company_active: companyData.companyActive,
        vat_active: companyData.vatActive,
        vat_split_regime: companyData.vatSplitRegime,
        state_debts: companyData.stateDebts,
      },
      risk_score: {
        value: riskScore.value,
        level: riskScore.level,
        explanation: riskScore.explanation,
        factors: riskScore.factors,
      },
      metadata: {
        searched_at: new Date().toISOString(),
        api_version: 'v1',
      },
    })
  } catch (error) {
    console.error('Error searching company:', error)
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: 'Failed to search company. Please try again later.',
      },
      { status: 500 }
    )
  }
})
