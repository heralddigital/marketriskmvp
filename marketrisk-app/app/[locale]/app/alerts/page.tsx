'use client'

import { useState, useEffect } from 'react'
import { Bell, AlertCircle, CheckCircle2, TrendingDown, TrendingUp, Building2, Mail, Smartphone, X, Clock, Loader2 } from 'lucide-react'
import { getAlerts, markAlertAsRead, markAllAlertsAsRead, deleteAlert } from './actions'
import type { Alert } from './actions'
import Link from 'next/link'

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all')

  useEffect(() => {
    loadAlerts()
  }, [])

  const loadAlerts = async () => {
    setLoading(true)
    try {
      const result = await getAlerts()
      if (result.success && result.data) {
        setAlerts(result.data)
      }
    } catch (error) {
      console.error('Error loading alerts:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleMarkAsRead = async (id: string) => {
    const result = await markAlertAsRead(id)
    if (result.success) {
      setAlerts(alerts.map(alert =>
        alert.id === id ? { ...alert, read: true } : alert
      ))
    }
  }

  const handleMarkAllAsRead = async () => {
    const result = await markAllAlertsAsRead()
    if (result.success) {
      setAlerts(alerts.map(alert => ({ ...alert, read: true })))
    }
  }

  const handleDeleteAlert = async (id: string) => {
    if (!confirm('Sigur vrei să ștergi această alertă?')) {
      return
    }

    const result = await deleteAlert(id)
    if (result.success) {
      setAlerts(alerts.filter(alert => alert.id !== id))
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'bg-[#EF4444]/10 border-[#EF4444]/20 text-[#EF4444]'
      case 'medium':
        return 'bg-[#F59E0B]/10 border-[#F59E0B]/20 text-[#F59E0B]'
      case 'low':
        return 'bg-[#22C55E]/10 border-[#22C55E]/20 text-[#22C55E]'
      default:
        return 'bg-[var(--surface-bone)] border-[var(--border-subtle)] text-[var(--text-muted)]'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'risk_increase':
        return TrendingUp
      case 'risk_decrease':
        return TrendingDown
      case 'risk_change':
        return AlertCircle
      case 'status_change':
        return AlertCircle
      case 'financial_change':
        return CheckCircle2
      case 'data_update':
        return Building2
      default:
        return Bell
    }
  }

  const getTimeAgo = (dateString: string) => {
    const now = new Date()
    const then = new Date(dateString)
    const diffMs = now.getTime() - then.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'Acum'
    if (diffMins < 60) return `${diffMins} min în urmă`
    if (diffHours < 24) return `${diffHours} ore în urmă`
    if (diffDays < 7) return `${diffDays} zile în urmă`
    return then.toLocaleDateString('ro-RO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const filteredAlerts = alerts.filter(alert => {
    if (filter === 'unread') return !alert.read
    if (filter === 'read') return alert.read
    return true
  })

  const stats = {
    total: alerts.length,
    unread: alerts.filter(a => !a.read).length,
    read: alerts.filter(a => a.read).length,
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
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-3xl font-bold text-[var(--text-primary)]">
            Alerte
          </h1>
          {stats.unread > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="px-4 py-2 text-sm font-medium text-[var(--brand-mughal-green)] hover:bg-[var(--brand-mughal-green)]/10 rounded-[4px] transition-colors"
            >
              Marchează toate ca citite
            </button>
          )}
        </div>
        <p className="text-[var(--text-secondary)]">
          Primește notificări când companiile din watchlist au modificări importante
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white border border-[var(--border-subtle)] rounded-[4px] p-4">
          <p className="text-sm text-[var(--text-muted)] mb-1">Total alerte</p>
          <p className="text-2xl font-bold text-[var(--text-primary)]">{stats.total}</p>
        </div>
        <div className="bg-white border border-[var(--border-subtle)] rounded-[4px] p-4">
          <p className="text-sm text-[var(--text-muted)] mb-1">Necitite</p>
          <p className="text-2xl font-bold text-[#F59E0B]">{stats.unread}</p>
        </div>
        <div className="bg-white border border-[var(--border-subtle)] rounded-[4px] p-4">
          <p className="text-sm text-[var(--text-muted)] mb-1">Citite</p>
          <p className="text-2xl font-bold text-[var(--text-primary)]">{stats.read}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border border-[var(--border-subtle)] rounded-[4px] p-4 mb-6">
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
            onClick={() => setFilter('unread')}
            className={`px-3 py-1.5 rounded-[4px] text-sm font-medium transition-colors ${
              filter === 'unread'
                ? 'bg-[var(--brand-mughal-green)] text-white'
                : 'bg-[var(--surface-bone)] text-[var(--text-secondary)] hover:bg-[var(--border-subtle)]'
            }`}
          >
            Necitite ({stats.unread})
          </button>
          <button
            onClick={() => setFilter('read')}
            className={`px-3 py-1.5 rounded-[4px] text-sm font-medium transition-colors ${
              filter === 'read'
                ? 'bg-[var(--brand-mughal-green)] text-white'
                : 'bg-[var(--surface-bone)] text-[var(--text-secondary)] hover:bg-[var(--border-subtle)]'
            }`}
          >
            Citite ({stats.read})
          </button>
        </div>
      </div>

      {/* Alerts List */}
      {filteredAlerts.length > 0 ? (
        <div className="space-y-3">
          {filteredAlerts.map((alert) => {
            const TypeIcon = getTypeIcon(alert.alert_type)
            return (
              <div
                key={alert.id}
                className={`bg-white border rounded-[4px] p-5 transition-all ${
                  alert.read
                    ? 'border-[var(--border-subtle)]'
                    : 'border-[var(--brand-mughal-green)]/30 shadow-sm'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`flex-shrink-0 w-10 h-10 rounded-[4px] border flex items-center justify-center ${getSeverityColor(alert.severity)}`}>
                    <TypeIcon className="w-5 h-5" />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-[var(--text-primary)]">{alert.company_name || 'Companie necunoscută'}</h3>
                          {!alert.read && (
                            <span className="w-2 h-2 rounded-full bg-[var(--brand-mughal-green)]"></span>
                          )}
                        </div>
                        {alert.cui && (
                          <p className="text-sm text-[var(--text-muted)] mb-1">CUI: {alert.cui}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-[var(--text-muted)] flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {getTimeAgo(alert.created_at)}
                        </span>
                      </div>
                    </div>

                    <p className="text-[var(--text-primary)] mb-2">{alert.message}</p>
                    {alert.details && (
                      <p className="text-sm text-[var(--text-secondary)]">{alert.details}</p>
                    )}

                    <div className="flex items-center gap-2 mt-4 pt-4 border-t border-[var(--border-subtle)]">
                      {!alert.read && (
                        <button
                          onClick={() => handleMarkAsRead(alert.id)}
                          className="px-3 py-1.5 text-sm font-medium text-[var(--brand-mughal-green)] hover:bg-[var(--brand-mughal-green)]/10 rounded-[4px] transition-colors"
                        >
                          Marchează ca citit
                        </button>
                      )}
                      {alert.cui && (
                        <Link
                          href={`/app/company/${alert.cui}`}
                          className="px-3 py-1.5 text-sm font-medium text-[var(--text-secondary)] hover:bg-[var(--surface-bone)] rounded-[4px] transition-colors"
                        >
                          Vezi compania
                        </Link>
                      )}
                      <button
                        onClick={() => handleDeleteAlert(alert.id)}
                        className="ml-auto p-1.5 text-[var(--text-muted)] hover:text-[#EF4444] hover:bg-[#EF4444]/10 rounded-[4px] transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="bg-white border border-[var(--border-subtle)] rounded-[4px] p-12 text-center">
          <Bell className="w-16 h-16 text-[var(--text-muted)] mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
            {filter === 'unread' ? 'Nicio alertă necitită' : filter === 'read' ? 'Nicio alertă citită' : 'Nicio alertă'}
          </h3>
          <p className="text-[var(--text-secondary)] max-w-md mx-auto mb-6">
            {filter === 'all'
              ? 'Vei primi alerte când companiile din watchlist au modificări importante.'
              : 'Încearcă să schimbi filtrul pentru a vedea alte alerte.'}
          </p>
          {filter === 'all' && (
            <Link
              href="/app/watchlist"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--brand-mughal-green)] text-white rounded-[4px] font-medium hover:bg-[var(--brand-mughal-green-2)] transition-colors"
            >
              <Bell className="w-4 h-4" />
              Vezi Watchlist
            </Link>
          )}
        </div>
      )}

      {/* Alert Settings */}
      <div className="bg-white border border-[var(--border-subtle)] rounded-[4px] p-6 mt-6">
        <h3 className="font-semibold text-[var(--text-primary)] mb-4">
          Setări alerte
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-[var(--surface-paper)] rounded-[4px]">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-[var(--brand-mughal-green)]" />
              <div>
                <p className="font-medium text-[var(--text-primary)]">Email</p>
                <p className="text-sm text-[var(--text-secondary)]">Primește alerte pe email</p>
              </div>
            </div>
            <button className="px-4 py-2 bg-[var(--brand-mughal-green)] text-white rounded-[4px] text-sm font-medium">
              Activ
            </button>
          </div>
          <div className="flex items-center justify-between p-4 bg-[var(--surface-paper)] rounded-[4px]">
            <div className="flex items-center gap-3">
              <Smartphone className="w-5 h-5 text-[var(--text-muted)]" />
              <div>
                <p className="font-medium text-[var(--text-primary)]">SMS</p>
                <p className="text-sm text-[var(--text-secondary)]">Primește alerte prin SMS</p>
              </div>
            </div>
            <button className="px-4 py-2 bg-[var(--surface-bone)] text-[var(--text-secondary)] rounded-[4px] text-sm font-medium">
              Upgrade pentru SMS
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
