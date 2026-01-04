import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { AdminDashboardClient } from '../admin/AdminDashboardClient'
import { getAdminStats } from '../admin/actions'

export default async function AnalyticsPage() {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    // Fetch admin/analytics stats
    const stats = await getAdminStats()

    return (
        <div className="p-8">
            <div className="max-w-[1200px] mx-auto">
                <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-8">Platform Analytics</h1>
                <AdminDashboardClient stats={stats} />
            </div>
        </div>
    )
}
