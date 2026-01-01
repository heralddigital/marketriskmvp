import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Search, List, Bell, TrendingUp } from 'lucide-react'
import Link from 'next/link'

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

  const stats = [
    {
      name: 'Căutări rămase',
      value: profile?.search_limit_monthly || 3,
      used: profile?.searches_this_month || 0,
      icon: Search,
      color: 'text-[var(--brand-mughal-green)]',
      bg: 'bg-[var(--brand-pistachio)]/10'
    },
    {
      name: 'Companii monitorizate',
      value: 0,
      limit: profile?.watchlist_limit || 0,
      icon: List,
      color: 'text-blue-600',
      bg: 'bg-blue-50'
    },
    {
      name: 'Alerte noi',
      value: 0,
      icon: Bell,
      color: 'text-orange-600',
      bg: 'bg-orange-50'
    },
    {
      name: 'Export PDF rămase',
      value: profile?.pdf_export_limit_monthly || 0,
      used: profile?.pdf_exports_this_month || 0,
      icon: TrendingUp,
      color: 'text-purple-600',
      bg: 'bg-purple-50'
    },
  ]

  return (
    <div className="p-8">
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2">
          Bine ai revenit{profile?.full_name ? `, ${profile.full_name.split(' ')[0]}` : ''}!
        </h1>
        <p className="text-[var(--text-secondary)]">
          Iată o privire de ansamblu asupra activității tale
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.name} className="bg-white p-6 rounded-[4px] border border-[var(--border-subtle)] hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-[4px] ${stat.bg} flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
              <p className="text-sm text-[var(--text-muted)] mb-1">{stat.name}</p>
              <p className="text-3xl font-bold text-[var(--text-primary)]">
                {stat.value}
                {stat.limit !== undefined && <span className="text-lg text-[var(--text-muted)]"> / {stat.limit}</span>}
              </p>
              {stat.used !== undefined && (
                <p className="text-xs text-[var(--text-muted)] mt-1">
                  {stat.used} folosite luna aceasta
                </p>
              )}
            </div>
          )
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-6 rounded-[4px] border border-[var(--border-subtle)] mb-8">
        <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-4">
          Acțiuni rapide
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/app/search"
            className="p-4 border border-[var(--border-subtle)] rounded-[4px] hover:border-[var(--brand-mughal-green)] hover:shadow-sm transition-all group"
          >
            <Search className="w-6 h-6 text-[var(--brand-mughal-green)] mb-2" />
            <h3 className="font-semibold text-[var(--text-primary)] mb-1 group-hover:text-[var(--brand-mughal-green)]">
              Caută companie
            </h3>
            <p className="text-sm text-[var(--text-secondary)]">
              Verifică riscul unei firme după CUI
            </p>
          </Link>
          <Link
            href="/app/watchlist"
            className="p-4 border border-[var(--border-subtle)] rounded-[4px] hover:border-[var(--brand-mughal-green)] hover:shadow-sm transition-all group"
          >
            <List className="w-6 h-6 text-[var(--brand-mughal-green)] mb-2" />
            <h3 className="font-semibold text-[var(--text-primary)] mb-1 group-hover:text-[var(--brand-mughal-green)]">
              Vezi watchlist
            </h3>
            <p className="text-sm text-[var(--text-secondary)]">
              Monitorizează firmele tale
            </p>
          </Link>
          <Link
            href="/app/alerts"
            className="p-4 border border-[var(--border-subtle)] rounded-[4px] hover:border-[var(--brand-mughal-green)] hover:shadow-sm transition-all group"
          >
            <Bell className="w-6 h-6 text-[var(--brand-mughal-green)] mb-2" />
            <h3 className="font-semibold text-[var(--text-primary)] mb-1 group-hover:text-[var(--brand-mughal-green)]">
              Verifică alerte
            </h3>
            <p className="text-sm text-[var(--text-secondary)]">
              Vezi notificările tale
            </p>
          </Link>
        </div>
      </div>

      {/* Account Info */}
      <div className="bg-white p-6 rounded-[4px] border border-[var(--border-subtle)]">
        <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-4">
          Informații cont
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-[var(--text-muted)] mb-1">Email</p>
            <p className="text-sm font-medium text-[var(--text-primary)]">{user.email}</p>
          </div>
          <div>
            <p className="text-sm text-[var(--text-muted)] mb-1">Plan</p>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center px-3 py-1 rounded-[4px] text-xs font-semibold bg-[var(--brand-pistachio)]/10 text-[var(--brand-mughal-green)] capitalize">
                {profile?.plan || 'free'}
              </span>
              {profile?.plan === 'free' && (
                <Link
                  href="/pricing"
                  className="text-xs text-[var(--brand-mughal-green)] hover:underline"
                >
                  Upgrade
                </Link>
              )}
            </div>
          </div>
          <div>
            <p className="text-sm text-[var(--text-muted)] mb-1">Membru din</p>
            <p className="text-sm font-medium text-[var(--text-primary)]">
              {new Date(user.created_at).toLocaleDateString('ro-RO', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
          <div>
            <p className="text-sm text-[var(--text-muted)] mb-1">Companie</p>
            <p className="text-sm font-medium text-[var(--text-primary)]">
              {profile?.company_name || 'Neintrodus'}
            </p>
          </div>
        </div>
      </div>

      {/* Getting Started (for new users) */}
      {profile?.searches_this_month === 0 && (
        <div className="mt-8 bg-blue-50 border border-blue-200 p-6 rounded-[4px]">
          <h2 className="text-lg font-semibold text-blue-900 mb-3">
            Primul pas: Caută o companie
          </h2>
          <p className="text-sm text-blue-800 mb-4">
            Începe prin a verifica riscul unei companii. Ai {profile?.search_limit_monthly || 3} căutări gratuite!
          </p>
          <Link
            href="/app/search"
            className="inline-block px-6 py-2 bg-[var(--brand-mughal-green)] text-white rounded-[4px] font-medium hover:bg-[var(--brand-mughal-green-2)] transition-colors"
          >
            Caută prima companie
          </Link>
        </div>
      )}
    </div>
  )
}
