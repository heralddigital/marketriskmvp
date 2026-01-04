// Admin API - User management
// GET /api/admin/users - List all users

import { NextRequest, NextResponse } from 'next/server'
import { getAllUsers, requireAdmin } from '@/lib/admin/server'

export async function GET(request: NextRequest) {
  try {
    // Verify admin access
    await requireAdmin()

    // Get all users
    const users = await getAllUsers()

    return NextResponse.json({ users })
  } catch (error: any) {
    console.error('Error in admin users API:', error)

    if (error.message === 'Not authenticated') {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    if (error.message === 'Admin access required') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    return NextResponse.json({ error: 'Failed to get users' }, { status: 500 })
  }
}
