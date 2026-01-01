'use client'

import { useState } from 'react'
import Link from 'next/link'
import { LogoWithText } from '../Logo'
import { Menu, X } from 'lucide-react'

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navigation = [
    { name: 'Acasă', href: '/' },
    { name: 'Despre', href: '/about' },
    { name: 'Prețuri', href: '/pricing' },
    { name: 'FAQ', href: '/faq' },
    { name: 'Contact', href: '/contact' },
  ]

  return (
    <header className="bg-white border-b border-[var(--border-subtle)] sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <LogoWithText size={32} />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              href="/login"
              className="text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            >
              Autentificare
            </Link>
            <Link
              href="/signup"
              className="px-4 py-2 bg-[var(--brand-mughal-green)] text-white rounded-[4px] text-sm font-medium hover:bg-[var(--brand-mughal-green-2)] transition-colors"
            >
              Înregistrare gratuită
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            className="md:hidden p-2 rounded-[4px] text-[var(--text-secondary)] hover:bg-[var(--surface-bone)] transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-[var(--border-subtle)]">
            <div className="flex flex-col gap-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="pt-4 border-t border-[var(--border-subtle)] flex flex-col gap-3">
                <Link
                  href="/login"
                  className="text-sm font-medium text-center py-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Autentificare
                </Link>
                <Link
                  href="/signup"
                  className="px-4 py-2 bg-[var(--brand-mughal-green)] text-white rounded-[4px] text-sm font-medium hover:bg-[var(--brand-mughal-green-2)] transition-colors text-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Înregistrare gratuită
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
