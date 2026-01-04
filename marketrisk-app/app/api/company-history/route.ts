import { NextRequest, NextResponse } from 'next/server'
import { getCompanyHistory, getAddressChanges, getChangeSummary } from '@/lib/company-history/service'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const cui = searchParams.get('cui')
    const years = parseInt(searchParams.get('years') || '5', 10)

    if (!cui) {
      return NextResponse.json(
        { error: 'CUI is required' },
        { status: 400 }
      )
    }

    const [history, addressChanges, summary] = await Promise.all([
      getCompanyHistory(cui, years),
      getAddressChanges(cui, years),
      getChangeSummary(cui, years),
    ])

    return NextResponse.json({
      history,
      addressChanges,
      summary,
    })
  } catch (error) {
    console.error('Error fetching company history:', error)
    return NextResponse.json(
      { error: 'Failed to fetch company history' },
      { status: 500 }
    )
  }
}

