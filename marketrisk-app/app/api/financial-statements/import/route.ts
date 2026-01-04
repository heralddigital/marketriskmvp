/**
 * API Route: Import Financial Statements from data.gov.ro
 * 
 * This endpoint can be called:
 * 1. Manually by admins
 * 2. Via cron job for periodic updates
 * 
 * Usage: POST /api/financial-statements/import?year=2024
 */

import { NextRequest, NextResponse } from 'next/server'
import { importFinancialStatementsFromDataGovRo, processFinancialStatementsFile, downloadDatasetFile, searchFinancialStatementsDatasets } from '@/lib/mfinante/client'
import { saveFinancialStatements } from '@/lib/mfinante/service'

export async function POST(request: NextRequest) {
  try {
    // Check for admin authentication (you may want to add proper auth here)
    // const supabase = createClient()
    // const { data: { user } } = await supabase.auth.getUser()
    // if (!user || user.email !== 'admin@example.com') {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    // }

    const searchParams = request.nextUrl.searchParams
    const year = searchParams.get('year') ? parseInt(searchParams.get('year')!, 10) : undefined

    console.log(`Starting financial statements import${year ? ` for year ${year}` : ''}...`)

    // Search for datasets
    const datasets = await searchFinancialStatementsDatasets(year)

    if (datasets.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'No financial statement datasets found',
        imported: 0,
        errors: 0,
      })
    }

    let totalImported = 0
    let totalErrors = 0
    const results: Array<{ dataset: string; imported: number; errors: number }> = []

    // Process each dataset
    for (const dataset of datasets) {
      try {
        console.log(`Processing dataset: ${dataset.title}`)

        // Download file
        const content = await downloadDatasetFile(dataset.url)

        // Extract year if not provided
        const fileYear = year || new Date().getFullYear()
        const yearMatch = dataset.title.match(/\b(20\d{2})\b/)
        const extractedYear = yearMatch ? parseInt(yearMatch[1], 10) : fileYear

        // Process file
        const statements = await processFinancialStatementsFile(
          content,
          dataset.format as 'csv' | 'txt',
          extractedYear
        )

        // Save to database
        const { saved, errors } = await saveFinancialStatements(statements)

        totalImported += saved
        totalErrors += errors

        results.push({
          dataset: dataset.title,
          imported: saved,
          errors,
        })

        console.log(`Imported ${saved} statements from ${dataset.title} (${errors} errors)`)

      } catch (error) {
        console.error(`Error processing dataset ${dataset.title}:`, error)
        totalErrors++
        results.push({
          dataset: dataset.title,
          imported: 0,
          errors: 1,
        })
      }
    }

    return NextResponse.json({
      success: true,
      imported: totalImported,
      errors: totalErrors,
      datasetsProcessed: datasets.length,
      results,
    })

  } catch (error) {
    console.error('Error importing financial statements:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        imported: 0,
        errors: 1,
      },
      { status: 500 }
    )
  }
}

// Allow GET for testing
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const year = searchParams.get('year') ? parseInt(searchParams.get('year')!, 10) : undefined

  try {
    const datasets = await searchFinancialStatementsDatasets(year)

    return NextResponse.json({
      success: true,
      datasets: datasets.map(ds => ({
        id: ds.id,
        title: ds.title,
        url: ds.url,
        format: ds.format,
        updated: ds.updated,
      })),
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

