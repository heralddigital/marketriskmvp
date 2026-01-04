'use client'

import React from 'react'
import {
    Database,
    Mail,
    Webhook,
    Server,
    CheckCircle2,
    AlertCircle,
    Activity,
    Zap,
    Clock
} from 'lucide-react'
import { AnimatedCard } from './AnimatedCard'

interface HealthStatus {
    status: 'healthy' | 'warning' | 'error'
    uptime?: string
    responseTime?: string
    lastSync?: string
}

interface SystemHealthCardProps {
    name: string
    health: HealthStatus
}

export function SystemHealthCard({ name, health }: SystemHealthCardProps) {
    const statusColors = {
        healthy: 'text-brand-mughal-green',
        warning: 'text-state-warning',
        error: 'text-state-danger',
    }

    const statusBg = {
        healthy: 'bg-brand-mughal-green/10',
        warning: 'bg-state-warning-soft',
        error: 'bg-state-danger-soft',
    }

    const getIcon = () => {
        const lowerName = name.toLowerCase()
        if (lowerName.includes('supabase') || lowerName.includes('database')) {
            return Database
        }
        if (lowerName.includes('sendgrid') || lowerName.includes('mail')) {
            return Mail
        }
        if (lowerName.includes('webhook')) {
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
                    <Icon size={18} className="text-text-secondary" />
                    <h4 className="text-sm font-semibold text-text-primary">{name}</h4>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${statusColors[health.status]} ${statusBg[health.status]}`}>
                    <StatusIcon size={12} />
                    <span className="capitalize">{health.status}</span>
                </span>
            </div>
            <div className="space-y-2 text-xs">
                <div className="flex justify-between items-center">
                    <span className="text-text-muted flex items-center gap-1">
                        <Activity size={12} />
                        Uptime
                    </span>
                    <span className="text-text-primary font-medium">{health.uptime || 'N/A'}</span>
                </div>
                {health.responseTime && (
                    <div className="flex justify-between items-center">
                        <span className="text-text-muted flex items-center gap-1">
                            <Zap size={12} />
                            Response Time
                        </span>
                        <span className="text-text-primary font-medium">{health.responseTime}</span>
                    </div>
                )}
                {health.lastSync && (
                    <div className="flex justify-between items-center">
                        <span className="text-text-muted flex items-center gap-1">
                            <Clock size={12} />
                            Last Sync
                        </span>
                        <span className="text-text-primary font-medium">{health.lastSync}</span>
                    </div>
                )}
            </div>
        </AnimatedCard>
    )
}
