'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { getLatestLitigationCases, getMarketAnalytics } from './actions'
import { getAdminStats } from '../admin/actions'
import { DashboardClient } from './DashboardClient'
import { Suspense } from 'react'
import { Scale, TrendingUp, BarChart3, FileText, Calendar } from 'lucide-react'
import { AnimatedCard } from '@/components/admin/AnimatedCard'
import Link from 'next/link'

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // At this point user is guaranteed by the redirect above, but we'll use a local const for TS
  const currentUser = user;

  // Fetch user profile
  const { data: profile } = await supabase
    .from('users')
    .select('*')
    .eq('id', currentUser.id)
    .single()

  // Fetch watchlist count
  const { count: watchlistCount } = await supabase
    .from('watchlist')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', currentUser.id)

  // Fetch unread alerts count
  const { count: unreadAlertsCount } = await supabase
    .from('alerts')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', currentUser.id)
    .eq('read', false)

  // Fetch recent search history (last 10)
  const { data: recentSearches } = await supabase
    .from('search_history')
    .select('*')
    .eq('user_id', currentUser.id)
    .order('created_at', { ascending: false })
    .limit(10)

  // Fetch watchlist with risk distribution
  const { data: watchlistData } = await supabase
    .from('watchlist')
    .select(`
      id,
      companies!inner (
        company_name,
        cui,
        current_risk_level,
        current_risk_score
      )
    `)
    .eq('user_id', currentUser.id)
    .order('added_at', { ascending: false })

  // Calculate risk distribution
  const riskDistribution = {
    green: 0,
    yellow: 0,
    red: 0,
    unknown: 0
  }

  if (watchlistData) {
    watchlistData.forEach((item: any) => {
      const level = item.companies?.current_risk_level
      if (level === 'GREEN') riskDistribution.green++
      else if (level === 'YELLOW') riskDistribution.yellow++
      else if (level === 'RED') riskDistribution.red++
      else riskDistribution.unknown++
    })
  }

  // Admin access check
  const isAdminUser = currentUser.email === 'andrei@aconstantin.com'
  let adminStats = null
  if (isAdminUser) {
    adminStats = await getAdminStats()
  }

  return (
    <div className="max-w-[1400px] mx-auto p-4 md:p-8">
      <DashboardClient
        user={currentUser}
        profile={profile}
        watchlistCount={watchlistCount || 0}
        unreadAlertsCount={unreadAlertsCount || 0}
        recentSearches={recentSearches || []}
        watchlistData={watchlistData || []}
        riskDistribution={riskDistribution}
        adminStats={adminStats}
        isAdmin={isAdminUser}
      >
        {{
          litigation: (
            <Suspense fallback={<LitigationSkeleton />}>
              <LitigationSection watchlistCount={watchlistCount || 0} />
            </Suspense>
          ),
          analytics: (
            <Suspense fallback={<AnalyticsSkeleton />}>
              <AnalyticsSection />
            </Suspense>
          )
        }}
      </DashboardClient>
    </div>
  )
}

// --- Sub-components for Suspense ---

async function LitigationSection({ watchlistCount }: { watchlistCount: number }) {
  const latestLitigation = await getLatestLitigationCases()

  if (!latestLitigation.success || latestLitigation.cases.length === 0) {
    return (
      <div className="text-center py-12 bg-white border border-[var(--border-subtle)] rounded-xl">
        <Scale className="w-12 h-12 text-[var(--text-muted)] mx-auto mb-3" />
        <p className="text-sm text-[var(--text-secondary)]">
          Nu există procese juridice recente pentru companiile monitorizate.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {latestLitigation.cases.map((caseItem, index) => {
        const lawsuit = caseItem.lawsuit
        const getStatusColor = (status: string) => {
          switch (status) {
            case 'active': return 'bg-orange-50 text-orange-600 border-orange-100'
            case 'closed': return 'bg-gray-50 text-gray-500 border-gray-100'
            case 'suspended': return 'bg-blue-50 text-blue-600 border-blue-100'
            case 'cancelled': return 'bg-red-50 text-red-600 border-red-100'
            default: return 'bg-gray-50 text-gray-400 border-gray-100'
          }
        }

        const displayDate = lawsuit.lastUpdate || lawsuit.startDate || ''

        return (
          <AnimatedCard key={index} delay={100 * index} className="p-0 border-0 group">
            <Link
              href={`/app/company/${caseItem.companyCui}`}
              className="block p-5 bg-white border border-[var(--border-subtle)] rounded-xl hover:border-[var(--brand-mughal-green)] hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${getStatusColor(lawsuit.status)}`}>
                      {lawsuit.status}
                    </span>
                    <span className="text-xs font-mono text-[var(--text-muted)]">{lawsuit.caseNumber}</span>
                  </div>
                  <h4 className="font-bold text-[var(--text-primary)] group-hover:text-[var(--brand-mughal-green)] transition-colors">
                    {caseItem.companyName}
                  </h4>
                  <p className="text-xs text-[var(--text-secondary)] mt-1 line-clamp-1">{lawsuit.court} • {lawsuit.caseType}</p>
                </div>
                {displayDate && (
                  <div className="text-right flex-shrink-0">
                    <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase">Ultima Modificare</p>
                    <p className="text-xs font-bold text-[var(--text-primary)] mt-0.5">
                      {new Date(displayDate).toLocaleDateString('ro-RO')}
                    </p>
                  </div>
                )}
              </div>
            </Link>
          </AnimatedCard>
        )
      })}
    </div>
  )
}

function LitigationSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="h-32 bg-gray-100 animate-pulse rounded-xl" />
      ))}
    </div>
  )
}

async function AnalyticsSection() {
  const analytics = await getMarketAnalytics()

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Search Trends */}
      <AnimatedCard delay={100} className="p-6 bg-white border-[var(--border-subtle)]">
        <h3 className="text-sm font-bold text-[var(--text-muted)] mb-6 uppercase tracking-widest">Trend Căutări (6 luni)</h3>
        <div className="h-48 flex items-end justify-between gap-2">
          {analytics.searchTrends.map((trend, i) => (
            <div key={trend.month} className="flex flex-col items-center gap-3 flex-1">
              <div
                className="w-full bg-[var(--brand-mughal-green)]/10 border-t-2 border-[var(--brand-mughal-green)] rounded-t-sm hover:bg-[var(--brand-mughal-green)]/20 transition-all relative group"
                style={{ height: `${(trend.count / 450) * 100}%` }}
              >
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-[var(--text-primary)] text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-xl">
                  {trend.count} interogări
                </div>
              </div>
              <span className="text-[10px] font-bold text-[var(--text-muted)]">{trend.month}</span>
            </div>
          ))}
        </div>
      </AnimatedCard>

      {/* Risk Distribution */}
      <AnimatedCard delay={200} className="p-6 bg-white border-[var(--border-subtle)]">
        <h3 className="text-sm font-bold text-[var(--text-muted)] mb-6 uppercase tracking-widest">Distribuție Globală Risc</h3>
        <div className="space-y-6">
          {analytics.riskDistribution.map((risk) => (
            <div key={risk.level} className="space-y-2">
              <div className="flex justify-between items-end">
                <span className="text-sm font-bold text-[var(--text-primary)]">{risk.level}</span>
                <span className="text-xs font-mono text-[var(--text-muted)]">{risk.percentage}%</span>
              </div>
              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-1000"
                  style={{ width: `${risk.percentage}%`, backgroundColor: risk.color }}
                />
              </div>
            </div>
          ))}
        </div>
      </AnimatedCard>

      {/* Market Sentiment */}
      <AnimatedCard delay={300} className="p-6 bg-[var(--brand-mughal-green)] text-white border-0 overflow-hidden relative">
        <div className="relative z-10">
          <h3 className="text-white/60 text-sm font-bold uppercase tracking-widest mb-6">Sentimenul Pieței</h3>
          <div className="flex items-center gap-4 mb-4">
            <span className="text-3xl font-bold">{analytics.marketSentiment.level}</span>
            <div className="px-2 py-1 bg-white/10 rounded flex items-center gap-1 text-[10px] font-bold uppercase tracking-tight">
              <TrendingUp className="w-3 h-3" />
              {analytics.marketSentiment.trend}
            </div>
          </div>
          <p className="text-sm text-white/70 leading-relaxed mb-8">
            {analytics.marketSentiment.description}
          </p>
          <div className="flex items-center justify-between pt-6 border-t border-white/10">
            <span className="text-xs font-medium opacity-60">Avg. Risk Index</span>
            <span className="text-2xl font-bold font-mono">{analytics.marketSentiment.score}</span>
          </div>
        </div>
        <div className="absolute bottom-0 right-0 translate-y-1/2 translate-x-1/3 w-40 h-40 bg-white/5 rounded-full blur-3xl pointer-events-none" />
      </AnimatedCard>
    </div>
  )
}

function AnalyticsSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {[1, 2, 3].map((i) => (
        <div key={i} className="h-64 bg-gray-100 animate-pulse rounded-xl" />
      ))}
    </div>
  )
}
