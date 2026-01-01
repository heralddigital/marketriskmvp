'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Search, List, Bell, Clock, Settings, LogOut } from 'lucide-react'
import { LogoWithText } from '../Logo'
import { signOut } from '@/app/(auth)/actions'

export default function Sidebar() {
  const pathname = usePathname()

  const navigation = [
    { name: 'Dashboard', href: '/app/dashboard', icon: Home },
    { name: 'Căutare', href: '/app/search', icon: Search },
    { name: 'Watchlist', href: '/app/watchlist', icon: List },
    { name: 'Alerte', href: '/app/alerts', icon: Bell },
    { name: 'Istoric', href: '/app/history', icon: Clock },
    { name: 'Setări', href: '/app/settings', icon: Settings },
  ]

  const isActive = (href: string) => pathname === href

  return (
    <div className="flex flex-col h-full bg-white border-r border-[var(--border-subtle)]">
      {/* Logo */}
      <div className="p-6 border-b border-[var(--border-subtle)]">
        <Link href="/app/dashboard">
          <LogoWithText size={28} />
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navigation.map((item) => {
          const Icon = item.icon
          const active = isActive(item.href)
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-[4px] text-sm font-medium transition-colors ${
                active
                  ? 'bg-[var(--brand-pistachio)]/10 text-[var(--brand-mughal-green)]'
                  : 'text-[var(--text-secondary)] hover:bg-[var(--surface-bone)] hover:text-[var(--text-primary)]'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.name}</span>
            </Link>
          )
        })}
      </nav>

      {/* User section */}
      <div className="p-4 border-t border-[var(--border-subtle)]">
        <form action={signOut}>
          <button
            type="submit"
            className="flex items-center gap-3 px-4 py-3 rounded-[4px] text-sm font-medium text-[var(--text-secondary)] hover:bg-[var(--surface-bone)] hover:text-[var(--text-primary)] transition-colors w-full"
          >
            <LogOut className="w-5 h-5" />
            <span>Deconectare</span>
          </button>
        </form>
      </div>
    </div>
  )
}
