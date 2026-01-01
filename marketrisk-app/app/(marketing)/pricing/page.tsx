import Link from 'next/link'
import { CheckCircle2, X } from 'lucide-react'

export default function PricingPage() {
  const plans = [
    {
      name: 'Free',
      price: '0',
      period: 'pe lună',
      description: 'Perfect pentru a testa platforma',
      features: [
        { text: '3 căutări/lună', included: true },
        { text: 'Date de bază ANAF', included: true },
        { text: 'Scor de risc MarketRisk', included: true },
        { text: 'Istoric 30 zile', included: true },
        { text: 'Watchlist', included: false },
        { text: 'Alerte automate', included: false },
        { text: 'Export PDF', included: false },
        { text: 'Suport email', included: false },
      ],
      cta: 'Începe gratuit',
      href: '/signup',
      popular: false
    },
    {
      name: 'Starter',
      price: '99',
      period: 'pe lună',
      description: 'Pentru afaceri mici și mijlocii',
      features: [
        { text: '50 căutări/lună', included: true },
        { text: 'Date complete (ANAF + PortalJust)', included: true },
        { text: 'Scor de risc MarketRisk', included: true },
        { text: 'Istoric 12 luni', included: true },
        { text: '10 firme în watchlist', included: true },
        { text: 'Alerte email zilnice', included: true },
        { text: '10 export PDF/lună', included: true },
        { text: 'Suport email (24h)', included: true },
      ],
      cta: 'Alege Starter',
      href: '/signup',
      popular: true
    },
    {
      name: 'Pro',
      price: '299',
      period: 'pe lună',
      description: 'Pentru companii cu volum mare',
      features: [
        { text: '200 căutări/lună', included: true },
        { text: 'Date complete (ANAF + PortalJust + BPI)', included: true },
        { text: 'Scor de risc MarketRisk', included: true },
        { text: 'Istoric nelimitat', included: true },
        { text: '50 firme în watchlist', included: true },
        { text: 'Alerte email + SMS instant', included: true },
        { text: 'Export PDF nelimitat', included: true },
        { text: 'Suport prioritar (2h)', included: true },
      ],
      cta: 'Alege Pro',
      href: '/signup',
      popular: false
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: 'pe lună',
      description: 'Pentru corporații și departamente',
      features: [
        { text: 'Căutări nelimitate', included: true },
        { text: 'Toate datele disponibile', included: true },
        { text: 'API dedicat', included: true },
        { text: 'Istoric nelimitat', included: true },
        { text: 'Watchlist nelimitat', included: true },
        { text: 'Alerte personalizate', included: true },
        { text: 'Export nelimitat + Logo custom', included: true },
        { text: 'Dedicated account manager', included: true },
      ],
      cta: 'Contactează vânzări',
      href: '/contact',
      popular: false
    },
  ]

  const faqs = [
    {
      question: 'Pot schimba planul oricând?',
      answer: 'Da, poți face upgrade sau downgrade oricând. Modificările se aplică imediat, iar facturarea se ajustează proporțional.'
    },
    {
      question: 'Ce se întâmplă dacă depășesc limita de căutări?',
      answer: 'Vei primi o notificare când ajungi la 80% din limită. După limită, poți face upgrade instant sau aștepta resetarea lunară.'
    },
    {
      question: 'Există costuri ascunse?',
      answer: 'Nu. Prețurile afișate includ toate funcționalitățile planului. Nu există taxe de setup sau alte costuri surprise.'
    },
    {
      question: 'Cum funcționează perioada de probă?',
      answer: 'Planul Free este permanent gratuit. Pentru planurile plătite, oferim 14 zile money-back guarantee fără întrebări.'
    },
    {
      question: 'Pot anula oricând?',
      answer: 'Da, poți anula abonamentul oricând. Nu sunt penalități. Vei avea acces până la sfârșitul perioadei plătite.'
    },
    {
      question: 'Acceptați facturi?',
      answer: 'Da, emitem facturi fiscale în RON pentru toate abonamentele. Facturile sunt trimise automat la începutul fiecărei luni.'
    },
  ]

  return (
    <div className="bg-[var(--surface-paper)]">
      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-[var(--text-primary)] mb-6">
          Prețuri simple și transparente
        </h1>
        <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto">
          Începe gratuit, fără card bancar. Upgrade când ai nevoie de mai multe funcționalități.
        </p>
      </section>

      {/* Pricing Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`bg-white border-2 ${
                plan.popular
                  ? 'border-[var(--brand-mughal-green)] shadow-lg relative'
                  : 'border-[var(--border-subtle)]'
              } p-6 rounded-[4px] flex flex-col`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[var(--brand-mughal-green)] text-white px-4 py-1 rounded-full text-xs font-semibold">
                  Recomandat
                </div>
              )}
              <div className="mb-6">
                <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">
                  {plan.name}
                </h3>
                <p className="text-sm text-[var(--text-muted)] mb-4">
                  {plan.description}
                </p>
                <div className="flex items-baseline gap-2">
                  {plan.price === 'Custom' ? (
                    <span className="text-3xl font-bold text-[var(--text-primary)]">
                      Custom
                    </span>
                  ) : (
                    <>
                      <span className="text-4xl font-bold text-[var(--text-primary)]">
                        {plan.price}
                      </span>
                      <span className="text-[var(--text-muted)]">RON</span>
                    </>
                  )}
                </div>
                <span className="text-sm text-[var(--text-muted)]">
                  {plan.period}
                </span>
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm">
                    {feature.included ? (
                      <CheckCircle2 className="w-5 h-5 text-[var(--brand-mughal-green)] flex-shrink-0 mt-0.5" />
                    ) : (
                      <X className="w-5 h-5 text-[var(--text-muted)] flex-shrink-0 mt-0.5" />
                    )}
                    <span className={feature.included ? 'text-[var(--text-secondary)]' : 'text-[var(--text-muted)]'}>
                      {feature.text}
                    </span>
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
      </section>

      {/* FAQ */}
      <section className="bg-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-[var(--text-primary)] text-center mb-12">
            Întrebări frecvente
          </h2>
          <div className="space-y-6">
            {faqs.map((faq, idx) => (
              <div key={idx} className="border-b border-[var(--border-subtle)] pb-6">
                <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
                  {faq.question}
                </h3>
                <p className="text-sm text-[var(--text-secondary)]">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h2 className="text-3xl font-bold text-[var(--text-primary)] mb-4">
          Încă ai întrebări?
        </h2>
        <p className="text-lg text-[var(--text-secondary)] mb-8">
          Contactează echipa noastră pentru o demonstrație personalizată
        </p>
        <Link
          href="/contact"
          className="inline-block px-8 py-4 bg-[var(--brand-mughal-green)] text-white rounded-[4px] font-semibold hover:bg-[var(--brand-mughal-green-2)] transition-colors"
        >
          Contactează-ne
        </Link>
      </section>
    </div>
  )
}
