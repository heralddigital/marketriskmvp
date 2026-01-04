'use client'

import { useState } from 'react'
import {
  Scale,
  Calendar,
  MapPin,
  FileText,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  ChevronDown,
  ChevronUp,
  ExternalLink,
} from 'lucide-react'
import type { PortalJustLawsuit } from '@/lib/portaljust/types'

interface LitigationCardProps {
  lawsuits: PortalJustLawsuit[]
  total: number
  riskMetrics: {
    activeLawsuits: number
    lostCases2y: number
    totalLawsuits: number
    hasBankruptcyFiling: boolean
    hasExecutionProceedings: boolean
  }
}

export default function LitigationCard({
  lawsuits,
  total,
  riskMetrics,
}: LitigationCardProps) {
  const [expanded, setExpanded] = useState(false)
  const [showAll, setShowAll] = useState(false)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-[#F59E0B] bg-[#F59E0B]/10 border-[#F59E0B]/20'
      case 'closed':
        return 'text-gray-500 bg-gray-100 border-gray-200'
      case 'suspended':
        return 'text-[#6366F1] bg-[#6366F1]/10 border-[#6366F1]/20'
      case 'cancelled':
        return 'text-[#EF4444] bg-[#EF4444]/10 border-[#EF4444]/20'
      default:
        return 'text-gray-500 bg-gray-100 border-gray-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <AlertTriangle className="w-4 h-4" />
      case 'closed':
        return <CheckCircle2 className="w-4 h-4" />
      case 'cancelled':
        return <XCircle className="w-4 h-4" />
      default:
        return <FileText className="w-4 h-4" />
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active':
        return 'Activ'
      case 'closed':
        return 'Închis'
      case 'suspended':
        return 'Suspendat'
      case 'cancelled':
        return 'Anulat'
      default:
        return 'Necunoscut'
    }
  }

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'plaintiff':
        return 'Reclamant'
      case 'defendant':
        return 'Pârât'
      case 'third_party':
        return 'Terț'
      default:
        return 'Parte'
    }
  }

  const displayedLawsuits = showAll ? lawsuits : lawsuits.slice(0, 5)

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#F59E0B]/10 rounded-lg flex items-center justify-center">
            <Scale className="w-5 h-5 text-[#F59E0B]" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Procese judiciare
            </h3>
            <p className="text-sm text-gray-500">
              {total} dosar{total !== 1 ? 'e' : ''} găsit{total !== 1 ? 'e' : ''}
            </p>
          </div>
        </div>
        <button
          onClick={() => setExpanded(!expanded)}
          className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
        >
          {expanded ? (
            <ChevronUp className="w-5 h-5" />
          ) : (
            <ChevronDown className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Risk Metrics Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <div className="bg-[#F59E0B]/10 border border-[#F59E0B]/20 rounded-lg p-3">
          <p className="text-xs text-gray-500 mb-1">Procese active</p>
          <p className="text-lg font-bold text-[#F59E0B]">
            {riskMetrics.activeLawsuits}
          </p>
        </div>
        <div className="bg-[#EF4444]/10 border border-[#EF4444]/20 rounded-lg p-3">
          <p className="text-xs text-gray-500 mb-1">Pierdute (2 ani)</p>
          <p className="text-lg font-bold text-[#EF4444]">
            {riskMetrics.lostCases2y}
          </p>
        </div>
        {riskMetrics.hasBankruptcyFiling && (
          <div className="bg-[#EF4444]/10 border border-[#EF4444]/20 rounded-lg p-3">
            <p className="text-xs text-gray-500 mb-1">Faliment</p>
            <p className="text-lg font-bold text-[#EF4444]">Da</p>
          </div>
        )}
        {riskMetrics.hasExecutionProceedings && (
          <div className="bg-[#EF4444]/10 border border-[#EF4444]/20 rounded-lg p-3">
            <p className="text-xs text-gray-500 mb-1">Executare</p>
            <p className="text-lg font-bold text-[#EF4444]">Da</p>
          </div>
        )}
      </div>

      {/* Lawsuits List */}
      {expanded && (
        <div className="space-y-3">
          {lawsuits.length === 0 ? (
            <div className="text-center py-8">
              <Scale className="w-12 h-12 text-gray-500 mx-auto mb-3" />
              <p className="text-sm text-gray-600">
                Nu s-au găsit procese judiciare pentru această companie
              </p>
            </div>
          ) : (
            <>
              {displayedLawsuits.map((lawsuit, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg p-4 hover:border-[#2F5232] transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <FileText className="w-4 h-4 text-gray-500" />
                        <span className="font-mono text-sm font-medium text-gray-900">
                          {lawsuit.caseNumber}
                        </span>
                        {lawsuit.oldCaseNumber && (
                          <span className="text-xs text-gray-500">
                            (fost: {lawsuit.oldCaseNumber})
                          </span>
                        )}
                      </div>
                      {lawsuit.description && (
                        <p className="text-sm text-gray-600 mb-2">
                          {lawsuit.description}
                        </p>
                      )}
                    </div>
                    <span
                      className={`px-2 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 border ${getStatusColor(
                        lawsuit.status
                      )}`}
                    >
                      {getStatusIcon(lawsuit.status)}
                      {getStatusLabel(lawsuit.status)}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-600">
                        <strong className="text-gray-900">
                          {lawsuit.court}
                        </strong>
                        {lawsuit.department && ` - ${lawsuit.department}`}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-600">
                        <strong className="text-gray-900">
                          {lawsuit.caseType}
                        </strong>
                        {lawsuit.proceduralStage && ` - ${lawsuit.proceduralStage}`}
                      </span>
                    </div>
                    {lawsuit.startDate && (
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-600">
                          Început:{' '}
                          {new Date(lawsuit.startDate).toLocaleDateString('ro-RO')}
                        </span>
                      </div>
                    )}
                    {lawsuit.endDate && (
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-600">
                          Închis:{' '}
                          {new Date(lawsuit.endDate).toLocaleDateString('ro-RO')}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Parties */}
                  {lawsuit.parties && lawsuit.parties.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <p className="text-xs text-gray-500 mb-2">Părți:</p>
                      <div className="flex flex-wrap gap-2">
                        {lawsuit.parties.map((party, partyIndex) => (
                          <span
                            key={partyIndex}
                            className={`px-2 py-1 rounded-lg text-xs ${
                              party.role === 'defendant'
                                ? 'bg-[#EF4444]/10 text-[#EF4444] border border-[#EF4444]/20'
                                : party.role === 'plaintiff'
                                ? 'bg-[#22C55E]/10 text-[#22C55E] border border-[#22C55E]/20'
                                : 'bg-gray-100 text-gray-600 border border-gray-200'
                            }`}
                          >
                            {getRoleLabel(party.role)}: {party.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {lawsuit.lastUpdate && (
                    <div className="mt-2 text-xs text-gray-500">
                      Ultima actualizare:{' '}
                      {new Date(lawsuit.lastUpdate).toLocaleDateString('ro-RO')}
                    </div>
                  )}
                </div>
              ))}

              {lawsuits.length > 5 && (
                <button
                  onClick={() => setShowAll(!showAll)}
                  className="w-full py-2 text-sm text-[#2F5232] hover:bg-gray-100 rounded-lg transition-colors"
                >
                  {showAll
                    ? `Afișează mai puține (5 din ${lawsuits.length})`
                    : `Afișează toate (${lawsuits.length} dosare)`}
                </button>
              )}
            </>
          )}
        </div>
      )}

      {/* Footer Note */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-500 flex items-center gap-2">
          <ExternalLink className="w-3 h-3" />
          Datele provin din PortalJust - Portalul Instanțelor de Judecată
        </p>
      </div>
    </div>
  )
}

