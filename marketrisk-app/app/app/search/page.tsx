'use client'

import { useState, useEffect } from 'react'
import { Search, Building2, AlertCircle, CheckCircle2, FileText, Loader2 } from 'lucide-react'
import { searchCompany, getRemainingSearches } from './actions'
import type { CompanySearchResult } from '@/lib/anaf/types'

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResult, setSearchResult] = useState<CompanySearchResult | null>(null)
  const [isSearching, setIsSearching] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [remaining, setRemaining] = useState({ used: 0, limit: 0, remaining: 0 })

  // Load remaining searches on mount
  useEffect(() => {
    loadRemainingSearches()
  }, [])

  const loadRemainingSearches = async () => {
    const data = await getRemainingSearches()
    setRemaining(data)
  }

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchQuery.trim()) return

    setIsSearching(true)
    setError(null)
    setSearchResult(null)

    try {
      const result = await searchCompany(searchQuery.trim())

      if (result.success && result.data) {
        setSearchResult(result.data)
        // Reload remaining searches
        await loadRemainingSearches()
      } else {
        setError(result.error || 'Eroare la căutare')
      }
    } catch (err) {
      setError('Eroare de conexiune. Te rugăm să încerci din nou.')
    } finally {
      setIsSearching(false)
    }
  }

  const getRiskColor = (level: string) => {
    switch (level) {
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

  const getRiskIcon = (level: string) => {
    switch (level) {
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

  return (
    <div className="p-8 bg-[var(--surface-paper)] min-h-full">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2">
          Căutare companie
        </h1>
        <p className="text-[var(--text-secondary)]">
          Introduceți CUI-ul companiei pentru a vedea scorul de risc și datele actualizate din ANAF
        </p>
      </div>

      {/* Search Form */}
      <div className="bg-white border border-[var(--border-subtle)] rounded-[4px] p-6 mb-6">
        <form onSubmit={handleSearch}>
          <div className="flex gap-4">
            <div className="flex-1">
              <label htmlFor="search" className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                CUI companie
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]" />
                <input
                  id="search"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Ex: 12345678 sau RO12345678"
                  className="w-full pl-10 pr-4 py-3 border border-[var(--border-subtle)] rounded-[4px] focus:outline-none focus:ring-2 focus:ring-[var(--brand-mughal-green)] focus:border-transparent"
                  disabled={isSearching}
                />
              </div>
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                disabled={isSearching || !searchQuery.trim()}
                className="px-6 py-3 bg-[var(--brand-mughal-green)] text-white rounded-[4px] font-medium hover:bg-[var(--brand-mughal-green-2)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap flex items-center gap-2"
              >
                {isSearching ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Se caută...
                  </>
                ) : (
                  'Caută firmă'
                )}
              </button>
            </div>
          </div>
        </form>

        {/* Search info */}
        <div className="mt-4 flex items-center gap-2 text-sm text-[var(--text-muted)]">
          <AlertCircle className="w-4 h-4" />
          <span>
            Căutările consumă din limita planului tău. Îți mai rămân{' '}
            <strong className="text-[var(--text-primary)]">{remaining.remaining}</strong> căutări în această lună.
          </span>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-[#EF4444]/10 border border-[#EF4444]/20 rounded-[4px] p-4 mb-6 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-[#EF4444] flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-[var(--text-primary)] mb-1">Eroare</p>
            <p className="text-sm text-[var(--text-secondary)]">{error}</p>
          </div>
        </div>
      )}

      {/* Search Result */}
      {searchResult && (
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-[var(--text-primary)]">
              Rezultat căutare
            </h2>
          </div>

          {/* Company Card */}
          <div className="bg-white border border-[var(--border-subtle)] rounded-[4px] p-6 hover:shadow-sm transition-all">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <Building2 className="w-5 h-5 text-[var(--brand-mughal-green)]" />
                  <h3 className="text-lg font-semibold text-[var(--text-primary)]">
                    {searchResult.company.name}
                  </h3>
                </div>
                <p className="text-sm text-[var(--text-secondary)] mb-2">
                  CUI: <span className="font-mono font-medium text-[var(--text-primary)]">{searchResult.company.cui}</span>
                </p>
                <p className="text-sm text-[var(--text-secondary)]">
                  Nr. Reg. Com: <span className="font-medium text-[var(--text-primary)]">{searchResult.company.registrationNumber}</span>
                </p>
              </div>
              <div className="flex flex-col items-end gap-2">
                {(() => {
                  const RiskIcon = getRiskIcon(searchResult.riskScore.level)
                  return (
                    <span className={`px-3 py-1.5 rounded-[4px] text-sm font-semibold flex items-center gap-1.5 ${getRiskColor(searchResult.riskScore.level)}`}>
                      <RiskIcon className="w-4 h-4" />
                      {searchResult.riskScore.level} ({searchResult.riskScore.value}/100)
                    </span>
                  )
                })()}
                <span className="text-xs text-[var(--text-muted)]">
                  Actualizat: {new Date(searchResult.lastUpdated).toLocaleDateString('ro-RO')}
                </span>
              </div>
            </div>

            {/* Company Details */}
            <div className="grid grid-cols-4 gap-4 py-4 border-t border-[var(--border-subtle)]">
              <div>
                <p className="text-xs text-[var(--text-muted)] mb-1">Status</p>
                <p className="text-sm font-medium text-[var(--text-primary)]">{searchResult.company.status}</p>
              </div>
              <div>
                <p className="text-xs text-[var(--text-muted)] mb-1">Înregistrare</p>
                <p className="text-sm font-medium text-[var(--text-primary)]">
                  {new Date(searchResult.company.registrationDate).toLocaleDateString('ro-RO')}
                </p>
              </div>
              <div>
                <p className="text-xs text-[var(--text-muted)] mb-1">Formă juridică</p>
                <p className="text-sm font-medium text-[var(--text-primary)]">{searchResult.company.legalForm}</p>
              </div>
              <div>
                <p className="text-xs text-[var(--text-muted)] mb-1">Cod CAEN</p>
                <p className="text-sm font-medium text-[var(--text-primary)]">{searchResult.company.caenCode}</p>
              </div>
            </div>

            {/* Additional Details */}
            <div className="pt-4 border-t border-[var(--border-subtle)]">
              <p className="text-xs text-[var(--text-muted)] mb-1">Adresă</p>
              <p className="text-sm text-[var(--text-primary)] mb-3">{searchResult.company.address}</p>

              {searchResult.company.phone && (
                <p className="text-sm text-[var(--text-secondary)]">
                  Telefon: <span className="font-medium">{searchResult.company.phone}</span>
                </p>
              )}
            </div>

            {/* Risk Factors Summary */}
            <div className="pt-4 border-t border-[var(--border-subtle)] mt-4">
              <h4 className="text-sm font-semibold text-[var(--text-primary)] mb-3">
                Top factori de risc analizați:
              </h4>
              <div className="grid grid-cols-2 gap-3">
                {searchResult.riskScore.factors
                  .sort((a, b) => b.weight - a.weight)
                  .slice(0, 6)
                  .map((factor, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs">
                      <div className={`w-2 h-2 rounded-full mt-1 flex-shrink-0 ${
                        factor.impact === 'positive' ? 'bg-[#22C55E]' :
                        factor.impact === 'negative' ? 'bg-[#EF4444]' :
                        'bg-[#F59E0B]'
                      }`} />
                      <div>
                        <p className="font-medium text-[var(--text-primary)]">{factor.name}</p>
                        <p className="text-[var(--text-muted)]">{factor.description}</p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4 border-t border-[var(--border-subtle)] mt-4">
              <button className="flex-1 px-4 py-2 bg-[var(--brand-mughal-green)] text-white rounded-[4px] text-sm font-medium hover:bg-[var(--brand-mughal-green-2)] transition-colors flex items-center justify-center gap-2">
                <FileText className="w-4 h-4" />
                Raport complet PDF
              </button>
              <button className="px-4 py-2 bg-white border border-[var(--border-subtle)] text-[var(--text-primary)] rounded-[4px] text-sm font-medium hover:bg-[var(--surface-bone)] transition-colors">
                Adaugă în Watchlist
              </button>
            </div>
          </div>

          {/* Upgrade Prompt */}
          <div className="bg-gradient-to-r from-[var(--brand-mughal-green)] to-[var(--brand-mughal-green-2)] text-white rounded-[4px] p-6 mt-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold mb-2">
                  Vrei să vezi mai multe detalii?
                </h3>
                <p className="text-sm opacity-90">
                  Upgrade la planul Pro pentru rapoarte PDF nelimitate, analiza completă a tuturor factorilor de risc și istoric detaliat.
                </p>
              </div>
              <button className="px-6 py-3 bg-white text-[var(--brand-mughal-green)] rounded-[4px] font-semibold hover:shadow-lg transition-all whitespace-nowrap">
                Upgrade acum
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!searchResult && !error && !isSearching && (
        <div className="bg-white border border-[var(--border-subtle)] rounded-[4px] p-12 text-center">
          <Search className="w-16 h-16 text-[var(--text-muted)] mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
            Începe o căutare
          </h3>
          <p className="text-[var(--text-secondary)] max-w-md mx-auto">
            Introdu CUI-ul companiei în câmpul de căutare de mai sus pentru a vedea scorul de risc,
            date financiare și informații juridice actualizate din ANAF.
          </p>
        </div>
      )}
    </div>
  )
}
