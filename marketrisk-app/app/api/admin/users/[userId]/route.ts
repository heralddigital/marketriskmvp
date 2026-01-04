// Admin API - Update/Delete specific user
// PATCH /api/admin/users/[userId] - Update user
// DELETE /api/admin/users/[userId] - Delete user

import { NextRequest, NextResponse } from 'next/server'
import {
  requireAdmin,
  updateUserSubscription,
  updateUserRole,
  deleteUser,
} from '@/lib/admin/server'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    // Verify admin access
    const adminId = await requireAdmin()

    const { userId } = await params
    const body = await request.json()
    const { plan, role } = body

    // Update plan if provided
    if (plan) {
      await updateUserSubscription(userId, plan, adminId)
    }

    // Update role if provided
    if (role) {
      await updateUserRole(userId, role, adminId)
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error in admin update user API:', error)

    if (error.message === 'Not authenticated') {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    if (error.message === 'Admin access required') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    // Verify admin access
    const adminId = await requireAdmin()

    const { userId } = await params

    // Delete user
    await deleteUser(userId, adminId)

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error in admin delete user API:', error)

    if (error.message === 'Not authenticated') {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    if (error.message === 'Admin access required') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 })
  }
}
