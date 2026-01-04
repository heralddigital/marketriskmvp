'use client'

// Features section for MarketRisk marketing pages
// Showcases key platform features

import {
  Bell,
  FileText,
  Shield,
  TrendingUp,
  Zap,
  Search,
  Clock,
  BarChart3,
} from 'lucide-react'

interface FeaturesProps {
  locale?: 'ro' | 'en'
}

export function Features({ locale = 'ro' }: FeaturesProps) {
  const text = {
    ro: {
      badge: 'Funcționalități',
      title: 'Tot ce ai nevoie pentru a gestiona riscul de credit',
      subtitle:
        'Platformă completă pentru monitorizarea partenerilor de afaceri din România',
      features: [
        {
          icon: Search,
          title: 'Căutare Companii',
          description:
            'Caută orice companie din România folosind CUI. Date în timp real de la ANAF, BPI și PortalJust.',
        },
        {
          icon: Shield,
          title: 'Scor de Risc Multi-Factor',
          description:
            'Algoritm proprietar care analizează 24 de factori pentru a calcula scorul de risc: GREEN, YELLOW sau RED.',
        },
        {
          icon: Bell,
          title: 'Alerte Inteligente',
          description:
            'Primești notificări automate când se schimbă statusul companiilor monitorizate.',
        },
        {
          icon: FileText,
          title: 'Rapoarte PDF',
          description:
            'Generează rapoarte profesionale cu informații complete despre companie și factori de risc.',
        },
        {
          icon: TrendingUp,
          title: 'Monitorizare Watchlist',
          description:
            'Salvează companiile importante în watchlist și urmărește evoluția lor în timp.',
        },
        {
          icon: BarChart3,
          title: 'Istoric Risc',
          description:
            'Vezi cum a evoluat scorul de risc al companiei în ultimele 12 luni.',
        },
        {
          icon: Zap,
          title: 'API Acces',
          description:
            'Integrează MarketRisk în sistemele tale cu API RESTful (plan Business).',
        },
        {
          icon: Clock,
          title: 'Date în Timp Real',
          description:
            'Informații actualizate zilnic de la surse oficiale: ANAF, Buletinul Procedurilor de Insolvență.',
        },
      ],
    },
    en: {
      badge: 'Features',
      title: 'Everything you need to manage credit risk',
      subtitle: 'Complete platform for monitoring your Romanian business partners',
      features: [
        {
          icon: Search,
          title: 'Company Search',
          description:
            'Search any Romanian company using CUI. Real-time data from ANAF, BPI and PortalJust.',
        },
        {
          icon: Shield,
          title: 'Multi-Factor Risk Score',
          description:
            'Proprietary algorithm analyzing 24 factors to calculate risk score: GREEN, YELLOW or RED.',
        },
        {
          icon: Bell,
          title: 'Smart Alerts',
          description:
            'Get automatic notifications when the status of monitored companies changes.',
        },
        {
          icon: FileText,
          title: 'PDF Reports',
          description:
            'Generate professional reports with complete company information and risk factors.',
        },
        {
          icon: TrendingUp,
          title: 'Watchlist Monitoring',
          description:
            'Save important companies to your watchlist and track their evolution over time.',
        },
        {
          icon: BarChart3,
          title: 'Risk History',
          description: 'See how the company risk score has evolved over the last 12 months.',
        },
        {
          icon: Zap,
          title: 'API Access',
          description:
            'Integrate MarketRisk into your systems with RESTful API (Business plan).',
        },
        {
          icon: Clock,
          title: 'Real-Time Data',
          description:
            'Information updated daily from official sources: ANAF, Insolvency Bulletin.',
        },
      ],
    },
  }

  const t = text[locale]

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-block px-4 py-2 bg-[#2F5232]/10 rounded-full mb-4">
            <p className="text-[#2F5232] text-sm font-medium">{t.badge}</p>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{t.title}</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">{t.subtitle}</p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {t.features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-6 border border-gray-200 hover:border-[#2F5232] hover:shadow-lg transition-all duration-300 group"
            >
              <div className="w-12 h-12 bg-[#2F5232]/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-[#2F5232] group-hover:scale-110 transition-all duration-300">
                <feature.icon className="w-6 h-6 text-[#2F5232] group-hover:text-white transition-colors duration-300" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-[#2F5232] transition-colors duration-300">
                {feature.title}
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
