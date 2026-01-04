'use client'

import { AnimatedCard } from './AnimatedCard'
import { Database, Mail, Webhook, Server, CheckCircle2, AlertCircle, Activity, Zap, Clock } from 'lucide-react'

interface SystemHealth {
    status: 'healthy' | 'warning' | 'error'
    uptime: string
    responseTime?: string
    lastSync?: string
}

interface SystemHealthCardProps {
    name: string
    health: SystemHealth
}

export function SystemHealthCard({ name, health }: SystemHealthCardProps) {
    const statusColors = {
        healthy: 'text-[var(--brand-mughal-green)]',
        warning: 'text-[var(--state-warning)]',
        error: 'text-[var(--state-danger)]',
    }
    const statusBg = {
        healthy: 'bg-[var(--brand-mughal-green)]/10',
        warning: 'bg-[var(--state-warning)]/10',
        error: 'bg-[var(--state-danger)]/10',
    }

    const getIcon = () => {
        if (name.toLowerCase().includes('supabase') || name.toLowerCase().includes('database')) {
            return Database
        }
        if (name.toLowerCase().includes('sendgrid') || name.toLowerCase().includes('mail')) {
            return Mail
        }
        if (name.toLowerCase().includes('webhook')) {
            return Webhook
        }
        return Server
    }

    const Icon = getIcon()
    const StatusIcon = health.status === 'healthy' ? CheckCircle2 : AlertCircle

    return (
        <AnimatedCard delay={100}>
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    <Icon size={18} className="text-[var(--text-secondary)]" />
                    <h4 className="text-sm font-semibold text-[var(--text-primary)]">{name}</h4>
                </div>
                <span
                    className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${statusColors[health.status]} ${statusBg[health.status]}`}
                >
                    <StatusIcon size={12} />
                    {health.status}
                </span>
            </div>
            <div className="space-y-2 text-xs">
                <div className="flex justify-between items-center">
                    <span className="text-[var(--text-muted)] flex items-center gap-1">
                        <Activity size={12} />
                        Uptime
                    </span>
                    <span className="text-[var(--text-primary)] font-medium">{health.uptime}</span>
                </div>
                {health.responseTime && (
                    <div className="flex justify-between items-center">
                        <span className="text-[var(--text-muted)] flex items-center gap-1">
                            <Zap size={12} />
                            Response Time
                        </span>
                        <span className="text-[var(--text-primary)] font-medium">{health.responseTime}</span>
                    </div>
                )}
                {health.lastSync && (
                    <div className="flex justify-between items-center">
                        <span className="text-[var(--text-muted)] flex items-center gap-1">
                            <Clock size={12} />
                            Last Sync
                        </span>
                        <span className="text-[var(--text-primary)] font-medium">{health.lastSync}</span>
                    </div>
                )}
            </div>
        </AnimatedCard>
    )
}
