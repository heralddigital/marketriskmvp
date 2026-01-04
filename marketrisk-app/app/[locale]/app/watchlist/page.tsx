'use client'

import { useState, useEffect } from 'react'
import { Star, Building2, AlertCircle, CheckCircle2, TrendingUp, TrendingDown, Eye, Trash2, Bell, BellOff, Loader2 } from 'lucide-react'
import { getWatchlist, removeFromWatchlist, toggleWatchlistAlerts } from './actions'
import type { WatchlistItem } from './actions'
import Link from 'next/link'

export default function WatchlistPage() {
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'GREEN' | 'YELLOW' | 'RED'>('all')
  const [watchlistLimit, setWatchlistLimit] = useState(10)

  const getRiskColor = (score: string | null) => {
    switch (score) {
      case 'GREEN':
        return 'text-[#22C55E] bg-[#22C55E]/10'
      case 'YELLOW':
        return 'text-[#F59E0B] bg-[#F59E0B]/10'
      case 'RED':
        return 'text-[#EF4444] bg-[#EF4444]/10'
      case 'UNKNOWN':
      case null:
      default:
        return 'text-[var(--text-muted)] bg-[var(--surface-bone)]'
    }
  }

  useEffect(() => {
    loadWatchlist()
  }, [])

  const loadWatchlist = async () => {
    setLoading(true)
    try {
      const result = await getWatchlist()
      if (result.success && result.data) {
        setWatchlist(result.data)
        if (result.watchlistLimit !== undefined) {
          setWatchlistLimit(result.watchlistLimit)
        }
      }
    } catch (error) {
      console.error('Error loading watchlist:', error)
    } finally {
      setLoading(false)
    }
  }

  const getRiskIcon = (score: string | null) => {
    switch (score) {
      case 'GREEN':
        return CheckCircle2
      case 'YELLOW':
        return AlertCircle
      case 'RED':
        return AlertCircle
      default:
        return AlertCircle
    }
  }

  const handleToggleAlerts = async (id: string, currentValue: boolean) => {
    const result = await toggleWatchlistAlerts(id, !currentValue)
    if (result.success) {
      setWatchlist(watchlist.map(item =>
        item.id === id ? { ...item, alert_on_change: !currentValue } : item
      ))
    }
  }

  const handleRemoveFromWatchlist = async (id: string) => {
    if (!confirm('Sigur vrei să ștergi această companie din watchlist?')) {
      return
    }

    const result = await removeFromWatchlist(id)
    if (result.success) {
      setWatchlist(watchlist.filter(item => item.id !== id))
    }
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('ro-RO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getTimeAgo = (date: string | null) => {
    if (!date) return 'Niciodată'
    const now = new Date()
    const then = new Date(date)
    const diffMs = now.getTime() - then.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 60) return `${diffMins} min în urmă`
    if (diffHours < 24) return `${diffHours} ore în urmă`
    if (diffDays < 7) return `${diffDays} zile în urmă`
    return formatDate(date)
  }

  const filteredWatchlist = filter === 'all'
    ? watchlist
    : watchlist.filter(item => item.current_risk_level === filter)

  const stats = {
    total: watchlist.length,
    green: watchlist.filter(i => i.current_risk_level === 'GREEN').length,
    yellow: watchlist.filter(i => i.current_risk_level === 'YELLOW').length,
    red: watchlist.filter(i => i.current_risk_level === 'RED').length,
  }

  if (loading) {
    return (
      <div className="p-8 bg-[var(--surface-paper)] min-h-full">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-[var(--brand-mughal-green)]" />
        </div>
      </div>
    )
  }

  return (
    <div className="p-8 bg-[var(--surface-paper)] min-h-full">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2">
          Watchlist
        </h1>
        <p className="text-[var(--text-secondary)]">
          Monitorizează companiile importante și primește alerte când apar modificări
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white border border-[var(--border-subtle)] rounded-[4px] p-4">
          <p className="text-sm text-[var(--text-muted)] mb-1">Total companii</p>
          <p className="text-2xl font-bold text-[var(--text-primary)]">{stats.total}</p>
        </div>
        <div className="bg-white border border-[var(--border-subtle)] rounded-[4px] p-4">
          <p className="text-sm text-[var(--text-muted)] mb-1">Risc GREEN</p>
          <p className="text-2xl font-bold text-[#22C55E]">{stats.green}</p>
        </div>
        <div className="bg-white border border-[var(--border-subtle)] rounded-[4px] p-4">
          <p className="text-sm text-[var(--text-muted)] mb-1">Risc YELLOW</p>
          <p className="text-2xl font-bold text-[#F59E0B]">{stats.yellow}</p>
        </div>
        <div className="bg-white border border-[var(--border-subtle)] rounded-[4px] p-4">
          <p className="text-sm text-[var(--text-muted)] mb-1">Risc RED</p>
          <p className="text-2xl font-bold text-[#EF4444]">{stats.red}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border border-[var(--border-subtle)] rounded-[4px] p-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-[var(--text-primary)]">Filtrează:</span>
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 rounded-[4px] text-sm font-medium transition-colors ${
                filter === 'all'
                  ? 'bg-[var(--brand-mughal-green)] text-white'
                  : 'bg-[var(--surface-bone)] text-[var(--text-secondary)] hover:bg-[var(--border-subtle)]'
              }`}
            >
              Toate ({stats.total})
            </button>
            <button
              onClick={() => setFilter('GREEN')}
              className={`px-3 py-1.5 rounded-[4px] text-sm font-medium transition-colors ${
                filter === 'GREEN'
                  ? 'bg-[#22C55E] text-white'
                  : 'bg-[var(--surface-bone)] text-[var(--text-secondary)] hover:bg-[var(--border-subtle)]'
              }`}
            >
              GREEN ({stats.green})
            </button>
            <button
              onClick={() => setFilter('YELLOW')}
              className={`px-3 py-1.5 rounded-[4px] text-sm font-medium transition-colors ${
                filter === 'YELLOW'
                  ? 'bg-[#F59E0B] text-white'
                  : 'bg-[var(--surface-bone)] text-[var(--text-secondary)] hover:bg-[var(--border-subtle)]'
              }`}
            >
              YELLOW ({stats.yellow})
            </button>
            <button
              onClick={() => setFilter('RED')}
              className={`px-3 py-1.5 rounded-[4px] text-sm font-medium transition-colors ${
                filter === 'RED'
                  ? 'bg-[#EF4444] text-white'
                  : 'bg-[var(--surface-bone)] text-[var(--text-secondary)] hover:bg-[var(--border-subtle)]'
              }`}
            >
              RED ({stats.red})
            </button>
          </div>
          <div className="text-sm text-[var(--text-muted)]">
            Limită plan: <strong className="text-[var(--text-primary)]">{watchlistLimit === -1 ? 'Nelimitat' : watchlistLimit}</strong> companii
          </div>
        </div>
      </div>

      {/* Watchlist Table */}
      {filteredWatchlist.length > 0 ? (
        <div className="bg-white border border-[var(--border-subtle)] rounded-[4px] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[var(--surface-paper)] border-b border-[var(--border-subtle)]">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-[var(--text-primary)] uppercase tracking-wide">
                    Companie
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-[var(--text-primary)] uppercase tracking-wide">
                    Scor risc
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-[var(--text-primary)] uppercase tracking-wide">
                    Schimbare
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-[var(--text-primary)] uppercase tracking-wide">
                    Ultimă verificare
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-[var(--text-primary)] uppercase tracking-wide">
                    Alerte
                  </th>
                  <th className="text-right px-6 py-3 text-xs font-semibold text-[var(--text-primary)] uppercase tracking-wide">
                    Acțiuni
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-subtle)]">
                {filteredWatchlist.map((company) => {
                  const RiskIcon = getRiskIcon(company.current_risk_level)
                  const riskLevel = company.current_risk_level || 'UNKNOWN'
                  const riskScore = company.current_risk_score || 0

                  return (
                    <tr key={company.id} className="hover:bg-[var(--surface-paper)] transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <Building2 className="w-5 h-5 text-[var(--brand-mughal-green)] flex-shrink-0" />
                          <div>
                            <p className="font-medium text-[var(--text-primary)]">{company.company_name}</p>
                            <p className="text-sm text-[var(--text-muted)]">CUI: {company.cui}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-[4px] text-sm font-semibold ${getRiskColor(riskLevel)}`}>
                          <RiskIcon className="w-4 h-4" />
                          {riskLevel === 'UNKNOWN' ? 'Necunoscut' : riskLevel}
                        </span>
                        {riskLevel !== 'UNKNOWN' && (
                          <p className="text-xs text-[var(--text-muted)] mt-1">{riskScore}/100</p>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-[var(--text-muted)]">—</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-[var(--text-secondary)]">
                          {getTimeAgo(company.last_check)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleToggleAlerts(company.id, company.alert_on_change)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-[4px] text-sm font-medium transition-colors ${
                            company.alert_on_change
                              ? 'bg-[var(--brand-mughal-green)]/10 text-[var(--brand-mughal-green)] hover:bg-[var(--brand-mughal-green)]/20'
                              : 'bg-[var(--surface-bone)] text-[var(--text-muted)] hover:bg-[var(--border-subtle)]'
                          }`}
                        >
                          {company.alert_on_change ? (
                            <>
                              <Bell className="w-3.5 h-3.5" />
                              Active
                            </>
                          ) : (
                            <>
                              <BellOff className="w-3.5 h-3.5" />
                              Inactive
                            </>
                          )}
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/app/company/${company.cui}`}
                            className="p-2 text-[var(--text-secondary)] hover:text-[var(--brand-mughal-green)] hover:bg-[var(--surface-bone)] rounded-[4px] transition-colors"
                            title="Vezi detalii companie"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleRemoveFromWatchlist(company.id)}
                            className="p-2 text-[var(--text-secondary)] hover:text-[#EF4444] hover:bg-[#EF4444]/10 rounded-[4px] transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white border border-[var(--border-subtle)] rounded-[4px] p-12 text-center">
          <Star className="w-16 h-16 text-[var(--text-muted)] mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
            Nicio companie în watchlist
          </h3>
          <p className="text-[var(--text-secondary)] max-w-md mx-auto">
            Adaugă companii în watchlist pentru a le monitoriza automat și pentru a primi alerte când apar modificări.
          </p>
        </div>
      )}

      {/* Upgrade Prompt */}
      <div className="bg-gradient-to-r from-[var(--brand-mughal-green)] to-[var(--brand-mughal-green-2)] text-white rounded-[4px] p-6 mt-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold mb-2">
              Monitorizează mai multe companii
            </h3>
            <p className="text-sm opacity-90">
              Planul tău actual permite <strong>{watchlistLimit === -1 ? 'nelimitat' : watchlistLimit} companii</strong> în watchlist. Upgrade la Pro pentru <strong>250 companii</strong> sau la Enterprise pentru monitorizare nelimitată.
            </p>
          </div>
          <button className="px-6 py-3 bg-white text-[var(--brand-mughal-green)] rounded-[4px] font-semibold hover:shadow-lg transition-all whitespace-nowrap">
            Vezi planuri
          </button>
        </div>
      </div>
    </div>
  )
}
