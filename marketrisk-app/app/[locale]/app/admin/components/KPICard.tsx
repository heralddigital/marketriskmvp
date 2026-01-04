'use client'

import React, { useState, useEffect } from 'react'
import { LucideIcon } from 'lucide-react'

interface KPICardProps {
    label: string
    value: string
    change?: number
    isUp?: boolean
    delay?: number
    icon?: LucideIcon
}

export function KPICard({ label, value, change, isUp, delay = 0, icon: Icon }: KPICardProps) {
    const [isHovered, setIsHovered] = useState(false)
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        const timer = setTimeout(() => setIsVisible(true), delay)
        return () => clearTimeout(timer)
    }, [delay])

    return (
        <div
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={`bg-surface-primary border border-border-subtle p-5 transition-all duration-300 cursor-pointer flex flex-col h-full rounded-[4px] ${isHovered ? 'shadow-sm' : ''}`}
            style={{
                transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                opacity: isVisible ? 1 : 0,
            }}
        >
            <div className="flex items-start justify-between mb-3">
                <p className="text-[13px] font-medium text-text-secondary m-0">{label}</p>
                {change !== undefined && (
                    <span
                        className={`text-xs font-semibold px-2 py-1 rounded-[4px] ${isUp
                            ? 'bg-state-success-soft text-state-success'
                            : 'bg-state-danger-soft text-state-danger'
                            }`}
                    >
                        {isUp ? '+' : ''}{change}%
                    </span>
                )}
            </div>
            <div className="flex items-end justify-between mt-auto pt-2">
                <p className="text-[28px] font-semibold text-text-primary m-0 tracking-tight leading-none">
                    {value}
                </p>
                {Icon && (
                    <div className="w-10 h-10 bg-brand-mughal-green rounded-[4px] flex items-center justify-center text-white flex-shrink-0">
                        <Icon size={20} strokeWidth={2} />
                    </div>
                )}
            </div>
        </div>
    )
}
