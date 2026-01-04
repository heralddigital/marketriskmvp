'use client'

import { useState } from 'react'
import { KPICard } from '@/components/admin/KPICard'
import { AnimatedCard } from '@/components/admin/AnimatedCard'
import { SystemHealthCard } from '@/components/admin/SystemHealthCard'
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
    CheckCircle2,
} from 'lucide-react'
import type { AdminStats } from './actions'
import { TaskCard } from '@/components/admin/TaskCard'

interface AdminDashboardClientProps {
    stats: AdminStats
}

export function AdminDashboardClient({ stats }: AdminDashboardClientProps) {
    const [activeTab, setActiveTab] = useState('overview')
    const [timeRange, setTimeRange] = useState('30d')

    return (
        <div style={{ backgroundColor: 'var(--surface-paper)', minHeight: 'calc(100vh - 72px)' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '48px' }}>
                {/* Welcome Header */}
                <div style={{ marginBottom: '32px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <div>
                            <p style={{ fontSize: '14px', color: 'rgba(11, 15, 12, 0.52)', margin: 0, marginBottom: '4px' }}>
                                Admin Dashboard
                            </p>
                            <h1 style={{ fontSize: '32px', fontWeight: 600, color: '#0B0F0C', letterSpacing: '-0.5px', margin: 0 }}>
                                System Overview
                            </h1>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <select
                                value={timeRange}
                                onChange={(e) => setTimeRange(e.target.value)}
                                className="text-sm bg-white border border-[var(--border-subtle)] rounded-[4px] px-4 py-2.5 text-[var(--text-primary)] cursor-pointer"
                            >
                                <option value="7d">Last 7 days</option>
                                <option value="30d">Last 30 days</option>
                                <option value="90d">Last 90 days</option>
                                <option value="1y">Last year</option>
                            </select>
                        </div>
                    </div>
                    <p style={{ fontSize: '14px', color: 'rgba(11, 15, 12, 0.66)', margin: 0 }}>
                        Comprehensive overview of your SaaS platform performance and operations
                    </p>
                </div>

                {/* Tabs */}
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '2px',
                        marginBottom: '24px',
                        borderBottom: '1px solid rgba(11, 15, 12, 0.08)',
                    }}
                >
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
                            style={{
                                padding: '12px 16px',
                                fontSize: '14px',
                                fontWeight: 500,
                                border: 'none',
                                background: 'none',
                                borderBottom:
                                    activeTab === tab.id ? '2px solid var(--brand-mughal-green)' : '2px solid transparent',
                                color: activeTab === tab.id ? 'var(--brand-mughal-green)' : 'rgba(11, 15, 12, 0.66)',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                marginBottom: '-1px',
                            }}
                            onMouseEnter={(e) => {
                                if (activeTab !== tab.id) {
                                    e.currentTarget.style.color = '#0B0F0C'
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (activeTab !== tab.id) {
                                    e.currentTarget.style.color = 'rgba(11, 15, 12, 0.66)'
                                }
                            }}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Overview Tab */}
                {activeTab === 'overview' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        {/* Top SaaS KPIs - 4 Column Grid */}
                        <div>
                            <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#0B0F0C', margin: 0, marginBottom: '16px' }}>
                                Key SaaS Metrics
                            </h2>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
                                <KPICard
                                    label="Monthly Recurring Revenue (MRR)"
                                    value={`€${stats.mrr.current.toLocaleString()}`}
                                    change={stats.mrr.growth}
                                    isUp={true}
                                    delay={0}
                                    icon={DollarSign}
                                />
                                <KPICard
                                    label="Annual Recurring Revenue (ARR)"
                                    value={`€${(stats.arr.current / 1000).toFixed(0)}K`}
                                    change={stats.arr.growth}
                                    isUp={true}
                                    delay={50}
                                    icon={TrendingUp}
                                />
                                <KPICard
                                    label="Churn Rate"
                                    value={`${stats.engagement.churn}%`}
                                    change={-0.5}
                                    isUp={true}
                                    delay={100}
                                    icon={TrendingDown}
                                />
                                <KPICard
                                    label="Net Revenue Retention"
                                    value={`${stats.saas.netRevenueRetention}%`}
                                    change={2.3}
                                    isUp={true}
                                    delay={150}
                                    icon={RefreshCw}
                                />
                            </div>
                        </div>

                        {/* Secondary SaaS KPIs - 4 Column Grid */}
                        <div>
                            <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#0B0F0C', margin: 0, marginBottom: '16px' }}>
                                Growth & Efficiency Metrics
                            </h2>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
                                <KPICard
                                    label="Customer Lifetime Value (LTV)"
                                    value={`€${stats.saas.ltv.toLocaleString()}`}
                                    change={8.2}
                                    isUp={true}
                                    delay={200}
                                    icon={Gem}
                                />
                                <KPICard
                                    label="Customer Acquisition Cost (CAC)"
                                    value={`€${stats.saas.cac}`}
                                    change={-3.1}
                                    isUp={true}
                                    delay={250}
                                    icon={Target}
                                />
                                <KPICard
                                    label="LTV:CAC Ratio"
                                    value={`${stats.saas.ltvCacRatio}:1`}
                                    change={1.2}
                                    isUp={true}
                                    delay={300}
                                    icon={Scale}
                                />
                                <KPICard
                                    label="Gross Margin"
                                    value={`${stats.saas.grossMargin}%`}
                                    change={1.5}
                                    isUp={true}
                                    delay={350}
                                    icon={BarChart}
                                />
                            </div>
                        </div>

                        {/* Main Content Grid - 2 Column */}
                        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
                            {/* User Growth Chart */}
                            <AnimatedCard delay={400}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <TrendingUp size={20} className="text-[var(--brand-mughal-green)]" />
                                        <div>
                                            <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#0B0F0C', margin: 0, marginBottom: '4px' }}>
                                                User Growth
                                            </h3>
                                            <p style={{ fontSize: '13px', color: 'rgba(11, 15, 12, 0.52)', margin: 0 }}>
                                                Monthly active users trend
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div
                                    style={{
                                        height: '200px',
                                        display: 'flex',
                                        alignItems: 'flex-end',
                                        justifyContent: 'space-between',
                                        gap: '8px',
                                        paddingTop: '20px',
                                    }}
                                >
                                    {[65, 72, 78, 85, 82, 88, 95].map((value, i) => (
                                        <div
                                            key={i}
                                            style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}
                                        >
                                            <div
                                                style={{
                                                    width: '100%',
                                                    maxWidth: '40px',
                                                    backgroundColor: 'var(--brand-mughal-green)',
                                                    borderRadius: '4px 4px 0 0',
                                                    height: `${value}%`,
                                                    transition: 'height 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
                                                }}
                                            />
                                            <span style={{ fontSize: '12px', color: 'rgba(11, 15, 12, 0.52)' }}>
                                                {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'][i]}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </AnimatedCard>

                            {/* Quick Stats */}
                            <AnimatedCard delay={450}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
                                    <Activity size={20} className="text-[var(--brand-mughal-green)]" />
                                    <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#0B0F0C', margin: 0 }}>Engagement</h3>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                    <div
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            padding: '10px 0',
                                            borderBottom: '1px solid rgba(11, 15, 12, 0.06)',
                                        }}
                                    >
                                        <div style={{ flex: 1 }}>
                                            <p style={{ fontSize: '13px', color: 'rgba(11, 15, 12, 0.66)', margin: 0 }}>DAU</p>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <p style={{ fontSize: '16px', fontWeight: 600, color: '#0B0F0C', margin: 0 }}>
                                                {stats.engagement.dau.toLocaleString()}
                                            </p>
                                            <span style={{ fontSize: '12px', fontWeight: 500, color: 'var(--state-success)' }}>+12%</span>
                                        </div>
                                    </div>
                                    <div
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            padding: '10px 0',
                                            borderBottom: '1px solid rgba(11, 15, 12, 0.06)',
                                        }}
                                    >
                                        <div style={{ flex: 1 }}>
                                            <p style={{ fontSize: '13px', color: 'rgba(11, 15, 12, 0.66)', margin: 0 }}>MAU</p>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <p style={{ fontSize: '16px', fontWeight: 600, color: '#0B0F0C', margin: 0 }}>
                                                {stats.engagement.mau.toLocaleString()}
                                            </p>
                                            <span style={{ fontSize: '12px', fontWeight: 500, color: 'var(--state-success)' }}>+8%</span>
                                        </div>
                                    </div>
                                    <div
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            padding: '10px 0',
                                            borderBottom: '1px solid rgba(11, 15, 12, 0.06)',
                                        }}
                                    >
                                        <div style={{ flex: 1 }}>
                                            <p style={{ fontSize: '13px', color: 'rgba(11, 15, 12, 0.66)', margin: 0 }}>NPS</p>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <p style={{ fontSize: '16px', fontWeight: 600, color: '#0B0F0C', margin: 0 }}>
                                                {stats.engagement.nps}
                                            </p>
                                            <span style={{ fontSize: '12px', fontWeight: 500, color: 'var(--state-success)' }}>+5</span>
                                        </div>
                                    </div>
                                    <div
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            padding: '10px 0',
                                        }}
                                    >
                                        <div style={{ flex: 1 }}>
                                            <p style={{ fontSize: '13px', color: 'rgba(11, 15, 12, 0.66)', margin: 0 }}>Trial to Paid</p>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <p style={{ fontSize: '16px', fontWeight: 600, color: '#0B0F0C', margin: 0 }}>
                                                {stats.engagement.trialToPaid}%
                                            </p>
                                            <span style={{ fontSize: '12px', fontWeight: 500, color: 'var(--state-success)' }}>+2.3%</span>
                                        </div>
                                    </div>
                                </div>
                            </AnimatedCard>
                        </div>

                        {/* Users by Plan */}
                        <div>
                            <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#0B0F0C', margin: 0, marginBottom: '16px' }}>
                                Users by Plan
                            </h2>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
                                {Object.entries(stats.users.byPlan).map(([plan, count], idx) => {
                                    const monthlyPrice = stats.users.planPricing[plan as keyof typeof stats.users.planPricing]
                                    const monthlyRevenue = count * monthlyPrice
                                    return (
                                        <AnimatedCard key={plan} delay={500 + idx * 50}>
                                            <p
                                                style={{
                                                    fontSize: '13px',
                                                    color: 'rgba(11, 15, 12, 0.52)',
                                                    margin: 0,
                                                    marginBottom: '8px',
                                                    textTransform: 'capitalize',
                                                }}
                                            >
                                                {plan}
                                            </p>
                                            <p style={{ fontSize: '24px', fontWeight: 600, color: '#0B0F0C', margin: 0, marginBottom: '4px' }}>
                                                {count.toLocaleString()}
                                            </p>
                                            <p style={{ fontSize: '12px', color: 'rgba(11, 15, 12, 0.66)', margin: 0, marginBottom: '4px' }}>
                                                {((count / stats.users.total) * 100).toFixed(1)}% of total
                                            </p>
                                            {monthlyRevenue > 0 && (
                                                <p
                                                    style={{
                                                        fontSize: '14px',
                                                        fontWeight: 600,
                                                        color: 'var(--brand-mughal-green)',
                                                        margin: 0,
                                                        marginTop: '8px',
                                                        paddingTop: '8px',
                                                        borderTop: '1px solid rgba(11, 15, 12, 0.08)',
                                                    }}
                                                >
                                                    €{monthlyRevenue.toLocaleString()}/mo
                                                </p>
                                            )}
                                            {monthlyRevenue === 0 && (
                                                <p
                                                    style={{
                                                        fontSize: '12px',
                                                        color: 'rgba(11, 15, 12, 0.52)',
                                                        margin: 0,
                                                        marginTop: '8px',
                                                        paddingTop: '8px',
                                                        borderTop: '1px solid rgba(11, 15, 12, 0.08)',
                                                    }}
                                                >
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
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                            <KPICard
                                label="Total Users"
                                value={stats.users.total.toLocaleString()}
                                change={8.2}
                                isUp={true}
                                delay={0}
                                icon={Users}
                            />
                            <KPICard
                                label="Searches (Last Month)"
                                value={stats.searches.lastMonth.toLocaleString()}
                                change={15.3}
                                isUp={true}
                                delay={50}
                                icon={Activity}
                            />
                            <KPICard
                                label="Total Searches"
                                value={stats.searches.total.toLocaleString()}
                                delay={100}
                                icon={BarChart}
                            />
                        </div>

                        <AnimatedCard delay={150}>
                            <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#0B0F0C', margin: 0, marginBottom: '16px' }}>
                                Recent Users
                            </h2>
                            <div className="border border-[var(--border-subtle)] overflow-hidden" style={{ borderRadius: '4px' }}>
                                <table style={{ width: '100%' }}>
                                    <thead
                                        style={{ backgroundColor: 'var(--surface-paper)', borderBottom: '1px solid rgba(11, 15, 12, 0.08)' }}
                                    >
                                        <tr>
                                            <th
                                                style={{
                                                    textAlign: 'left',
                                                    padding: '12px 16px',
                                                    fontSize: '12px',
                                                    fontWeight: 600,
                                                    color: '#0B0F0C',
                                                }}
                                            >
                                                Name
                                            </th>
                                            <th
                                                style={{
                                                    textAlign: 'left',
                                                    padding: '12px 16px',
                                                    fontSize: '12px',
                                                    fontWeight: 600,
                                                    color: '#0B0F0C',
                                                }}
                                            >
                                                Email
                                            </th>
                                            <th
                                                style={{
                                                    textAlign: 'left',
                                                    padding: '12px 16px',
                                                    fontSize: '12px',
                                                    fontWeight: 600,
                                                    color: '#0B0F0C',
                                                }}
                                            >
                                                Plan
                                            </th>
                                            <th
                                                style={{
                                                    textAlign: 'left',
                                                    padding: '12px 16px',
                                                    fontSize: '12px',
                                                    fontWeight: 600,
                                                    color: '#0B0F0C',
                                                }}
                                            >
                                                Joined
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {stats.users.recent.map((user, idx) => (
                                            <tr
                                                key={idx}
                                                style={{
                                                    borderBottom:
                                                        idx < stats.users.recent.length - 1 ? '1px solid rgba(11, 15, 12, 0.08)' : 'none',
                                                }}
                                            >
                                                <td style={{ padding: '12px 16px', fontSize: '14px', color: '#0B0F0C' }}>{user.name}</td>
                                                <td style={{ padding: '12px 16px', fontSize: '14px', color: 'rgba(11, 15, 12, 0.66)' }}>
                                                    {user.email}
                                                </td>
                                                <td style={{ padding: '12px 16px' }}>
                                                    <span
                                                        style={{
                                                            padding: '4px 8px',
                                                            backgroundColor: 'var(--surface-bone)',
                                                            borderRadius: '4px',
                                                            fontSize: '12px',
                                                            fontWeight: 500,
                                                            color: '#0B0F0C',
                                                            textTransform: 'capitalize',
                                                        }}
                                                    >
                                                        {user.plan}
                                                    </span>
                                                </td>
                                                <td style={{ padding: '12px 16px', fontSize: '14px', color: 'rgba(11, 15, 12, 0.52)' }}>
                                                    {user.joined}
                                                </td>
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
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#0B0F0C', margin: 0 }}>System Health Status</h2>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
                            <SystemHealthCard name="Supabase" health={stats.systemHealth.supabase} />
                            <SystemHealthCard name="ANAF API" health={stats.systemHealth.anaf} />
                            <SystemHealthCard name="SendGrid" health={stats.systemHealth.sendgrid} />
                            <SystemHealthCard name="Webhooks" health={stats.systemHealth.webhooks} />
                        </div>
                    </div>
                )}

                {/* Tasks Tab */}
                {activeTab === 'tasks' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#0B0F0C', margin: 0 }}>Tasks & Roadmap</h2>
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    fontSize: '14px',
                                    color: 'rgba(11, 15, 12, 0.66)',
                                }}
                            >
                                <span>Total: {stats.tasks.length}</span>
                                <span>•</span>
                                <span>Completed: {stats.tasks.filter((t) => t.status === 'completed').length}</span>
                            </div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {stats.tasks.map((task) => (
                                <TaskCard key={task.id} task={task} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
