'use client'

import { useState } from 'react'
import { Star, Building2, AlertCircle, CheckCircle2, TrendingUp, TrendingDown, Eye, Trash2, Bell, BellOff } from 'lucide-react'

// Mock watchlist data
const mockWatchlist = [
  {
    id: 1,
    cui: '12345678',
    name: 'SC TECH SOLUTIONS SRL',
    riskScore: 'GREEN',
    riskValue: 85,
    riskChange: '+2',
    status: 'Activ',
    lastCheck: '2 ore în urmă',
    addedDate: '15.12.2024',
    alertsEnabled: true,
    changes: [],
  },
  {
    id: 2,
    cui: '23456789',
    name: 'SC CONSULTING GROUP SA',
    riskScore: 'YELLOW',
    riskValue: 62,
    riskChange: '-5',
    status: 'Activ',
    lastCheck: '5 ore în urmă',
    addedDate: '10.12.2024',
    alertsEnabled: true,
    changes: ['Scorul de risc a scăzut'],
  },
  {
    id: 3,
    cui: '34567890',
    name: 'SC IMPORT EXPORT SRL',
    riskScore: 'RED',
    riskValue: 38,
    riskChange: '-12',
    status: 'Activ - Risc fiscal',
    lastCheck: '1 zi în urmă',
    addedDate: '05.12.2024',
    alertsEnabled: false,
    changes: ['Risc fiscal detectat', 'Scorul de risc a scăzut semnificativ'],
  },
  {
    id: 4,
    cui: '45678901',
    name: 'SC PRODUCTION FACTORY SRL',
    riskScore: 'GREEN',
    riskValue: 78,
    riskChange: '0',
    status: 'Activ',
    lastCheck: '3 ore în urmă',
    addedDate: '01.12.2024',
    alertsEnabled: true,
    changes: [],
  },
]

export default function WatchlistPage() {
  const [watchlist, setWatchlist] = useState(mockWatchlist)
  const [filter, setFilter] = useState<'all' | 'GREEN' | 'YELLOW' | 'RED'>('all')

  const getRiskColor = (score: string) => {
    switch (score) {
      case 'GREEN':
        return 'text-[#22C55E] bg-[#22C55E]/10'
      case 'YELLOW':
        return 'text-[#F59E0B] bg-[#F59E0B]/10'
      case 'RED':
        return 'text-[#EF4444] bg-[#EF4444]/10'
      default:
        return 'text-[var(--text-muted)] bg-[var(--surface-bone)]'
    }
  }

  const getRiskIcon = (score: string) => {
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

  const toggleAlerts = (id: number) => {
    setWatchlist(watchlist.map(item =>
      item.id === id ? { ...item, alertsEnabled: !item.alertsEnabled } : item
    ))
  }

  const removeFromWatchlist = (id: number) => {
    setWatchlist(watchlist.filter(item => item.id !== id))
  }

  const filteredWatchlist = filter === 'all'
    ? watchlist
    : watchlist.filter(item => item.riskScore === filter)

  const stats = {
    total: watchlist.length,
    green: watchlist.filter(i => i.riskScore === 'GREEN').length,
    yellow: watchlist.filter(i => i.riskScore === 'YELLOW').length,
    red: watchlist.filter(i => i.riskScore === 'RED').length,
    withChanges: watchlist.filter(i => i.changes.length > 0).length,
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
      <div className="grid grid-cols-5 gap-4 mb-6">
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
        <div className="bg-white border border-[var(--border-subtle)] rounded-[4px] p-4">
          <p className="text-sm text-[var(--text-muted)] mb-1">Cu modificări</p>
          <p className="text-2xl font-bold text-[var(--brand-mughal-green)]">{stats.withChanges}</p>
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
            Limită plan: <strong className="text-[var(--text-primary)]">10</strong> companii
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
                  const RiskIcon = getRiskIcon(company.riskScore)
                  const isRiskUp = company.riskChange.startsWith('+')
                  const isRiskDown = company.riskChange.startsWith('-')

                  return (
                    <tr key={company.id} className="hover:bg-[var(--surface-paper)] transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <Building2 className="w-5 h-5 text-[var(--brand-mughal-green)] flex-shrink-0" />
                          <div>
                            <p className="font-medium text-[var(--text-primary)]">{company.name}</p>
                            <p className="text-sm text-[var(--text-muted)]">CUI: {company.cui}</p>
                            {company.changes.length > 0 && (
                              <div className="flex items-center gap-1 mt-1">
                                <AlertCircle className="w-3 h-3 text-[#F59E0B]" />
                                <span className="text-xs text-[#F59E0B] font-medium">
                                  {company.changes.length} modificări
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-[4px] text-sm font-semibold ${getRiskColor(company.riskScore)}`}>
                          <RiskIcon className="w-4 h-4" />
                          {company.riskScore}
                        </span>
                        <p className="text-xs text-[var(--text-muted)] mt-1">{company.riskValue}/100</p>
                      </td>
                      <td className="px-6 py-4">
                        {company.riskChange !== '0' ? (
                          <div className="flex items-center gap-1">
                            {isRiskUp && <TrendingUp className="w-4 h-4 text-[#22C55E]" />}
                            {isRiskDown && <TrendingDown className="w-4 h-4 text-[#EF4444]" />}
                            <span className={`text-sm font-medium ${isRiskUp ? 'text-[#22C55E]' : isRiskDown ? 'text-[#EF4444]' : 'text-[var(--text-muted)]'}`}>
                              {company.riskChange}
                            </span>
                          </div>
                        ) : (
                          <span className="text-sm text-[var(--text-muted)]">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-[var(--text-secondary)]">{company.lastCheck}</span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => toggleAlerts(company.id)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-[4px] text-sm font-medium transition-colors ${
                            company.alertsEnabled
                              ? 'bg-[var(--brand-mughal-green)]/10 text-[var(--brand-mughal-green)] hover:bg-[var(--brand-mughal-green)]/20'
                              : 'bg-[var(--surface-bone)] text-[var(--text-muted)] hover:bg-[var(--border-subtle)]'
                          }`}
                        >
                          {company.alertsEnabled ? (
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
                          <button className="p-2 text-[var(--text-secondary)] hover:text-[var(--brand-mughal-green)] hover:bg-[var(--surface-bone)] rounded-[4px] transition-colors">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => removeFromWatchlist(company.id)}
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
              Planul tău actual permite <strong>10 companii</strong> în watchlist. Upgrade la Pro pentru <strong>50 companii</strong> sau la Enterprise pentru monitorizare nelimitată.
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
