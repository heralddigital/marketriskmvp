import { Target, Users, Shield, TrendingUp } from 'lucide-react'

export default function AboutPage() {
  const values = [
    {
      icon: Shield,
      title: 'Transparență',
      description: 'Date real-time din surse oficiale. Fără estimări sau ghiciri.'
    },
    {
      icon: Target,
      title: 'Acuratețe',
      description: 'Algoritm propriu calibrat pe piața românească.'
    },
    {
      icon: Users,
      title: 'Simplitate',
      description: 'Interfață intuitivă. Rapoarte clare. Fără jargon complicat.'
    },
    {
      icon: TrendingUp,
      title: 'Inovație',
      description: 'Îmbunătățim continuu algoritmul și adăugăm noi surse de date.'
    },
  ]

  return (
    <div className="bg-[var(--surface-paper)]">
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h1 className="text-4xl md:text-5xl font-bold text-[var(--text-primary)] mb-6 text-center">
          Despre MarketRisk
        </h1>
        <p className="text-lg text-[var(--text-secondary)] text-center max-w-2xl mx-auto mb-12">
          Prima platformă românească dedicată exclusiv monitorizării riscului de credit pentru afaceri
        </p>

        <div className="prose prose-lg max-w-none">
          <div className="bg-white p-8 rounded-[4px] border border-[var(--border-subtle)] mb-8">
            <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4">Misiunea noastră</h2>
            <p className="text-[var(--text-secondary)] mb-4">
              MarketRisk democratizează accesul la informații de credit profesionale. Ceea ce înainte era disponibil doar
              pentru corporații cu bugete mari, acum este accesibil oricărei afaceri din România.
            </p>
            <p className="text-[var(--text-secondary)]">
              Conectăm date din ANAF, PortalJust și BPI și le transformăm într-un scor de risc simplu de înțeles:
              GREEN, YELLOW sau RED. Astfel, poți lua decizii informate despre cu cine faci afaceri.
            </p>
          </div>

          <div className="bg-white p-8 rounded-[4px] border border-[var(--border-subtle)]">
            <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-6">Valorile noastre</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {values.map((value) => {
                const Icon = value.icon
                return (
                  <div key={value.title} className="flex gap-4">
                    <div className="w-12 h-12 rounded-[4px] bg-[var(--brand-pistachio)]/10 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-6 h-6 text-[var(--brand-mughal-green)]" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
                        {value.title}
                      </h3>
                      <p className="text-sm text-[var(--text-secondary)]">
                        {value.description}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
