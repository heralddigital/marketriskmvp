'use client'

import { useState, useEffect } from 'react'
import { Search, Building2, Calendar, Download, Loader2, Eye } from 'lucide-react'
import { getSearchHistory, getSearchHistoryStats } from './actions'
import type { SearchHistoryItem } from './actions'
import Link from 'next/link'

export default function HistoryPage() {
  const [history, setHistory] = useState<SearchHistoryItem[]>([])
  const [stats, setStats] = useState({ total: 0, thisMonth: 0, exported: 0 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadHistory()
  }, [])

  const loadHistory = async () => {
    setLoading(true)
    setError(null)
    try {
      const [historyResult, statsResult] = await Promise.all([
        getSearchHistory(),
        getSearchHistoryStats()
      ])

      if (historyResult.success) {
        if (historyResult.data) {
          setHistory(historyResult.data)
          console.log('History loaded:', historyResult.data.length, 'items')
        } else {
          console.log('No history data returned')
          setHistory([])
        }
      } else {
        console.error('History load failed:', historyResult.error)
        setError(historyResult.error || 'Eroare la încărcarea istoricului')
      }

      if (statsResult.success && statsResult.stats) {
        setStats(statsResult.stats)
      } else {
        console.error('Stats load failed:', statsResult.error)
      }
    } catch (error) {
      console.error('Error loading history:', error)
      setError(error instanceof Error ? error.message : 'Eroare necunoscută')
    } finally {
      setLoading(false)
    }
  }

  const getRiskColor = (score: string | null) => {
    if (!score) return 'text-[var(--text-muted)] bg-[var(--surface-bone)]'
    return score === 'GREEN' ? 'text-[#22C55E] bg-[#22C55E]/10' :
           score === 'YELLOW' ? 'text-[#F59E0B] bg-[#F59E0B]/10]' :
           'text-[#EF4444] bg-[#EF4444]/10'
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString('ro-RO', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
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
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2">Istoric căutări</h1>
            <p className="text-[var(--text-secondary)]">Toate căutările tale anterioare și rapoartele exportate</p>
          </div>
          <button
            onClick={loadHistory}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-[var(--text-primary)] bg-white border border-[var(--border-subtle)] rounded-[4px] hover:bg-[var(--surface-paper)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Search className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Reîmprospătează
          </button>
        </div>
        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-[4px]">
            <p className="text-sm text-red-800">{error}</p>
            <button
              onClick={loadHistory}
              className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
            >
              Reîncearcă
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white border border-[var(--border-subtle)] rounded-[4px] p-4">
          <p className="text-sm text-[var(--text-muted)] mb-1">Total căutări</p>
          <p className="text-2xl font-bold text-[var(--text-primary)]">{stats.total}</p>
        </div>
        <div className="bg-white border border-[var(--border-subtle)] rounded-[4px] p-4">
          <p className="text-sm text-[var(--text-muted)] mb-1">Această lună</p>
          <p className="text-2xl font-bold text-[var(--brand-mughal-green)]">{stats.thisMonth}</p>
        </div>
        <div className="bg-white border border-[var(--border-subtle)] rounded-[4px] p-4">
          <p className="text-sm text-[var(--text-muted)] mb-1">Exportate PDF</p>
          <p className="text-2xl font-bold text-[var(--text-primary)]">{stats.exported}</p>
        </div>
      </div>

      {history.length > 0 ? (
        <div className="bg-white border border-[var(--border-subtle)] rounded-[4px] overflow-hidden">
          <table className="w-full">
            <thead className="bg-[var(--surface-paper)] border-b border-[var(--border-subtle)]">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-semibold text-[var(--text-primary)] uppercase">Companie</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-[var(--text-primary)] uppercase">Data</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-[var(--text-primary)] uppercase">Scor</th>
                <th className="text-right px-6 py-3 text-xs font-semibold text-[var(--text-primary)] uppercase">Acțiuni</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-subtle)]">
              {history.map((item) => {
                const riskLevel = item.risk_level || null
                const riskScore = item.risk_score || 0

                return (
                  <tr key={item.id} className="hover:bg-[var(--surface-paper)] transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Building2 className="w-5 h-5 text-[var(--brand-mughal-green)]" />
                        <div>
                          <p className="font-medium text-[var(--text-primary)]">{item.company_name || 'N/A'}</p>
                          <p className="text-sm text-[var(--text-muted)]">CUI: {item.cui}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-[var(--text-secondary)] flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {formatDate(item.created_at)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-[4px] text-sm font-semibold ${getRiskColor(riskLevel)}`}>
                        {riskLevel === null || riskLevel === 'UNKNOWN' ? 'Necunoscut' : riskLevel}
                      </span>
                      {riskLevel && riskLevel !== 'UNKNOWN' && (
                        <p className="text-xs text-[var(--text-muted)] mt-1">{riskScore}/100</p>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/app/company/${item.cui}`}
                          className="p-2 text-[var(--text-secondary)] hover:text-[var(--brand-mughal-green)] hover:bg-[var(--surface-bone)] rounded-[4px] transition-colors"
                          title="Vezi detalii"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <button
                          className="p-2 text-[var(--text-secondary)] hover:text-[var(--brand-mughal-green)] hover:bg-[var(--surface-bone)] rounded-[4px] transition-colors"
                          title="Exportă PDF (în dezvoltare)"
                          disabled
                        >
                          <Download className="w-4 h-4 opacity-50" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-white border border-[var(--border-subtle)] rounded-[4px] p-12 text-center">
          <Search className="w-16 h-16 text-[var(--text-muted)] mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
            Nicio căutare în istoric
          </h3>
          <p className="text-[var(--text-secondary)] max-w-md mx-auto mb-6">
            Căutările tale vor apărea aici. Începe prin a căuta o companie.
          </p>
          <Link
            href="/app/search"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--brand-mughal-green)] text-white rounded-[4px] font-medium hover:bg-[var(--brand-mughal-green-2)] transition-colors"
          >
            <Search className="w-4 h-4" />
            Caută o companie
          </Link>
        </div>
      )}
    </div>
  )
}
