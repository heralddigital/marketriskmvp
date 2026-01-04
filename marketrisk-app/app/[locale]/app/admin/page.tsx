import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { getAdminStats } from './actions'
import { AdminDashboardClient } from './AdminDashboardClient'

export default async function AdminDashboardPage() {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    // Fetch user profile to check admin status
    const { data: profile } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single()

    // Check if user is admin (you'll need to add is_admin field to users table)
    // For now, we'll allow all authenticated users - update this in production
    // if (!profile?.is_admin) {
    //   redirect('/app/dashboard')
    // }

    // Fetch admin statistics
    const stats = await getAdminStats()

    return <AdminDashboardClient stats={stats} />
}
