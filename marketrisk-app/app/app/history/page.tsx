'use client'

import { Search, Building2, Calendar, Download } from 'lucide-react'

const mockHistory = [
  { id: 1, cui: '12345678', name: 'SC TECH SOLUTIONS SRL', date: '2024-12-30 14:23', riskScore: 'GREEN', exported: true },
  { id: 2, cui: '23456789', name: 'SC CONSULTING GROUP SA', date: '2024-12-29 10:15', riskScore: 'YELLOW', exported: false },
  { id: 3, cui: '34567890', name: 'SC IMPORT EXPORT SRL', date: '2024-12-28 16:45', riskScore: 'RED', exported: true },
  { id: 4, cui: '45678901', name: 'SC PRODUCTION FACTORY SRL', date: '2024-12-27 09:30', riskScore: 'GREEN', exported: false },
]

export default function HistoryPage() {
  const getRiskColor = (score: string) => {
    return score === 'GREEN' ? 'text-[#22C55E] bg-[#22C55E]/10' :
           score === 'YELLOW' ? 'text-[#F59E0B] bg-[#F59E0B]/10' :
           'text-[#EF4444] bg-[#EF4444]/10'
  }

  return (
    <div className="p-8 bg-[var(--surface-paper)] min-h-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2">Istoric căutări</h1>
        <p className="text-[var(--text-secondary)]">Toate căutările tale anterioare și rapoartele exportate</p>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white border border-[var(--border-subtle)] rounded-[4px] p-4">
          <p className="text-sm text-[var(--text-muted)] mb-1">Total căutări</p>
          <p className="text-2xl font-bold text-[var(--text-primary)]">{mockHistory.length}</p>
        </div>
        <div className="bg-white border border-[var(--border-subtle)] rounded-[4px] p-4">
          <p className="text-sm text-[var(--text-muted)] mb-1">Această lună</p>
          <p className="text-2xl font-bold text-[var(--brand-mughal-green)]">3</p>
        </div>
        <div className="bg-white border border-[var(--border-subtle)] rounded-[4px] p-4">
          <p className="text-sm text-[var(--text-muted)] mb-1">Exportate PDF</p>
          <p className="text-2xl font-bold text-[var(--text-primary)]">2</p>
        </div>
      </div>

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
            {mockHistory.map((item) => (
              <tr key={item.id} className="hover:bg-[var(--surface-paper)] transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <Building2 className="w-5 h-5 text-[var(--brand-mughal-green)]" />
                    <div>
                      <p className="font-medium text-[var(--text-primary)]">{item.name}</p>
                      <p className="text-sm text-[var(--text-muted)]">CUI: {item.cui}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-[var(--text-secondary)] flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {item.date}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-[4px] text-sm font-semibold ${getRiskColor(item.riskScore)}`}>
                    {item.riskScore}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <button className="p-2 text-[var(--text-secondary)] hover:text-[var(--brand-mughal-green)] hover:bg-[var(--surface-bone)] rounded-[4px]">
                      <Search className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-[var(--text-secondary)] hover:text-[var(--brand-mughal-green)] hover:bg-[var(--surface-bone)] rounded-[4px]">
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
