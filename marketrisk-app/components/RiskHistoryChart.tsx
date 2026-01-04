'use client'

import { useEffect, useState } from 'react'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { getRiskHistory } from '@/app/[locale]/app/search/actions'

interface RiskHistoryProps {
  cui: string
}

export default function RiskHistoryChart({ cui }: RiskHistoryProps) {
  const [history, setHistory] = useState<any[]>([])
  const [trend, setTrend] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadHistory() {
      setLoading(true)
      const result = await getRiskHistory(cui)
      if (result.success && result.data) {
        setHistory(result.data)
        setTrend(result.trend)
      }
      setLoading(false)
    }
    loadHistory()
  }, [cui])

  if (loading) {
    return (
      <div className="bg-white border border-[var(--border-subtle)] rounded-[4px] p-6">
        <p className="text-[var(--text-muted)]">Se încarcă istoric...</p>
      </div>
    )
  }

  if (!history || history.length === 0) {
    return (
      <div className="bg-white border border-[var(--border-subtle)] rounded-[4px] p-6">
        <h3 className="font-semibold text-[var(--text-primary)] mb-2">Istoric Scor Risc</h3>
        <p className="text-[var(--text-muted)]">
          Aceasta este prima evaluare a companiei. Istoricul se va construi în timp.
        </p>
      </div>
    )
  }

  const getTrendIcon = () => {
    if (!trend) return null

    switch (trend.trend) {
      case 'IMPROVING':
        return <TrendingDown className="w-5 h-5 text-[#22C55E]" />
      case 'DECLINING':
        return <TrendingUp className="w-5 h-5 text-[#EF4444]" />
      case 'STABLE':
        return <Minus className="w-5 h-5 text-[#F59E0B]" />
      default:
        return null
    }
  }

  const getTrendColor = () => {
    if (!trend) return ''

    switch (trend.trend) {
      case 'IMPROVING':
        return 'text-[#22C55E] bg-[#22C55E]/10'
      case 'DECLINING':
        return 'text-[#EF4444] bg-[#EF4444]/10'
      case 'STABLE':
        return 'text-[#F59E0B] bg-[#F59E0B]/10'
      default:
        return ''
    }
  }

  const getTrendText = () => {
    if (!trend) return ''

    switch (trend.trend) {
      case 'IMPROVING':
        return 'În îmbunătățire'
      case 'DECLINING':
        return 'În deteriorare'
      case 'STABLE':
        return 'Stabil'
      case 'NEW':
        return 'Nou evaluat'
      default:
        return ''
    }
  }

  // Get min/max for scaling
  const scores = history.map(h => h.risk_score)
  const minScore = Math.min(...scores)
  const maxScore = Math.max(...scores)
  const scoreRange = maxScore - minScore || 1

  return (
    <div className="bg-white border border-[var(--border-subtle)] rounded-[4px] p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-semibold text-[var(--text-primary)]">Istoric Scor Risc</h3>
        {trend && trend.trend !== 'NO_DATA' && trend.trend !== 'NEW' && (
          <div className={`flex items-center gap-2 px-3 py-1 rounded-[4px] ${getTrendColor()}`}>
            {getTrendIcon()}
            <span className="text-sm font-semibold">{getTrendText()}</span>
            {trend.score_change !== 0 && (
              <span className="text-sm">
                ({trend.score_change > 0 ? '+' : ''}{trend.score_change})
              </span>
            )}
          </div>
        )}
      </div>

      {/* Simple line chart visualization */}
      <div className="mb-6">
        <div className="h-32 flex items-end gap-1">
          {history.slice(0, 30).reverse().map((point, index) => {
            const height = ((point.risk_score - minScore) / scoreRange) * 100
            const color = point.risk_level === 'GREEN' ? '#22C55E' :
                         point.risk_level === 'YELLOW' ? '#F59E0B' : '#EF4444'

            return (
              <div
                key={index}
                className="flex-1 group relative"
                style={{
                  height: `${Math.max(height, 10)}%`,
                  backgroundColor: color,
                  opacity: 0.7,
                  transition: 'opacity 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.opacity = '1'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.opacity = '0.7'
                }}
                title={`${point.risk_score} - ${new Date(point.calculated_at).toLocaleDateString('ro-RO')}`}
              />
            )
          })}
        </div>
        <div className="flex justify-between text-xs text-[var(--text-muted)] mt-2">
          <span>{history.length > 0 ? new Date(history[history.length - 1].calculated_at).toLocaleDateString('ro-RO') : ''}</span>
          <span>{history.length > 0 ? new Date(history[0].calculated_at).toLocaleDateString('ro-RO') : ''}</span>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-3 gap-4 border-t border-[var(--border-subtle)] pt-4">
        <div>
          <p className="text-xs text-[var(--text-muted)] mb-1">Scor Curent</p>
          <p className="text-lg font-bold text-[var(--text-primary)]">
            {trend?.current_score || history[0]?.risk_score || '-'}
          </p>
        </div>
        <div>
          <p className="text-xs text-[var(--text-muted)] mb-1">Scor Anterior</p>
          <p className="text-lg font-bold text-[var(--text-primary)]">
            {trend?.previous_score || '-'}
          </p>
        </div>
        <div>
          <p className="text-xs text-[var(--text-muted)] mb-1">Evaluări</p>
          <p className="text-lg font-bold text-[var(--text-primary)]">
            {history.length}
          </p>
        </div>
      </div>

      {/* Recent history list */}
      <div className="mt-6 border-t border-[var(--border-subtle)] pt-4">
        <p className="text-sm font-semibold text-[var(--text-primary)] mb-3">Ultimele Evaluări</p>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {history.slice(0, 10).map((point, index) => (
            <div key={index} className="flex items-center justify-between text-sm">
              <span className="text-[var(--text-secondary)]">
                {new Date(point.calculated_at).toLocaleDateString('ro-RO', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric'
                })}
              </span>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded-[4px] text-xs font-semibold ${
                  point.risk_level === 'GREEN' ? 'text-[#22C55E] bg-[#22C55E]/10' :
                  point.risk_level === 'YELLOW' ? 'text-[#F59E0B] bg-[#F59E0B]/10' :
                  'text-[#EF4444] bg-[#EF4444]/10'
                }`}>
                  {point.risk_level}
                </span>
                <span className="font-semibold text-[var(--text-primary)] w-12 text-right">
                  {point.risk_score}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
