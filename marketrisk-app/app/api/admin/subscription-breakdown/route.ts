// Admin API - Subscription breakdown
// GET /api/admin/subscription-breakdown

import { NextRequest, NextResponse } from 'next/server'
import { getSubscriptionBreakdown, requireAdmin } from '@/lib/admin/server'

export async function GET(request: NextRequest) {
  try {
    // Verify admin access
    await requireAdmin()

    // Get subscription breakdown
    const breakdown = await getSubscriptionBreakdown()

    return NextResponse.json(breakdown)
  } catch (error: any) {
    console.error('Error in admin subscription breakdown API:', error)

    if (error.message === 'Not authenticated') {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    if (error.message === 'Admin access required') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    return NextResponse.json(
      { error: 'Failed to get subscription breakdown' },
      { status: 500 }
    )
  }
}
