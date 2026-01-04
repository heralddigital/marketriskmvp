import { Metadata } from 'next'
import { generateMarketingPageMetadata } from '@/lib/seo/metadata'
import { getOrganizationSchema } from '@/lib/seo/schema'
import { JsonLd } from '@/components/seo/JsonLd'
import { Breadcrumbs } from '@/components/seo/Breadcrumbs'

interface AboutPageProps {
  params: Promise<{
    locale: 'ro' | 'en'
  }>
}

/**
 * Generate metadata for About page
 */
export async function generateMetadata({ params }: AboutPageProps): Promise<Metadata> {
  const { locale } = await params
  return generateMarketingPageMetadata('about', locale)
}

/**
 * About page with SEO
 */
export default async function AboutPage({ params }: AboutPageProps) {
  const { locale } = await params

  // Generate Schema.org data
  const organizationSchema = getOrganizationSchema(locale)

  // Breadcrumbs
  const breadcrumbs = [
    {
      name: locale === 'ro' ? 'Despre' : 'About',
      href: `/${locale}/about`,
    },
  ]

  const content = {
    ro: {
      title: 'Despre MarketRisk',
      subtitle: 'Platforma de încredere pentru analiza riscurilor de credit',
      mission: 'Misiunea noastră',
      missionText:
        'MarketRisk oferă companiilor românești instrumentele necesare pentru a lua decizii de business informate prin analiza completă a riscurilor de credit ale partenerilor lor.',
      vision: 'Viziunea noastră',
      visionText:
        'Aspirăm să devenim platforma de referință pentru analiza riscurilor de credit în România, protejând fluxul de numerar al mii de companii.',
      values: 'Valorile noastre',
      valuesItems: [
        {
          title: 'Transparență',
          description: 'Date clare și complete din surse oficiale verificate.',
        },
        {
          title: 'Acuratețe',
          description: 'Informații precise și actualizate în timp real.',
        },
        {
          title: 'Încredere',
          description: 'Protecția datelor și confidențialitatea clienților noștri.',
        },
      ],
      team: 'Echipa noastră',
      teamText: 'O echipă dedicată de profesioniști cu experiență în fintech și analiză de risc.',
      cta: 'Începe acum',
      ctaText: 'Descoperă cum MarketRisk te poate ajuta să iei decizii mai bune.',
    },
    en: {
      title: 'About MarketRisk',
      subtitle: 'Trusted platform for credit risk analysis',
      mission: 'Our Mission',
      missionText:
        'MarketRisk provides Romanian companies with the tools needed to make informed business decisions through comprehensive credit risk analysis of their partners.',
      vision: 'Our Vision',
      visionText:
        'We aspire to become the reference platform for credit risk analysis in Romania, protecting the cashflow of thousands of companies.',
      values: 'Our Values',
      valuesItems: [
        {
          title: 'Transparency',
          description: 'Clear and complete data from verified official sources.',
        },
        {
          title: 'Accuracy',
          description: 'Precise information updated in real-time.',
        },
        {
          title: 'Trust',
          description: 'Data protection and confidentiality for our clients.',
        },
      ],
      team: 'Our Team',
      teamText: 'A dedicated team of professionals with experience in fintech and risk analysis.',
      cta: 'Get Started',
      ctaText: 'Discover how MarketRisk can help you make better decisions.',
    },
  }

  const t = content[locale]

  return (
    <>
      <JsonLd data={organizationSchema} />

      <div className="max-w-4xl mx-auto space-y-12">
        <Breadcrumbs items={breadcrumbs} locale={locale} />

        {/* Hero */}
        <header className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">{t.title}</h1>
          <p className="text-xl text-gray-600">{t.subtitle}</p>
        </header>

        {/* Mission */}
        <section className="bg-white border border-gray-200 rounded-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{t.mission}</h2>
          <p className="text-lg text-gray-700 leading-relaxed">{t.missionText}</p>
        </section>

        {/* Vision */}
        <section className="bg-white border border-gray-200 rounded-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{t.vision}</h2>
          <p className="text-lg text-gray-700 leading-relaxed">{t.visionText}</p>
        </section>

        {/* Values */}
        <section className="bg-white border border-gray-200 rounded-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">{t.values}</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {t.valuesItems.map((value, index) => (
              <div key={index} className="space-y-2">
                <h3 className="text-lg font-semibold text-[#2F5232]">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Team */}
        <section className="bg-white border border-gray-200 rounded-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{t.team}</h2>
          <p className="text-lg text-gray-700 leading-relaxed">{t.teamText}</p>
        </section>

        {/* CTA */}
        <section className="bg-gradient-to-br from-[#2F5232] to-[#1a2e1b] rounded-2xl p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">{t.cta}</h2>
          <p className="text-xl text-white/90 mb-8">{t.ctaText}</p>
          <a
            href={`/${locale}/pricing`}
            className="inline-block bg-white text-[#2F5232] px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            {locale === 'ro' ? 'Vezi planurile' : 'View pricing'}
          </a>
        </section>
      </div>
    </>
  )
}
