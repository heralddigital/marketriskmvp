'use client'

import { useState, useEffect } from 'react'
import { Clock, MapPin, Building2, AlertTriangle, CheckCircle2, XCircle, Receipt, TrendingUp, TrendingDown, Minus } from 'lucide-react'
import type { CompanyHistoryEntry, AddressChange, ChangeSummary } from '@/lib/company-history/types'

interface CompanyHistoryTimelineProps {
  cui: string
}

export default function CompanyHistoryTimeline({ cui }: CompanyHistoryTimelineProps) {
  const [history, setHistory] = useState<CompanyHistoryEntry[]>([])
  const [addressChanges, setAddressChanges] = useState<AddressChange[]>([])
  const [summary, setSummary] = useState<ChangeSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [years, setYears] = useState(5)

  useEffect(() => {
    loadHistory()
  }, [cui, years])

  const loadHistory = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/company-history?cui=${cui}&years=${years}`)
      if (response.ok) {
        const data = await response.json()
        setHistory(data.history || [])
        setAddressChanges(data.addressChanges || [])
        setSummary(data.summary || null)
      }
    } catch (error) {
      console.error('Error loading history:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('ro-RO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getChangeIcon = (field: string) => {
    switch (field) {
      case 'fiscal_address':
      case 'social_address':
        return MapPin
      case 'status':
      case 'is_inactive':
        return AlertTriangle
      case 'vat_registration':
      case 'vat_split':
      case 'vat_incasare':
        return Receipt
      case 'company_name':
        return Building2
      default:
        return Clock
    }
  }

  const getChangeColor = (field: string) => {
    if (field.includes('address')) return 'text-blue-600 bg-blue-50'
    if (field.includes('vat')) return 'text-purple-600 bg-purple-50'
    if (field.includes('status') || field.includes('inactive')) return 'text-orange-600 bg-orange-50'
    return 'text-gray-600 bg-gray-50'
  }

  const formatAddress = (address: any) => {
    if (!address) return 'N/A'
    if (typeof address === 'string') return address
    if (address.full) return address.full
    return `${address.street || ''} ${address.number || ''}, ${address.postal_code || ''} ${address.city || ''}, ${address.county || ''}`.trim()
  }

  if (loading) {
    return (
      <div className="bg-white border border-[var(--border-subtle)] rounded-[4px] p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="h-20 bg-gray-200 rounded"></div>
          <div className="h-20 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  if (history.length === 0) {
    return (
      <div className="bg-white border border-[var(--border-subtle)] rounded-[4px] p-6">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-5 h-5 text-[var(--text-muted)]" />
          <h3 className="text-lg font-semibold text-[var(--text-primary)]">
            Istoric companie
          </h3>
        </div>
        <p className="text-sm text-[var(--text-secondary)]">
          Nu există date istorice pentru această companie. Datele vor fi salvate la următoarele verificări.
        </p>
      </div>
    )
  }

  return (
    <div className="bg-white border border-[var(--border-subtle)] rounded-[4px] p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-[var(--brand-mughal-green)]" />
          <h3 className="text-lg font-semibold text-[var(--text-primary)]">
            Istoric companie (ultimii {years} ani)
          </h3>
        </div>
        <select
          value={years}
          onChange={(e) => setYears(Number(e.target.value))}
          className="text-sm border border-[var(--border-subtle)] rounded-[4px] px-3 py-1.5 bg-white"
        >
          <option value={1}>Ultimul an</option>
          <option value={2}>Ultimii 2 ani</option>
          <option value={3}>Ultimii 3 ani</option>
          <option value={5}>Ultimii 5 ani</option>
        </select>
      </div>

      {/* Summary */}
      {summary && summary.total_changes > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-[var(--surface-paper)] rounded-[4px] border border-[var(--border-subtle)]">
          <div>
            <p className="text-xs text-[var(--text-muted)] mb-1">Total modificări</p>
            <p className="text-lg font-semibold text-[var(--text-primary)]">{summary.total_changes}</p>
          </div>
          <div>
            <p className="text-xs text-[var(--text-muted)] mb-1">Schimbări adrese</p>
            <p className="text-lg font-semibold text-blue-600">{summary.address_changes}</p>
          </div>
          <div>
            <p className="text-xs text-[var(--text-muted)] mb-1">Schimbări status</p>
            <p className="text-lg font-semibold text-orange-600">{summary.status_changes}</p>
          </div>
          <div>
            <p className="text-xs text-[var(--text-muted)] mb-1">Schimbări TVA</p>
            <p className="text-lg font-semibold text-purple-600">{summary.vat_changes}</p>
          </div>
        </div>
      )}

      {/* Address Changes Section */}
      {addressChanges.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-[var(--text-primary)] mb-3 flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            Schimbări adrese ({addressChanges.length})
          </h4>
          <div className="space-y-3">
            {addressChanges.map((change, idx) => (
              <div key={idx} className="p-4 bg-blue-50 border border-blue-200 rounded-[4px]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-blue-900">
                    {change.field_name === 'fiscal_address' ? 'Domiciliu fiscal' : 'Sediu social'}
                  </span>
                  <span className="text-xs text-blue-700">{formatDate(change.change_date)}</span>
                </div>
                <div className="space-y-1 text-xs">
                  <div className="flex items-start gap-2">
                    <TrendingDown className="w-3 h-3 text-red-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-red-700 font-medium">Înainte:</p>
                      <p className="text-red-600">{formatAddress(change.old_value)}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <TrendingUp className="w-3 h-3 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-green-700 font-medium">După:</p>
                      <p className="text-green-600">{formatAddress(change.new_value)}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Timeline */}
      <div>
        <h4 className="text-sm font-semibold text-[var(--text-primary)] mb-3">
          Timeline modificări ({history.length} înregistrări)
        </h4>
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-[var(--border-subtle)]"></div>

          <div className="space-y-4">
            {history.map((entry, idx) => (
              <div key={entry.id} className="relative pl-12">
                {/* Timeline dot */}
                <div className="absolute left-0 top-1.5 w-8 h-8 bg-white border-2 border-[var(--brand-mughal-green)] rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-[var(--brand-mughal-green)] rounded-full"></div>
                </div>

                {/* Entry content */}
                <div className="bg-[var(--surface-paper)] border border-[var(--border-subtle)] rounded-[4px] p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold text-[var(--text-primary)]">
                      {formatDate(entry.recorded_at)}
                    </span>
                    {entry.risk_level && (
                      <span className={`px-2 py-1 rounded-[4px] text-xs font-semibold ${entry.risk_level === 'GREEN' ? 'text-[#22C55E] bg-[#22C55E]/10' :
                          entry.risk_level === 'YELLOW' ? 'text-[#F59E0B] bg-[#F59E0B]/10' :
                            'text-[#EF4444] bg-[#EF4444]/10'
                        }`}>
                        {entry.risk_level} ({entry.risk_score}/100)
                      </span>
                    )}
                  </div>

                  {/* Changes detected */}
                  {entry.changes_detected && entry.changes_detected.length > 0 && (
                    <div className="mb-3">
                      <p className="text-xs text-[var(--text-muted)] mb-2">Modificări detectate:</p>
                      <div className="flex flex-wrap gap-2">
                        {entry.changes_detected.map((change, changeIdx) => {
                          const color = getChangeColor(change)
                          return (
                            <span
                              key={changeIdx}
                              className={`px-2 py-1 rounded-[4px] text-xs font-medium flex items-center gap-1 ${color}`}
                            >
                              {change === 'fiscal_address' || change === 'social_address' ? <MapPin className="w-3 h-3" /> :
                                change === 'status' || change === 'is_inactive' ? <AlertTriangle className="w-3 h-3" /> :
                                  change.includes('vat') ? <Receipt className="w-3 h-3" /> :
                                    change === 'company_name' ? <Building2 className="w-3 h-3" /> :
                                      <Clock className="w-3 h-3" />}
                              {change.replace('_', ' ')}
                            </span>
                          )
                        })}
                      </div>
                    </div>
                  )}

                  {/* Snapshot details */}
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <p className="text-[var(--text-muted)] mb-1">Status</p>
                      <div className="flex items-center gap-1">
                        {entry.status === 'ACTIV' || !entry.snapshot_data.isInactive ? (
                          <CheckCircle2 className="w-3 h-3 text-[#22C55E]" />
                        ) : (
                          <XCircle className="w-3 h-3 text-[#EF4444]" />
                        )}
                        <p className="font-medium text-[var(--text-primary)]">{entry.status}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-[var(--text-muted)] mb-1">TVA</p>
                      <p className="font-medium text-[var(--text-primary)]">
                        {entry.snapshot_data.vatRegistration?.isRegistered ? 'Înregistrat' : 'Neînregistrat'}
                      </p>
                    </div>
                    {entry.fiscal_address && (
                      <div className="col-span-2">
                        <p className="text-[var(--text-muted)] mb-1">Domiciliu fiscal</p>
                        <p className="text-[var(--text-primary)]">{formatAddress(entry.fiscal_address)}</p>
                      </div>
                    )}
                    {entry.social_address && (
                      <div className="col-span-2">
                        <p className="text-[var(--text-muted)] mb-1">Sediu social</p>
                        <p className="text-[var(--text-primary)]">{formatAddress(entry.social_address)}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

