'use client'

// Footer component matching creator-dashboard design
// Green background with rounded corners, contact info, links, and social icons

import Link from 'next/link'

interface FooterProps {
  locale?: 'ro' | 'en'
}

export default function Footer({ locale = 'ro' }: FooterProps) {
  const email = 'hello@marketrisk.ro'
  const phone = '+40 712 345 678'
  const telHref = `tel:${phone.replace(/\s+/g, '')}`

  const text = {
    ro: {
      tagline: 'calm reporting for high-stakes decisions.',
      about: 'Despre',
      privacy: 'Confidențialitate',
      terms: 'Termeni',
      contact: 'Contact',
    },
    en: {
      tagline: 'calm reporting for high-stakes decisions.',
      about: 'About',
      privacy: 'Privacy',
      terms: 'Terms',
      contact: 'Contact',
    },
  }

  const t = text[locale]

  return (
    <footer className="bg-surface-paper mt-12 pb-12">
      <div className="max-w-[1200px] mx-auto px-6 md:px-12">
        <div className="bg-brand-mughal-green text-text-inverse rounded-2xl overflow-hidden">
          <div className="px-6 md:px-12 py-10">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
              {/* Left side - Logo and contact */}
              <div className="min-w-0">
                <p className="text-sm text-text-inverse-muted">
                  <span className="text-text-inverse">
                    <span>market</span>
                    <span className="font-bold">risk</span>
                  </span>{' '}
                  — {t.tagline}
                </p>
                <div className="mt-4 flex flex-col sm:flex-row gap-3 sm:gap-6">
                  <a
                    href={`mailto:${email}`}
                    className="text-sm text-text-inverse-muted hover:text-text-inverse transition-colors duration-normal"
                  >
                    {email}
                  </a>
                  <a
                    href={telHref}
                    className="text-sm text-text-inverse-muted hover:text-text-inverse transition-colors duration-normal"
                  >
                    {phone}
                  </a>
                </div>
              </div>

              {/* Right side - Links and social */}
              <div className="flex items-center gap-6 flex-wrap">
                <Link
                  href={`/${locale}/about`}
                  className="text-sm text-text-inverse-muted hover:text-text-inverse transition-colors duration-normal"
                >
                  {t.about}
                </Link>
                <Link
                  href={`/${locale}/privacy`}
                  className="text-sm text-text-inverse-muted hover:text-text-inverse transition-colors duration-normal"
                >
                  {t.privacy}
                </Link>
                <Link
                  href={`/${locale}/terms`}
                  className="text-sm text-text-inverse-muted hover:text-text-inverse transition-colors duration-normal"
                >
                  {t.terms}
                </Link>
                <Link
                  href={`/${locale}/contact`}
                  className="text-sm text-text-inverse-muted hover:text-text-inverse transition-colors duration-normal"
                >
                  {t.contact}
                </Link>

                {/* Divider */}
                <div className="w-px h-5 bg-border-inverse-subtle" />

                {/* Social Icons */}
                <a
                  href="https://instagram.com/marketrisk"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Instagram"
                  className="inline-flex items-center justify-center w-10 h-10 bg-white/10 text-text-inverse-muted hover:text-text-inverse transition-colors duration-normal rounded-lg"
                >
                  <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" aria-hidden="true">
                    <path
                      d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2Z"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    />
                    <path
                      d="M12 16.25a4.25 4.25 0 1 0 0-8.5 4.25 4.25 0 0 0 0 8.5Z"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    />
                    <path
                      d="M17.5 6.5h.01"
                      stroke="currentColor"
                      strokeWidth="2.4"
                      strokeLinecap="round"
                    />
                  </svg>
                </a>
                <a
                  href="https://x.com/marketrisk"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="X"
                  className="inline-flex items-center justify-center w-10 h-10 bg-white/10 text-text-inverse-muted hover:text-text-inverse transition-colors duration-normal rounded-lg"
                >
                  <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" aria-hidden="true">
                    <path
                      d="M18.5 2H21l-6.7 7.65L22 22h-6.3l-4.93-6.55L5 22H2.5l7.28-8.32L2 2h6.46l4.45 5.93L18.5 2Z"
                      fill="currentColor"
                    />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
