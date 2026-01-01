'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const faqs = [
    {
      category: 'General',
      questions: [
        {
          q: 'Ce este MarketRisk?',
          a: 'MarketRisk este o platformă de monitorizare a riscului de credit pentru companii din România. Verificăm automat solvabilitatea partenerilor tăi folosind date oficiale din ANAF, PortalJust și BPI.'
        },
        {
          q: 'De unde provin datele?',
          a: 'Colectăm date din trei surse oficiale: ANAF (stare fiscală, TVA, datorii la stat), PortalJust (procese judiciare) și BPI (insolvență). Datele sunt actualizate zilnic.'
        },
        {
          q: 'Cum funcționează scorul de risc?',
          a: 'Algoritmul nostru analizează 24 de factori și calculează un scor între 0 și 100. GREEN (0-14) = risc scăzut, YELLOW (15-49) = risc mediu, RED (50+) = risc ridicat.'
        },
      ]
    },
    {
      category: 'Funcționalități',
      questions: [
        {
          q: 'Ce înseamnă "watchlist"?',
          a: 'Watchlist-ul este lista ta de companii monitorizate. Verificăm zilnic aceste firme și îți trimitem alerte când scorul de risc se modifică sau apar evenimente importante.'
        },
        {
          q: 'Cum funcționează alertele?',
          a: 'Primești notificări automate prin email (și SMS pentru planul Pro) când: scorul de risc se schimbă, apar procese noi, compania intră în insolvență, sau apar datorii la stat.'
        },
        {
          q: 'Pot exporta rapoartele?',
          a: 'Da, poți exporta rapoarte PDF profesionale cu toate datele companiei și analiza de risc. Numărul de export-uri depinde de planul ales.'
        },
      ]
    },
    {
      category: 'Prețuri & Plăți',
      questions: [
        {
          q: 'Planul Free este cu adevărat gratuit?',
          a: 'Da, 100% gratuit, fără card bancar, permanent. Ai 3 căutări pe lună și acces la scorul de risc. Ideal pentru a testa platforma.'
        },
        {
          q: 'Ce metode de plată acceptați?',
          a: 'Card bancar (Visa, Mastercard), virament bancar și facturare. Pentru Enterprise, acceptăm și alte modalități de plată.'
        },
        {
          q: 'Există perioadă de probă?',
          a: 'Pentru planurile plătite oferim 14 zile money-back guarantee. Dacă nu ești mulțumit, îți returnăm banii fără întrebări.'
        },
      ]
    },
    {
      category: 'Tehnic',
      questions: [
        {
          q: 'Cât de des sunt actualizate datele?',
          a: 'Datele ANAF sunt actualizate zilnic. Datele PortalJust sunt sincronizate săptămânal. Verificăm watchlist-ul tău automat în fiecare zi.'
        },
        {
          q: 'Aveți API pentru integrări?',
          a: 'Da, planul Enterprise include API dedicat. Contactează-ne pentru documentație și acces.'
        },
        {
          q: 'Este sigur să introduc date sensibile?',
          a: 'Da, folosim criptare end-to-end și servere în Europa. Suntem conformi GDPR și nu partajăm datele tale cu terțe părți.'
        },
      ]
    },
  ]

  const toggleFAQ = (categoryIndex: number, questionIndex: number) => {
    const index = categoryIndex * 100 + questionIndex
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <div className="bg-[var(--surface-paper)]">
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h1 className="text-4xl md:text-5xl font-bold text-[var(--text-primary)] mb-6 text-center">
          Întrebări frecvente
        </h1>
        <p className="text-lg text-[var(--text-secondary)] text-center max-w-2xl mx-auto mb-12">
          Răspunsuri la cele mai comune întrebări despre MarketRisk
        </p>

        <div className="space-y-8">
          {faqs.map((category, catIdx) => (
            <div key={category.category} className="bg-white p-6 rounded-[4px] border border-[var(--border-subtle)]">
              <h2 className="text-xl font-bold text-[var(--text-primary)] mb-4">
                {category.category}
              </h2>
              <div className="space-y-4">
                {category.questions.map((faq, qIdx) => {
                  const index = catIdx * 100 + qIdx
                  const isOpen = openIndex === index
                  return (
                    <div key={qIdx} className="border-b border-[var(--border-subtle)] last:border-0 pb-4 last:pb-0">
                      <button
                        onClick={() => toggleFAQ(catIdx, qIdx)}
                        className="w-full flex items-start justify-between gap-4 text-left hover:text-[var(--brand-mughal-green)] transition-colors"
                      >
                        <span className="font-semibold text-[var(--text-primary)]">
                          {faq.q}
                        </span>
                        {isOpen ? (
                          <ChevronUp className="w-5 h-5 text-[var(--brand-mughal-green)] flex-shrink-0 mt-1" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-[var(--text-muted)] flex-shrink-0 mt-1" />
                        )}
                      </button>
                      {isOpen && (
                        <p className="mt-3 text-sm text-[var(--text-secondary)] pl-0">
                          {faq.a}
                        </p>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
