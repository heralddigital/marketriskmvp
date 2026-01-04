import Link from 'next/link'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[var(--surface-paper)]">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="mb-8">
          <Link href="/" className="text-sm text-[var(--text-link)] hover:underline mb-4 inline-block">
            ← Înapoi la pagina principală
          </Link>
          <p className="text-xs text-[var(--text-muted)] mb-2">Confidențialitate</p>
          <h1 className="text-2xl font-semibold text-[var(--text-primary)]" style={{ letterSpacing: '-0.3px' }}>
            Politica de Confidențialitate
          </h1>
          <p className="text-sm text-[var(--text-secondary)] mt-3 max-w-2xl">
            Confidențialitatea datelor dumneavoastră este importantă pentru noi. Această politică explică ce date colectăm și cum le utilizăm.
          </p>
        </div>

        <section className="bg-white border border-[var(--border-subtle)] p-6 rounded-[4px] space-y-5">
          <div>
            <h2 className="text-lg font-medium text-[var(--text-primary)] mb-2">Ce colectăm</h2>
            <p className="text-sm text-[var(--text-secondary)]">
              Detalii de bază ale contului (cum ar fi numele și emailul), plus date de utilizare pentru îmbunătățirea produsului.
              Ne propunem să colectăm minimul necesar pentru a opera <span className="text-[var(--brand-mughal-green)] font-medium">marketrisk</span>.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-medium text-[var(--text-primary)] mb-2">Cum le utilizăm</h2>
            <ul className="space-y-2">
              <li className="text-sm text-[var(--text-secondary)] flex items-start gap-2">
                <span className="text-[var(--brand-mughal-green)] mt-[2px]">•</span>
                <span>Furnizarea serviciului și suportul cererilor</span>
              </li>
              <li className="text-sm text-[var(--text-secondary)] flex items-start gap-2">
                <span className="text-[var(--brand-mughal-green)] mt-[2px]">•</span>
                <span>Îmbunătățirea fiabilității, performanței și experienței utilizatorului</span>
              </li>
              <li className="text-sm text-[var(--text-secondary)] flex items-start gap-2">
                <span className="text-[var(--brand-mughal-green)] mt-[2px]">•</span>
                <span>Monitorizarea securității și prevenirea fraudei</span>
              </li>
              <li className="text-sm text-[var(--text-secondary)] flex items-start gap-2">
                <span className="text-[var(--brand-mughal-green)] mt-[2px]">•</span>
                <span>Comunicarea actualizărilor și notificărilor importante</span>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-lg font-medium text-[var(--text-primary)] mb-2">Partajarea datelor</h2>
            <p className="text-sm text-[var(--text-secondary)]">
              Nu vindem datele personale. Le partajăm doar cu furnizorii de servicii necesari operării platformei
              (ex: hosting, procesare plăți) care sunt obligați contractual să le protejeze.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-medium text-[var(--text-primary)] mb-2">Drepturile dumneavoastră</h2>
            <p className="text-sm text-[var(--text-secondary)]">
              Puteți solicita accesul, corectarea sau ștergerea datelor personale. Contactați-ne folosind detaliile
              de pe pagina de <Link href="/contact" className="text-[var(--text-link)] hover:underline">Contact</Link>.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-medium text-[var(--text-primary)] mb-2">Securitatea datelor</h2>
            <p className="text-sm text-[var(--text-secondary)]">
              Implementăm măsuri tehnice și organizatorice pentru protejarea datelor împotriva accesului neautorizat,
              pierderii sau alterării.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-medium text-[var(--text-primary)] mb-2">Cookie-uri</h2>
            <p className="text-sm text-[var(--text-secondary)]">
              Utilizăm cookie-uri esențiale pentru funcționarea platformei și pentru menținerea sesiunii de autentificare.
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
