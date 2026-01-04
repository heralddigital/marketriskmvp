'use client'

// FAQ Component with accordion functionality
// Frequently Asked Questions for marketing pages

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

interface FAQProps {
  locale?: 'ro' | 'en'
}

interface FAQItem {
  question: string
  answer: string
}

export function FAQ({ locale = 'ro' }: FAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const text = {
    ro: {
      badge: 'Întrebări Frecvente',
      title: 'Răspunsuri la întrebările tale',
      subtitle: 'Tot ce trebuie să știi despre MarketRisk',
      faqs: [
        {
          question: 'Ce este MarketRisk?',
          answer:
            'MarketRisk este o platformă de analiză a riscului de credit pentru companiile din România. Oferim date în timp real de la ANAF, BPI și PortalJust, plus un algoritm proprietar de scoring bazat pe 24 de factori de risc.',
        },
        {
          question: 'De unde vin datele?',
          answer:
            'Datele provin din surse oficiale: ANAF (Agenția Națională de Administrare Fiscală), BPI (Buletinul Procedurilor de Insolvență) și PortalJust (portal.just.ro). Toate datele sunt actualizate zilnic.',
        },
        {
          question: 'Cum funcționează scorul de risc?',
          answer:
            'Algoritmul nostru analizează 24 de factori: status legal, TVA, vechime, datorii la stat, insolvență, litigii etc. Fiecare factor contribuie la scorul final, clasificat în GREEN (risc scăzut), YELLOW (risc mediu) sau RED (risc ridicat).',
        },
        {
          question: 'Ce include planul gratuit?',
          answer:
            'Planul gratuit include 5 căutări pe lună, acces la scor de risc, salvare până la 3 companii în watchlist, și rapoarte PDF (cu watermark). Nu este necesar card pentru înregistrare.',
        },
        {
          question: 'Pot integra MarketRisk în sistemul meu?',
          answer:
            'Da! Planul Business include acces API RESTful pentru integrare în sistemele tale. Poți crea chei API, seta rate limits și monitoriza folosința prin dashboard.',
        },
        {
          question: 'Cum primesc alerte?',
          answer:
            'Cu planurile Professional și Business primești alerte prin email când se schimbă statusul companiilor din watchlist: status TVA, insolvență, datorii la stat, litigii noi etc.',
        },
        {
          question: 'Este sigur să folosesc MarketRisk?',
          answer:
            'Da, platforma folosește criptare end-to-end, autentificare Supabase, Row Level Security în baza de date, și respectă GDPR. Datele tale sunt stocate securizat în Europa.',
        },
        {
          question: 'Pot anula abonamentul oricând?',
          answer:
            'Da, poți anula abonamentul oricând din setări. Vei păstra accesul până la finalul perioadei de facturare, apoi contul va fi retrogradat automat la planul gratuit.',
        },
      ],
    },
    en: {
      badge: 'FAQ',
      title: 'Answers to your questions',
      subtitle: 'Everything you need to know about MarketRisk',
      faqs: [
        {
          question: 'What is MarketRisk?',
          answer:
            'MarketRisk is a credit risk analysis platform for Romanian companies. We provide real-time data from ANAF, BPI and PortalJust, plus a proprietary scoring algorithm based on 24 risk factors.',
        },
        {
          question: 'Where does the data come from?',
          answer:
            'Data comes from official sources: ANAF (National Tax Administration Agency), BPI (Insolvency Bulletin) and PortalJust (portal.just.ro). All data is updated daily.',
        },
        {
          question: 'How does the risk score work?',
          answer:
            'Our algorithm analyzes 24 factors: legal status, VAT, age, state debts, insolvency, litigation etc. Each factor contributes to the final score, classified as GREEN (low risk), YELLOW (medium risk) or RED (high risk).',
        },
        {
          question: 'What does the free plan include?',
          answer:
            'The free plan includes 5 searches per month, access to risk score, save up to 3 companies to watchlist, and PDF reports (with watermark). No card required for registration.',
        },
        {
          question: 'Can I integrate MarketRisk into my system?',
          answer:
            'Yes! The Business plan includes RESTful API access for integration into your systems. You can create API keys, set rate limits and monitor usage through the dashboard.',
        },
        {
          question: 'How do I receive alerts?',
          answer:
            'With Professional and Business plans you receive email alerts when the status of watchlist companies changes: VAT status, insolvency, state debts, new litigation etc.',
        },
        {
          question: 'Is it safe to use MarketRisk?',
          answer:
            'Yes, the platform uses end-to-end encryption, Supabase authentication, Row Level Security in the database, and complies with GDPR. Your data is stored securely in Europe.',
        },
        {
          question: 'Can I cancel my subscription anytime?',
          answer:
            'Yes, you can cancel your subscription anytime from settings. You will keep access until the end of the billing period, then your account will be automatically downgraded to the free plan.',
        },
      ],
    },
  }

  const t = text[locale]

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-block px-4 py-2 bg-[#2F5232]/10 rounded-full mb-4">
            <p className="text-[#2F5232] text-sm font-medium">{t.badge}</p>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{t.title}</h2>
          <p className="text-lg text-gray-600">{t.subtitle}</p>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-4">
          {t.faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:border-[#2F5232] transition-colors duration-300"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors duration-200"
              >
                <span className="text-lg font-semibold text-gray-900 pr-4">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`w-5 h-5 text-[#2F5232] flex-shrink-0 transition-transform duration-300 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                />
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === index ? 'max-h-96' : 'max-h-0'
                }`}
              >
                <div className="px-6 pb-6 text-gray-600 leading-relaxed">{faq.answer}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
