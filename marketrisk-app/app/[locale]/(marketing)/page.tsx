'use client'

import React, { useMemo } from 'react'
import Link from 'next/link'
import {
  Shield,
  Bell,
  Search,
  FileText,
  TrendingUp,
  Users,
  Zap,
  CheckCircle2,
  Star,
  ArrowRight,
  BarChart3,
  Clock,
  Building2,
  Target,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Check
} from 'lucide-react'

function PrimaryButton({ children, onClick, href, type = 'button', disabled = false, className = '' }: {
  children: React.ReactNode
  onClick?: () => void
  href?: string
  type?: 'button' | 'submit'
  disabled?: boolean
  className?: string
}) {
  if (href) {
    return (
      <Link
        href={href}
        className={`px-6 py-3 bg-brand-mughal-green text-white rounded-lg font-medium text-sm hover:bg-brand-mughal-green-2 transition-all duration-normal inline-block ${className}`}
      >
        {children}
      </Link>
    )
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`px-6 py-3 bg-brand-mughal-green text-white rounded-lg font-medium text-sm hover:bg-brand-mughal-green-2 transition-all duration-normal disabled:opacity-60 disabled:cursor-not-allowed ${className}`}
    >
      {children}
    </button>
  )
}

function SecondaryButton({ children, onClick, href, type = 'button' }: {
  children: React.ReactNode
  onClick?: () => void
  href?: string
  type?: 'button' | 'submit'
}) {
  if (href) {
    return (
      <Link
        href={href}
        className="px-6 py-3 bg-white text-brand-mughal-green rounded-lg font-medium text-sm hover:shadow-sm transition-all duration-normal inline-block"
      >
        {children}
      </Link>
    )
  }

  return (
    <button
      type={type}
      onClick={onClick}
      className="px-6 py-3 bg-white text-brand-mughal-green rounded-lg font-medium text-sm hover:shadow-sm transition-all duration-normal"
    >
      {children}
    </button>
  )
}

function BenefitCard({ title, description, bullets, icon: Icon }: {
  title: string
  description: string
  bullets?: string[]
  icon: React.ComponentType<{ className?: string }>
}) {
  return (
    <div className="bg-white border border-border-subtle p-6 rounded-xl hover:shadow-sm transition-all duration-normal">
      <div className="mb-4">
        <div className="w-10 h-10 rounded-lg bg-brand-pistachio/10 flex items-center justify-center">
          <Icon className="w-5 h-5 text-brand-mughal-green" />
        </div>
      </div>
      <h3 className="text-lg font-medium text-text-primary mb-2">{title}</h3>
      <p className="text-sm text-text-secondary mb-4">{description}</p>
      {bullets && bullets.length > 0 && (
        <ul className="space-y-2">
          {bullets.map((b) => (
            <li key={b} className="text-sm text-text-secondary flex items-start gap-2">
              <span className="text-brand-mughal-green mt-[2px]">•</span>
              <span>{b}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

function FeatureCard({ icon: Icon, title, description }: {
  icon: React.ComponentType<{ className?: string }>
  title: string
  description: string
}) {
  return (
    <div className="flex gap-4">
      <div className="flex-shrink-0">
        <div className="w-12 h-12 rounded-lg bg-brand-pistachio/10 flex items-center justify-center">
          <Icon className="w-6 h-6 text-brand-mughal-green" />
        </div>
      </div>
      <div>
        <h3 className="text-lg font-medium text-text-primary mb-2">{title}</h3>
        <p className="text-sm text-text-secondary">{description}</p>
      </div>
    </div>
  )
}

function StepCard({ number, title, description }: {
  number: number
  title: string
  description: string
}) {
  return (
    <div className="bg-white border border-border-subtle p-6 rounded-xl">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-brand-mughal-green text-white flex items-center justify-center font-semibold text-sm">
          {number}
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-medium text-text-primary mb-2">{title}</h3>
          <p className="text-sm text-text-secondary">{description}</p>
        </div>
      </div>
    </div>
  )
}

function TestimonialCard({ quote, name, role, company, rating = 5 }: {
  quote: string
  name: string
  role: string
  company: string
  rating?: number
}) {
  return (
    <div className="bg-white border border-border-subtle p-6 rounded-xl">
      <div className="flex gap-1 mb-4">
        {Array.from({ length: rating }).map((_, i) => (
          <Star key={i} className="w-4 h-4 fill-brand-pistachio text-brand-pistachio" />
        ))}
      </div>
      <p className="text-sm text-text-secondary mb-4 italic">&ldquo;{quote}&rdquo;</p>
      <div>
        <p className="text-sm font-medium text-text-primary">{name}</p>
        <p className="text-xs text-text-muted">{role}, {company}</p>
      </div>
    </div>
  )
}

function UseCaseCard({ icon: Icon, title, description, features }: {
  icon: React.ComponentType<{ className?: string }>
  title: string
  description: string
  features: string[]
}) {
  return (
    <div className="bg-white border border-border-subtle p-6 rounded-xl hover:shadow-sm transition-all duration-normal">
      <div className="mb-4">
        <div className="w-12 h-12 rounded-lg bg-brand-pistachio/10 flex items-center justify-center">
          <Icon className="w-6 h-6 text-brand-mughal-green" />
        </div>
      </div>
      <h3 className="text-lg font-medium text-text-primary mb-2">{title}</h3>
      <p className="text-sm text-text-secondary mb-4">{description}</p>
      <ul className="space-y-2">
        {features.map((feature) => (
          <li key={feature} className="text-sm text-text-secondary flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-brand-pistachio mt-0.5 flex-shrink-0" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <div className="bg-white border border-border-subtle rounded-xl overflow-hidden">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-surface-paper transition-colors"
      >
        <span className="text-sm font-medium text-text-primary pr-4">{question}</span>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-text-muted flex-shrink-0" />
        ) : (
          <ChevronDown className="w-5 h-5 text-text-muted flex-shrink-0" />
        )}
      </button>
      {isOpen && (
        <div className="px-6 pb-4">
          <p className="text-sm text-text-secondary">{answer}</p>
        </div>
      )}
    </div>
  )
}

const AnalyticsMockup = React.memo(function AnalyticsMockup() {
  const [hoveredCard, setHoveredCard] = React.useState<number | null>(null)
  const [hoveredBar, setHoveredBar] = React.useState<number | null>(null)
  const [animated, setAnimated] = React.useState(false)

  React.useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), 100)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="bg-white rounded-xl p-6 shadow-2xl border border-border-subtle max-w-4xl mx-auto transition-all duration-300 hover:shadow-[0_20px_50px_rgba(0,0,0,0.15)] hover:scale-[1.02] cursor-pointer group">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-xs text-text-muted mb-1">Tablou de bord general</p>
          <h3 className="text-lg font-semibold text-text-primary group-hover:text-brand-mughal-green transition-colors duration-300">
            Analiză monitorizare risc
          </h3>
        </div>
        <select className="text-xs bg-surface-paper border border-border-subtle rounded-lg px-3 py-2 text-text-primary hover:border-brand-mughal-green transition-colors duration-200 cursor-pointer">
          <option>Ultimele 7 zile</option>
          <option>Ultimele 30 zile</option>
        </select>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        {[
          { label: 'Monitorizate', value: '25', change: '+3 săptămâna aceasta', color: 'text-brand-mughal-green' },
          { label: 'Alerte', value: '12', change: '3 noi astăzi', color: 'text-state-warning' },
          { label: 'Risc ridicat', value: '2', change: 'Acțiune necesară', color: 'text-state-danger' },
          { label: 'Stare bună', value: '23', change: 'Totul OK', color: 'text-brand-mughal-green' }
        ].map((card, i) => (
          <div
            key={i}
            className={`bg-surface-paper rounded-lg p-3 border border-border-subtle transition-all duration-200 cursor-pointer ${
              hoveredCard === i
                ? 'border-brand-mughal-green shadow-md scale-105 bg-brand-mughal-green/5'
                : 'hover:border-brand-mughal-green/50 hover:shadow-sm'
            }`}
            onMouseEnter={() => setHoveredCard(i)}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <p className="text-xs text-text-muted mb-1">{card.label}</p>
            <p className={`text-lg font-semibold text-text-primary transition-all duration-200 ${
              hoveredCard === i ? 'text-brand-mughal-green scale-110' : ''
            }`}>{card.value}</p>
            <p className={`text-xs ${card.color} mt-1`}>{card.change}</p>
          </div>
        ))}
      </div>

      {/* Chart Area */}
      <div className="bg-surface-paper rounded-lg p-4 border border-border-subtle hover:border-brand-mughal-green/50 transition-colors duration-200">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-sm font-semibold text-text-primary">Tendințe risc</h4>
          <div className="flex items-center gap-3 text-xs">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-brand-mughal-green"></div>
              <span className="text-text-muted">Alerte</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-brand-pistachio"></div>
              <span className="text-text-muted">Rezolvate</span>
            </div>
          </div>
        </div>
        {/* Simple bar chart visualization */}
        <div className="flex items-end justify-between gap-2 h-32">
          {[25, 85, 38, 92, 22, 71, 48].map((height, i) => (
            <div
              key={i}
              className="flex-1 flex flex-col items-center gap-1 group/bar"
              onMouseEnter={() => setHoveredBar(i)}
              onMouseLeave={() => setHoveredBar(null)}
            >
              <div
                className={`w-full rounded-t transition-all duration-300 cursor-pointer ${
                  hoveredBar === i
                    ? 'opacity-80 scale-105 shadow-lg'
                    : 'hover:opacity-90 hover:scale-[1.02]'
                } ${
                  animated ? 'opacity-100' : 'opacity-0'
                }`}
                style={{
                  height: animated ? `${height}%` : '0%',
                  backgroundColor: i % 2 === 0 ? 'var(--brand-mughal-green)' : 'var(--brand-pistachio)',
                  minHeight: '20px',
                  transitionDelay: `${i * 50}ms`
                }}
              ></div>
              <span className={`text-xs text-text-muted transition-colors duration-200 ${
                hoveredBar === i ? 'text-brand-mughal-green font-semibold' : ''
              }`}>{['Lun', 'Mar', 'Mie', 'Joi', 'Vin', 'Sâm', 'Dum'][i]}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Stats Row */}
      <div className="grid grid-cols-3 gap-3 mt-4">
        {[
          { label: 'Verificări insolvență', value: '156' },
          { label: 'Actualizări datorii', value: '89' },
          { label: 'Schimbări status', value: '23' }
        ].map((stat, i) => (
          <div
            key={i}
            className="bg-surface-paper rounded-lg p-3 border border-border-subtle hover:border-brand-mughal-green hover:shadow-sm hover:scale-105 transition-all duration-200 cursor-pointer"
          >
            <p className="text-xs text-text-muted mb-1">{stat.label}</p>
            <p className="text-sm font-semibold text-text-primary group-hover:text-brand-mughal-green transition-colors duration-200">{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
  )
})

export default function Homepage() {
  const handleScrollToSignup = () => {
    const signupSection = document.getElementById('signup-cta')
    signupSection?.scrollIntoView({ behavior: 'smooth' })
  }

  const testimonials = useMemo(() => [
    {
      quote: "MarketRisk ne-a salvat de o datorie de 50.000€. Sistemul de avertizare timpurie a detectat o procedură de insolvență pe care am fi ratat-o.",
      name: "Maria Popescu",
      role: "CFO",
      company: "TechStart SRL",
      rating: 5
    },
    {
      quote: "Monitorizarea 24/7 ne oferă liniște sufletească. Știm imediat când se schimbă ceva la partenerii noștri.",
      name: "Alexandru Ionescu",
      role: "Manager risc",
      company: "FinanceCorp",
      rating: 5
    },
    {
      quote: "Cea mai bună investiție a anului. Planul PRO se plătește singur prevenind o singură creanță neîncasată.",
      name: "Elena Radu",
      role: "Director operațiuni",
      company: "RetailGroup",
      rating: 5
    },
    {
      quote: "Prețuri simple și transparente. Fără taxe ascunse, fără surprize. Exact ce aveam nevoie.",
      name: "Cristian Moldovan",
      role: "CEO",
      company: "ServicePro",
      rating: 5
    }
  ], [])

  const useCases = useMemo(() => [
    {
      icon: Building2,
      title: "Echipe de vânzări",
      description: "Monitorizează clienții potențiali și actuali înainte și după contracte.",
      features: [
        "Verifică bonitatea înainte de onboarding",
        "Urmărește schimbările în comportamentul de plată",
        "Identifică clienții cu risc ridicat din timp"
      ]
    },
    {
      icon: Users,
      title: "Departamente financiare",
      description: "Protejează fluxul de numerar monitorizând furnizori și parteneri.",
      features: [
        "Monitorizează stabilitatea furnizorilor",
        "Primește alerte pentru proceduri de insolvență",
        "Urmărește datorii la stat și probleme fiscale"
      ]
    },
    {
      icon: Target,
      title: "Analiști credit",
      description: "Ia decizii de creditare informate cu date complete de risc.",
      features: [
        "Acces la informații de credit în timp real",
        "Analiză trend istoric",
        "Exportă rapoarte detaliate"
      ]
    }
  ], [])

  return (
    <div className="space-y-16 md:space-y-24">
      {/* Hero Section - Version 4 */}
      <section className="bg-gradient-to-br from-brand-mughal-green via-brand-mughal-green-2 to-brand-mughal-green rounded-2xl p-6 md:p-9 relative overflow-visible pb-8">
        {/* Background pattern */}
        <div className="absolute inset-0 pointer-events-none opacity-10 overflow-hidden rounded-2xl" style={{ zIndex: 5 }}>
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid-v4" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="var(--brand-pistachio)" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid-v4)" />
          </svg>
        </div>

        {/* Floating elements */}
        <div className="absolute top-10 right-10 w-32 h-32 bg-brand-pistachio/20 rounded-full blur-3xl" style={{ zIndex: 5 }}></div>
        <div className="absolute bottom-20 left-10 w-24 h-24 bg-brand-pistachio/15 rounded-full blur-2xl" style={{ zIndex: 5 }}></div>

        <div className="relative z-10 max-w-6xl mx-auto">
          {/* Top Content */}
          <div className="text-center">
            <div className="inline-block px-4 py-2 bg-brand-pistachio/20 rounded-full mb-4">
              <p className="text-brand-pistachio text-sm font-medium">Acces anticipat disponibil</p>
            </div>
            <h1 className="text-4xl md:text-6xl font-semibold text-text-inverse mb-4 leading-tight" style={{ letterSpacing: '-1.2px' }}>
              Oprește datoriile neîncasate înainte să îți oprească afacerea
            </h1>
            <p className="text-text-inverse-muted text-lg md:text-xl max-w-2xl mx-auto mb-6 leading-relaxed">
              Monitorizează riscul de credit pentru partenerii tăi IMM din România. Primește alerte inteligente când ceva se schimbă—astfel poți acționa rapid și îți protejezi fluxul de numerar.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-4">
              <PrimaryButton href="/signup">
                Obține acces anticipat
              </PrimaryButton>
              <SecondaryButton href="/login">
                Vezi cum funcționează
              </SecondaryButton>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-text-inverse-muted mb-8">
              <div className="flex items-center gap-2">
                <Check size={16} className="text-brand-pistachio flex-shrink-0" />
                <span>Plan gratuit disponibil</span>
              </div>
              <div className="flex items-center gap-2">
                <Check size={16} className="text-brand-pistachio flex-shrink-0" />
                <span>Fără card necesar</span>
              </div>
              <div className="flex items-center gap-2">
                <Check size={16} className="text-brand-pistachio flex-shrink-0" />
                <span>Lansare Q1 2025</span>
              </div>
            </div>
          </div>

          {/* Analytics Dashboard Mockup */}
          <div className="relative z-20 mt-8">
            <AnalyticsMockup />
          </div>
        </div>
      </section>

      {/* Social Proof / Trust Logos */}
      <section className="py-8">
        <div className="text-center mb-8">
          <p className="text-sm text-text-muted mb-4">De încredere pentru IMM-uri din România</p>
          <div className="flex flex-wrap items-center justify-center gap-8 opacity-60">
            <div className="text-text-muted font-semibold text-lg">ANAF</div>
            <div className="text-text-muted font-semibold text-lg">MFP</div>
            <div className="text-text-muted font-semibold text-lg">ONRC</div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section>
        <div className="text-center mb-12">
          <p className="text-xs text-text-muted mb-2 uppercase tracking-wide">Cum funcționează</p>
          <h2 className="text-3xl md:text-4xl font-semibold text-text-primary mb-4" style={{ letterSpacing: '-0.5px' }}>
            Pornește în câteva minute
          </h2>
          <p className="text-text-secondary max-w-2xl mx-auto">
            Configurare simplă, protecție puternică. Începe să îți monitorizezi partenerii de afaceri astăzi.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StepCard
            number={1}
            title="Creează watchlist-ul"
            description="Adaugă până la 25 de companii după CUI. Organizează cu etichete și notițe pentru gestionare ușoară."
          />
          <StepCard
            number={2}
            title="Configurează alertele"
            description="Alege ce contează: proceduri de insolvență, modificări juridice, semnale datorii la stat și altele."
          />
          <StepCard
            number={3}
            title="Rămâi protejat"
            description="Primește notificări instant când apar riscuri. Acționează înainte să îți afecteze fluxul de numerar."
          />
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-surface-paper rounded-2xl p-8 md:p-12">
        <div className="text-center mb-12">
          <p className="text-xs text-text-muted mb-2 uppercase tracking-wide">Funcționalități</p>
          <h2 className="text-3xl md:text-4xl font-semibold text-text-primary mb-4" style={{ letterSpacing: '-0.5px' }}>
            Tot ce ai nevoie pentru gestionarea riscului
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard
            icon={Bell}
            title="Alerte în timp real"
            description="Primește notificări instant pentru proceduri de insolvență, procese, datorii fiscale și modificări juridice."
          />
          <FeatureCard
            icon={Search}
            title="Căutare rapidă CUI"
            description="Verificări rapide de credit pentru orice companie din România. Obține profiluri complete de risc în secunde."
          />
          <FeatureCard
            icon={FileText}
            title="Rapoarte PDF"
            description="Exportă rapoarte detaliate pentru stakeholderi, audituri sau documentație internă."
          />
          <FeatureCard
            icon={TrendingUp}
            title="Tendințe risc"
            description="Urmărește schimbările în timp. Vezi când nivelurile de risc cresc sau scad pentru companiile monitorizate."
          />
          <FeatureCard
            icon={Users}
            title="Colaborare în echipă"
            description="Împărtășește watchlist-uri cu echipa. Setează permisiuni și ține pe toată lumea informată."
          />
          <FeatureCard
            icon={Shield}
            title="Securitate nivel bancar"
            description="Datele tale sunt criptate și protejate cu standarde de securitate de top în industrie."
          />
        </div>
      </section>

      {/* Use Cases */}
      <section>
        <div className="text-center mb-12">
          <p className="text-xs text-text-muted mb-2 uppercase tracking-wide">Cazuri de utilizare</p>
          <h2 className="text-3xl md:text-4xl font-semibold text-text-primary mb-4" style={{ letterSpacing: '-0.5px' }}>
            Construit pentru echipe ca a ta
          </h2>
          <p className="text-text-secondary max-w-2xl mx-auto">
            Fie că ești în vânzări, finanțe sau analiză credit, MarketRisk se adaptează workflow-ului tău.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {useCases.map((useCase) => (
            <UseCaseCard key={useCase.title} {...useCase} />
          ))}
        </div>
      </section>

      {/* Benefits Section */}
      <section>
        <div className="text-center mb-12">
          <p className="text-xs text-text-muted mb-2 uppercase tracking-wide">Beneficii</p>
          <h2 className="text-3xl md:text-4xl font-semibold text-text-primary mb-4" style={{ letterSpacing: '-0.5px' }}>
            Construit pentru alerte — nu supraîncărcare informațională
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <BenefitCard
            icon={AlertTriangle}
            title="Alerte proactive de risc"
            description="Primești avertizări timpurii care îți spun ce s-a schimbat și ce să faci mai departe."
            bullets={['Insolvență & modificări juridice', 'Semnale datorii la stat', 'Context + acțiune recomandată']}
          />
          <BenefitCard
            icon={BarChart3}
            title="Watchlist-uri prietenoase IMM"
            description="Setează o singură dată: monitorizează cele 25 de companii care contează cel mai mult."
            bullets={['Căutare rapidă', 'Etichete + notițe', 'Istoric status clar']}
          />
          <BenefitCard
            icon={CheckCircle2}
            title="Prețuri simple și transparente"
            description='Upgrade self-service, fără credite, fără "contactează vânzările pentru preț".'
            bullets={['Plan gratuit pentru încercare', '99 RON Starter pentru portofolii mici', '299 RON PRO pentru vânzări active', 'Enterprise pentru volum mare']}
          />
          <BenefitCard
            icon={Zap}
            title="Mobile-first în mod implicit"
            description="Proiectat pentru operatori ocupați — verificări rapide, alerte rapide, UI calm."
            bullets={['Tipografie curată', 'Sarcină cognitivă redusă', 'Funcționează excelent pe telefoane']}
          />
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-surface-paper rounded-2xl p-8 md:p-12">
        <div className="text-center mb-12">
          <p className="text-xs text-text-muted mb-2 uppercase tracking-wide">Testimoniale</p>
          <h2 className="text-3xl md:text-4xl font-semibold text-text-primary mb-4" style={{ letterSpacing: '-0.5px' }}>
            Apreciat de afaceri din România
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={index} {...testimonial} />
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section>
        <div className="text-center mb-12">
          <p className="text-xs text-text-muted mb-2 uppercase tracking-wide">Întrebări frecvente</p>
          <h2 className="text-3xl md:text-4xl font-semibold text-text-primary mb-4" style={{ letterSpacing: '-0.5px' }}>
            Întrebări frecvente
          </h2>
          <p className="text-text-secondary max-w-2xl mx-auto">
            Tot ce trebuie să știi despre MarketRisk
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-4">
          <FAQItem
            question="Ce surse de date folosește MarketRisk?"
            answer="Monitorizăm ANAF (autoritatea fiscală), proceduri de insolvență (BPI), procese judiciare (Dosare) și alte registre oficiale românești. Toate datele sunt actualizate în timp real."
          />
          <FAQItem
            question="Sunt limite la câte companii pot monitoriza?"
            answer="Plan gratuit: 3 căutări/lună. Starter: 20 căutări/lună + watchlist 10 companii. PRO: căutări nelimitate + watchlist 250 companii. Enterprise: totul nelimitat."
          />
          <FAQItem
            question="Cât de securizate sunt datele mele?"
            answer="Folosim criptare nivel bancar, conformitate GDPR și stocăm toate datele în centre de date din UE. Watchlist-urile și rapoartele tale nu sunt niciodată partajate cu terți."
          />
          <FAQItem
            question="Pot accesa API-ul?"
            answer="Accesul API este disponibil pentru planurile Enterprise. Contactează echipa noastră de vânzări pentru a discuta opțiuni de integrare și cerințe personalizate."
          />
          <FAQItem
            question="Ce se întâmplă dacă depășesc limitele planului?"
            answer="Te vom notifica când te apropii de limite. Poți face upgrade oricând, sau vom pauzează căutările adiționale până la următorul ciclu de facturare. Fără taxe surpriză."
          />
          <FAQItem
            question="Cât de repede voi primi alerte?"
            answer="Planurile PRO și Enterprise primesc alerte în timp real în câteva minute de la o înregistrare sau modificare. Planurile Starter primesc e-mailuri zilnice rezumative. Planul gratuit include notificări de bază prin email."
          />
        </div>
      </section>

      {/* Pricing Preview */}
      <section>
        <div className="text-center mb-12">
          <p className="text-xs text-text-muted mb-2 uppercase tracking-wide">Prețuri</p>
          <h2 className="text-3xl md:text-4xl font-semibold text-text-primary mb-4" style={{ letterSpacing: '-0.5px' }}>
            Prețuri simple și transparente
          </h2>
          <p className="text-text-secondary max-w-2xl mx-auto mb-8">
            Începe gratuit, upgrade când ești gata. Fără taxe ascunse, fără surprize.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <div className="bg-white border border-border-subtle p-6 rounded-xl">
            <h3 className="text-lg font-medium text-text-primary mb-2">Gratuit</h3>
            <div className="mb-4">
              <span className="text-3xl font-semibold text-text-primary">0 RON</span>
            </div>
            <p className="text-sm text-text-secondary mb-6">Pentru verificări ocazionale</p>
            <ul className="space-y-3 mb-6">
              <li className="text-sm text-text-secondary flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-brand-pistachio mt-0.5 flex-shrink-0" />
                <span>3 căutări CUI / lună</span>
              </li>
              <li className="text-sm text-text-secondary flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-brand-pistachio mt-0.5 flex-shrink-0" />
                <span>Verificări de credit de bază</span>
              </li>
              <li className="text-sm text-text-secondary flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-brand-pistachio mt-0.5 flex-shrink-0" />
                <span>Suport prin email</span>
              </li>
            </ul>
            <PrimaryButton href="/signup" className="w-full">Începe</PrimaryButton>
          </div>

          <div className="bg-brand-mughal-green border-2 border-brand-mughal-green p-6 rounded-xl text-white relative">
            <div className="absolute top-4 right-4">
              <span className="text-xs bg-brand-pistachio text-brand-mughal-green px-2 py-1 rounded font-medium">Cel mai popular</span>
            </div>
            <h3 className="text-lg font-medium text-white mb-2">PRO</h3>
            <div className="mb-4">
              <span className="text-3xl font-semibold text-white">299 RON</span>
              <span className="text-text-inverse-muted text-sm">/lună</span>
            </div>
            <p className="text-sm text-text-inverse-muted mb-6">Pentru echipe de vânzări active</p>
            <ul className="space-y-3 mb-6">
              <li className="text-sm text-text-inverse-muted flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-brand-pistachio mt-0.5 flex-shrink-0" />
                <span>Căutări CUI nelimitate</span>
              </li>
              <li className="text-sm text-text-inverse-muted flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-brand-pistachio mt-0.5 flex-shrink-0" />
                <span>Watchlist 50 CUI</span>
              </li>
              <li className="text-sm text-text-inverse-muted flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-brand-pistachio mt-0.5 flex-shrink-0" />
                <span>Toate alertele activate</span>
              </li>
              <li className="text-sm text-text-inverse-muted flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-brand-pistachio mt-0.5 flex-shrink-0" />
                <span>Export PDF nelimitat</span>
              </li>
              <li className="text-sm text-text-inverse-muted flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-brand-pistachio mt-0.5 flex-shrink-0" />
                <span>Suport prioritar</span>
              </li>
            </ul>
            <Link
              href="/signup"
              className="block w-full px-6 py-3 bg-white text-brand-mughal-green rounded-lg font-medium text-sm hover:bg-brand-paper transition-all duration-normal text-center"
            >
              Începe trial PRO
            </Link>
          </div>

          <div className="bg-white border border-border-subtle p-6 rounded-xl">
            <h3 className="text-lg font-medium text-text-primary mb-2">Enterprise</h3>
            <div className="mb-4">
              <span className="text-3xl font-semibold text-text-primary">Personalizat</span>
            </div>
            <p className="text-sm text-text-secondary mb-6">Pentru nevoi de volum mare</p>
            <ul className="space-y-3 mb-6">
              <li className="text-sm text-text-secondary flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-brand-pistachio mt-0.5 flex-shrink-0" />
                <span>Totul nelimitat</span>
              </li>
              <li className="text-sm text-text-secondary flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-brand-pistachio mt-0.5 flex-shrink-0" />
                <span>Integrări personalizate</span>
              </li>
              <li className="text-sm text-text-secondary flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-brand-pistachio mt-0.5 flex-shrink-0" />
                <span>Suport dedicat</span>
              </li>
              <li className="text-sm text-text-secondary flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-brand-pistachio mt-0.5 flex-shrink-0" />
                <span>Garanții SLA</span>
              </li>
            </ul>
            <Link
              href="/contact"
              className="block w-full px-6 py-3 bg-brand-mughal-green text-white rounded-lg font-medium text-sm hover:bg-brand-mughal-green-2 transition-all duration-normal text-center"
            >
              Contactează vânzările
            </Link>
          </div>
        </div>

        <div className="text-center mt-8">
          <Link
            href="/pricing"
            className="text-sm text-brand-mughal-green hover:text-brand-mughal-green-2 font-medium inline-flex items-center gap-2"
          >
            Vezi prețurile detaliate
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Final CTA Section */}
      <section id="signup-cta" className="bg-brand-mughal-green rounded-2xl p-8 md:p-12 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 5 }}>
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M 70% 70% Q 80% 75%, 85% 85% T 95% 95% Q 98% 98%, 100% 100%"
              stroke="var(--brand-pistachio)"
              strokeWidth="25"
              strokeLinecap="round"
              fill="none"
              opacity="0.3"
            />
          </svg>
        </div>

        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-semibold text-text-inverse mb-4" style={{ letterSpacing: '-0.5px' }}>
            Gata să îți protejezi afacerea?
          </h2>
          <p className="text-lg text-text-inverse-muted mb-8 max-w-2xl mx-auto">
            Începe gratuit astăzi. Fără card necesar, fără angajamente.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/signup"
              className="px-8 py-3 bg-white text-brand-mughal-green rounded-lg font-medium text-sm hover:bg-brand-paper transition-all duration-normal inline-flex items-center justify-center gap-2"
            >
              Creează cont gratuit
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/login"
              className="px-8 py-3 bg-white/10 text-white border border-white/20 rounded-lg font-medium text-sm hover:bg-white/20 transition-all duration-normal inline-flex items-center justify-center"
            >
              Vezi demo produs
            </Link>
          </div>
          <div className="mt-8 flex items-center justify-center gap-6 text-sm text-text-inverse-muted">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>Fără card necesar</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              <span>Plan gratuit disponibil</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
