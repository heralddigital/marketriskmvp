// Server-side admin utilities
// For admin panel operations and user management

import { createClient } from '@/lib/supabase/server'

export type UserRole = 'user' | 'admin' | 'super_admin'

export interface AdminUser {
  id: string
  email: string
  name: string
  role: UserRole
  subscription_plan: string
  subscription_status: string
  created_at: string
  last_sign_in_at: string | null
  companies_searched: number
}

export interface SystemStats {
  totalUsers: number
  activeSubscriptions: number
  monthlyRevenue: number
  totalSearches: number
  apiRequestsToday: number
}

export interface SubscriptionBreakdown {
  plan: string
  userCount: number
  revenue: number
}

/**
 * Check if the current user is an admin
 */
export async function isAdmin(userId?: string): Promise<boolean> {
  const supabase = await createClient()

  if (!userId) {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return false
    userId = user.id
  }

  const { data } = await supabase
    .from('users')
    .select('role')
    .eq('id', userId)
    .single()

  return data?.role === 'admin' || data?.role === 'super_admin'
}

/**
 * Require admin access
 * Throws error if user is not admin
 */
export async function requireAdmin(): Promise<string> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Not authenticated')
  }

  const admin = await isAdmin(user.id)
  if (!admin) {
    throw new Error('Admin access required')
  }

  return user.id
}

/**
 * Get all users with admin info
 */
export async function getAllUsers(): Promise<AdminUser[]> {
  await requireAdmin()

  const supabase = await createClient()

  const { data, error } = await supabase
    .from('users')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching users:', error)
    throw new Error('Failed to fetch users')
  }

  return data as AdminUser[]
}

/**
 * Get system statistics
 */
export async function getSystemStats(): Promise<SystemStats> {
  await requireAdmin()

  const supabase = await createClient()

  const { data, error } = await supabase.rpc('get_system_stats')

  if (error) {
    console.error('Error fetching system stats:', error)
    return {
      totalUsers: 0,
      activeSubscriptions: 0,
      monthlyRevenue: 0,
      totalSearches: 0,
      apiRequestsToday: 0,
    }
  }

  const stats = data[0] || {}
  return {
    totalUsers: stats.total_users || 0,
    activeSubscriptions: stats.active_subscriptions || 0,
    monthlyRevenue: stats.monthly_revenue || 0,
    totalSearches: stats.total_searches || 0,
    apiRequestsToday: stats.api_requests_today || 0,
  }
}

/**
 * Get subscription breakdown
 */
export async function getSubscriptionBreakdown(): Promise<SubscriptionBreakdown[]> {
  await requireAdmin()

  const supabase = await createClient()

  const { data, error } = await supabase.rpc('get_subscription_breakdown')

  if (error) {
    console.error('Error fetching subscription breakdown:', error)
    return []
  }

  return (data || []).map((row: any) => ({
    plan: row.plan,
    userCount: row.user_count,
    revenue: row.revenue,
  }))
}

/**
 * Update user subscription plan (admin override)
 */
export async function updateUserSubscription(
  targetUserId: string,
  plan: string,
  adminId?: string
): Promise<void> {
  if (!adminId) {
    adminId = await requireAdmin()
  }

  const supabase = await createClient()

  const { error } = await supabase
    .from('users')
    .update({ subscription_plan: plan })
    .eq('id', targetUserId)

  if (error) {
    console.error('Error updating user subscription:', error)
    throw new Error('Failed to update subscription')
  }

  // Log admin action
  await logAdminAction(adminId, 'update_subscription', targetUserId, { plan })
}

/**
 * Update user role
 */
export async function updateUserRole(
  targetUserId: string,
  role: UserRole,
  adminId?: string
): Promise<void> {
  if (!adminId) {
    adminId = await requireAdmin()
  }

  const supabase = await createClient()

  const { error } = await supabase
    .from('users')
    .update({ role })
    .eq('id', targetUserId)

  if (error) {
    console.error('Error updating user role:', error)
    throw new Error('Failed to update role')
  }

  // Log admin action
  await logAdminAction(adminId, 'update_role', targetUserId, { role })
}

/**
 * Delete user account
 */
export async function deleteUser(targetUserId: string, adminId?: string): Promise<void> {
  if (!adminId) {
    adminId = await requireAdmin()
  }

  const supabase = await createClient()

  const { error } = await supabase.from('users').delete().eq('id', targetUserId)

  if (error) {
    console.error('Error deleting user:', error)
    throw new Error('Failed to delete user')
  }

  // Log admin action
  await logAdminAction(adminId, 'delete_user', targetUserId)
}

/**
 * Log admin action
 */
export async function logAdminAction(
  adminId: string,
  actionType: string,
  targetUserId?: string,
  details?: any
): Promise<void> {
  const supabase = await createClient()

  const { error } = await supabase.from('admin_actions').insert({
    admin_id: adminId,
    action_type: actionType,
    target_user_id: targetUserId,
    details,
  })

  if (error) {
    console.error('Error logging admin action:', error)
    // Don't throw - logging failure shouldn't break the action
  }
}

/**
 * Get recent admin actions
 */
export async function getRecentAdminActions(limit: number = 50): Promise<any[]> {
  await requireAdmin()

  const supabase = await createClient()

  const { data, error } = await supabase
    .from('admin_actions')
    .select(
      `
      *,
      admin:users!admin_id(email, name),
      target_user:users!target_user_id(email, name)
    `
    )
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('Error fetching admin actions:', error)
    return []
  }

  return data || []
}

/**
 * Get user details by ID
 */
export async function getUserById(userId: string): Promise<AdminUser | null> {
  await requireAdmin()

  const supabase = await createClient()

  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single()

  if (error) {
    console.error('Error fetching user:', error)
    return null
  }

  return data as AdminUser
}

/**
 * Search users by email or name
 */
export async function searchUsers(query: string): Promise<AdminUser[]> {
  await requireAdmin()

  const supabase = await createClient()

  const { data, error } = await supabase
    .from('users')
    .select('*')
    .or(`email.ilike.%${query}%,name.ilike.%${query}%`)
    .order('created_at', { ascending: false })
    .limit(50)

  if (error) {
    console.error('Error searching users:', error)
    return []
  }

  return data as AdminUser[]
}
