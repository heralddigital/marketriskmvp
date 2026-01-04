'use client'

import { TrendingDown, TrendingUp, AlertTriangle, FileText, Calendar } from 'lucide-react'
import { getFinancialSummary } from '@/app/[locale]/app/search/financial-actions'
import { useEffect, useState } from 'react'
import type { CompanyFinancialSummary } from '@/lib/mfinante/types'

interface FinancialStatementsCardProps {
  cui: string
}

export default function FinancialStatementsCard({ cui }: FinancialStatementsCardProps) {
  const [summary, setSummary] = useState<CompanyFinancialSummary | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getFinancialSummary(cui)
        setSummary(data)
      } catch (error) {
        console.error('Error fetching financial summary:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [cui])

  const formatCurrency = (value?: number) => {
    if (value === undefined || value === null) return 'N/A'
    return new Intl.NumberFormat('ro-RO', {
      style: 'currency',
      currency: 'RON',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const formatPercent = (value?: number) => {
    if (value === undefined || value === null) return 'N/A'
    return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`
  }

  if (loading) {
    return (
      <div className="bg-white border border-[var(--border-subtle)] rounded-[4px] p-6">
        <div className="flex items-center gap-2 mb-4">
          <FileText className="w-5 h-5 text-[var(--brand-mughal-green)]" />
          <h3 className="text-lg font-semibold text-[var(--text-primary)]">
            Situații financiare
          </h3>
        </div>
        <p className="text-sm text-[var(--text-muted)]">Se încarcă...</p>
      </div>
    )
  }

  if (!summary || !summary.latestStatement) {
    return (
      <div className="bg-white border border-[var(--border-subtle)] rounded-[4px] p-6">
        <div className="flex items-center gap-2 mb-4">
          <FileText className="w-5 h-5 text-[var(--brand-mughal-green)]" />
          <h3 className="text-lg font-semibold text-[var(--text-primary)]">
            Situații financiare
          </h3>
        </div>
        <div className="p-4 bg-[#F59E0B]/10 border border-[#F59E0B]/20 rounded-[4px]">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-4 h-4 text-[#F59E0B]" />
            <span className="text-sm font-semibold text-[#F59E0B]">
              Situații financiare indisponibile
            </span>
          </div>
          <p className="text-xs text-[var(--text-secondary)]">
            Nu există situații financiare disponibile pentru această companie în baza noastră de date.
            {summary?.riskFactors.missingStatements && (
              <span className="block mt-1">
                <strong>Notă:</strong> Lipsesc situațiile financiare pentru ultimii 2 ani.
              </span>
            )}
          </p>
        </div>
      </div>
    )
  }

  const latest = summary.latestStatement

  return (
    <div className="bg-white border border-[var(--border-subtle)] rounded-[4px] p-6 space-y-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-[var(--brand-mughal-green)]" />
          <h3 className="text-lg font-semibold text-[var(--text-primary)]">
            Situații financiare
          </h3>
        </div>
        <div className="text-xs text-[var(--text-muted)]">
          Anul {latest.year}
        </div>
      </div>

      {/* Risk Indicators */}
      {(summary.riskFactors.missingStatements ||
        summary.riskFactors.delayedFiling ||
        summary.riskFactors.negativeEquity ||
        summary.riskFactors.revenueDrop50) && (
        <div className="space-y-2">
          {summary.riskFactors.missingStatements && (
            <div className="p-3 bg-[#EF4444]/10 border border-[#EF4444]/20 rounded-[4px]">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-[#EF4444]" />
                <span className="text-xs font-semibold text-[#EF4444]">
                  Lipsesc situațiile financiare (ultimii 2 ani)
                </span>
              </div>
            </div>
          )}
          {summary.riskFactors.delayedFiling && (
            <div className="p-3 bg-[#F59E0B]/10 border border-[#F59E0B]/20 rounded-[4px]">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#F59E0B]" />
                <span className="text-xs font-semibold text-[#F59E0B]">
                  Depunere întârziată situații financiare
                </span>
              </div>
            </div>
          )}
          {summary.riskFactors.negativeEquity && (
            <div className="p-3 bg-[#EF4444]/10 border border-[#EF4444]/20 rounded-[4px]">
              <div className="flex items-center gap-2">
                <TrendingDown className="w-4 h-4 text-[#EF4444]" />
                <span className="text-xs font-semibold text-[#EF4444]">
                  Capital propriu negativ
                </span>
              </div>
            </div>
          )}
          {summary.riskFactors.revenueDrop50 && (
            <div className="p-3 bg-[#F59E0B]/10 border border-[#F59E0B]/20 rounded-[4px]">
              <div className="flex items-center gap-2">
                <TrendingDown className="w-4 h-4 text-[#F59E0B]" />
                <span className="text-xs font-semibold text-[#F59E0B]">
                  Scădere cifră de afaceri &gt;50% (an/an)
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Balance Sheet Summary */}
      <div>
        <h4 className="text-sm font-semibold text-[var(--text-primary)] mb-3">
          Bilanț (rezumat)
        </h4>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-[var(--surface-paper)] rounded-[4px] border border-[var(--border-subtle)]">
            <p className="text-xs text-[var(--text-muted)] mb-1">Total active</p>
            <p className="text-sm font-semibold text-[var(--text-primary)]">
              {formatCurrency(latest.totalAssets)}
            </p>
          </div>
          <div className="p-4 bg-[var(--surface-paper)] rounded-[4px] border border-[var(--border-subtle)]">
            <p className="text-xs text-[var(--text-muted)] mb-1">Capital propriu</p>
            <p className={`text-sm font-semibold ${latest.equity && latest.equity < 0 ? 'text-[#EF4444]' : 'text-[var(--text-primary)]'}`}>
              {formatCurrency(latest.equity)}
            </p>
          </div>
          <div className="p-4 bg-[var(--surface-paper)] rounded-[4px] border border-[var(--border-subtle)]">
            <p className="text-xs text-[var(--text-muted)] mb-1">Total datorii</p>
            <p className="text-sm font-semibold text-[var(--text-primary)]">
              {formatCurrency(latest.totalLiabilities)}
            </p>
          </div>
          <div className="p-4 bg-[var(--surface-paper)] rounded-[4px] border border-[var(--border-subtle)]">
            <p className="text-xs text-[var(--text-muted)] mb-1">Capital social</p>
            <p className="text-sm font-semibold text-[var(--text-primary)]">
              {formatCurrency(latest.shareCapital)}
            </p>
          </div>
        </div>
      </div>

      {/* Profit & Loss Summary */}
      {(latest.revenue !== undefined || latest.netProfit !== undefined || latest.netLoss !== undefined) && (
        <div>
          <h4 className="text-sm font-semibold text-[var(--text-primary)] mb-3">
            Cont de profit și pierdere
          </h4>
          <div className="grid grid-cols-2 gap-4">
            {latest.revenue !== undefined && (
              <div className="p-4 bg-[var(--surface-paper)] rounded-[4px] border border-[var(--border-subtle)]">
                <p className="text-xs text-[var(--text-muted)] mb-1">Cifră de afaceri</p>
                <p className="text-sm font-semibold text-[var(--text-primary)]">
                  {formatCurrency(latest.revenue)}
                </p>
                {summary.revenueTrend && (
                  <p className={`text-xs mt-1 flex items-center gap-1 ${
                    summary.revenueTrend.changePercent >= 0 ? 'text-[#22C55E]' : 'text-[#EF4444]'
                  }`}>
                    {summary.revenueTrend.changePercent >= 0 ? (
                      <TrendingUp className="w-3 h-3" />
                    ) : (
                      <TrendingDown className="w-3 h-3" />
                    )}
                    {formatPercent(summary.revenueTrend.changePercent)}
                  </p>
                )}
              </div>
            )}
            {latest.netProfit !== undefined && (
              <div className="p-4 bg-[var(--surface-paper)] rounded-[4px] border border-[var(--border-subtle)]">
                <p className="text-xs text-[var(--text-muted)] mb-1">Profit net</p>
                <p className="text-sm font-semibold text-[#22C55E]">
                  {formatCurrency(latest.netProfit)}
                </p>
              </div>
            )}
            {latest.netLoss !== undefined && (
              <div className="p-4 bg-[var(--surface-paper)] rounded-[4px] border border-[var(--border-subtle)]">
                <p className="text-xs text-[var(--text-muted)] mb-1">Pierdere netă</p>
                <p className="text-sm font-semibold text-[#EF4444]">
                  {formatCurrency(latest.netLoss)}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Financial Ratios */}
      {(latest.currentRatio !== undefined ||
        latest.debtToEquity !== undefined ||
        latest.returnOnAssets !== undefined ||
        latest.returnOnEquity !== undefined) && (
        <div>
          <h4 className="text-sm font-semibold text-[var(--text-primary)] mb-3">
            Indicatori financiari
          </h4>
          <div className="grid grid-cols-2 gap-4">
            {latest.currentRatio !== undefined && (
              <div className="p-4 bg-[var(--surface-paper)] rounded-[4px] border border-[var(--border-subtle)]">
                <p className="text-xs text-[var(--text-muted)] mb-1">Rata lichidității</p>
                <p className="text-sm font-semibold text-[var(--text-primary)]">
                  {latest.currentRatio.toFixed(2)}
                </p>
              </div>
            )}
            {latest.debtToEquity !== undefined && (
              <div className="p-4 bg-[var(--surface-paper)] rounded-[4px] border border-[var(--border-subtle)]">
                <p className="text-xs text-[var(--text-muted)] mb-1">Datorii / Capital propriu</p>
                <p className="text-sm font-semibold text-[var(--text-primary)]">
                  {latest.debtToEquity.toFixed(2)}
                </p>
              </div>
            )}
            {latest.returnOnAssets !== undefined && (
              <div className="p-4 bg-[var(--surface-paper)] rounded-[4px] border border-[var(--border-subtle)]">
                <p className="text-xs text-[var(--text-muted)] mb-1">Rentabilitatea activelor</p>
                <p className="text-sm font-semibold text-[var(--text-primary)]">
                  {latest.returnOnAssets.toFixed(2)}%
                </p>
              </div>
            )}
            {latest.returnOnEquity !== undefined && (
              <div className="p-4 bg-[var(--surface-paper)] rounded-[4px] border border-[var(--border-subtle)]">
                <p className="text-xs text-[var(--text-muted)] mb-1">Rentabilitatea capitalului propriu</p>
                <p className="text-sm font-semibold text-[var(--text-primary)]">
                  {latest.returnOnEquity.toFixed(2)}%
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Historical Statements Count */}
      {summary.statements.length > 1 && (
        <div className="pt-4 border-t border-[var(--border-subtle)]">
          <p className="text-xs text-[var(--text-muted)]">
            Disponibile {summary.statements.length} situații financiare pentru această companie
          </p>
        </div>
      )}
    </div>
  )
}

