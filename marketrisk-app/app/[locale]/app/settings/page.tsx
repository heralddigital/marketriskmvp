'use client'

import { User, Mail, Bell, Lock, CreditCard, Shield } from 'lucide-react'

export default function SettingsPage() {
  return (
    <div className="p-8 bg-[var(--surface-paper)] min-h-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2">Setări</h1>
        <p className="text-[var(--text-secondary)]">Gestionează-ți contul și preferințele</p>
      </div>

      <div className="grid gap-6 max-w-4xl">
        {/* Profile Settings */}
        <div className="bg-white border border-[var(--border-subtle)] rounded-[4px] p-6">
          <div className="flex items-center gap-3 mb-6">
            <User className="w-5 h-5 text-[var(--brand-mughal-green)]" />
            <h2 className="text-lg font-semibold text-[var(--text-primary)]">Profil</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">Nume complet</label>
              <input type="text" defaultValue="John Doe" className="w-full px-4 py-2 border border-[var(--border-subtle)] rounded-[4px] focus:ring-2 focus:ring-[var(--brand-mughal-green)] focus:border-transparent" />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">Email</label>
              <input type="email" defaultValue="john@example.com" className="w-full px-4 py-2 border border-[var(--border-subtle)] rounded-[4px] focus:ring-2 focus:ring-[var(--brand-mughal-green)] focus:border-transparent" />
            </div>
            <button className="px-4 py-2 bg-[var(--brand-mughal-green)] text-white rounded-[4px] font-medium hover:bg-[var(--brand-mughal-green-2)]">
              Salvează modificările
            </button>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="bg-white border border-[var(--border-subtle)] rounded-[4px] p-6">
          <div className="flex items-center gap-3 mb-6">
            <Bell className="w-5 h-5 text-[var(--brand-mughal-green)]" />
            <h2 className="text-lg font-semibold text-[var(--text-primary)]">Notificări</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-[var(--text-primary)]">Email alerte</p>
                <p className="text-sm text-[var(--text-secondary)]">Primește alerte pentru modificări de risc</p>
              </div>
              <button className="px-4 py-2 bg-[var(--brand-mughal-green)] text-white rounded-[4px] text-sm font-medium">Activ</button>
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-[var(--border-subtle)]">
              <div>
                <p className="font-medium text-[var(--text-primary)]">SMS alerte</p>
                <p className="text-sm text-[var(--text-secondary)]">Alerte prin SMS (disponibil la planul Pro)</p>
              </div>
              <button className="px-4 py-2 bg-[var(--surface-bone)] text-[var(--text-secondary)] rounded-[4px] text-sm font-medium">Upgrade</button>
            </div>
          </div>
        </div>

        {/* Security Settings */}
        <div className="bg-white border border-[var(--border-subtle)] rounded-[4px] p-6">
          <div className="flex items-center gap-3 mb-6">
            <Lock className="w-5 h-5 text-[var(--brand-mughal-green)]" />
            <h2 className="text-lg font-semibold text-[var(--text-primary)]">Securitate</h2>
          </div>
          <div className="space-y-4">
            <button className="w-full px-4 py-3 border border-[var(--border-subtle)] text-[var(--text-primary)] rounded-[4px] font-medium hover:bg-[var(--surface-bone)] text-left">
              Schimbă parola
            </button>
            <button className="w-full px-4 py-3 border border-[var(--border-subtle)] text-[var(--text-primary)] rounded-[4px] font-medium hover:bg-[var(--surface-bone)] text-left">
              Autentificare în doi pași
            </button>
          </div>
        </div>

        {/* Subscription */}
        <div className="bg-white border border-[var(--border-subtle)] rounded-[4px] p-6">
          <div className="flex items-center gap-3 mb-6">
            <CreditCard className="w-5 h-5 text-[var(--brand-mughal-green)]" />
            <h2 className="text-lg font-semibold text-[var(--text-primary)]">Abonament</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-[var(--surface-paper)] rounded-[4px]">
              <div>
                <p className="font-semibold text-[var(--text-primary)]">Plan actual: Starter</p>
                <p className="text-sm text-[var(--text-secondary)]">99 RON / lună</p>
              </div>
              <button className="px-4 py-2 bg-[var(--brand-mughal-green)] text-white rounded-[4px] font-medium">Upgrade</button>
            </div>
            <button className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
              Anulează abonamentul
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
