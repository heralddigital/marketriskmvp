'use client'

import React, { useState, useEffect } from 'react'

interface AnimatedCardProps {
    children: React.ReactNode
    delay?: number
    className?: string
}

export function AnimatedCard({ children, delay = 0, className = '' }: AnimatedCardProps) {
    const [isVisible, setIsVisible] = useState(false)
    const [isHovered, setIsHovered] = useState(false)

    useEffect(() => {
        const timer = setTimeout(() => setIsVisible(true), delay)
        return () => clearTimeout(timer)
    }, [delay])

    return (
        <div
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={`bg-surface-primary border border-border-subtle p-5 transition-all duration-300 rounded-[4px] ${isHovered ? 'shadow-sm' : ''} ${className}`}
            style={{
                transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                opacity: isVisible ? 1 : 0,
            }}
        >
            {children}
        </div>
    )
}
