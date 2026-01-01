import Link from 'next/link'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[var(--surface-paper)]">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="mb-8">
          <Link href="/" className="text-sm text-[var(--text-link)] hover:underline mb-4 inline-block">
            ← Înapoi la pagina principală
          </Link>
          <p className="text-xs text-[var(--text-muted)] mb-2">Termeni și Condiții</p>
          <h1 className="text-2xl font-semibold text-[var(--text-primary)]" style={{ letterSpacing: '-0.3px' }}>
            Terms of Service
          </h1>
          <p className="text-sm text-[var(--text-secondary)] mt-3 max-w-2xl">
            Acești termeni reglementează utilizarea platformei MarketRisk pentru monitorizarea riscului de credit.
          </p>
        </div>

        <section className="bg-white border border-[var(--border-subtle)] p-6 rounded-[4px] space-y-5">
          <div>
            <h2 className="text-lg font-medium text-[var(--text-primary)] mb-2">Utilizarea serviciului</h2>
            <p className="text-sm text-[var(--text-secondary)]">
              Sunteți de acord să utilizați <span className="text-[var(--brand-mughal-green)] font-medium">marketrisk</span> în mod responsabil
              și să respectați legile aplicabile. Nu încercați să perturbați sau să accesați serviciul în moduri neautorizate.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-medium text-[var(--text-primary)] mb-2">Fără consiliere financiară</h2>
            <p className="text-sm text-[var(--text-secondary)]">
              <span className="text-[var(--brand-mughal-green)] font-medium">marketrisk</span> oferă instrumente informaționale de raportare.
              Nu oferă consiliere în investiții, juridică sau financiară.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-medium text-[var(--text-primary)] mb-2">Limitarea răspunderii</h2>
            <p className="text-sm text-[var(--text-secondary)]">
              În măsura maximă permisă de lege, serviciul este furnizat "ca atare" fără garanții, iar răspunderea
              este limitată la taxele plătite (dacă este cazul) pentru perioada aplicabilă.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-medium text-[var(--text-primary)] mb-2">Date și confidențialitate</h2>
            <p className="text-sm text-[var(--text-secondary)]">
              Colectăm și procesăm date în conformitate cu <Link href="/privacy" className="text-[var(--text-link)] hover:underline">Politica de Confidențialitate</Link>.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-medium text-[var(--text-primary)] mb-2">Modificări ale termenilor</h2>
            <p className="text-sm text-[var(--text-secondary)]">
              Ne rezervăm dreptul de a modifica acești termeni. Utilizatorii vor fi notificați despre modificări semnificative.
            </p>
          </div>
        </section>

        <div className="mt-8 text-sm text-[var(--text-muted)]">
          Ultima actualizare: 31 Decembrie 2025
        </div>
      </div>
    </div>
  )
}
