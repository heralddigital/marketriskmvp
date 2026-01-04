'use client'

import React, { useState } from 'react'
import {
    DollarSign,
    TrendingUp,
    TrendingDown,
    RefreshCw,
    Gem,
    Target,
    Scale,
    BarChart,
    Users,
    Activity,
    Server,
    Database,
    Mail,
    Webhook,
    FileText
} from 'lucide-react'
import { Link } from '@/lib/i18n/navigation'
import { ROADMAP_TASKS } from '@/lib/admin/tasks'
import { AnimatedCard } from './components/AnimatedCard'
import { KPICard } from './components/KPICard'
import { SystemHealthCard } from './components/SystemHealthCard'
import { TaskCard } from './components/TaskCard'

// Mock data to be replaced with real Supabase data later
const mockData = {
    users: {
        total: 1247,
        byPlan: {
            free: 892, // number
            starter: 234,
            pro: 98,
            enterprise: 23,
        } as Record<string, number>,
        planPricing: {
            free: 0,
            starter: 29,
            pro: 99,
            enterprise: 299,
        } as Record<string, number>,
        recent: [
            { name: 'Maria Popescu', email: 'maria@example.com', plan: 'Pro', joined: '2 hours ago' },
            { name: 'Ion Georgescu', email: 'ion@example.com', plan: 'Starter', joined: '5 hours ago' },
            { name: 'Ana Ionescu', email: 'ana@example.com', plan: 'Free', joined: '1 day ago' },
            { name: 'Alexandru Radu', email: 'alex@example.com', plan: 'Pro', joined: '2 days ago' },
        ],
    },
    searches: {
        lastMonth: 15420,
        total: 89234,
        watchlistItems: 3456,
    },
    mrr: {
        current: 12450,
        growth: 12.5,
        previous: 11050,
    },
    arr: {
        current: 149400,
        growth: 12.5,
    },
    engagement: {
        dau: 342,
        mau: 1247,
        nps: 68,
        csat: 4.6,
        adoptionRate: 78,
        trialToPaid: 23.5,
        churn: 2.1,
    },
    saas: {
        ltv: 1240,
        cac: 85,
        ltvCacRatio: 14.6,
        grossMargin: 78.5,
        netRevenueRetention: 102.3,
    },
    systemHealth: {
        supabase: { status: 'healthy', uptime: '99.9%', responseTime: '45ms' },
        anaf: { status: 'healthy', uptime: '98.2%', responseTime: '320ms' },
        sendgrid: { status: 'healthy', uptime: '99.8%', responseTime: '120ms' },
        webhooks: { status: 'healthy', uptime: '99.5%', lastSync: '2 minutes ago' },
    } as Record<string, { status: 'healthy' | 'warning' | 'error', uptime?: string, responseTime?: string, lastSync?: string }>,
}

export default function AdminDashboardPage() {
    const [tasks, setTasks] = useState(ROADMAP_TASKS)
    const [activeTab, setActiveTab] = useState('overview')
    const [timeRange, setTimeRange] = useState('30d')

    const handleTaskComplete = (taskId: number) => {
        setTasks((prevTasks) =>
            prevTasks.map((task) =>
                task.id === taskId ? { ...task, status: 'completed' } : task
            )
        )
    }

    const handleTaskUncomplete = (taskId: number) => {
        setTasks((prevTasks) =>
            prevTasks.map((task) =>
                task.id === taskId ? { ...task, status: 'planned' } : task
            )
        )
    }

    const handleAddToFeatures = (taskId: number) => {
        // Placeholder for feature addition logic
        console.log('Feature added to documentation:', taskId)
    }

    const visibleTasks = tasks.filter((t) => t.visible)
    const allTasks = tasks
    const completedTasks = allTasks.filter((t) => t.status === 'completed')

    return (
        <div className="bg-[var(--surface-paper)] min-h-[calc(100vh-72px)] p-8">
            <div className="max-w-[1200px] mx-auto">
                {/* Welcome Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-2">
                        <div>
                            <p className="text-sm text-[var(--text-secondary)] mb-1">
                                Admin Dashboard
                            </p>
                            <h1 className="text-[32px] font-semibold text-[var(--text-primary)] tracking-tight leading-none">
                                System Overview
                            </h1>
                        </div>
                        <div className="flex items-center gap-3">
                            <select
                                value={timeRange}
                                onChange={(e) => setTimeRange(e.target.value)}
                                className="text-sm bg-white border border-[var(--border-subtle)] rounded-[4px] px-4 py-2.5 text-[var(--text-primary)] cursor-pointer outline-none focus:ring-2 focus:ring-[var(--brand-mughal-green)]"
                            >
                                <option value="7d">Last 7 days</option>
                                <option value="30d">Last 30 days</option>
                                <option value="90d">Last 90 days</option>
                                <option value="1y">Last year</option>
                            </select>
                            <Link
                                href="/docs"
                                className="px-4 py-2.5 bg-white text-[var(--text-primary)] border border-[var(--border-subtle)] rounded-[4px] font-medium text-sm hover:shadow-sm transition-all duration-300 flex items-center gap-2"
                            >
                                <FileText size={16} />
                                View Documentation
                            </Link>
                        </div>
                    </div>
                    <p className="text-sm text-[var(--text-secondary)]">
                        Comprehensive overview of your SaaS platform performance and operations
                    </p>
                </div>

                {/* Tabs */}
                <div className="flex items-center gap-1 mb-6 border-b border-[var(--border-subtle)]">
                    {[
                        { id: 'overview', label: 'Overview' },
                        { id: 'users', label: 'Users & Growth' },
                        { id: 'system', label: 'System Health' },
                        { id: 'tasks', label: 'Tasks & Roadmap' },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            type="button"
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-4 py-3 text-sm font-medium border-b-2 transition-all duration-200 -mb-[1px] ${activeTab === tab.id
                                ? 'border-[var(--brand-mughal-green)] text-[var(--brand-mughal-green)]'
                                : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Overview Tab */}
                {activeTab === 'overview' && (
                    <div className="space-y-6">
                        {/* Top SaaS KPIs - 4 Column Grid */}
                        <div>
                            <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
                                Key SaaS Metrics
                            </h2>
                            <div className="grid grid-cols-4 gap-4">
                                <KPICard
                                    label="Monthly Recurring Revenue (MRR)"
                                    value={`€${mockData.mrr.current.toLocaleString()}`}
                                    change={mockData.mrr.growth}
                                    isUp={true}
                                    delay={0}
                                    icon={DollarSign}
                                />
                                <KPICard
                                    label="Annual Recurring Revenue (ARR)"
                                    value={`€${(mockData.arr.current / 1000).toFixed(0)}K`}
                                    change={mockData.arr.growth}
                                    isUp={true}
                                    delay={50}
                                    icon={TrendingUp}
                                />
                                <KPICard
                                    label="Churn Rate"
                                    value={`${mockData.engagement.churn}%`}
                                    change={-0.5}
                                    isUp={true}
                                    delay={100}
                                    icon={TrendingDown}
                                />
                                <KPICard
                                    label="Net Revenue Retention"
                                    value={`${mockData.saas.netRevenueRetention}%`}
                                    change={2.3}
                                    isUp={true}
                                    delay={150}
                                    icon={RefreshCw}
                                />
                            </div>
                        </div>

                        {/* Secondary SaaS KPIs - 4 Column Grid */}
                        <div>
                            <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
                                Growth & Efficiency Metrics
                            </h2>
                            <div className="grid grid-cols-4 gap-4">
                                <KPICard
                                    label="Customer Lifetime Value (LTV)"
                                    value={`€${mockData.saas.ltv.toLocaleString()}`}
                                    change={8.2}
                                    isUp={true}
                                    delay={200}
                                    icon={Gem}
                                />
                                <KPICard
                                    label="Customer Acquisition Cost (CAC)"
                                    value={`€${mockData.saas.cac}`}
                                    change={-3.1}
                                    isUp={true}
                                    delay={250}
                                    icon={Target}
                                />
                                <KPICard
                                    label="LTV:CAC Ratio"
                                    value={`${mockData.saas.ltvCacRatio}:1`}
                                    change={1.2}
                                    isUp={true}
                                    delay={300}
                                    icon={Scale}
                                />
                                <KPICard
                                    label="Gross Margin"
                                    value={`${mockData.saas.grossMargin}%`}
                                    change={1.5}
                                    isUp={true}
                                    delay={350}
                                    icon={BarChart}
                                />
                            </div>
                        </div>

                        {/* Main Content Grid - 2 Column */}
                        <div className="grid grid-cols-[2fr_1fr] gap-5">
                            {/* User Growth Chart - Mock Visual */}
                            <AnimatedCard delay={400}>
                                <div className="flex items-center justify-between mb-5">
                                    <div className="flex items-center gap-2">
                                        <TrendingUp size={20} className="text-[var(--brand-mughal-green)]" />
                                        <div>
                                            <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-1">User Growth</h3>
                                            <p className="text-[13px] text-[var(--text-secondary)]">Monthly active users trend</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="h-[200px] flex items-end justify-between gap-2 pt-5">
                                    {[65, 72, 78, 85, 82, 88, 95].map((value, i) => (
                                        <div key={i} className="flex-1 flex flex-col items-center gap-2">
                                            <div
                                                className="w-full max-w-[40px] bg-[var(--brand-mughal-green)] rounded-t-[4px] transition-all duration-700 ease-out"
                                                style={{ height: `${value}%` }}
                                            />
                                            <span className="text-xs text-[var(--text-secondary)]">
                                                {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'][i]}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </AnimatedCard>

                            {/* Quick Stats */}
                            <AnimatedCard delay={450}>
                                <div className="flex items-center gap-2 mb-5">
                                    <Activity size={20} className="text-[var(--brand-mughal-green)]" />
                                    <h3 className="text-lg font-semibold text-[var(--text-primary)]">Engagement</h3>
                                </div>
                                <div className="space-y-4">
                                    {[
                                        { label: 'DAU', value: mockData.engagement.dau.toLocaleString(), change: '+12%' },
                                        { label: 'MAU', value: mockData.engagement.mau.toLocaleString(), change: '+8%' },
                                        { label: 'NPS', value: mockData.engagement.nps, change: '+5' },
                                    ].map((stat, i) => (
                                        <div key={i} className="flex items-center justify-between py-2 border-b border-[var(--border-subtle)]">
                                            <div className="flex-1">
                                                <p className="text-[13px] text-[var(--text-secondary)]">{stat.label}</p>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <p className="text-base font-semibold text-[var(--text-primary)]">{stat.value}</p>
                                                <span className="text-xs font-medium text-[#22C55E]">{stat.change}</span>
                                            </div>
                                        </div>
                                    ))}
                                    <div className="flex items-center justify-between py-2">
                                        <div className="flex-1">
                                            <p className="text-[13px] text-[var(--text-secondary)]">Trial to Paid</p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <p className="text-base font-semibold text-[var(--text-primary)]">{mockData.engagement.trialToPaid}%</p>
                                            <span className="text-xs font-medium text-[#22C55E]">+2.3%</span>
                                        </div>
                                    </div>
                                </div>
                            </AnimatedCard>
                        </div>

                        {/* Users by Plan */}
                        <div>
                            <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
                                Users by Plan
                            </h2>
                            <div className="grid grid-cols-4 gap-4">
                                {Object.entries(mockData.users.byPlan).map(([plan, count], idx) => {
                                    const monthlyPrice = mockData.users.planPricing[plan] || 0
                                    const monthlyRevenue = count * monthlyPrice
                                    return (
                                        <AnimatedCard key={plan} delay={500 + idx * 50}>
                                            <p className="text-[13px] text-[var(--text-secondary)] mb-2 capitalize">{plan}</p>
                                            <p className="text-2xl font-semibold text-[var(--text-primary)] mb-1">{count.toLocaleString()}</p>
                                            <p className="text-xs text-[var(--text-secondary)] mb-2">
                                                {((count / mockData.users.total) * 100).toFixed(1)}% of total
                                            </p>
                                            {monthlyRevenue > 0 ? (
                                                <p className="text-sm font-semibold text-[var(--brand-mughal-green)] mt-2 pt-2 border-t border-[var(--border-subtle)]">
                                                    €{monthlyRevenue.toLocaleString()}/mo
                                                </p>
                                            ) : (
                                                <p className="text-xs text-[var(--text-secondary)] mt-2 pt-2 border-t border-[var(--border-subtle)]">
                                                    Free plan
                                                </p>
                                            )}
                                        </AnimatedCard>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                )}

                {/* Users Tab */}
                {activeTab === 'users' && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-3 gap-4">
                            <KPICard
                                label="Total Users"
                                value={mockData.users.total.toLocaleString()}
                                change={8.2}
                                isUp={true}
                                delay={0}
                                icon={Users}
                            />
                            <KPICard
                                label="Searches (Last Month)"
                                value={mockData.searches.lastMonth.toLocaleString()}
                                change={15.3}
                                isUp={true}
                                delay={50}
                                icon={Activity}
                            />
                            <KPICard
                                label="Total Searches"
                                value={mockData.searches.total.toLocaleString()}
                                delay={100}
                                icon={BarChart}
                            />
                        </div>

                        <AnimatedCard delay={150}>
                            <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Recent Users</h2>
                            <div className="border border-[var(--border-subtle)] rounded-[4px] overflow-hidden">
                                <table className="w-full text-left border-collapse">
                                    <thead className="bg-[#f9fafb] border-b border-[var(--border-subtle)]">
                                        <tr>
                                            <th className="px-4 py-3 text-xs font-semibold text-[var(--text-primary)]">Name</th>
                                            <th className="px-4 py-3 text-xs font-semibold text-[var(--text-primary)]">Email</th>
                                            <th className="px-4 py-3 text-xs font-semibold text-[var(--text-primary)]">Plan</th>
                                            <th className="px-4 py-3 text-xs font-semibold text-[var(--text-primary)]">Joined</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white">
                                        {mockData.users.recent.map((user, idx) => (
                                            <tr key={idx} className={idx < mockData.users.recent.length - 1 ? 'border-b border-[var(--border-subtle)]' : ''}>
                                                <td className="px-4 py-3 text-sm text-[var(--text-primary)]">{user.name}</td>
                                                <td className="px-4 py-3 text-sm text-[var(--text-secondary)]">{user.email}</td>
                                                <td className="px-4 py-3">
                                                    <span className="px-2 py-1 bg-[var(--surface-bone)] rounded-[4px] text-xs font-medium text-[var(--text-primary)]">
                                                        {user.plan}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-sm text-[var(--text-secondary)]">{user.joined}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </AnimatedCard>
                    </div>
                )}

                {/* System Health Tab */}
                {activeTab === 'system' && (
                    <div className="space-y-6">
                        <h2 className="text-lg font-semibold text-[var(--text-primary)]">System Health Status</h2>
                        <div className="grid grid-cols-4 gap-4">
                            <SystemHealthCard name="Supabase" health={mockData.systemHealth.supabase!} />
                            <SystemHealthCard name="ANAF API" health={mockData.systemHealth.anaf!} />
                            <SystemHealthCard name="SendGrid" health={mockData.systemHealth.sendgrid!} />
                            <SystemHealthCard name="Webhooks" health={mockData.systemHealth.webhooks!} />
                        </div>
                    </div>
                )}

                {/* Tasks Tab */}
                {activeTab === 'tasks' && (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-[var(--text-primary)]">Tasks & Roadmap</h2>
                            <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                                <span>Total: {allTasks.length}</span>
                                <span>•</span>
                                <span>Visible: {visibleTasks.length}</span>
                                <span>•</span>
                                <span>Completed: {completedTasks.length}</span>
                            </div>
                        </div>
                        <div className="grid gap-4">
                            {allTasks.map((task) => (
                                <TaskCard
                                    key={task.id}
                                    task={task}
                                    onComplete={handleTaskComplete}
                                    onUncomplete={handleTaskUncomplete}
                                    onAddToFeatures={handleAddToFeatures}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
