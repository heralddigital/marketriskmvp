'use client'

// Call to Action section
// Conversion-focused section for marketing pages

import Link from 'next/link'
import { ArrowRight, Check } from 'lucide-react'

interface CallToActionProps {
  locale?: 'ro' | 'en'
  variant?: 'default' | 'pricing' | 'blog'
}

export function CallToAction({ locale = 'ro', variant = 'default' }: CallToActionProps) {
  const text = {
    ro: {
      default: {
        title: 'Gata să protejezi fluxul de numerar?',
        subtitle:
          'Alătură-te sute de companii românești care folosesc MarketRisk pentru a reduce riscul de credit.',
        cta: 'Începe gratuit',
        features: [
          'Plan gratuit fără card',
          'Configurare în 2 minute',
          'Date în timp real de la ANAF',
        ],
      },
      pricing: {
        title: 'Nu ești sigur ce plan să alegi?',
        subtitle: 'Începe cu planul gratuit și upgrade când ai nevoie de mai mult.',
        cta: 'Creează cont gratuit',
        features: [
          '5 căutări pe lună gratis',
          'Acces la scor de risc',
          'Fără card necesar',
        ],
      },
      blog: {
        title: 'Vrei să afli mai multe?',
        subtitle: 'Explorează platformă și vezi cum poate ajuta afacerea ta.',
        cta: 'Vezi dashboard-ul',
        features: [
          'Demo interactiv',
          'Video tutorial',
          'Suport dedicat',
        ],
      },
    },
    en: {
      default: {
        title: 'Ready to protect your cashflow?',
        subtitle:
          'Join hundreds of Romanian companies using MarketRisk to reduce credit risk.',
        cta: 'Start for free',
        features: [
          'Free plan, no card required',
          '2-minute setup',
          'Real-time ANAF data',
        ],
      },
      pricing: {
        title: 'Not sure which plan to choose?',
        subtitle: 'Start with the free plan and upgrade when you need more.',
        cta: 'Create free account',
        features: [
          '5 searches per month free',
          'Access to risk score',
          'No card required',
        ],
      },
      blog: {
        title: 'Want to learn more?',
        subtitle: 'Explore the platform and see how it can help your business.',
        cta: 'View dashboard',
        features: [
          'Interactive demo',
          'Video tutorial',
          'Dedicated support',
        ],
      },
    },
  }

  const content = text[locale][variant]

  return (
    <section className="py-16 bg-gradient-to-br from-[#2F5232] to-[#3A6440] relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="cta-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#8ACA74" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#cta-grid)" />
        </svg>
      </div>

      {/* Floating elements */}
      <div className="absolute top-10 right-20 w-40 h-40 bg-[#8ACA74]/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-10 left-20 w-32 h-32 bg-[#8ACA74]/15 rounded-full blur-2xl"></div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{content.title}</h2>
          <p className="text-lg md:text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            {content.subtitle}
          </p>

          {/* Features list */}
          <div className="flex flex-wrap items-center justify-center gap-6 mb-8">
            {content.features.map((feature, index) => (
              <div key={index} className="flex items-center gap-2 text-white/90">
                <Check size={20} className="text-[#8ACA74] flex-shrink-0" />
                <span className="text-sm font-medium">{feature}</span>
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <Link
            href={`/${locale}/signup`}
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#8ACA74] text-[#2F5232] rounded-lg font-semibold text-lg hover:bg-[#9DD685] hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl group"
          >
            {content.cta}
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
        </div>
      </div>
    </section>
  )
}
