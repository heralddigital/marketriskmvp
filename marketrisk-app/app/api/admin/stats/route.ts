// Admin API - System statistics
// GET /api/admin/stats

import { NextRequest, NextResponse } from 'next/server'
import { getSystemStats, requireAdmin } from '@/lib/admin/server'

export async function GET(request: NextRequest) {
  try {
    // Verify admin access
    await requireAdmin()

    // Get system statistics
    const stats = await getSystemStats()

    return NextResponse.json(stats)
  } catch (error: any) {
    console.error('Error in admin stats API:', error)

    if (error.message === 'Not authenticated') {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    if (error.message === 'Admin access required') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    return NextResponse.json({ error: 'Failed to get statistics' }, { status: 500 })
  }
}
