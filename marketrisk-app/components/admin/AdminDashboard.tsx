'use client'

// Admin dashboard with system statistics
// For admins and super admins only

import { useState, useEffect } from 'react'
import {
  Users,
  CreditCard,
  Euro,
  Search,
  Activity,
  TrendingUp,
  AlertCircle,
} from 'lucide-react'

interface SystemStats {
  totalUsers: number
  activeSubscriptions: number
  monthlyRevenue: number
  totalSearches: number
  apiRequestsToday: number
}

interface SubscriptionBreakdown {
  plan: string
  userCount: number
  revenue: number
}

interface AdminDashboardProps {
  locale?: 'ro' | 'en'
}

export function AdminDashboard({ locale = 'ro' }: AdminDashboardProps) {
  const [stats, setStats] = useState<SystemStats | null>(null)
  const [breakdown, setBreakdown] = useState<SubscriptionBreakdown[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const text = {
    ro: {
      title: 'Panou Administrare',
      overview: 'Statistici Generale',
      totalUsers: 'Total Utilizatori',
      activeSubscriptions: 'Abonamente Active',
      monthlyRevenue: 'Venit Lunar',
      totalSearches: 'Căutări Totale',
      apiRequests: 'Cereri API (24h)',
      subscriptionBreakdown: 'Distribuție Abonamente',
      plan: 'Plan',
      users: 'Utilizatori',
      revenue: 'Venit',
      loading: 'Se încarcă...',
      error: 'Eroare la încărcarea datelor',
      retry: 'Reîncearcă',
      free: 'Gratuit',
      professional: 'Profesional',
      business: 'Business',
      enterprise: 'Enterprise',
    },
    en: {
      title: 'Admin Panel',
      overview: 'Overview Statistics',
      totalUsers: 'Total Users',
      activeSubscriptions: 'Active Subscriptions',
      monthlyRevenue: 'Monthly Revenue',
      totalSearches: 'Total Searches',
      apiRequests: 'API Requests (24h)',
      subscriptionBreakdown: 'Subscription Breakdown',
      plan: 'Plan',
      users: 'Users',
      revenue: 'Revenue',
      loading: 'Loading...',
      error: 'Error loading data',
      retry: 'Retry',
      free: 'Free',
      professional: 'Professional',
      business: 'Business',
      enterprise: 'Enterprise',
    },
  }

  const t = text[locale]

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    try {
      setLoading(true)
      setError(null)

      const [statsResponse, breakdownResponse] = await Promise.all([
        fetch('/api/admin/stats'),
        fetch('/api/admin/subscription-breakdown'),
      ])

      if (statsResponse.ok && breakdownResponse.ok) {
        const statsData = await statsResponse.json()
        const breakdownData = await breakdownResponse.json()

        setStats(statsData)
        setBreakdown(breakdownData)
      } else {
        setError(t.error)
      }
    } catch (err) {
      console.error('Error fetching admin data:', err)
      setError(t.error)
    } finally {
      setLoading(false)
    }
  }

  const planNames: Record<string, string> = {
    free: t.free,
    professional: t.professional,
    business: t.business,
    enterprise: t.enterprise,
  }

  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">{t.title}</h1>
        <p className="text-gray-600">{t.loading}</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">{t.title}</h1>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <p className="text-red-800">{error}</p>
          </div>
          <button
            onClick={fetchData}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
          >
            {t.retry}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">{t.title}</h1>

      {/* Overview Stats */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">{t.overview}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Total Users */}
          <div className="bg-white border rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <Users className="w-8 h-8 text-blue-600" />
              <TrendingUp className="w-4 h-4 text-green-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {stats?.totalUsers.toLocaleString() || 0}
            </div>
            <div className="text-sm text-gray-600">{t.totalUsers}</div>
          </div>

          {/* Active Subscriptions */}
          <div className="bg-white border rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <CreditCard className="w-8 h-8 text-purple-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {stats?.activeSubscriptions.toLocaleString() || 0}
            </div>
            <div className="text-sm text-gray-600">{t.activeSubscriptions}</div>
          </div>

          {/* Monthly Revenue */}
          <div className="bg-white border rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <Euro className="w-8 h-8 text-green-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              €{stats?.monthlyRevenue.toLocaleString() || 0}
            </div>
            <div className="text-sm text-gray-600">{t.monthlyRevenue}</div>
          </div>

          {/* Total Searches */}
          <div className="bg-white border rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <Search className="w-8 h-8 text-orange-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {stats?.totalSearches.toLocaleString() || 0}
            </div>
            <div className="text-sm text-gray-600">{t.totalSearches}</div>
          </div>

          {/* API Requests */}
          <div className="bg-white border rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <Activity className="w-8 h-8 text-red-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {stats?.apiRequestsToday.toLocaleString() || 0}
            </div>
            <div className="text-sm text-gray-600">{t.apiRequests}</div>
          </div>
        </div>
      </div>

      {/* Subscription Breakdown */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          {t.subscriptionBreakdown}
        </h2>
        <div className="bg-white border rounded-xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-700">
                  {t.plan}
                </th>
                <th className="text-right py-3 px-6 text-sm font-medium text-gray-700">
                  {t.users}
                </th>
                <th className="text-right py-3 px-6 text-sm font-medium text-gray-700">
                  {t.revenue}
                </th>
              </tr>
            </thead>
            <tbody>
              {breakdown.map((item) => (
                <tr key={item.plan} className="border-b last:border-b-0">
                  <td className="py-3 px-6">
                    <span className="font-medium text-gray-900">
                      {planNames[item.plan] || item.plan}
                    </span>
                  </td>
                  <td className="py-3 px-6 text-right text-gray-900">
                    {item.userCount.toLocaleString()}
                  </td>
                  <td className="py-3 px-6 text-right">
                    <span className="font-medium text-green-600">
                      €{item.revenue.toLocaleString()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
