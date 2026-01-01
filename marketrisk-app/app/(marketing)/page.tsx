import Link from 'next/link'
import { Shield, Bell, Search, FileText, TrendingUp, CheckCircle2, ArrowRight } from 'lucide-react'

export default function Homepage() {
  const features = [
    {
      icon: Search,
      title: 'Căutare companii în timp real',
      description: 'Accesează date actualizate din ANAF, PortalJust și BPI pentru orice firmă din România.'
    },
    {
      icon: Shield,
      title: 'Algoritm propriu de risc',
      description: 'Scor de risc calculat pe baza a 24 factori: insolvență, datorii, procese, istoric financiar.'
    },
    {
      icon: Bell,
      title: 'Alerte automate',
      description: 'Primești notificări când firmele monitorizate își schimbă scorul de risc sau apar probleme.'
    },
    {
      icon: FileText,
      title: 'Rapoarte PDF profesionale',
      description: 'Exportă rapoarte detaliate cu date complete și analiza de risc pentru parteneri și bănci.'
    },
    {
      icon: TrendingUp,
      title: 'Monitorizare continuă',
      description: 'Lista ta de watchlist este verificată zilnic automat pentru modificări relevante.'
    },
  ]

  const stats = [
    { value: '100.000+', label: 'Companii în bază' },
    { value: '24h', label: 'Date actualizate' },
    { value: '24', label: 'Factori de risc' },
  ]

  const pricing = [
    {
      name: 'Free',
      price: '0 RON',
      period: 'pe lună',
      features: ['3 căutări/lună', 'Date de bază ANAF', 'Scor de risc'],
      cta: 'Începe gratuit',
      href: '/signup',
      popular: false
    },
    {
      name: 'Starter',
      price: '99 RON',
      period: 'pe lună',
      features: ['50 căutări/lună', '10 firme în watchlist', 'Alerte email', 'Export PDF (10/lună)'],
      cta: 'Încearcă Starter',
      href: '/signup',
      popular: true
    },
    {
      name: 'Pro',
      price: '299 RON',
      period: 'pe lună',
      features: ['200 căutări/lună', '50 firme în watchlist', 'Alerte email + SMS', 'Export PDF nelimitat', 'Suport prioritar'],
      cta: 'Upgrade la Pro',
      href: '/signup',
      popular: false
    },
  ]

  const steps = [
    {
      number: '1',
      title: 'Caută compania',
      description: 'Introduci CUI-ul firmei și obții instantaneu date din ANAF, PortalJust, BPI.'
    },
    {
      number: '2',
      title: 'Vezi scorul de risc',
      description: 'Algoritmul analizează 24 factori și calculează un scor GREEN/YELLOW/RED.'
    },
    {
      number: '3',
      title: 'Monitorizează automat',
      description: 'Adaugi firma în watchlist și primești alerte când apar modificări.'
    },
  ]

  return (
    <div className="bg-[var(--surface-paper)]">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[var(--text-primary)] mb-6" style={{ letterSpacing: '-0.3px' }}>
            Monitorizare profesională a <span className="text-[var(--brand-mughal-green)]">riscului de credit</span>
          </h1>
          <p className="text-lg md:text-xl text-[var(--text-secondary)] mb-8 max-w-3xl mx-auto">
            Verifică solvabilitatea partenerilor tăi de afaceri cu date din ANAF, PortalJust și BPI.
            Scor de risc calculat automat pentru orice firmă din România.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/signup"
              className="px-8 py-4 bg-[var(--brand-mughal-green)] text-white rounded-[4px] font-semibold text-base hover:bg-[var(--brand-mughal-green-2)] transition-colors inline-flex items-center gap-2"
            >
              Începe gratuit
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/pricing"
              className="px-8 py-4 bg-white text-[var(--brand-mughal-green)] rounded-[4px] font-semibold text-base hover:shadow-sm border border-[var(--border-subtle)] transition-all"
            >
              Vezi prețurile
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-3 gap-8 max-w-2xl mx-auto">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl font-bold text-[var(--brand-mughal-green)] mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-[var(--text-muted)]">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <p className="text-xs text-[var(--text-muted)] mb-2 uppercase tracking-wide">Funcționalități</p>
          <h2 className="text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-4">
            Tot ce ai nevoie pentru analiza de risc
          </h2>
          <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto">
            Platformă completă de monitorizare a riscului de credit pentru afaceri din România
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <div
                key={feature.title}
                className="bg-white border border-[var(--border-subtle)] p-6 rounded-[4px] hover:shadow-md transition-all"
              >
                <div className="w-12 h-12 rounded-[4px] bg-[var(--brand-pistachio)]/10 flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-[var(--brand-mughal-green)]" />
                </div>
                <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-[var(--text-secondary)]">
                  {feature.description}
                </p>
              </div>
            )
          })}
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-xs text-[var(--text-muted)] mb-2 uppercase tracking-wide">Cum funcționează</p>
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-4">
              3 pași simpli către monitorizare automată
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step) => (
              <div key={step.number} className="relative">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[var(--brand-mughal-green)] text-white flex items-center justify-center font-bold text-lg">
                    {step.number}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-2">
                      {step.title}
                    </h3>
                    <p className="text-sm text-[var(--text-secondary)]">
                      {step.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <p className="text-xs text-[var(--text-muted)] mb-2 uppercase tracking-wide">Prețuri</p>
          <h2 className="text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-4">
            Planuri pentru orice business
          </h2>
          <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto">
            Începe gratuit, upgrade când ai nevoie
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {pricing.map((plan) => (
            <div
              key={plan.name}
              className={`bg-white border-2 ${
                plan.popular
                  ? 'border-[var(--brand-mughal-green)] shadow-lg relative'
                  : 'border-[var(--border-subtle)]'
              } p-8 rounded-[4px]`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[var(--brand-mughal-green)] text-white px-4 py-1 rounded-full text-xs font-semibold">
                  Cel mai popular
                </div>
              )}
              <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">
                {plan.name}
              </h3>
              <div className="mb-6">
                <span className="text-4xl font-bold text-[var(--text-primary)]">
                  {plan.price}
                </span>
                <span className="text-[var(--text-muted)] ml-2">
                  {plan.period}
                </span>
              </div>
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm text-[var(--text-secondary)]">
                    <CheckCircle2 className="w-5 h-5 text-[var(--brand-mughal-green)] flex-shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Link
                href={plan.href}
                className={`block w-full py-3 rounded-[4px] font-semibold text-center transition-all ${
                  plan.popular
                    ? 'bg-[var(--brand-mughal-green)] text-white hover:bg-[var(--brand-mughal-green-2)]'
                    : 'bg-white border border-[var(--border-subtle)] text-[var(--brand-mughal-green)] hover:shadow-sm'
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/pricing"
            className="text-[var(--brand-mughal-green)] font-medium hover:underline inline-flex items-center gap-2"
          >
            Vezi toate planurile și funcționalitățile
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-[var(--brand-mughal-green)] text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Începe să monitorizezi riscul de credit astăzi
          </h2>
          <p className="text-lg mb-8 opacity-90">
            3 căutări gratuite fără card bancar. Upgrade oricând ai nevoie.
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-[var(--brand-mughal-green)] rounded-[4px] font-semibold text-lg hover:shadow-lg transition-all"
          >
            Creează cont gratuit
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  )
}
