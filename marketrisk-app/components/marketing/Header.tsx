'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { Link, useRouter, usePathname } from '@/lib/i18n/navigation'
import {
  Menu as MenuIcon,
  X as CloseIcon,
  LayoutDashboard,
  BarChart3,
  User as UserIcon,
  Settings,
  LogOut,
  ChevronDown
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

// --- Sub-components (defined before Header for better hoisting safety) ---

function NavItem({ active, href, children }: { active: boolean, href: string, children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className={`text-sm transition-colors duration-normal ${active ? 'text-text-primary font-medium' : 'text-text-secondary hover:text-text-primary'
        }`}
    >
      {children}
    </Link>
  )
}

function UserMenu({ currentUserData, onLogout }: { currentUserData: any, onLogout: () => void }) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const getUserInitials = () => {
    if (currentUserData.name) {
      return currentUserData.name
        .split(' ')
        .map((n: string) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    }
    return currentUserData.email?.[0]?.toUpperCase() || 'U'
  }

  const menuItems = [
    { key: 'dashboard', label: 'Dashboard', href: '/app/dashboard', icon: LayoutDashboard },
    { key: 'analytics', label: 'Analytics', href: '/app/analytics', icon: BarChart3 },
    { type: 'divider' },
    { key: 'profile', label: 'Profile', href: '/app/settings#profile', icon: UserIcon },
    { key: 'settings', label: 'Settings', href: '/app/settings', icon: Settings },
    { type: 'divider' },
    { key: 'logout', label: 'Log out', icon: LogOut, action: onLogout },
  ]

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-1 rounded-lg hover:bg-surface-paper transition-all duration-normal"
      >
        <div className="w-8 h-8 rounded-full bg-brand-mughal-green text-white flex items-center justify-center text-[11px] font-medium shadow-sm">
          {getUserInitials()}
        </div>
        <ChevronDown
          className={`w-3.5 h-3.5 text-text-muted transition-transform duration-normal ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-60 bg-white border border-border-subtle rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          <div className="px-5 py-4 border-b border-border-subtle bg-surface-paper">
            <p className="text-sm font-semibold text-text-primary truncate">{currentUserData.name || 'User'}</p>
            <p className="text-[11px] text-text-muted truncate mt-0.5">{currentUserData.email}</p>
          </div>

          <div className="py-1">
            {menuItems.map((item, index) => {
              if (item.type === 'divider') {
                return <div key={`divider-${index}`} className="h-px bg-border-subtle my-1" />
              }

              // Using a static switch for icons to be safe with React 19 / Next 15
              const renderIcon = () => {
                switch (item.key) {
                  case 'dashboard': return <LayoutDashboard className="w-4 h-4" />
                  case 'analytics': return <BarChart3 className="w-4 h-4" />
                  case 'profile': return <UserIcon className="w-4 h-4" />
                  case 'settings': return <Settings className="w-4 h-4" />
                  case 'logout': return <LogOut className="w-4 h-4" />
                  default: return null
                }
              }

              const isActive = item.href ? pathname === item.href : false

              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => {
                    if (item.action) {
                      item.action()
                    } else if (item.href) {
                      router.push(item.href)
                    }
                    setIsOpen(false)
                  }}
                  className={`w-full text-left px-4 py-2 text-sm transition-colors duration-normal flex items-center gap-3 ${isActive
                    ? 'bg-surface-paper text-text-primary font-medium'
                    : 'text-text-secondary hover:bg-surface-paper hover:text-text-primary'
                    }`}
                >
                  {renderIcon()}
                  <span>{item.label}</span>
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

// --- Main Header Component ---

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const t = useTranslations('common')
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUser(user)
        const { data: profile } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single()
        setProfile(profile)
      }
    }
    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setUser(session.user)
      } else {
        setUser(null)
        setProfile(null)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const navigation = [
    { name: 'Landing', href: '/' },
    ...(user ? [{ name: 'Dashboard', href: '/app/dashboard' }] : []),
    { name: 'Pricing', href: '/pricing' },
    { name: 'FAQ', href: '/faq' },
    { name: 'Blog', href: '/blog' },
    { name: 'Documentation', href: '/docs' },
  ]

  const switchLanguage = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale })
    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000`
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <header className="sticky top-0 z-50 h-[72px] bg-surface-paper border-b border-border-subtle">
      <div className="max-w-[1200px] mx-auto px-6 md:px-12 h-full flex items-center justify-between">
        <div className="flex items-center gap-12">
          <Link href="/" className="flex items-center gap-3 transition-transform duration-normal hover:scale-[1.02] active:scale-[0.98]">
            <div className="w-8 h-8 bg-brand-bone rounded-xl flex items-center justify-center shadow-sm">
              <div className="w-5 h-5 bg-brand-mughal-green rounded-md flex items-center justify-center">
                <span
                  aria-hidden="true"
                  className="text-brand-pistachio select-none"
                  style={{
                    fontFamily: "'Corinthia', cursive",
                    fontSize: '20px',
                    lineHeight: '20px',
                    fontWeight: 700,
                    display: 'block',
                    width: '20px',
                    textAlign: 'center',
                    transform: 'translateY(-1px)',
                  }}
                >
                  b
                </span>
              </div>
            </div>
            <span className="text-lg text-text-primary">
              <span>market</span><span className="font-bold">risk</span>
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-8">
            {navigation.map((item) => (
              <NavItem
                key={item.name}
                href={item.href}
                active={pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))}
              >
                {item.name}
              </NavItem>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <div className="hidden md:flex items-center gap-1 mr-2 px-3 py-1 bg-white/50 rounded-lg border border-border-subtle">
            <button
              onClick={() => switchLanguage('ro')}
              className={`px-2 py-1 text-xs transition-colors duration-normal ${locale === 'ro'
                ? 'text-text-primary font-medium'
                : 'text-text-secondary hover:text-text-primary'
                }`}
            >
              RO
            </button>
            <span className="text-text-muted text-[10px]">|</span>
            <button
              onClick={() => switchLanguage('en')}
              className={`px-2 py-1 text-xs transition-colors duration-normal ${locale === 'en'
                ? 'text-text-primary font-medium'
                : 'text-text-secondary hover:text-text-primary'
                }`}
            >
              EN
            </button>
          </div>

          {user ? (
            <UserMenu
              currentUserData={{
                name: profile?.full_name || user.email?.split('@')[0],
                email: user.email,
                avatar: null
              }}
              onLogout={handleLogout}
            />
          ) : (
            <Link
              href="/login"
              className="text-sm font-medium text-text-primary transition-all duration-normal hover:text-brand-mughal-green px-5 py-2.5 border border-border-subtle rounded-lg bg-white hover:bg-surface-paper hover:shadow-sm active:scale-95"
            >
              Log in
            </Link>
          )}

          <button
            type="button"
            className="lg:hidden p-2 text-text-secondary hover:text-text-primary transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <CloseIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-border-subtle bg-surface-paper animate-in slide-in-from-top duration-300">
          <div className="max-w-[1200px] mx-auto px-6 py-6 space-y-6">
            <nav className="flex flex-col gap-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`text-base py-2 transition-colors ${pathname === item.href ? 'text-text-primary font-bold' : 'text-text-secondary hover:text-text-primary'
                    }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            <div className="pt-6 border-t border-border-subtle space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-text-muted">Language</span>
                <div className="flex items-center gap-1 p-1 bg-white rounded-lg border border-border-subtle">
                  <button
                    onClick={() => switchLanguage('ro')}
                    className={`px-3 py-1.5 text-xs rounded ${locale === 'ro' ? 'bg-brand-mughal-green text-white' : 'text-text-secondary'}`}
                  >
                    RO
                  </button>
                  <button
                    onClick={() => switchLanguage('en')}
                    className={`px-3 py-1.5 text-xs rounded ${locale === 'en' ? 'bg-brand-mughal-green text-white' : 'text-text-secondary'}`}
                  >
                    EN
                  </button>
                </div>
              </div>

              {!user && (
                <Link
                  href="/login"
                  className="block w-full text-center py-3 bg-brand-mughal-green text-white rounded-lg font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Get Started
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
