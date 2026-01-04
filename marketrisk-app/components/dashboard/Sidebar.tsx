'use client'

// Enhanced Sidebar component with bilingual support
// Updated with new color scheme for app dashboard

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Search, List, Bell, Clock, Settings, LogOut, Mail, Info, BarChart3 } from 'lucide-react'
import { LogoWithText } from '../Logo'
import { signOut } from '@/app/[locale]/(auth)/actions'

interface SidebarProps {
  locale?: 'ro' | 'en'
}

export default function Sidebar({ locale = 'ro' }: SidebarProps) {
  const pathname = usePathname()

  const text = {
    ro: {
      navigation: [
        { name: 'Dashboard', href: '/app/dashboard', icon: Home },
        { name: 'Căutare', href: '/app/search', icon: Search },
        { name: 'Watchlist', href: '/app/watchlist', icon: List },
        { name: 'Alerte', href: '/app/alerts', icon: Bell },
        { name: 'Istoric', href: '/app/history', icon: Clock },
        { name: 'Statistici', href: '/app/stats', icon: BarChart3 },
        { name: 'Setări', href: '/app/settings', icon: Settings },
      ],
      support: [
        { name: 'Despre', href: '/app/about', icon: Info },
        { name: 'Contact', href: '/app/contact', icon: Mail },
      ],
      logout: 'Deconectare',
    },
    en: {
      navigation: [
        { name: 'Dashboard', href: '/app/dashboard', icon: Home },
        { name: 'Search', href: '/app/search', icon: Search },
        { name: 'Watchlist', href: '/app/watchlist', icon: List },
        { name: 'Alerts', href: '/app/alerts', icon: Bell },
        { name: 'History', href: '/app/history', icon: Clock },
        { name: 'Statistics', href: '/app/stats', icon: BarChart3 },
        { name: 'Settings', href: '/app/settings', icon: Settings },
      ],
      support: [
        { name: 'About', href: '/app/about', icon: Info },
        { name: 'Contact', href: '/app/contact', icon: Mail },
      ],
      logout: 'Sign out',
    },
  }

  const t = text[locale]

  const isActive = (href: string) => pathname === href

  return (
    <div className="flex flex-col h-full bg-white border-r border-gray-200">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <Link href="/app/dashboard" className="hover:opacity-80 transition-opacity">
          <LogoWithText size={28} />
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {/* Main Navigation */}
        {t.navigation.map((item) => {
          const Icon = item.icon
          const active = isActive(item.href)
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                active
                  ? 'bg-[#2F5232]/10 text-[#2F5232] shadow-sm'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.name}</span>
            </Link>
          )
        })}

        {/* Support Section */}
        <div className="pt-6 mt-6 border-t border-gray-200">
          <p className="px-4 pb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            {locale === 'ro' ? 'Suport' : 'Support'}
          </p>
          {t.support.map((item) => {
            const Icon = item.icon
            const active = isActive(item.href)
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                  active
                    ? 'bg-[#2F5232]/10 text-[#2F5232] shadow-sm'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.name}</span>
              </Link>
            )
          })}
        </div>
      </nav>

      {/* User section / Logout */}
      <div className="p-4 border-t border-gray-200">
        <form action={signOut}>
          <button
            type="submit"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-600 transition-all duration-200 w-full group"
          >
            <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span>{t.logout}</span>
          </button>
        </form>
      </div>
    </div>
  )
}
