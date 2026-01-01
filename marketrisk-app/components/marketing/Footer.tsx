import Link from 'next/link'
import { LogoWithText } from '../Logo'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  const footerLinks = {
    product: [
      { name: 'Funcționalități', href: '/#features' },
      { name: 'Prețuri', href: '/pricing' },
      { name: 'FAQ', href: '/faq' },
    ],
    company: [
      { name: 'Despre noi', href: '/about' },
      { name: 'Contact', href: '/contact' },
      { name: 'Blog', href: '/blog' },
    ],
    legal: [
      { name: 'Confidențialitate', href: '/privacy' },
      { name: 'Termeni și condiții', href: '/terms' },
    ],
  }

  return (
    <footer className="bg-white border-t border-[var(--border-subtle)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and tagline */}
          <div className="col-span-1">
            <LogoWithText size={32} className="mb-4" />
            <p className="text-sm text-[var(--text-secondary)] max-w-xs">
              Monitorizare profesională a riscului de credit pentru afaceri din România
            </p>
          </div>

          {/* Product */}
          <div>
            <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-4">
              Produs
            </h3>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-4">
              Companie
            </h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-4">
              Legal
            </h3>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-[var(--border-subtle)]">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-[var(--text-muted)]">
              © {currentYear} MarketRisk. Toate drepturile rezervate.
            </p>
            <div className="flex gap-6">
              <Link
                href="/privacy"
                className="text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
              >
                Confidențialitate
              </Link>
              <Link
                href="/terms"
                className="text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
              >
                Termeni
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
