'use client'

import React, { useEffect, useState } from 'react'
import { LucideIcon } from 'lucide-react'

interface KPICardProps {
    label?: string
    title?: string // Alias for label
    value: string | number
    change?: number
    isUp?: boolean
    trend?: {
        value: string
        isPositive: boolean
    }
    delay?: number
    icon?: any // Can be LucideIcon or ReactNode
}

export function KPICard({
    label,
    title,
    value,
    change,
    isUp,
    trend,
    delay = 0,
    icon: Icon
}: KPICardProps) {
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        const timer = setTimeout(() => setIsVisible(true), delay)
        return () => clearTimeout(timer)
    }, [delay])

    const displayLabel = title || label

    return (
        <div
            className="bg-white border border-[var(--border-subtle)] p-5 transition-all duration-300 flex flex-col h-full hover:shadow-md"
            style={{
                borderRadius: '4px',
                transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                opacity: isVisible ? 1 : 0,
            }}
        >
            <div className="flex items-start justify-between mb-3">
                <p className="text-[13px] font-medium text-[var(--text-muted)] m-0">{displayLabel}</p>
                {/* Handle change percentage (Admin style) */}
                {change !== undefined && (
                    <span
                        className={`text-[12px] font-bold px-2 py-1 rounded-[4px] ${isUp ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                            }`}
                    >
                        {isUp ? '+' : ''}{change}%
                    </span>
                )}
                {/* Handle trend object (User style) */}
                {trend && (
                    <span
                        className={`text-[11px] font-bold px-2 py-0.5 rounded ${trend.isPositive ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'
                            }`}
                    >
                        {trend.value}
                    </span>
                )}
            </div>

            <div className="flex items-end justify-between mt-auto pt-2">
                <p className="text-3xl font-bold text-[var(--text-primary)] leading-none tracking-tight m-0">
                    {value}
                </p>

                {Icon && (
                    <div className="w-10 h-10 bg-[var(--brand-mughal-green)] text-white rounded-[4px] flex items-center justify-center flex-shrink-0">
                        {typeof Icon === 'function' ? (
                            <Icon size={20} strokeWidth={2} />
                        ) : (
                            Icon
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}
