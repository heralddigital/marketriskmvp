import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { fetchCompanyByCUI, parseANAFResponse } from '@/lib/anaf/client'
import { calculateRiskScore } from '@/lib/anaf/risk-calculator'

/**
 * Daily monitoring cron job for watchlist companies
 * 
 * This endpoint should be called daily (e.g., via Vercel Cron) to:
 * 1. Fetch all companies in watchlists with alert_on_change = true
 * 2. Re-fetch their data from ANAF
 * 3. Recalculate risk scores
 * 4. Update companies table with latest risk data
 * 5. Save to risk_score_history for trend tracking
 * 6. Update watchlist last_check timestamp
 * 7. Create alerts if risk level changed
 * 
 * POST /api/cron/monitor-watchlist
 * 
 * Authorization: Must include CRON_SECRET header
 */
export async function POST(request: NextRequest) {
  try {
    // Verify authorization for cron job
    // Vercel Cron (configured in vercel.json) automatically calls this endpoint
    // For additional security, check CRON_SECRET if set
    const authHeader = request.headers.get('authorization')
    const cronSecret = process.env.CRON_SECRET
    
    // If CRON_SECRET is set, require it for authorization
    // This protects against unauthorized access while allowing Vercel Cron to work
    if (cronSecret && cronSecret !== 'change-me-in-production') {
      if (!authHeader || authHeader !== `Bearer ${cronSecret}`) {
        return NextResponse.json(
          { error: 'Unauthorized - Invalid or missing CRON_SECRET' },
          { status: 401 }
        )
      }
    }

    const supabase = await createClient()
    
    // Get all companies being monitored (in watchlists with alerts enabled)
    // Use the database function for efficiency
    const { data: companiesToMonitor, error: fetchError } = await supabase
      .rpc('get_companies_for_monitoring') as {
        data: Array<{
          company_id: string
          cui: string
          company_name: string
          current_risk_level: string | null
          users_watching: number
        }> | null
        error: any
      }

    if (fetchError) {
      console.error('Error fetching companies for monitoring:', fetchError)
      return NextResponse.json(
        { error: 'Failed to fetch companies for monitoring', details: fetchError.message },
        { status: 500 }
      )
    }

    if (!companiesToMonitor || companiesToMonitor.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No companies to monitor',
        processed: 0,
        updated: 0,
        errors: 0
      })
    }

    let processed = 0
    let updated = 0
    let errors = 0
    const errorDetails: string[] = []

    // Process each company (with rate limiting consideration)
    for (const company of companiesToMonitor) {
      try {
        processed++

        // Fetch fresh data from ANAF
        const anafResponse = await fetchCompanyByCUI(company.cui)
        
        if (!anafResponse || anafResponse.found.length === 0) {
          console.warn(`Company ${company.cui} not found in ANAF`)
          errors++
          errorDetails.push(`${company.cui}: Not found in ANAF`)
          continue
        }

        // Parse ANAF response
        const companyData = parseANAFResponse(anafResponse)
        
        if (!companyData) {
          console.warn(`Failed to parse ANAF data for ${company.cui}`)
          errors++
          errorDetails.push(`${company.cui}: Failed to parse ANAF data`)
          continue
        }

        // Calculate new risk score
        const newRiskScore = calculateRiskScore(companyData)

        // Get old risk data for comparison
        const { data: oldCompany } = await supabase
          .from('companies')
          .select('current_risk_level, current_risk_score')
          .eq('id', company.company_id)
          .single() as { data: { current_risk_level: string | null; current_risk_score: number | null } | null }

        const oldRiskLevel = oldCompany?.current_risk_level || null
        const oldRiskScore = oldCompany?.current_risk_score || null

        // Update company record
        const { error: updateError } = await (supabase.from('companies') as any).update({
          company_name: companyData.name,
          registration_number: companyData.registrationNumber,
          anaf_data: companyData,
          vat_active: companyData.vatRegistration?.isRegistered ?? false,
          vat_split_regime: companyData.isVATSplit,
          company_active: !companyData.isInactive,
          current_risk_score: newRiskScore.value,
          current_risk_level: newRiskScore.level,
          risk_details: newRiskScore,
          last_anaf_check: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }).eq('id', company.company_id)

        if (updateError) {
          console.error(`Error updating company ${company.cui}:`, updateError)
          errors++
          errorDetails.push(`${company.cui}: Update error - ${updateError.message}`)
          continue
        }

        // Save to risk_score_history
        const { error: historyError } = await (supabase.from('risk_score_history') as any).insert({
          cui: company.cui,
          company_name: companyData.name,
          risk_level: newRiskScore.level,
          risk_score: newRiskScore.value,
          risk_factors: newRiskScore.factors,
          company_snapshot: companyData,
          triggered_by: null // System-triggered
        })

        if (historyError) {
          console.warn(`Error saving risk history for ${company.cui}:`, historyError)
          // Don't fail the whole operation for history errors
        }

        // Update watchlist last_check for all users watching this company
        const { error: watchlistUpdateError } = await (supabase.from('watchlist') as any).update({
          last_check: new Date().toISOString()
        }).eq('company_id', company.company_id)

        if (watchlistUpdateError) {
          console.warn(`Error updating watchlist last_check for ${company.cui}:`, watchlistUpdateError)
          // Don't fail the whole operation for this
        }

        // Check if risk level changed and create alerts
        if (oldRiskLevel && oldRiskLevel !== newRiskScore.level) {
          // Risk level changed - create alerts for all users watching this company
          const { error: alertError } = await supabase.rpc('create_risk_change_alert', {
            p_company_id: company.company_id,
            p_old_level: oldRiskLevel,
            p_new_level: newRiskScore.level,
            p_old_score: oldRiskScore || 0,
            p_new_score: newRiskScore.value
          })

          if (alertError) {
            console.warn(`Error creating alert for ${company.cui}:`, alertError)
            // Don't fail the whole operation for alert errors
          }
        }

        updated++
        
        // Add a small delay to avoid rate limiting (ANAF API)
        await new Promise(resolve => setTimeout(resolve, 100))

      } catch (error) {
        console.error(`Error processing company ${company.cui}:`, error)
        errors++
        errorDetails.push(`${company.cui}: ${error instanceof Error ? error.message : 'Unknown error'}`)
      }
    }

    return NextResponse.json({
      success: true,
      message: `Monitoring completed: ${updated} updated, ${errors} errors`,
      processed,
      updated,
      errors,
      errorDetails: errors > 0 ? errorDetails : undefined
    })

  } catch (error) {
    console.error('Cron job error:', error)
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// Allow GET for testing (with auth)
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET || 'change-me-in-production'
  
  if (authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }

  // Return status/info
  const supabase = await createClient()
  const { data: companiesToMonitor } = await supabase.rpc('get_companies_for_monitoring') as {
    data: Array<any> | null
  }

  return NextResponse.json({
    status: 'ok',
    companiesToMonitor: companiesToMonitor?.length || 0,
    message: 'Use POST to trigger monitoring'
  })
}

