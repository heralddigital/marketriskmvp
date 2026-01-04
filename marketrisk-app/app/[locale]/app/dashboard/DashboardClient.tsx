'use client'

import React, { useState, useTransition } from 'react'
import {
    Search,
    LayoutDashboard,
    BarChart3,
    History,
    ShieldCheck,
    TrendingUp,
    Building2,
    Scale,
    AlertCircle,
    Plus,
    ArrowRight,
    ChevronRight,
    Database,
    Users,
    Briefcase
} from 'lucide-react'
import Link from 'next/link'
import { AnimatedCard } from '@/components/admin/AnimatedCard'
import { KPICard } from '@/components/admin/KPICard'
import { SystemHealthCard } from '@/components/admin/SystemHealthCard'

interface DashboardClientProps {
    user: any
    profile: any
    watchlistCount: number
    unreadAlertsCount: number
    recentSearches: any[]
    watchlistData: any[]
    riskDistribution: any
    adminStats?: any
    isAdmin: boolean
    children: {
        litigation: React.ReactNode
        analytics: React.ReactNode
    }
}

export function DashboardClient({
    user,
    profile,
    watchlistCount,
    unreadAlertsCount,
    recentSearches,
    watchlistData,
    riskDistribution,
    adminStats,
    isAdmin,
    children
}: DashboardClientProps) {
    const [activeTab, setActiveTab] = useState('overview')
    const [isPending, startTransition] = useTransition()

    const tabs = [
        { id: 'overview', label: 'Monitorizare', icon: LayoutDashboard },
        { id: 'insights', label: 'Analiză Piață', icon: BarChart3 },
        { id: 'activity', label: 'Activitate', icon: History },
    ]

    if (isAdmin) {
        tabs.push({ id: 'admin', label: 'Admin Panel', icon: ShieldCheck })
    }

    const renderOverview = () => (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: Command Feed */}
            <div className="lg:col-span-8 space-y-8">
                {/* Resource Usage Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <KPICard
                        title="Căutări Disponibile"
                        value={String((profile?.search_limit_monthly || 0) - (profile?.searches_this_month || 0))}
                        icon={<Search className="w-5 h-5" />}
                        trend={{ value: `${profile?.searches_this_month || 0} folosite`, isPositive: false }}
                        delay={100}
                    />
                    <KPICard
                        title="Companii în Watchlist"
                        value={String(watchlistCount || 0)}
                        icon={<Building2 className="w-5 h-5" />}
                        trend={{ value: `Limită: ${profile?.watchlist_limit || 0}`, isPositive: true }}
                        delay={200}
                    />
                    <KPICard
                        title="Alerte Noi"
                        value={String(unreadAlertsCount || 0)}
                        icon={<AlertCircle className="w-5 h-5" />}
                        trend={{ value: "Ultimele 24h", isPositive: unreadAlertsCount === 0 }}
                        delay={300}
                    />
                </div>

                {/* Litigation Section (Streamed) */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-bold flex items-center gap-2">
                            <Scale className="w-5 h-5 text-[var(--brand-mughal-green)]" />
                            Feed Juridic Urgent
                        </h3>
                        <Link href="/app/watchlist" className="text-sm text-[var(--brand-mughal-green)] hover:underline flex items-center gap-1 group">
                            Toate cazurile <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                        </Link>
                    </div>
                    {children.litigation}
                </div>

                {/* Recent Activity Grid */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-bold flex items-center gap-2">
                            <History className="w-5 h-5 text-[var(--brand-mughal-green)]" />
                            Căutări Recente
                        </h3>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {recentSearches?.map((search, idx) => (
                            <AnimatedCard key={search.id} delay={400 + (idx * 50)} className="group p-4 bg-white hover:border-[var(--brand-mughal-green)] transition-all cursor-pointer">
                                <Link href={`/app/company/${search.cui}`} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-[var(--surface-bone)] flex items-center justify-center text-[var(--brand-mughal-green)] group-hover:bg-[var(--brand-pistachio)]/20 transition-colors">
                                            <Building2 className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-[var(--text-primary)] group-hover:text-[var(--brand-mughal-green)] transition-colors truncate max-w-[150px]">
                                                {search.company_name}
                                            </p>
                                            <p className="text-xs text-[var(--text-muted)]">CUI: {search.cui}</p>
                                        </div>
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-[var(--text-muted)] group-hover:text-[var(--brand-mughal-green)]" />
                                </Link>
                            </AnimatedCard>
                        ))}
                        {recentSearches?.length === 0 && (
                            <div className="col-span-2 text-center py-12 border-2 border-dashed border-[var(--border-subtle)] rounded-lg">
                                <p className="text-[var(--text-muted)]">Nu ai încă nicio căutare recentă.</p>
                                <Link href="/app/search">
                                    <button className="mt-4 px-6 py-2 bg-[var(--brand-mughal-green)] text-white rounded-full text-sm font-bold hover:shadow-lg transition-all">
                                        Efectuează prima căutare
                                    </button>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Right Column: Health & Actions */}
            <div className="lg:col-span-4 space-y-8">
                {/* Watchlist Health Scorecard */}
                <AnimatedCard delay={500} className="bg-[var(--brand-mughal-green)] text-white border-0 overflow-hidden relative p-8">
                    <div className="relative z-10">
                        <h3 className="text-white/70 text-sm font-medium uppercase tracking-widest mb-6">Starea Portofoliului</h3>
                        <div className="flex items-end gap-2 mb-8">
                            <span className="text-5xl font-bold">
                                {Math.round(((riskDistribution.green + riskDistribution.yellow * 0.5) / (watchlistCount || 1)) * 100)}%
                            </span>
                            <span className="text-white/60 text-sm pb-2">Scor Sănătate</span>
                        </div>

                        <div className="space-y-4">
                            <div className="h-2 w-full bg-white/10 rounded-full flex overflow-hidden">
                                <div
                                    className="h-full bg-green-400"
                                    style={{ width: `${(riskDistribution.green / (watchlistCount || 1)) * 100}%` }}
                                />
                                <div
                                    className="h-full bg-yellow-400"
                                    style={{ width: `${(riskDistribution.yellow / (watchlistCount || 1)) * 100}%` }}
                                />
                                <div
                                    className="h-full bg-red-400"
                                    style={{ width: `${(riskDistribution.red / (watchlistCount || 1)) * 100}%` }}
                                />
                            </div>
                            <div className="flex justify-between text-xs font-medium">
                                <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-green-400" /> {riskDistribution.green} Safe</span>
                                <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-yellow-400" /> {riskDistribution.yellow} Moderate</span>
                                <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-red-400" /> {riskDistribution.red} High</span>
                            </div>
                        </div>
                    </div>
                    <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-48 h-48 bg-white/5 rounded-full blur-3xl pointer-events-none" />
                </AnimatedCard>

                {/* Quick Actions Shortcuts */}
                <div className="space-y-4">
                    <h3 className="text-sm font-bold text-[var(--text-muted)] uppercase tracking-wider">Acțiuni Rapide</h3>
                    <div className="grid grid-cols-1 gap-3">
                        <Link href="/app/search">
                            <div className="flex items-center justify-between p-4 bg-white border border-[var(--border-subtle)] rounded-lg hover:border-[var(--brand-mughal-green)] hover:shadow-sm transition-all group">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                                        <Plus className="w-5 h-5" />
                                    </div>
                                    <span className="font-bold text-sm">Adaugă în Watchlist</span>
                                </div>
                                <ArrowRight className="w-4 h-4 text-[var(--text-muted)] group-hover:translate-x-1 transition-transform" />
                            </div>
                        </Link>
                        <Link href="/app/alerts">
                            <div className="flex items-center justify-between p-4 bg-white border border-[var(--border-subtle)] rounded-lg hover:border-[var(--brand-mughal-green)] hover:shadow-sm transition-all group">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center relative">
                                        <AlertCircle className="w-5 h-5" />
                                        {unreadAlertsCount > 0 && <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full" />}
                                    </div>
                                    <span className="font-bold text-sm">Gestionează Alerte</span>
                                </div>
                                <ArrowRight className="w-4 h-4 text-[var(--text-muted)] group-hover:translate-x-1 transition-transform" />
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )

    const renderInsights = () => (
        <div className="space-y-8">
            {children.analytics}
        </div>
    )

    const renderActivity = () => (
        <div className="grid grid-cols-1 gap-8">
            <AnimatedCard delay={100} className="p-0 border-0 overflow-hidden">
                <div className="bg-white border rounded-lg overflow-hidden">
                    <div className="px-6 py-4 border-b border-[var(--border-subtle)] bg-[var(--surface-bone)]/30">
                        <h3 className="font-bold text-[var(--text-primary)]">Istoric Complet Căutări</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider border-b border-[var(--border-subtle)]">
                                    <th className="px-6 py-4">Companie</th>
                                    <th className="px-6 py-4">CUI</th>
                                    <th className="px-6 py-4">Data</th>
                                    <th className="px-6 py-4 text-right">Acțiuni</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[var(--border-subtle)]">
                                {recentSearches?.map((s) => (
                                    <tr key={s.id} className="hover:bg-[var(--surface-bone)]/20 transition-colors">
                                        <td className="px-6 py-4 font-bold text-[var(--text-primary)] text-sm">{s.company_name}</td>
                                        <td className="px-6 py-4 text-sm font-mono text-[var(--text-secondary)]">{s.cui}</td>
                                        <td className="px-6 py-4 text-sm text-[var(--text-muted)]">
                                            {new Date(s.created_at).toLocaleDateString('ro-RO')}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <Link href={`/app/company/${s.cui}`} className="text-[var(--brand-mughal-green)] text-xs font-bold hover:underline">
                                                Vezi Raport
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </AnimatedCard>
        </div>
    )

    const renderAdmin = () => {
        if (!adminStats) return null
        return (
            <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <KPICard
                        title="Venit Recurent (MRR)"
                        value={`€${adminStats.mrr.current.toLocaleString()}`}
                        trend={{ value: `${adminStats.mrr.growth}% growth`, isPositive: true }}
                        icon={<TrendingUp />}
                        delay={100}
                    />
                    <KPICard
                        title="Utilizatori Activi"
                        value={String(adminStats.users.total)}
                        trend={{ value: "+12.5% vs prev month", isPositive: true }}
                        icon={<Users />}
                        delay={200}
                    />
                    <KPICard
                        title="Căutări Platformă"
                        value={String(adminStats.searches.total)}
                        trend={{ value: `${adminStats.searches.lastMonth} last 30d`, isPositive: true }}
                        icon={<Database />}
                        delay={300}
                    />
                    <KPICard
                        title="Health System"
                        value="Optimal"
                        trend={{ value: "99.9% Uptime", isPositive: true }}
                        icon={<ShieldCheck />}
                        delay={400}
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <AnimatedCard delay={500} className="lg:col-span-2 p-6">
                        <h4 className="font-bold mb-6 flex items-center gap-2">
                            <Users className="w-5 h-5 text-blue-500" />
                            Utilizatori Recenți
                        </h4>
                        <div className="space-y-4">
                            {adminStats.users.recent.map((u: any, i: number) => (
                                <div key={i} className="flex items-center justify-between p-4 bg-[var(--surface-bone)]/30 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold uppercase">
                                            {u.name.substring(0, 2)}
                                        </div>
                                        <div>
                                            <p className="font-bold text-sm">{u.name}</p>
                                            <p className="text-xs text-[var(--text-muted)]">{u.email}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs font-bold uppercase text-blue-600">{u.plan}</p>
                                        <p className="text-[10px] text-[var(--text-muted)]">{u.joined}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </AnimatedCard>

                    <div className="space-y-4">
                        <SystemHealthCard name="Supabase" health={adminStats.systemHealth.supabase} />
                        <SystemHealthCard name="ANAF" health={adminStats.systemHealth.anaf} />
                        <SystemHealthCard name="Email" health={adminStats.systemHealth.sendgrid} />
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Search Header Section */}
            <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-[var(--brand-mughal-green)] to-[var(--brand-pistachio)] rounded-xl blur opacity-10 group-hover:opacity-20 transition duration-1000"></div>
                <div className="relative bg-white border border-[var(--border-subtle)] p-8 rounded-xl shadow-sm">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div>
                            <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-1">
                                Bună, {profile?.full_name ? profile.full_name.split(' ')[0] : 'Andrei'} 👋
                            </h1>
                            <p className="text-[var(--text-muted)] text-sm">
                                {activeTab === 'admin' ? 'Panou administrativ pentru super-utilizator.' : 'Verifică riscul unei companii noi în câteva secunde.'}
                            </p>
                        </div>
                        <div className="flex-1 max-w-xl">
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]" />
                                <input
                                    type="text"
                                    placeholder="Caută după CUI sau Nume Companie..."
                                    className="w-full pl-12 pr-4 py-4 bg-[var(--surface-bone)]/50 border border-[var(--border-subtle)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--brand-mughal-green)]/20 focus:border-[var(--brand-mughal-green)] transition-all font-medium text-sm"
                                    onClick={() => window.location.href = '/en/app/search'}
                                    readOnly
                                />
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 px-2 py-1 bg-white border border-[var(--border-subtle)] rounded text-[10px] font-mono text-[var(--text-muted)] pointer-events-none">
                                    CMD + K
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modern Tabs Navigation */}
            <div className="flex items-center gap-1 p-1 bg-[var(--surface-bone)]/50 border border-[var(--border-subtle)] rounded-xl w-fit">
                {tabs.map((tab) => {
                    const Icon = tab.icon
                    const isActive = activeTab === tab.id
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`
                flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-bold transition-all
                ${isActive
                                    ? 'bg-white text-[var(--brand-mughal-green)] shadow-sm'
                                    : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-white/50'}
              `}
                        >
                            <Icon className={`w-4 h-4 ${isActive ? 'text-[var(--brand-mughal-green)]' : ''}`} />
                            {tab.label}
                        </button>
                    )
                })}
            </div>

            {/* Main Content Area */}
            <div className="mt-8 transition-opacity duration-300">
                {activeTab === 'overview' && renderOverview()}
                {activeTab === 'insights' && renderInsights()}
                {activeTab === 'activity' && renderActivity()}
                {activeTab === 'admin' && isAdmin && renderAdmin()}
            </div>
        </div>
    )
}
