import { Mail, MessageSquare, Phone } from 'lucide-react'

export default function ContactPage() {
  return (
    <div className="bg-[var(--surface-paper)]">
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h1 className="text-4xl md:text-5xl font-bold text-[var(--text-primary)] mb-6 text-center">
          Contactează-ne
        </h1>
        <p className="text-lg text-[var(--text-secondary)] text-center max-w-2xl mx-auto mb-12">
          Suntem aici să te ajutăm. Alege modalitatea preferată de contact.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 rounded-[4px] border border-[var(--border-subtle)] text-center">
            <div className="w-12 h-12 rounded-[4px] bg-[var(--brand-pistachio)]/10 flex items-center justify-center mx-auto mb-4">
              <Mail className="w-6 h-6 text-[var(--brand-mughal-green)]" />
            </div>
            <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
              Email
            </h3>
            <p className="text-sm text-[var(--text-secondary)] mb-3">
              Răspundem în max 24h
            </p>
            <a
              href="mailto:contact@marketrisk.ro"
              className="text-[var(--brand-mughal-green)] font-medium hover:underline"
            >
              contact@marketrisk.ro
            </a>
          </div>

          <div className="bg-white p-6 rounded-[4px] border border-[var(--border-subtle)] text-center">
            <div className="w-12 h-12 rounded-[4px] bg-[var(--brand-pistachio)]/10 flex items-center justify-center mx-auto mb-4">
              <Phone className="w-6 h-6 text-[var(--brand-mughal-green)]" />
            </div>
            <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
              Telefon
            </h3>
            <p className="text-sm text-[var(--text-secondary)] mb-3">
              Luni - Vineri, 9:00 - 18:00
            </p>
            <a
              href="tel:+40312345678"
              className="text-[var(--brand-mughal-green)] font-medium hover:underline"
            >
              +40 31 234 5678
            </a>
          </div>

          <div className="bg-white p-6 rounded-[4px] border border-[var(--border-subtle)] text-center">
            <div className="w-12 h-12 rounded-[4px] bg-[var(--brand-pistachio)]/10 flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="w-6 h-6 text-[var(--brand-mughal-green)]" />
            </div>
            <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
              Suport
            </h3>
            <p className="text-sm text-[var(--text-secondary)] mb-3">
              Pentru clienți activi
            </p>
            <a
              href="mailto:support@marketrisk.ro"
              className="text-[var(--brand-mughal-green)] font-medium hover:underline"
            >
              support@marketrisk.ro
            </a>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[4px] border border-[var(--border-subtle)]">
          <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-6">
            Trimite-ne un mesaj
          </h2>
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                  Nume complet
                </label>
                <input
                  type="text"
                  id="name"
                  className="w-full px-4 py-2 border border-[var(--border-subtle)] rounded-[4px] focus:outline-none focus:ring-2 focus:ring-[var(--brand-mughal-green)] focus:border-transparent"
                  placeholder="Ion Popescu"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full px-4 py-2 border border-[var(--border-subtle)] rounded-[4px] focus:outline-none focus:ring-2 focus:ring-[var(--brand-mughal-green)] focus:border-transparent"
                  placeholder="ion@companie.ro"
                />
              </div>
            </div>
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                Subiect
              </label>
              <input
                type="text"
                id="subject"
                className="w-full px-4 py-2 border border-[var(--border-subtle)] rounded-[4px] focus:outline-none focus:ring-2 focus:ring-[var(--brand-mughal-green)] focus:border-transparent"
                placeholder="Întrebare despre planul Pro"
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                Mesaj
              </label>
              <textarea
                id="message"
                rows={6}
                className="w-full px-4 py-2 border border-[var(--border-subtle)] rounded-[4px] focus:outline-none focus:ring-2 focus:ring-[var(--brand-mughal-green)] focus:border-transparent resize-none"
                placeholder="Descrie-ne cum te putem ajuta..."
              />
            </div>
            <button
              type="submit"
              className="px-8 py-3 bg-[var(--brand-mughal-green)] text-white rounded-[4px] font-semibold hover:bg-[var(--brand-mughal-green-2)] transition-colors"
            >
              Trimite mesaj
            </button>
          </form>
        </div>
      </section>
    </div>
  )
}
