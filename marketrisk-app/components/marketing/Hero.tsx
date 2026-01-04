'use client'

// Hero section for MarketRisk homepage
// Converted from creator-dashboard HeroV4 with MarketRisk branding

import { Check } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

interface HeroProps {
  locale?: 'ro' | 'en'
}

// Analytics Dashboard Mockup
function AnalyticsMockup({ locale = 'ro' }: { locale?: 'ro' | 'en' }) {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)
  const [hoveredBar, setHoveredBar] = useState<number | null>(null)
  const [animated, setAnimated] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), 100)
    return () => clearTimeout(timer)
  }, [])

  const text = {
    ro: {
      overview: 'Panou de Control',
      riskMonitoring: 'Monitorizare Risc',
      lastDays: 'Ultimele 7 zile',
      last30Days: 'Ultimele 30 zile',
      monitored: { label: 'Monitorizați', value: '25', change: '+3 săptămâna asta' },
      alerts: { label: 'Alerte', value: '12', change: '3 noi astăzi' },
      atRisk: { label: 'Risc Ridicat', value: '2', change: 'Acțiune necesară' },
      healthy: { label: 'Sănătoși', value: '23', change: 'Totul OK' },
      riskTrends: 'Tendințe Risc',
      alertsLegend: 'Alerte',
      resolvedLegend: 'Rezolvate',
      insolvencyChecks: 'Verificări Insolvență',
      debtUpdates: 'Actualizări Datorii',
      statusChanges: 'Schimbări Status',
    },
    en: {
      overview: 'Overview Dashboard',
      riskMonitoring: 'Risk Monitoring Analytics',
      lastDays: 'Last 7 days',
      last30Days: 'Last 30 days',
      monitored: { label: 'Monitored', value: '25', change: '+3 this week' },
      alerts: { label: 'Alerts', value: '12', change: '3 new today' },
      atRisk: { label: 'At Risk', value: '2', change: 'Action needed' },
      healthy: { label: 'Healthy', value: '23', change: 'All clear' },
      riskTrends: 'Risk Trends',
      alertsLegend: 'Alerts',
      resolvedLegend: 'Resolved',
      insolvencyChecks: 'Insolvency Checks',
      debtUpdates: 'Debt Updates',
      statusChanges: 'Status Changes',
    },
  }

  const t = text[locale]
  const cards = [t.monitored, t.alerts, t.atRisk, t.healthy]
  const stats = [
    { label: t.insolvencyChecks, value: '156' },
    { label: t.debtUpdates, value: '89' },
    { label: t.statusChanges, value: '23' },
  ]

  return (
    <div className="bg-white rounded-xl p-6 shadow-2xl border border-gray-200 max-w-4xl mx-auto transition-all duration-300 hover:shadow-[0_20px_50px_rgba(0,0,0,0.15)] hover:scale-[1.02] cursor-pointer group">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-xs text-gray-600 mb-1">{t.overview}</p>
          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-[#2F5232] transition-colors duration-300">
            {t.riskMonitoring}
          </h3>
        </div>
        <select className="text-xs bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-gray-900 hover:border-[#2F5232] transition-colors duration-200 cursor-pointer">
          <option>{t.lastDays}</option>
          <option>{t.last30Days}</option>
        </select>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {cards.map((card, i) => (
          <div
            key={i}
            className={`bg-gray-50 rounded-lg p-3 border border-gray-200 transition-all duration-200 cursor-pointer ${
              hoveredCard === i
                ? 'border-[#2F5232] shadow-md scale-105 bg-[#2F5232]/5'
                : 'hover:border-[#2F5232]/50 hover:shadow-sm'
            }`}
            onMouseEnter={() => setHoveredCard(i)}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <p className="text-xs text-gray-600 mb-1">{card.label}</p>
            <p
              className={`text-lg font-semibold text-gray-900 transition-all duration-200 ${
                hoveredCard === i ? 'text-[#2F5232] scale-110' : ''
              }`}
            >
              {card.value}
            </p>
            <p
              className={`text-xs mt-1 ${
                i === 0 || i === 3 ? 'text-[#2F5232]' : i === 1 ? 'text-yellow-600' : 'text-red-600'
              }`}
            >
              {card.change}
            </p>
          </div>
        ))}
      </div>

      {/* Chart Area */}
      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:border-[#2F5232]/50 transition-colors duration-200">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-sm font-semibold text-gray-900">{t.riskTrends}</h4>
          <div className="flex items-center gap-3 text-xs">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-[#2F5232]"></div>
              <span className="text-gray-600">{t.alertsLegend}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-[#8ACA74]"></div>
              <span className="text-gray-600">{t.resolvedLegend}</span>
            </div>
          </div>
        </div>
        {/* Bar chart */}
        <div className="flex items-end justify-between gap-2 h-32">
          {[25, 85, 38, 92, 22, 71, 48].map((height, i) => (
            <div
              key={i}
              className="flex-1 flex flex-col items-center gap-1"
              onMouseEnter={() => setHoveredBar(i)}
              onMouseLeave={() => setHoveredBar(null)}
            >
              <div
                className={`w-full rounded-t transition-all duration-300 cursor-pointer ${
                  hoveredBar === i ? 'opacity-80 scale-105 shadow-lg' : 'hover:opacity-90 hover:scale-[1.02]'
                } ${animated ? 'opacity-100' : 'opacity-0'}`}
                style={{
                  height: animated ? `${height}%` : '0%',
                  backgroundColor: i % 2 === 0 ? '#2F5232' : '#8ACA74',
                  minHeight: '20px',
                  transitionDelay: `${i * 50}ms`,
                }}
              ></div>
              <span
                className={`text-xs text-gray-600 transition-colors duration-200 ${
                  hoveredBar === i ? 'text-[#2F5232] font-semibold' : ''
                }`}
              >
                {['L', 'M', 'M', 'J', 'V', 'S', 'D'][i]}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Stats Row */}
      <div className="grid grid-cols-3 gap-3 mt-4">
        {stats.map((stat, i) => (
          <div
            key={i}
            className="bg-gray-50 rounded-lg p-3 border border-gray-200 hover:border-[#2F5232] hover:shadow-sm hover:scale-105 transition-all duration-200 cursor-pointer"
          >
            <p className="text-xs text-gray-600 mb-1">{stat.label}</p>
            <p className="text-sm font-semibold text-gray-900">{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export function Hero({ locale = 'ro' }: HeroProps) {
  const text = {
    ro: {
      badge: 'Acces Anticipat Disponibil',
      title: 'Oprește datoriile nerecuperate înainte să-ți oprească afacerea',
      subtitle:
        'Monitorizează riscul de credit pentru partenerii tăi din România. Primești alerte inteligente când se schimbă ceva—astfel poți acționa rapid și îți protejezi fluxul de numerar.',
      ctaPrimary: 'Începe gratuit',
      ctaSecondary: 'Vezi cum funcționează',
      feature1: 'Plan gratuit disponibil',
      feature2: 'Fără card necesar',
      feature3: 'Lansare Q1 2025',
    },
    en: {
      badge: 'Early Access Available',
      title: 'Stop bad debt before it stops your business',
      subtitle:
        'Monitor credit risk for your Romanian SME partners. Get smart alerts when something changes—so you can act fast and protect your cashflow.',
      ctaPrimary: 'Start for free',
      ctaSecondary: 'See how it works',
      feature1: 'Free plan available',
      feature2: 'No credit card required',
      feature3: 'Launching Q1 2025',
    },
  }

  const t = text[locale]

  return (
    <section className="bg-gradient-to-br from-[#2F5232] via-[#3A6440] to-[#2F5232] rounded-2xl p-6 md:p-9 relative overflow-visible pb-8">
      {/* Background pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-10 overflow-hidden rounded-2xl" style={{ zIndex: 5 }}>
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#8ACA74" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid-pattern)" />
        </svg>
      </div>

      {/* Floating elements */}
      <div className="absolute top-10 right-10 w-32 h-32 bg-[#8ACA74]/20 rounded-full blur-3xl" style={{ zIndex: 5 }}></div>
      <div className="absolute bottom-20 left-10 w-24 h-24 bg-[#8ACA74]/15 rounded-full blur-2xl" style={{ zIndex: 5 }}></div>

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Top Content */}
        <div className="text-center">
          <div className="inline-block px-4 py-2 bg-[#8ACA74]/20 rounded-full mb-4">
            <p className="text-[#8ACA74] text-sm font-medium">{t.badge}</p>
          </div>
          <h1
            className="text-4xl md:text-6xl font-semibold text-white mb-4 leading-tight"
            style={{ letterSpacing: '-1.2px' }}
          >
            {t.title}
          </h1>
          <p className="text-white/80 text-lg md:text-xl max-w-2xl mx-auto mb-6 leading-relaxed">
            {t.subtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-4">
            <Link
              href={`/${locale}/signup`}
              className="px-6 py-3 bg-[#8ACA74] text-[#2F5232] rounded-lg font-medium text-sm hover:bg-[#9DD685] transition-all duration-200"
            >
              {t.ctaPrimary}
            </Link>
            <Link
              href={`/${locale}/pricing`}
              className="px-6 py-3 bg-white text-[#2F5232] rounded-lg font-medium text-sm hover:shadow-sm transition-all duration-200"
            >
              {t.ctaSecondary}
            </Link>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-white/70 mb-8">
            <div className="flex items-center gap-2">
              <Check size={16} className="text-[#8ACA74] flex-shrink-0" />
              <span>{t.feature1}</span>
            </div>
            <div className="flex items-center gap-2">
              <Check size={16} className="text-[#8ACA74] flex-shrink-0" />
              <span>{t.feature2}</span>
            </div>
            <div className="flex items-center gap-2">
              <Check size={16} className="text-[#8ACA74] flex-shrink-0" />
              <span>{t.feature3}</span>
            </div>
          </div>
        </div>

        {/* Analytics Dashboard Mockup */}
        <div className="relative z-20 mt-8">
          <AnalyticsMockup locale={locale} />
        </div>
      </div>
    </section>
  )
}
