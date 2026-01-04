import { Metadata } from 'next'
import Link from 'next/link'
import { generateMarketingPageMetadata } from '@/lib/seo/metadata'
import { getOrganizationSchema } from '@/lib/seo/schema'
import { JsonLd } from '@/components/seo/JsonLd'
import { Breadcrumbs } from '@/components/seo/Breadcrumbs'
import { Check } from 'lucide-react'

interface PricingPageProps {
  params: Promise<{
    locale: 'ro' | 'en'
  }>
}

/**
 * Generate metadata for Pricing page
 */
export async function generateMetadata({ params }: PricingPageProps): Promise<Metadata> {
  const { locale } = await params
  return generateMarketingPageMetadata('pricing', locale)
}

/**
 * Pricing page with SEO
 */
export default async function PricingPage({ params }: PricingPageProps) {
  const { locale } = await params

  // Generate Schema.org data
  const organizationSchema = getOrganizationSchema(locale)

  // Breadcrumbs
  const breadcrumbs = [
    {
      name: locale === 'ro' ? 'Prețuri' : 'Pricing',
      href: `/${locale}/pricing`,
    },
  ]

  const content = {
    ro: {
      title: 'Prețuri simple și transparente',
      subtitle: 'Alegeți planul potrivit pentru afacerea dvs.',
      monthly: 'Lunar',
      features: 'Caracteristici',
      getStarted: 'Începe acum',
      contactUs: 'Contactează-ne',
      plans: [
        {
          name: 'Gratuit',
          price: '€0',
          period: '/lună',
          description: 'Perfect pentru a testa platforma',
          features: [
            '5 căutări pe lună',
            'Date ANAF de bază',
            'Istoric 30 zile',
            'Export PDF',
          ],
          cta: 'Începe gratuit',
          popular: false,
        },
        {
          name: 'Professional',
          price: '€39',
          period: '/lună',
          description: 'Pentru companii mici și mijlocii',
          features: [
            '100 căutări pe lună',
            'Date complete ANAF + BPI',
            'Monitorizare PortalJust',
            'Alerte în timp real',
            'Istoric complet',
            'Export PDF avansat',
            'Suport prioritar',
          ],
          cta: 'Alege Professional',
          popular: true,
        },
        {
          name: 'Business',
          price: '€99',
          period: '/lună',
          description: 'Pentru companii cu volum mare',
          features: [
            'Căutări nelimitate',
            'Toate funcțiile Professional',
            'API access',
            'Watchlist de până la 500 companii',
            'Rapoarte personalizate',
            'Integrări dedicate',
            'Account manager dedicat',
          ],
          cta: 'Alege Business',
          popular: false,
        },
        {
          name: 'Enterprise',
          price: 'Custom',
          period: '',
          description: 'Soluții personalizate pentru corporații',
          features: [
            'Totul din Business',
            'Volum personalizat',
            'SLA garantat',
            'Onboarding dedicat',
            'Training echipă',
            'Integrări on-premise',
          ],
          cta: 'Contactează vânzări',
          popular: false,
        },
      ],
    },
    en: {
      title: 'Simple and transparent pricing',
      subtitle: 'Choose the right plan for your business',
      monthly: 'Monthly',
      features: 'Features',
      getStarted: 'Get started',
      contactUs: 'Contact us',
      plans: [
        {
          name: 'Free',
          price: '€0',
          period: '/month',
          description: 'Perfect for testing the platform',
          features: [
            '5 searches per month',
            'Basic ANAF data',
            '30-day history',
            'PDF export',
          ],
          cta: 'Start free',
          popular: false,
        },
        {
          name: 'Professional',
          price: '€39',
          period: '/month',
          description: 'For small and medium businesses',
          features: [
            '100 searches per month',
            'Complete ANAF + BPI data',
            'PortalJust monitoring',
            'Real-time alerts',
            'Full history',
            'Advanced PDF export',
            'Priority support',
          ],
          cta: 'Choose Professional',
          popular: true,
        },
        {
          name: 'Business',
          price: '€99',
          period: '/month',
          description: 'For high-volume companies',
          features: [
            'Unlimited searches',
            'All Professional features',
            'API access',
            'Watchlist up to 500 companies',
            'Custom reports',
            'Dedicated integrations',
            'Dedicated account manager',
          ],
          cta: 'Choose Business',
          popular: false,
        },
        {
          name: 'Enterprise',
          price: 'Custom',
          period: '',
          description: 'Custom solutions for corporations',
          features: [
            'Everything in Business',
            'Custom volume',
            'Guaranteed SLA',
            'Dedicated onboarding',
            'Team training',
            'On-premise integrations',
          ],
          cta: 'Contact sales',
          popular: false,
        },
      ],
    },
  }

  const t = content[locale]

  return (
    <>
      <JsonLd data={organizationSchema} />

      <div className="max-w-7xl mx-auto space-y-12">
        <Breadcrumbs items={breadcrumbs} locale={locale} />

        {/* Hero */}
        <header className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">{t.title}</h1>
          <p className="text-xl text-gray-600">{t.subtitle}</p>
        </header>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {t.plans.map((plan, index) => (
            <div
              key={index}
              className={`relative bg-white rounded-2xl p-8 ${
                plan.popular
                  ? 'border-2 border-[#2F5232] shadow-xl'
                  : 'border border-gray-200'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#2F5232] text-white px-4 py-1 rounded-full text-sm font-medium">
                  {locale === 'ro' ? 'Popular' : 'Popular'}
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <p className="text-gray-600 text-sm mb-4">{plan.description}</p>
                <div className="flex items-baseline">
                  <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                  {plan.period && (
                    <span className="text-gray-600 ml-1">{plan.period}</span>
                  )}
                </div>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-[#2F5232] flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                href={`/${locale}#waitlist`}
                className={`block w-full text-center py-3 rounded-lg font-medium transition-colors ${
                  plan.popular
                    ? 'bg-[#2F5232] text-white hover:bg-[#1a2e1b]'
                    : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <section className="bg-white border border-gray-200 rounded-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            {locale === 'ro' ? 'Întrebări frecvente' : 'Frequently asked questions'}
          </h2>
          <div className="max-w-3xl mx-auto space-y-4">
            <div className="border-b border-gray-200 pb-4">
              <h3 className="font-semibold text-gray-900 mb-2">
                {locale === 'ro' ? 'Pot schimba planul oricând?' : 'Can I change plans anytime?'}
              </h3>
              <p className="text-gray-600">
                {locale === 'ro'
                  ? 'Da, puteți upgrada sau downgrade oricând. Modificările se aplică imediat.'
                  : 'Yes, you can upgrade or downgrade anytime. Changes apply immediately.'}
              </p>
            </div>
            <div className="border-b border-gray-200 pb-4">
              <h3 className="font-semibold text-gray-900 mb-2">
                {locale === 'ro' ? 'Ce metode de plată acceptați?' : 'What payment methods do you accept?'}
              </h3>
              <p className="text-gray-600">
                {locale === 'ro'
                  ? 'Acceptăm plăți cu card bancar prin Stripe. Pentru planul Enterprise, oferim și facturare prin transfer bancar.'
                  : 'We accept card payments through Stripe. For Enterprise plans, we also offer bank transfer invoicing.'}
              </p>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
