'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Check, Shield, Clock, RefreshCw, Lock, Star, ArrowRight, Zap, Users, BarChart3, FileText, Bell, TrendingUp, Award, Building2, Calculator, Target, CheckCircle2 } from 'lucide-react'

interface PricingCardProps {
  highlight?: boolean
  name: string
  price: string
  period: string
  description: string
  features: string[]
  cta: string
  href: string
}

function PricingCard({ highlight, name, price, period, description, features, cta, href }: PricingCardProps) {
  return (
    <div
      className={`p-6 rounded-xl border relative flex flex-col h-full ${
        highlight ? 'bg-brand-mughal-green text-white border-border-inverse-subtle' : 'bg-white border-border-subtle'
      }`}
    >
      {highlight && (
        <span
          className="absolute -top-3 right-4 text-[11px] font-semibold bg-brand-pistachio text-brand-mughal-green px-3 py-1 rounded-full shadow-sm"
          style={{ whiteSpace: 'nowrap', display: 'inline-block', minWidth: 'max-content' }}
        >
          ★ Cel mai popular
        </span>
      )}
      <div className="mb-4">
        <p className={`text-sm font-medium ${highlight ? 'text-text-inverse' : 'text-text-primary'}`}>{name}</p>
        <p className={`text-xs ${highlight ? 'text-text-inverse-muted' : 'text-text-muted'}`}>{description}</p>
      </div>

      <div className="mb-4">
        <div className="flex items-baseline gap-2">
          <p className={`text-3xl font-light ${highlight ? 'text-text-inverse' : 'text-text-primary'}`}>{price}</p>
          <p className={`text-xs ${highlight ? 'text-text-inverse-muted' : 'text-text-muted'}`}>{period}</p>
        </div>
      </div>

      <ul className="space-y-2 mb-6 flex-grow">
        {features.map((f) => (
          <li key={f} className={`text-sm flex items-start gap-2 ${highlight ? 'text-text-inverse-muted' : 'text-text-secondary'}`}>
            <Check size={16} className={`${highlight ? 'text-brand-pistachio' : 'text-brand-mughal-green'} mt-[2px] flex-shrink-0`} />
            <span>{f}</span>
          </li>
        ))}
      </ul>

      <Link
        href={href}
        className={`w-full px-6 py-3 rounded-lg font-medium text-sm transition-all duration-normal mt-auto text-center block ${
          highlight
            ? 'bg-white text-brand-mughal-green hover:shadow-sm'
            : 'bg-brand-mughal-green text-white hover:bg-brand-mughal-green-2'
        }`}
      >
        {cta}
      </Link>
    </div>
  )
}

export default function PricingPage() {
  const [isYearly, setIsYearly] = useState(false)

  const testimonials = [
    {
      quote: "MarketRisk ne-a salvat de o datorie de 50.000€. Sistemul de avertizare timpurie a detectat o procedură de insolvență pe care am fi ratat-o.",
      name: "Maria Popescu",
      role: "CFO, TechStart SRL",
      rating: 5,
      company: "TechStart SRL",
      category: "business"
    },
    {
      quote: "Monitorizarea 24/7 ne oferă liniște sufletească. Știm imediat când se schimbă ceva la partenerii noștri.",
      name: "Alexandru Ionescu",
      role: "Manager risc, FinanceCorp",
      rating: 5,
      company: "FinanceCorp",
      category: "business"
    },
    {
      quote: "Cea mai bună investiție a anului. Planul PRO se plătește singur prevenind o singură creanță neîncasată.",
      name: "Elena Radu",
      role: "Director operațiuni, RetailGroup",
      rating: 5,
      company: "RetailGroup",
      category: "business"
    },
    {
      quote: "Prețuri simple și transparente. Fără taxe ascunse, fără surprize. Exact ce aveam nevoie.",
      name: "Cristian Moldovan",
      role: "CEO, ServicePro",
      rating: 5,
      company: "ServicePro",
      category: "business"
    },
    {
      quote: "Echipa de suport este incredibilă. Ne-au ajutat să configurăm watchlist-ul și au răspuns la toate întrebările în câteva ore.",
      name: "Andreea Stan",
      role: "Director financiar, ManufacturingPlus",
      rating: 5,
      company: "ManufacturingPlus",
      category: "business"
    },
    {
      quote: "Am încercat alte soluții, dar MarketRisk este singura construită specific pentru afaceri din România. Se vede diferența.",
      name: "Dragos Constantinescu",
      role: "Șef credit, BankPartners",
      rating: 5,
      company: "BankPartners",
      category: "business"
    },
    {
      quote: "Ca practică contabilă, gestionăm riscul de credit pentru zeci de clienți. MarketRisk ne permite să îi monitorizăm pe toți într-un singur loc. Schimbător de joc!",
      name: "Lucian Popescu",
      role: "Partener senior, Popescu & Asociații",
      rating: 5,
      company: "Popescu & Asociații",
      category: "accountant"
    },
    {
      quote: "Recomandăm MarketRisk tuturor clienților noștri. Rapoartele de export sunt perfecte pentru audituri, iar alertele ne economisesc ore de verificări manuale.",
      name: "Ioana Georgescu",
      role: "Partener managing, Georgescu Accounting Group",
      rating: 5,
      company: "Georgescu Accounting Group",
      category: "accountant"
    },
    {
      quote: "ROI-ul este incredibil. Am ajutat clienții să evite peste 200.000€ în creanțe neîncasate doar anul acesta. Planul PRO se plătește singur în câteva zile.",
      name: "Mihai Constantinescu",
      role: "Contabil șef, FinanceAdvisors RO",
      rating: 5,
      company: "FinanceAdvisors RO",
      category: "accountant"
    },
    {
      quote: "În sfârșit, un instrument construit pentru practici contabile din România. Doar monitorizarea ANAF și dosare judecătorești merită abonamentul.",
      name: "Ana Dumitrescu",
      role: "Director servicii CFO, BusinessConsult",
      rating: 5,
      company: "BusinessConsult",
      category: "accountant"
    },
    {
      quote: "Practica noastră gestionează riscul pentru 150+ clienți. Funcția watchlist din MarketRisk ne permite să îi urmărim pe toți eficient. Cea mai bună decizie.",
      name: "Radu Ionescu",
      role: "Partener, Ionescu & Parteneri",
      rating: 5,
      company: "Ionescu & Parteneri",
      category: "accountant"
    },
    {
      quote: "Funcțiile de raportare pentru clienți sunt excepționale. Exportăm PDF-uri direct pentru întâlniri. Profesionale și complete de fiecare dată.",
      name: "Carmen Stoica",
      role: "Contabil senior, Stoica Financial Services",
      rating: 5,
      company: "Stoica Financial Services",
      category: "accountant"
    }
  ]

  const trustBadges = [
    {
      icon: Clock,
      title: "Suport 24/7",
      description: "Asistență non-stop oricând ai nevoie. Echipa noastră este mereu gata să ajute. Timp mediu de răspuns sub 2 ore."
    },
    {
      icon: RefreshCw,
      title: "Garanție 30 zile bani înapoi",
      description: "Nu ești mulțumit? Primești banii înapoi în 30 de zile, fără întrebări. Suntem siguri că vei adora."
    },
    {
      icon: Shield,
      title: "Securitate nivel bancar",
      description: "Datele tale sunt criptate și protejate cu standarde de securitate de top în industrie. Conformi GDPR și certificați SOC 2."
    },
    {
      icon: Lock,
      title: "Plăți securizate",
      description: "Toate plățile sunt procesate securizat prin gateway-uri de plată conforme PCI. Datele tale financiare nu sunt niciodată stocate."
    },
    {
      icon: Users,
      title: "De încredere pentru 500+ companii",
      description: "Sute de contabili, practici și afaceri au încredere în MarketRisk să le protejeze fluxul de numerar zilnic."
    },
    {
      icon: Award,
      title: "99.9% Uptime SLA",
      description: "Fiabilitate de nivel enterprise. Monitorizarea ta nu se oprește niciodată, asigurându-te că nu ratezi nicio alertă critică."
    }
  ]

  const valueProps = [
    {
      icon: Zap,
      title: "Monitorizare în timp real",
      description: "Primește alerte instant când apar proceduri de insolvență, dosare judecătorești sau datorii fiscale. Nu rata niciodată o actualizare critică."
    },
    {
      icon: Users,
      title: "Colaborare în echipă",
      description: "Împărtășește watchlist-uri cu echipa. Setează permisiuni, adaugă notițe și ține pe toată lumea informată."
    },
    {
      icon: BarChart3,
      title: "Rapoarte cuprinzătoare",
      description: "Exportă rapoarte PDF detaliate pentru stakeholderi, audituri sau documentație internă."
    },
    {
      icon: Bell,
      title: "Alerte inteligente",
      description: "Personalizează preferințele de alertă. Primește notificări prin email, SMS sau notificări în aplicație."
    }
  ]

  const faqs = [
    {
      q: "Ce se întâmplă dacă depășesc limitele planului?",
      a: "Te vom notifica când te apropii de limite. Poți face upgrade oricând, sau vom pauzează căutările adiționale până la următorul ciclu de facturare. Fără taxe surpriză."
    },
    {
      q: "Pot schimba planurile mai târziu?",
      a: "Absolut! Fă upgrade sau downgrade oricând. Modificările intră în vigoare imediat, iar facturarea se proratează corespunzător."
    },
    {
      q: "Ce metode de plată acceptați?",
      a: "Acceptăm toate cardurile majore (Visa, Mastercard, American Express) și transfer bancar pentru planurile Enterprise. Toate plățile sunt procesate securizat prin Stripe."
    },
    {
      q: "Există taxă de setup?",
      a: "Nu există taxe de setup, niciodată. Ce vezi este ce plătești. Fără costuri ascunse, fără surprize."
    },
    {
      q: "Cum funcționează garanția bani înapoi?",
      a: "Dacă nu ești mulțumit de MarketRisk în primele 30 de zile, contactează-ne și vom emite o rambursare completă. Fără întrebări, fără bătaie de cap."
    },
    {
      q: "Ce fel de suport oferiți?",
      a: "Toate planurile includ suport prin email. Planurile PRO și Enterprise primesc suport prioritar cu timpi de răspuns mai rapizi. Clienții Enterprise primesc și gestionare dedicată a contului."
    },
    {
      q: "Pot testa înainte de a cumpăra?",
      a: "Da! Planul nostru gratuit îți permite să încerci 3 căutări CUI pe lună fără cost. Nu este necesar card bancar."
    },
    {
      q: "Cât de securizate sunt datele mele?",
      a: "Folosim criptare nivel bancar, audituri regulate de securitate și suntem conformi GDPR. Datele tale sunt stocate securizat în centre de date din UE și nu sunt niciodată partajate cu terți."
    },
    {
      q: "Ce se întâmplă cu datele mele dacă anulez?",
      a: "Poți exporta toate datele oricând. După anulare, păstrăm datele 30 de zile, apoi le ștergem permanent decât dacă soliciți ștergerea mai devreme."
    },
    {
      q: "Oferiți reduceri pentru planuri anuale?",
      a: "Da! Planurile anuale te fac să economisești 2 luni față de facturarea lunară. Asta înseamnă o reducere de 16.7%."
    }
  ]

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="text-center">
        <div className="max-w-3xl mx-auto">
          <p className="text-xs text-text-muted mb-2 uppercase tracking-wide">Prețuri</p>
          <h1 className="text-4xl md:text-5xl font-semibold text-text-primary mb-4" style={{ letterSpacing: '-0.8px' }}>
            Prețuri simple și transparente care cresc cu tine
          </h1>
          <p className="text-lg text-text-secondary mb-8">
            Fără taxe ascunse. Fără &quot;contactează vânzările&quot;. Alege planul potrivit nevoilor tale și fă upgrade oricând.
          </p>

          {/* Trust Indicators */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-text-secondary mb-8">
            <div className="flex items-center gap-2">
              <Check size={16} className="text-brand-mughal-green" />
              <span>Garanție 30 zile bani înapoi</span>
            </div>
            <div className="flex items-center gap-2">
              <Check size={16} className="text-brand-mughal-green" />
              <span>Suport 24/7</span>
            </div>
            <div className="flex items-center gap-2">
              <Check size={16} className="text-brand-mughal-green" />
              <span>Plăți securizate</span>
            </div>
            <div className="flex items-center gap-2">
              <Check size={16} className="text-brand-mughal-green" />
              <span>Fără card necesar pentru plan Gratuit</span>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof - Trusted By */}
      <section className="bg-surface-paper rounded-2xl p-8 md:p-12">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Users className="w-6 h-6 text-brand-mughal-green" />
            <h2 className="text-2xl md:text-3xl font-semibold text-text-primary" style={{ letterSpacing: '-0.5px' }}>
              De încredere pentru sute de contabili și practici
            </h2>
          </div>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            Alătură-te peste 500+ afaceri din România, practici contabile și consilieri financiari care au încredere în MarketRisk să le protejeze fluxul de numerar și să ia decizii de creditare informate.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-10">
          <div className="text-center">
            <div className="text-4xl font-bold text-brand-mughal-green mb-2">500+</div>
            <div className="text-sm text-text-secondary">Companii active</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-brand-mughal-green mb-2">150+</div>
            <div className="text-sm text-text-secondary">Practici contabile</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-brand-mughal-green mb-2">2M+€</div>
            <div className="text-sm text-text-secondary">Datorii prevenite</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-brand-mughal-green mb-2">99.9%</div>
            <div className="text-sm text-text-secondary">Garanție Uptime</div>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section>
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 gap-4">
          <div>
            <p className="text-xs text-text-muted mb-2">Alege planul tău</p>
            <h2 className="text-2xl font-semibold text-text-primary" style={{ letterSpacing: '-0.3px' }}>
              Planuri care cresc odată cu afacerea ta
            </h2>
          </div>

          {/* Billing Toggle */}
          <div className="flex items-center gap-3 bg-surface-bone p-1.5 rounded-xl">
            <button
              type="button"
              onClick={() => setIsYearly(false)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-normal ${
                !isYearly
                  ? 'bg-white text-text-primary shadow-sm'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              Lunar
            </button>
            <button
              type="button"
              onClick={() => setIsYearly(true)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-normal flex items-center gap-2 ${
                isYearly
                  ? 'bg-white text-text-primary shadow-sm'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              Anual
              <span className="text-xs bg-brand-mughal-green text-white px-2 py-0.5 rounded">
                2 luni gratuite
              </span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <PricingCard
            name="Gratuit"
            price="0 RON"
            period=""
            description="Perfect pentru a testa MarketRisk"
            features={[
              '3 căutări CUI / lună',
              'Verificări de credit de bază',
              'Suport prin email',
              'Acces aplicație mobilă',
              'Fără card necesar'
            ]}
            cta="Începe gratuit"
            href="/signup"
          />
          <PricingCard
            name="Starter"
            price={isYearly ? '390 RON' : '39 RON'}
            period={isYearly ? 'pe an' : 'pe lună'}
            description="Ideal pentru portofolii mici"
            features={[
              '20 căutări CUI / lună',
              '10 CUI în watchlist',
              'Alerte insolvență',
              '5 exporturi PDF / lună',
              '5 utilizatori în echipă',
              'Suport prioritar prin email'
            ]}
            cta="Începe Starter"
            href="/signup"
          />
          <PricingCard
            highlight
            name="PRO"
            price={isYearly ? '990 RON' : '99 RON'}
            period={isYearly ? 'pe an' : 'pe lună'}
            description="Cel mai bun pentru echipe B2B active"
            features={[
              'Căutări CUI nelimitate',
              '250 CUI în watchlist',
              'Alerte în timp real',
              'Dosare judecătorești & datorii fiscale',
              'Exporturi PDF nelimitate',
              'Utilizatori echipă personalizați',
              'Suport prioritar',
              'Analiză avansată'
            ]}
            cta="Începe PRO"
            href="/signup"
          />
          <PricingCard
            name="Enterprise"
            price="Personalizat"
            period=""
            description="Pentru volum mare și instituții financiare"
            features={[
              'Tot din PRO',
              'Watchlist nelimitat',
              'Acces admin',
              'Integrare API completă',
              'Suport dedicat',
              'Integrări personalizate',
              'Garanții SLA',
              'Opțiuni on-premise'
            ]}
            cta="Contactează vânzările"
            href="/contact"
          />
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-text-secondary">
            Toate planurile includ suport 24/7, securitate nivel bancar și garanție 30 zile bani înapoi.
          </p>
        </div>
      </section>

      {/* Why Accountants Choose Us */}
      <section>
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Calculator className="w-8 h-8 text-brand-mughal-green" />
            <h2 className="text-3xl md:text-4xl font-semibold text-text-primary" style={{ letterSpacing: '-0.5px' }}>
              De ce aleg contabilii MarketRisk
            </h2>
          </div>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            Construit special pentru practici contabile din România. Simplifică workflow-ul, protejează clienții și economisește ore în fiecare săptămână.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white border border-border-subtle p-6 rounded-xl hover:shadow-sm transition-all duration-normal">
            <div className="w-12 h-12 bg-brand-pistachio/10 rounded-lg flex items-center justify-center mb-4">
              <Building2 className="w-6 h-6 text-brand-mughal-green" />
            </div>
            <h3 className="text-lg font-medium text-text-primary mb-2">Gestionare multi-client</h3>
            <p className="text-sm text-text-secondary">
              Monitorizează riscul de credit pentru zeci de clienți într-un tablou de bord unificat. Organizează pe client, adaugă notițe și generează rapoarte instant.
            </p>
          </div>

          <div className="bg-white border border-border-subtle p-6 rounded-xl hover:shadow-sm transition-all duration-normal">
            <div className="w-12 h-12 bg-brand-pistachio/10 rounded-lg flex items-center justify-center mb-4">
              <FileText className="w-6 h-6 text-brand-mughal-green" />
            </div>
            <h3 className="text-lg font-medium text-text-primary mb-2">Rapoarte gata pentru audit</h3>
            <p className="text-sm text-text-secondary">
              Exportă rapoarte PDF profesionale perfecte pentru întâlniri cu clienții și audituri. Include toate datele relevante cu un singur click.
            </p>
          </div>

          <div className="bg-white border border-border-subtle p-6 rounded-xl hover:shadow-sm transition-all duration-normal">
            <div className="w-12 h-12 bg-brand-pistachio/10 rounded-lg flex items-center justify-center mb-4">
              <TrendingUp className="w-6 h-6 text-brand-mughal-green" />
            </div>
            <h3 className="text-lg font-medium text-text-primary mb-2">Dovedește-ți valoarea</h3>
            <p className="text-sm text-text-secondary">
              Arată clienților exact cât de multe datorii neîncasate i-ai ajutat să evite. Cuantifică valoarea ta consultativă cu cifre reale.
            </p>
          </div>

          <div className="bg-white border border-border-subtle p-6 rounded-xl hover:shadow-sm transition-all duration-normal">
            <div className="w-12 h-12 bg-brand-pistachio/10 rounded-lg flex items-center justify-center mb-4">
              <Bell className="w-6 h-6 text-brand-mughal-green" />
            </div>
            <h3 className="text-lg font-medium text-text-primary mb-2">Sistem avertizare timpurie</h3>
            <p className="text-sm text-text-secondary">
              Primește alerte înainte ca problemele să escaladeze. Proceduri de insolvență, dosare judecătorești și datorii fiscale—toate în timp real.
            </p>
          </div>

          <div className="bg-white border border-border-subtle p-6 rounded-xl hover:shadow-sm transition-all duration-normal">
            <div className="w-12 h-12 bg-brand-pistachio/10 rounded-lg flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-brand-mughal-green" />
            </div>
            <h3 className="text-lg font-medium text-text-primary mb-2">Colaborare în echipă</h3>
            <p className="text-sm text-text-secondary">
              Împărtășește acces cu echipa. Atribuie clienți membrilor echipei, setează permisiuni și colaborează fără probleme.
            </p>
          </div>

          <div className="bg-white border border-border-subtle p-6 rounded-xl hover:shadow-sm transition-all duration-normal">
            <div className="w-12 h-12 bg-brand-pistachio/10 rounded-lg flex items-center justify-center mb-4">
              <Target className="w-6 h-6 text-brand-mughal-green" />
            </div>
            <h3 className="text-lg font-medium text-text-primary mb-2">Focusat pe România</h3>
            <p className="text-sm text-text-secondary">
              Construit specific pentru date de afaceri din România: ANAF, dosare judecătorești, proceduri de insolvență. Fără soluții internaționale generice.
            </p>
          </div>
        </div>
      </section>

      {/* ROI Calculator */}
      <section className="bg-brand-mughal-green rounded-2xl p-8 md:p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
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

        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <TrendingUp className="w-12 h-12 text-brand-pistachio mx-auto mb-4" />
            <h2 className="text-3xl md:text-4xl font-semibold text-text-inverse mb-4" style={{ letterSpacing: '-0.5px' }}>
              Calculează ROI-ul tău
            </h2>
            <p className="text-text-inverse-muted text-lg">
              Vezi cât poate economisi MarketRisk pentru practica ta
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 text-center">
              <div className="text-3xl font-bold text-brand-pistachio mb-2">12x</div>
              <div className="text-sm text-text-inverse-muted mb-4">ROI mediu</div>
              <div className="text-xs text-text-inverse">
                Clienții planului PRO economisesc în medie 1.200€/lună în datorii prevenite
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 text-center">
              <div className="text-3xl font-bold text-brand-pistachio mb-2">15 ore</div>
              <div className="text-sm text-text-inverse-muted mb-4">Timp economisit/săptămână</div>
              <div className="text-xs text-text-inverse">
                Automatizează verificările de credit și monitorizarea în loc de cercetare manuală
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 text-center">
              <div className="text-3xl font-bold text-brand-pistachio mb-2">50.000€+</div>
              <div className="text-sm text-text-inverse-muted mb-4">Medie prevenită</div>
              <div className="text-xs text-text-inverse">
                Suma tipică de datorii neîncasate prevenite pe client pe an
              </div>
            </div>
          </div>

          <div className="mt-10 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6">
            <div className="flex items-start gap-4">
              <CheckCircle2 className="w-6 h-6 text-brand-pistachio flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-lg font-semibold text-text-inverse mb-2">Exemplu real</h3>
                <p className="text-sm text-text-inverse-muted">
                  O practică contabilă din București cu 80 de clienți folosește MarketRisk PRO (99 RON/lună) pentru a monitoriza
                  toți furnizorii și clienții acestora. În primul trimestru, au prevenit 45.000€ în datorii neîncasate detectând
                  avertismente timpurii de insolvență. Asta înseamnă un ROI de 150x—și asta doar într-un trimestru.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-surface-paper rounded-2xl p-8 md:p-12">
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-2 mb-3">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={24} className="text-brand-pistachio fill-brand-pistachio" />
            ))}
          </div>
          <h2 className="text-3xl md:text-4xl font-semibold text-text-primary mb-4" style={{ letterSpacing: '-0.5px' }}>
            Apreciat de contabili și afaceri
          </h2>
          <p className="text-text-secondary text-lg">
            Vezi ce spun practicile contabile și companiile despre MarketRisk
          </p>
        </div>

        <div className="space-y-8">
          {/* Accountant Testimonials */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <Calculator className="w-6 h-6 text-brand-mughal-green" />
              <h3 className="text-xl font-semibold text-text-primary">De la practici contabile</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {testimonials.filter(t => t.category === 'accountant').map((testimonial, idx) => (
                <div key={idx} className="bg-white border border-border-subtle rounded-xl p-6 hover:shadow-sm transition-all duration-normal">
                  <div className="flex items-center gap-1 mb-3">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} size={14} className="text-brand-pistachio fill-brand-pistachio" />
                    ))}
                  </div>
                  <p className="text-text-secondary text-sm mb-4 italic">&ldquo;{testimonial.quote}&rdquo;</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-surface-bone rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-medium text-text-primary">
                        {testimonial.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-text-primary">{testimonial.name}</p>
                      <p className="text-xs text-text-muted">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Business Testimonials */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <Building2 className="w-6 h-6 text-brand-mughal-green" />
              <h3 className="text-xl font-semibold text-text-primary">De la afaceri</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {testimonials.filter(t => t.category === 'business').map((testimonial, idx) => (
                <div key={idx} className="bg-white border border-border-subtle rounded-xl p-6 hover:shadow-sm transition-all duration-normal">
                  <div className="flex items-center gap-1 mb-3">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} size={14} className="text-brand-pistachio fill-brand-pistachio" />
                    ))}
                  </div>
                  <p className="text-text-secondary text-sm mb-4 italic">&ldquo;{testimonial.quote}&rdquo;</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-surface-bone rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-medium text-text-primary">
                        {testimonial.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-text-primary">{testimonial.name}</p>
                      <p className="text-xs text-text-muted">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section>
        <div className="mb-6 text-center">
          <p className="text-xs text-text-muted mb-2">De ce să alegi MarketRisk</p>
          <h2 className="text-2xl font-semibold text-text-primary" style={{ letterSpacing: '-0.3px' }}>
            Liniștea ta sufletească este prioritatea noastră
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trustBadges.map((badge, idx) => (
            <div key={idx} className="bg-white border border-border-subtle p-6 rounded-xl hover:shadow-sm transition-all duration-normal text-center">
              <div className="w-12 h-12 bg-surface-bone rounded-lg flex items-center justify-center mx-auto mb-4">
                <badge.icon size={24} className="text-brand-mughal-green" />
              </div>
              <h3 className="text-lg font-medium text-text-primary mb-2">{badge.title}</h3>
              <p className="text-sm text-text-secondary">{badge.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Value Proposition */}
      <section>
        <div className="mb-6">
          <p className="text-xs text-text-muted mb-2">Valoare</p>
          <h2 className="text-2xl font-semibold text-text-primary" style={{ letterSpacing: '-0.3px' }}>
            Mai mult decât monitorizare—informații complete de risc
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {valueProps.map((prop, idx) => (
            <div key={idx} className="bg-white border border-border-subtle p-6 rounded-xl hover:shadow-sm transition-all duration-normal">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-surface-bone flex items-center justify-center rounded-lg flex-shrink-0">
                  <prop.icon size={20} className="text-brand-mughal-green" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-lg font-medium text-text-primary mb-2">{prop.title}</h3>
                  <p className="text-sm text-text-secondary">{prop.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQs */}
      <section>
        <div className="flex items-end justify-between mb-6">
          <div>
            <p className="text-xs text-text-muted mb-2">Întrebări frecvente</p>
            <h2 className="text-2xl font-semibold text-text-primary" style={{ letterSpacing: '-0.3px' }}>
              Tot ce trebuie să știi
            </h2>
          </div>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <details key={idx} className="bg-white border border-border-subtle rounded-xl p-4 group">
              <summary className="cursor-pointer text-sm font-medium text-text-primary flex items-center justify-between">
                <span>{faq.q}</span>
                <ArrowRight size={16} className="text-text-muted transform transition-transform duration-normal group-open:rotate-90" />
              </summary>
              <p className="text-sm text-text-secondary mt-3">{faq.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-brand-mughal-green rounded-2xl p-8 md:p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <rect
              x="6%"
              y="16%"
              width="420"
              height="260"
              rx="4"
              fill="none"
              stroke="rgba(220, 222, 197, 0.28)"
              strokeWidth="1"
            />
          </svg>
        </div>
        <div className="relative z-10 max-w-2xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-semibold text-text-inverse mb-4" style={{ letterSpacing: '-0.5px' }}>
            Gata să îți protejezi afacerea?
          </h2>
          <p className="text-text-inverse-muted text-lg mb-6">
            Începe cu planul nostru gratuit—fără card necesar. Fă upgrade oricând ești gata.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/signup"
              className="px-6 py-3 bg-white text-brand-mughal-green rounded-lg font-medium text-sm hover:shadow-sm transition-all duration-normal inline-block"
            >
              Începe gratuit
            </Link>
            <Link
              href="/contact"
              className="px-6 py-3 bg-white/10 text-white border border-white/20 rounded-lg font-medium text-sm hover:bg-white/20 transition-all duration-normal inline-block"
            >
              Vorbește cu vânzările
            </Link>
          </div>
          <p className="text-text-inverse-muted text-xs mt-4">
            Garanție 30 zile bani înapoi • Suport 24/7 • Securitate nivel bancar
          </p>
        </div>
      </section>
    </div>
  )
}
