'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export interface Alert {
  id: string
  user_id: string
  company_id: string
  company_name: string | null
  cui: string | null
  alert_type: string
  severity: 'low' | 'medium' | 'high'
  message: string
  details: string | null
  read: boolean
  created_at: string
}

/**
 * Get user's alerts
 */
export async function getAlerts(): Promise<{
  success: boolean
  data?: Alert[]
  error?: string
}> {
  try {
    const supabase = await createClient()
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
      redirect('/login')
    }

    // Fetch alerts with company data
    const { data, error } = await supabase
      .from('alerts')
      .select(`
        id,
        user_id,
        company_id,
        alert_type,
        severity,
        message,
        details,
        read,
        created_at,
        companies!inner (
          company_name,
          cui
        )
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(100) as {
        data: any[] | null
        error: any
      }

    if (error) {
      console.error('Error fetching alerts:', error)
      return { success: false, error: 'Eroare la încărcarea alertelor' }
    }

    // Transform data to match Alert interface
    const alerts: Alert[] = (data || []).map((item: any) => ({
      id: item.id,
      user_id: item.user_id,
      company_id: item.company_id,
      company_name: item.companies?.company_name || null,
      cui: item.companies?.cui || null,
      alert_type: item.alert_type,
      severity: item.severity,
      message: item.message,
      details: item.details,
      read: item.read,
      created_at: item.created_at,
    }))

    return { success: true, data: alerts }
  } catch (error) {
    console.error('Get alerts error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Eroare necunoscută'
    }
  }
}

/**
 * Mark alert as read
 */
export async function markAlertAsRead(alertId: string): Promise<{
  success: boolean
  error?: string
}> {
  try {
    const supabase = await createClient()
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
      redirect('/login')
    }

    const { error } = await (supabase.from('alerts') as any).update({
      read: true
    })
      .eq('id', alertId)
      .eq('user_id', user.id)

    if (error) {
      return { success: false, error: 'Eroare la marcarea alertei ca citită' }
    }

    return { success: true }
  } catch (error) {
    console.error('Mark alert as read error:', error)
    return { success: false, error: 'Eroare necunoscută' }
  }
}

/**
 * Mark all alerts as read
 */
export async function markAllAlertsAsRead(): Promise<{
  success: boolean
  error?: string
}> {
  try {
    const supabase = await createClient()
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
      redirect('/login')
    }

    const { error } = await (supabase.from('alerts') as any).update({
      read: true
    })
      .eq('user_id', user.id)
      .eq('read', false)

    if (error) {
      return { success: false, error: 'Eroare la marcarea alertelor ca citite' }
    }

    return { success: true }
  } catch (error) {
    console.error('Mark all alerts as read error:', error)
    return { success: false, error: 'Eroare necunoscută' }
  }
}

/**
 * Delete alert
 */
export async function deleteAlert(alertId: string): Promise<{
  success: boolean
  error?: string
}> {
  try {
    const supabase = await createClient()
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
      redirect('/login')
    }

    // Verify ownership and delete
    const { error } = await supabase
      .from('alerts')
      .delete()
      .eq('id', alertId)
      .eq('user_id', user.id)

    if (error) {
      return { success: false, error: 'Eroare la ștergerea alertei' }
    }

    return { success: true }
  } catch (error) {
    console.error('Delete alert error:', error)
    return { success: false, error: 'Eroare necunoscută' }
  }
}

/**
 * Get unread alerts count
 */
export async function getUnreadAlertsCount(): Promise<number> {
  try {
    const supabase = await createClient()
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
      return 0
    }

    const { count } = await supabase
      .from('alerts')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('read', false) as { count: number | null }

    return count || 0
  } catch (error) {
    console.error('Get unread alerts count error:', error)
    return 0
  }
}
