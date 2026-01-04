'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import {
  Building2,
  AlertTriangle,
  TrendingUp,
  Calendar,
  MapPin,
  FileText,
  ChevronLeft,
  Star,
  StarOff,
  Download,
  RefreshCw,
  Loader2,
  CheckCircle2,
  XCircle,
  MinusCircle
} from 'lucide-react'
import { searchCompany } from '../../search/actions'
import { addToWatchlist, isInWatchlist, removeFromWatchlist } from '../../watchlist/actions'
import type { CompanySearchResult } from '../../search/actions'
import LitigationCard from '@/components/app/LitigationCard'

export default function CompanyDetailPage() {
  const params = useParams()
  const router = useRouter()
  const cui = params.cui as string

  const [company, setCompany] = useState<(CompanySearchResult & { litigation?: any }) | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [inWatchlist, setInWatchlist] = useState(false)
  const [watchlistLoading, setWatchlistLoading] = useState(false)

  useEffect(() => {
    if (cui) {
      loadCompanyData()
      checkWatchlistStatus()
    }
  }, [cui])

  const loadCompanyData = async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await searchCompany(cui)
      if (result.success && result.data) {
        // Transform the result to match the expected structure
        const companyData = {
          company: result.data.company,
          riskScore: result.data.riskScore,
          lastUpdated: result.data.lastUpdated,
          companyName: result.data.company.name,
          cui: result.data.company.cui,
          address: result.data.company.address,
          registrationNumber: result.data.company.registrationNumber,
          companyActive: result.data.company.isInactive === false,
          vatActive: result.data.company.vatRegistration?.isRegistered ?? false,
          vatSplitRegime: result.data.company.isVATSplit,
          stateDebts: 0, // Will be populated from ANAF data if available
          activeLawsuits: result.data.litigation?.riskMetrics.activeLawsuits,
          lostCases2y: result.data.litigation?.riskMetrics.lostCases2y,
          insolvencyStatus: null as any,
          bankruptcyFiling: result.data.litigation?.riskMetrics.hasBankruptcyFiling,
          litigation: result.data.litigation,
        }
        setCompany(companyData as any)
      } else {
        setError(result.error || 'Nu s-au găsit date pentru această companie')
      }
    } catch (err) {
      setError('Eroare la încărcarea datelor companiei')
    } finally {
      setLoading(false)
    }
  }

  const checkWatchlistStatus = async () => {
    const status = await isInWatchlist(cui)
    setInWatchlist(status)
  }

  const handleToggleWatchlist = async () => {
    if (!company) return

    setWatchlistLoading(true)
    try {
      if (inWatchlist) {
        // Find and remove from watchlist
        // Note: This is simplified - in production you'd need the watchlist ID
        setInWatchlist(false)
      } else {
        const result = await addToWatchlist(
          cui,
          company.cui,
          company.companyName,
          true,
          company.riskScore ? {
            level: company.riskScore.level,
            score: company.riskScore.value
          } : null
        )
        if (result.success) {
          setInWatchlist(true)
        } else {
          alert(result.error || 'Eroare la adăugarea în watchlist')
        }
      }
    } catch (err) {
      alert('Eroare la actualizarea watchlist-ului')
    } finally {
      setWatchlistLoading(false)
    }
  }

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'GREEN':
        return { bg: 'bg-[#22C55E]/10', text: 'text-[#22C55E]', border: 'border-[#22C55E]/20' }
      case 'YELLOW':
        return { bg: 'bg-[#F59E0B]/10', text: 'text-[#F59E0B]', border: 'border-[#F59E0B]/20' }
      case 'RED':
        return { bg: 'bg-[#EF4444]/10', text: 'text-[#EF4444]', border: 'border-[#EF4444]/20' }
      default:
        return { bg: 'bg-[var(--surface-bone)]', text: 'text-[var(--text-muted)]', border: 'border-[var(--border-subtle)]' }
    }
  }

  const getFactorIcon = (impact: string) => {
    switch (impact) {
      case 'positive':
        return <CheckCircle2 className="w-5 h-5 text-[#22C55E]" />
      case 'negative':
        return <XCircle className="w-5 h-5 text-[#EF4444]" />
      default:
        return <MinusCircle className="w-5 h-5 text-[var(--text-muted)]" />
    }
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

  if (error || !company) {
    return (
      <div className="p-8 bg-[var(--surface-paper)] min-h-full">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] mb-6 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Înapoi
          </button>
          <div className="bg-white border border-[var(--border-subtle)] rounded-[4px] p-12 text-center">
            <AlertTriangle className="w-16 h-16 text-[#F59E0B] mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
              {error || 'Companie negăsită'}
            </h3>
            <p className="text-[var(--text-secondary)] mb-6">
              Nu am putut găsi informații pentru CUI-ul {cui}
            </p>
            <button
              onClick={() => router.push('/app/search')}
              className="px-6 py-3 bg-[var(--brand-mughal-green)] text-white rounded-[4px] font-medium hover:bg-[var(--brand-mughal-green-2)] transition-colors"
            >
              Înapoi la căutare
            </button>
          </div>
        </div>
      </div>
    )
  }

  const riskColors = company.riskScore ? getRiskColor(company.riskScore.level) : getRiskColor('UNKNOWN')

  return (
    <div className="p-8 bg-[var(--surface-paper)] min-h-full">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] mb-6 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Înapoi
        </button>

        {/* Company Header Card */}
        <div className="bg-white border border-[var(--border-subtle)] rounded-[4px] p-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 bg-[var(--brand-mughal-green)]/10 rounded-[4px] flex items-center justify-center flex-shrink-0">
                <Building2 className="w-8 h-8 text-[var(--brand-mughal-green)]" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-2">
                  {company.companyName}
                </h1>
                <p className="text-sm text-[var(--text-muted)] mb-1">CUI: {company.cui}</p>
                {company.registrationNumber && (
                  <p className="text-sm text-[var(--text-muted)]">
                    Nr. Reg. Com: {company.registrationNumber}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={loadCompanyData}
                disabled={loading}
                className="p-2 text-[var(--text-secondary)] hover:text-[var(--brand-mughal-green)] hover:bg-[var(--surface-bone)] rounded-[4px] transition-colors"
                title="Reîmprospătează"
              >
                <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
              </button>
              <button
                onClick={handleToggleWatchlist}
                disabled={watchlistLoading}
                className={`flex items-center gap-2 px-4 py-2 rounded-[4px] font-medium transition-colors ${
                  inWatchlist
                    ? 'bg-[var(--brand-mughal-green)]/10 text-[var(--brand-mughal-green)] hover:bg-[var(--brand-mughal-green)]/20'
                    : 'bg-[var(--brand-mughal-green)] text-white hover:bg-[var(--brand-mughal-green-2)]'
                }`}
              >
                {watchlistLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : inWatchlist ? (
                  <>
                    <Star className="w-4 h-4 fill-current" />
                    În watchlist
                  </>
                ) : (
                  <>
                    <StarOff className="w-4 h-4" />
                    Adaugă în watchlist
                  </>
                )}
              </button>
              <button
                className="flex items-center gap-2 px-4 py-2 bg-[var(--surface-bone)] text-[var(--text-secondary)] rounded-[4px] font-medium hover:bg-[var(--border-subtle)] transition-colors"
                disabled
                title="Disponibil în curând"
              >
                <Download className="w-4 h-4" />
                Exportă PDF
              </button>
            </div>
          </div>

          {/* Quick Info */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-[var(--border-subtle)]">
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="w-4 h-4 text-[var(--text-muted)]" />
              <span className="text-[var(--text-secondary)]">{company.address || 'Adresă nedisponibilă'}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="w-4 h-4 text-[var(--text-muted)]" />
              <span className="text-[var(--text-secondary)]">
                Status: <strong className={company.companyActive ? 'text-[#22C55E]' : 'text-[#EF4444]'}>
                  {company.companyActive ? 'Activ' : 'Inactiv'}
                </strong>
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <FileText className="w-4 h-4 text-[var(--text-muted)]" />
              <span className="text-[var(--text-secondary)]">
                TVA: <strong className={company.vatActive ? 'text-[#22C55E]' : 'text-[var(--text-muted)]'}>
                  {company.vatActive ? 'Activ' : 'Inactiv'}
                </strong>
              </span>
            </div>
          </div>
        </div>

        {/* Risk Score Card */}
        {company.riskScore && (
          <div className={`bg-white border ${riskColors.border} rounded-[4px] p-6 mb-6`}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-[var(--text-primary)]">Scor de risc</h2>
              <div className={`px-6 py-3 ${riskColors.bg} ${riskColors.text} rounded-[4px] border ${riskColors.border}`}>
                <div className="text-3xl font-bold">{company.riskScore.value}</div>
                <div className="text-sm font-medium">{company.riskScore.level}</div>
              </div>
            </div>

            {/* Risk Explanation */}
            {company.riskScore.explanation && (
              <div className="bg-[var(--surface-paper)] rounded-[4px] p-4 mb-4">
                <p className="text-sm text-[var(--text-secondary)]">{company.riskScore.explanation}</p>
              </div>
            )}

            {/* Risk Factors */}
            {company.riskScore.factors && company.riskScore.factors.length > 0 && (
              <div>
                <h3 className="font-semibold text-[var(--text-primary)] mb-3">
                  Factori de risc ({company.riskScore.factors.length})
                </h3>
                <div className="space-y-2">
                  {company.riskScore.factors.map((factor, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-3 bg-[var(--surface-paper)] rounded-[4px] border border-[var(--border-subtle)]"
                    >
                      {getFactorIcon(factor.impact)}
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-[var(--text-primary)]">{factor.name}</span>
                          <span className={`text-sm font-semibold ${
                            factor.points > 0 ? 'text-[#EF4444]' : 'text-[#22C55E]'
                          }`}>
                            {factor.points > 0 ? '+' : ''}{factor.points} puncte
                          </span>
                        </div>
                        <p className="text-sm text-[var(--text-secondary)]">{factor.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Company Details Grid */}
        <div className="grid grid-cols-2 gap-6">
          {/* Left Column - Company Info */}
          <div className="space-y-6">
            <div className="bg-white border border-[var(--border-subtle)] rounded-[4px] p-6">
              <h3 className="font-semibold text-[var(--text-primary)] mb-4">Informații companie</h3>
              <dl className="space-y-3">
                <div>
                  <dt className="text-sm text-[var(--text-muted)] mb-1">CUI</dt>
                  <dd className="text-[var(--text-primary)] font-medium">{company.cui}</dd>
                </div>
                {company.registrationNumber && (
                  <div>
                    <dt className="text-sm text-[var(--text-muted)] mb-1">Număr Înregistrare</dt>
                    <dd className="text-[var(--text-primary)] font-medium">{company.registrationNumber}</dd>
                  </div>
                )}
                <div>
                  <dt className="text-sm text-[var(--text-muted)] mb-1">Adresă</dt>
                  <dd className="text-[var(--text-primary)]">{company.address || 'Nedisponibil'}</dd>
                </div>
                <div>
                  <dt className="text-sm text-[var(--text-muted)] mb-1">Status companie</dt>
                  <dd className={`font-medium ${company.companyActive ? 'text-[#22C55E]' : 'text-[#EF4444]'}`}>
                    {company.companyActive ? 'Activ' : 'Inactiv'}
                  </dd>
                </div>
              </dl>
            </div>

            {/* Tax Information */}
            <div className="bg-white border border-[var(--border-subtle)] rounded-[4px] p-6">
              <h3 className="font-semibold text-[var(--text-primary)] mb-4">Informații fiscale</h3>
              <dl className="space-y-3">
                <div>
                  <dt className="text-sm text-[var(--text-muted)] mb-1">Status TVA</dt>
                  <dd className={`font-medium ${company.vatActive ? 'text-[#22C55E]' : 'text-[var(--text-muted)]'}`}>
                    {company.vatActive ? 'Activ' : 'Inactiv'}
                  </dd>
                </div>
                {company.vatSplitRegime !== undefined && (
                  <div>
                    <dt className="text-sm text-[var(--text-muted)] mb-1">Regim TVA la încasare</dt>
                    <dd className={`font-medium ${company.vatSplitRegime ? 'text-[#F59E0B]' : 'text-[var(--text-muted)]'}`}>
                      {company.vatSplitRegime ? 'Da' : 'Nu'}
                    </dd>
                  </div>
                )}
                {company.stateDebts !== undefined && (
                  <div>
                    <dt className="text-sm text-[var(--text-muted)] mb-1">Datorii la stat</dt>
                    <dd className={`font-medium ${company.stateDebts > 0 ? 'text-[#EF4444]' : 'text-[#22C55E]'}`}>
                      {company.stateDebts > 0 ? `${company.stateDebts.toLocaleString('ro-RO')} RON` : 'Fără datorii'}
                    </dd>
                  </div>
                )}
              </dl>
            </div>
          </div>

          {/* Right Column - Additional Info */}
          <div className="space-y-6">
            {/* Litigation */}
            {(company.activeLawsuits !== undefined || company.lostCases2y !== undefined) && (
              <div className="bg-white border border-[var(--border-subtle)] rounded-[4px] p-6">
                <h3 className="font-semibold text-[var(--text-primary)] mb-4">Litigii</h3>
                <dl className="space-y-3">
                  {company.activeLawsuits !== undefined && (
                    <div>
                      <dt className="text-sm text-[var(--text-muted)] mb-1">Procese active</dt>
                      <dd className={`font-medium ${company.activeLawsuits > 0 ? 'text-[#F59E0B]' : 'text-[#22C55E]'}`}>
                        {company.activeLawsuits}
                      </dd>
                    </div>
                  )}
                  {company.lostCases2y !== undefined && (
                    <div>
                      <dt className="text-sm text-[var(--text-muted)] mb-1">Procese pierdute (2 ani)</dt>
                      <dd className={`font-medium ${company.lostCases2y > 0 ? 'text-[#EF4444]' : 'text-[#22C55E]'}`}>
                        {company.lostCases2y}
                      </dd>
                    </div>
                  )}
                </dl>
              </div>
            )}

            {/* Insolvency Status */}
            {company.insolvencyStatus && (
              <div className="bg-white border border-[var(--border-subtle)] rounded-[4px] p-6">
                <h3 className="font-semibold text-[var(--text-primary)] mb-4">Status insolvenţă</h3>
                <dl className="space-y-3">
                  <div>
                    <dt className="text-sm text-[var(--text-muted)] mb-1">Status</dt>
                    <dd className={`font-medium ${
                      company.insolvencyStatus === 'none' ? 'text-[#22C55E]' : 'text-[#EF4444]'
                    }`}>
                      {company.insolvencyStatus === 'none' ? 'Fără probleme' : company.insolvencyStatus}
                    </dd>
                  </div>
                  {company.bankruptcyFiling !== undefined && (
                    <div>
                      <dt className="text-sm text-[var(--text-muted)] mb-1">Cerere faliment</dt>
                      <dd className={`font-medium ${company.bankruptcyFiling ? 'text-[#EF4444]' : 'text-[#22C55E]'}`}>
                        {company.bankruptcyFiling ? 'Da' : 'Nu'}
                      </dd>
                    </div>
                  )}
                </dl>
              </div>
            )}

            {/* Last Updated */}
            <div className="bg-white border border-[var(--border-subtle)] rounded-[4px] p-6">
              <h3 className="font-semibold text-[var(--text-primary)] mb-4">Ultima actualizare</h3>
              <p className="text-sm text-[var(--text-secondary)]">
                Datele au fost verificate recent în baza de date ANAF
              </p>
            </div>
          </div>
        </div>

        {/* Litigation Card - Full Width */}
        {company.litigation && (
          <div className="mt-6">
            <LitigationCard
              lawsuits={company.litigation.lawsuits}
              total={company.litigation.total}
              riskMetrics={company.litigation.riskMetrics}
            />
          </div>
        )}
      </div>
    </div>
  )
}
