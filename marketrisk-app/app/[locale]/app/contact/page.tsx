'use client'

import React from 'react'
import { Mail, Phone } from 'lucide-react'

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).trim())
}

export default function ContactPage() {
  const email = 'hello@marketrisk.ro'
  const phone = '+40 712 345 678'
  const telHref = `tel:${phone.replace(/\s+/g, '')}`

  const [form, setForm] = React.useState({ 
    topic: 'general', 
    name: '', 
    email: '', 
    message: '' 
  })
  const [status, setStatus] = React.useState<{ type: 'idle' | 'error' | 'success', message: string }>({ 
    type: 'idle', 
    message: '' 
  })

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const normalizedEmail = form.email.trim().toLowerCase()
    const allowedTopics = new Set(['general', 'technical', 'partnership', 'privacy'])
    if (!allowedTopics.has(form.topic)) {
      setStatus({ type: 'error', message: 'Te rugăm să selectezi un subiect.' })
      return
    }
    if (!form.name.trim()) {
      setStatus({ type: 'error', message: 'Te rugăm să introduci numele tău.' })
      return
    }
    if (!isValidEmail(normalizedEmail)) {
      setStatus({ type: 'error', message: 'Te rugăm să introduci o adresă de email validă.' })
      return
    }
    if (!form.message.trim()) {
      setStatus({ type: 'error', message: 'Te rugăm să adaugi un mesaj.' })
      return
    }

    // This is a static demo app: we simulate success without sending anywhere.
    setStatus({ type: 'success', message: 'Mulțumim — vom răspunde în 1–2 zile lucrătoare.' })
    setForm({ topic: 'general', name: '', email: '', message: '' })
  }

  return (
    <div className="p-8 bg-[var(--surface-paper)] min-h-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2">Contact</h1>
        <p className="text-[var(--text-secondary)]">Întrebări, demo-uri sau idei de parteneriat — trimite un mesaj și îți vom răspunde.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white border border-[var(--border-subtle)] rounded-[4px] p-6">
          <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-6">Trimite-ne un mesaj</h2>
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-2" htmlFor="contact-topic">
                Subiect
              </label>
              <select
                id="contact-topic"
                value={form.topic}
                onChange={(e) => setForm((p) => ({ ...p, topic: e.target.value }))}
                className="w-full px-4 py-2 border border-[var(--border-subtle)] rounded-[4px] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-mughal-green)] focus:border-transparent appearance-none bg-white"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%230B0F0C' stroke-width='2'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`,
                  backgroundPosition: 'right 12px center',
                  backgroundSize: '16px',
                  backgroundRepeat: 'no-repeat',
                }}
              >
                <option value="general">Întrebare generală</option>
                <option value="technical">Suport tehnic</option>
                <option value="partnership">Parteneriat sau strategie</option>
                <option value="privacy">Confidențialitate</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-2" htmlFor="contact-name">
                  Nume
                </label>
                <input
                  id="contact-name"
                  value={form.name}
                  onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                  autoComplete="name"
                  placeholder="Numele tău"
                  className="w-full px-4 py-2 border border-[var(--border-subtle)] rounded-[4px] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-mughal-green)] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-2" htmlFor="contact-email">
                  Email
                </label>
                <input
                  id="contact-email"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                  inputMode="email"
                  autoComplete="email"
                  placeholder="Email de lucru"
                  className="w-full px-4 py-2 border border-[var(--border-subtle)] rounded-[4px] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-mughal-green)] focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-2" htmlFor="contact-message">
                Mesaj
              </label>
              <textarea
                id="contact-message"
                value={form.message}
                onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
                rows={6}
                placeholder="Despre ce ai vrea să discutăm?"
                className="w-full px-4 py-2 border border-[var(--border-subtle)] rounded-[4px] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-mughal-green)] focus:border-transparent resize-y"
              />
            </div>

            {status.type !== 'idle' && (
              <div
                role={status.type === 'error' ? 'alert' : 'status'}
                className={`text-sm rounded-[4px] border px-4 py-3 ${
                  status.type === 'error'
                    ? 'bg-red-50 border-red-200 text-red-800'
                    : 'bg-green-50 border-green-200 text-green-800'
                }`}
              >
                {status.message}
              </div>
            )}

            <div className="flex items-center gap-3">
              <button
                type="submit"
                className="px-6 py-2 bg-[var(--brand-mughal-green)] text-white rounded-[4px] font-medium text-sm hover:bg-[var(--brand-mughal-green-2)] transition-colors"
              >
                Trimite mesaj
              </button>
              <button
                type="button"
                onClick={() => {
                  setForm({ topic: 'general', name: '', email: '', message: '' })
                  setStatus({ type: 'idle', message: '' })
                }}
                className="px-6 py-2 bg-white text-[var(--brand-mughal-green)] rounded-[4px] font-medium text-sm hover:bg-[var(--surface-bone)] transition-colors border border-[var(--border-subtle)]"
              >
                Resetează
              </button>
            </div>
          </form>
        </div>

        <aside className="bg-white border border-[var(--border-subtle)] rounded-[4px] p-6">
          <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Contact direct</h3>
          <div className="space-y-4">
            <a
              href={`mailto:${email}`}
              className="flex items-center gap-3 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            >
              <div className="w-10 h-10 rounded-[4px] bg-[var(--brand-pistachio)]/10 flex items-center justify-center">
                <Mail className="w-5 h-5 text-[var(--brand-mughal-green)]" />
              </div>
              <span>{email}</span>
            </a>
            <a
              href={telHref}
              className="flex items-center gap-3 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            >
              <div className="w-10 h-10 rounded-[4px] bg-[var(--brand-pistachio)]/10 flex items-center justify-center">
                <Phone className="w-5 h-5 text-[var(--brand-mughal-green)]" />
              </div>
              <span>{phone}</span>
            </a>
          </div>

          <div className="mt-6 pt-6 border-t border-[var(--border-subtle)]">
            <p className="text-xs text-[var(--text-muted)]">
              Notă: În această versiune demo, formularul nu trimite email — doar validează inputurile și afișează un mesaj de succes.
            </p>
          </div>
        </aside>
      </div>
    </div>
  )
}

