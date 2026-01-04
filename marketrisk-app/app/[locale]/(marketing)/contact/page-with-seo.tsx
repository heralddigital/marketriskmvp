import { Metadata } from 'next'
import { generateMarketingPageMetadata } from '@/lib/seo/metadata'
import { getOrganizationSchema } from '@/lib/seo/schema'
import { JsonLd } from '@/components/seo/JsonLd'
import { Breadcrumbs } from '@/components/seo/Breadcrumbs'
import { Mail, MessageSquare, Phone } from 'lucide-react'

interface ContactPageProps {
  params: Promise<{
    locale: 'ro' | 'en'
  }>
}

/**
 * Generate metadata for Contact page
 */
export async function generateMetadata({ params }: ContactPageProps): Promise<Metadata> {
  const { locale } = await params
  return generateMarketingPageMetadata('contact', locale)
}

/**
 * Contact page with SEO
 */
export default async function ContactPage({ params }: ContactPageProps) {
  const { locale } = await params

  // Generate Schema.org data
  const organizationSchema = getOrganizationSchema(locale)

  // Breadcrumbs
  const breadcrumbs = [
    {
      name: locale === 'ro' ? 'Contact' : 'Contact',
      href: `/${locale}/contact`,
    },
  ]

  const content = {
    ro: {
      title: 'Contactează-ne',
      subtitle: 'Suntem aici să vă ajutăm',
      email: 'Email',
      emailAddress: 'contact@marketrisk.ro',
      support: 'Suport',
      supportText: 'Pentru asistență tehnică și întrebări',
      sales: 'Vânzări',
      salesText: 'Pentru demonstrații și informații despre planuri',
      formTitle: 'Trimite-ne un mesaj',
      name: 'Nume',
      emailLabel: 'Email',
      message: 'Mesaj',
      send: 'Trimite mesaj',
      office: 'Birou',
      officeAddress: 'București, România',
    },
    en: {
      title: 'Contact us',
      subtitle: "We're here to help",
      email: 'Email',
      emailAddress: 'contact@marketrisk.ro',
      support: 'Support',
      supportText: 'For technical assistance and questions',
      sales: 'Sales',
      salesText: 'For demos and plan information',
      formTitle: 'Send us a message',
      name: 'Name',
      emailLabel: 'Email',
      message: 'Message',
      send: 'Send message',
      office: 'Office',
      officeAddress: 'Bucharest, Romania',
    },
  }

  const t = content[locale]

  return (
    <>
      <JsonLd data={organizationSchema} />

      <div className="max-w-6xl mx-auto space-y-12">
        <Breadcrumbs items={breadcrumbs} locale={locale} />

        {/* Hero */}
        <header className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">{t.title}</h1>
          <p className="text-xl text-gray-600">{t.subtitle}</p>
        </header>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#2F5232]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Mail className="w-6 h-6 text-[#2F5232]" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">{t.email}</h3>
                  <a
                    href={`mailto:${t.emailAddress}`}
                    className="text-[#2F5232] hover:underline"
                  >
                    {t.emailAddress}
                  </a>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#2F5232]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MessageSquare className="w-6 h-6 text-[#2F5232]" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">{t.support}</h3>
                  <p className="text-gray-600">{t.supportText}</p>
                  <a
                    href="mailto:support@marketrisk.ro"
                    className="text-[#2F5232] hover:underline mt-2 inline-block"
                  >
                    support@marketrisk.ro
                  </a>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#2F5232]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Phone className="w-6 h-6 text-[#2F5232]" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">{t.sales}</h3>
                  <p className="text-gray-600">{t.salesText}</p>
                  <a
                    href="mailto:sales@marketrisk.ro"
                    className="text-[#2F5232] hover:underline mt-2 inline-block"
                  >
                    sales@marketrisk.ro
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white border border-gray-200 rounded-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">{t.formTitle}</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                // Handle form submission (could redirect to waitlist or email)
                window.location.href = `/${locale}#waitlist`
              }}
              className="space-y-4"
            >
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  {t.name}
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2F5232] focus:border-transparent"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  {t.emailLabel}
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2F5232] focus:border-transparent"
                />
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  {t.message}
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={6}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2F5232] focus:border-transparent resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#2F5232] text-white py-3 rounded-lg font-medium hover:bg-[#1a2e1b] transition-colors"
              >
                {t.send}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}
