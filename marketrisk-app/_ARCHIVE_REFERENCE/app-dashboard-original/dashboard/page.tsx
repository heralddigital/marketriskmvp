import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { signOut } from '@/app/(auth)/actions'
import { Home, LogOut, User } from 'lucide-react'

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch user profile
  const { data: profile } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single()

  return (
    <div className="min-h-screen bg-[var(--color-paper)]">
      {/* Header */}
      <header className="bg-white border-b border-[var(--color-bone)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[var(--color-mughal-green)] rounded-[4px] flex items-center justify-center">
                <span className="text-white font-bold text-lg">M</span>
              </div>
              <h1 className="text-xl font-bold text-[var(--color-mughal-green)]">
                market<span className="font-extrabold">risk</span>
              </h1>
            </div>

            {/* User Menu */}
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  {profile?.full_name || user.email}
                </p>
                <p className="text-xs text-gray-500 capitalize">
                  Plan: {profile?.plan || 'free'}
                </p>
              </div>
              <form action={signOut}>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-[4px] transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Ieșire</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="bg-white border border-[var(--color-bone)] rounded-[4px] shadow-sm p-8 mb-8">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-[var(--color-pistachio)] rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-[var(--color-mughal-green)]" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Bine ai venit, {profile?.full_name?.split(' ')[0] || 'User'}!
              </h2>
              <p className="text-gray-600">
                Autentificarea funcționează corect! Acesta este dashboard-ul tău MarketRisk.
              </p>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white border border-[var(--color-bone)] rounded-[4px] shadow-sm p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Căutări Rămase</h3>
              <Home className="w-5 h-5 text-gray-400" />
            </div>
            <p className="text-3xl font-bold text-[var(--color-mughal-green)]">
              {profile?.search_limit_monthly || 3}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {profile?.searches_this_month || 0} folosite luna aceasta
            </p>
          </div>

          <div className="bg-white border border-[var(--color-bone)] rounded-[4px] shadow-sm p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Companii Monitorizate</h3>
              <Home className="w-5 h-5 text-gray-400" />
            </div>
            <p className="text-3xl font-bold text-[var(--color-mughal-green)]">0</p>
            <p className="text-xs text-gray-500 mt-1">
              Limita: {profile?.watchlist_limit || 0}
            </p>
          </div>

          <div className="bg-white border border-[var(--color-bone)] rounded-[4px] shadow-sm p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Alerte Active</h3>
              <Home className="w-5 h-5 text-gray-400" />
            </div>
            <p className="text-3xl font-bold text-[var(--color-mughal-green)]">0</p>
            <p className="text-xs text-gray-500 mt-1">Nicio alertă nouă</p>
          </div>
        </div>

        {/* Account Info */}
        <div className="bg-white border border-[var(--color-bone)] rounded-[4px] shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Informații Cont
          </h3>
          <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <dt className="text-sm font-medium text-gray-500">Email</dt>
              <dd className="mt-1 text-sm text-gray-900">{user.email}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Nume Complet</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {profile?.full_name || 'Neintrodus'}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Companie</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {profile?.company_name || 'Neintrodus'}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Plan</dt>
              <dd className="mt-1">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-[4px] text-xs font-medium bg-[var(--color-pistachio)] text-[var(--color-mughal-green)] capitalize">
                  {profile?.plan || 'free'}
                </span>
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Membru Din</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {new Date(user.created_at).toLocaleDateString('ro-RO', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </dd>
            </div>
          </dl>
        </div>

        {/* Next Steps */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-[4px] p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-4">
            Următorii Pași
          </h3>
          <ul className="space-y-2 text-sm text-blue-800">
            <li>✅ Autentificarea funcționează perfect!</li>
            <li>⏳ În curând: Căutare companii după CUI</li>
            <li>⏳ În curând: Monitorizare risc de credit</li>
            <li>⏳ În curând: Alerte automate</li>
            <li>⏳ În curând: Export rapoarte PDF</li>
          </ul>
        </div>
      </main>
    </div>
  )
}
