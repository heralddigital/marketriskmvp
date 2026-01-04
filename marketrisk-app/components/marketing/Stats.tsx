'use client'

// Stats/Numbers section
// Shows platform metrics and social proof

import { Building2, FileSearch, TrendingUp, Users } from 'lucide-react'

interface StatsProps {
  locale?: 'ro' | 'en'
}

export function Stats({ locale = 'ro' }: StatsProps) {
  const text = {
    ro: {
      badge: 'În Cifre',
      title: 'Datele vorbesc de la sine',
      stats: [
        {
          icon: Building2,
          number: '1.5M+',
          label: 'Companii în baza de date',
          description: 'Date complete ANAF',
        },
        {
          icon: FileSearch,
          number: '10K+',
          label: 'Căutări procesate',
          description: 'În ultima lună',
        },
        {
          icon: TrendingUp,
          number: '24',
          label: 'Factori de risc',
          description: 'Algoritm proprietar',
        },
        {
          icon: Users,
          number: '500+',
          label: 'Companii active',
          description: 'Folosesc MarketRisk',
        },
      ],
    },
    en: {
      badge: 'By the Numbers',
      title: 'The data speaks for itself',
      stats: [
        {
          icon: Building2,
          number: '1.5M+',
          label: 'Companies in database',
          description: 'Complete ANAF data',
        },
        {
          icon: FileSearch,
          number: '10K+',
          label: 'Searches processed',
          description: 'In the last month',
        },
        {
          icon: TrendingUp,
          number: '24',
          label: 'Risk factors',
          description: 'Proprietary algorithm',
        },
        {
          icon: Users,
          number: '500+',
          label: 'Active companies',
          description: 'Using MarketRisk',
        },
      ],
    },
  }

  const t = text[locale]

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-block px-4 py-2 bg-[#2F5232]/10 rounded-full mb-4">
            <p className="text-[#2F5232] text-sm font-medium">{t.badge}</p>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">{t.title}</h2>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {t.stats.map((stat, index) => (
            <div
              key={index}
              className="text-center group hover:scale-105 transition-transform duration-300"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-[#2F5232]/10 rounded-full mb-4 group-hover:bg-[#2F5232] group-hover:scale-110 transition-all duration-300">
                <stat.icon className="w-8 h-8 text-[#2F5232] group-hover:text-white transition-colors duration-300" />
              </div>
              <div className="text-4xl md:text-5xl font-bold text-[#2F5232] mb-2">
                {stat.number}
              </div>
              <div className="text-lg font-semibold text-gray-900 mb-1">{stat.label}</div>
              <div className="text-sm text-gray-600">{stat.description}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
