'use client'

import React from 'react'
import { CheckCircle2, Clock, AlertCircle } from 'lucide-react'
import { AnimatedCard } from './AnimatedCard'

export interface Task {
    id: string
    title: string
    description: string
    status: 'planned' | 'in-progress' | 'completed'
    priority: 'high' | 'medium' | 'low'
    type: 'feature' | 'optimization' | 'security' | 'integration'
    dueDate: string
    benefits: string
    costRange: string
    hours: number
}

interface TaskCardProps {
    task: Task
    onComplete?: (id: string) => void
    onUncomplete?: (id: string) => void
}

export function TaskCard({ task, onComplete, onUncomplete }: TaskCardProps) {
    const priorityColors = {
        high: 'text-[var(--state-danger)]',
        medium: 'text-[var(--state-warning)]',
        low: 'text-[var(--brand-mughal-green)]',
    }
    const statusColors = {
        planned: 'bg-[var(--surface-bone)] text-[var(--text-secondary)]',
        'in-progress': 'bg-[var(--brand-pistachio)]/20 text-[var(--brand-mughal-green)]',
        completed: 'bg-[var(--brand-mughal-green)]/20 text-[var(--brand-mughal-green)]',
    }
    const typeColors = {
        optimization: 'bg-[var(--brand-pistachio)]/20 text-[var(--brand-mughal-green)]',
        integration: 'bg-[var(--brand-mughal-green)]/10 text-[var(--brand-mughal-green)]',
        security: 'bg-[var(--state-danger)]/10 text-[var(--state-danger)]',
        feature: 'bg-[var(--brand-bone)]/50 text-[var(--text-primary)]',
    }

    const isCompleted = task.status === 'completed'

    return (
        <AnimatedCard delay={100}>
            <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                        <span className={`px-2 py-1 rounded-[4px] text-[10px] font-medium uppercase tracking-wider ${statusColors[task.status]}`}>
                            {task.status}
                        </span>
                        <span className={`px-2 py-1 rounded-[4px] text-[10px] font-medium uppercase tracking-wider ${typeColors[task.type]}`}>
                            {task.type}
                        </span>
                        <span className={`text-[10px] font-medium uppercase tracking-wider ${priorityColors[task.priority]}`}>
                            {task.priority} priority
                        </span>
                    </div>
                    <h4 className={`text-base font-semibold text-[var(--text-primary)] mb-2`}>
                        {task.title}
                    </h4>
                    <p className="text-sm text-[var(--text-secondary)] mb-3">{task.description}</p>
                    <div className="flex flex-wrap items-center gap-4 text-xs text-[var(--text-muted)]">
                        <span>{task.costRange}</span>
                        <span>{task.hours}h</span>
                        <span>Due: {new Date(task.dueDate).toLocaleDateString('ro-RO', { day: '2-digit', month: '2-digit', year: 'numeric' })}</span>
                    </div>
                    <div className="mt-3 flex items-start gap-2">
                        <CheckCircle2 size={14} className="text-[var(--brand-mughal-green)] mt-0.5 flex-shrink-0" />
                        <span className="text-xs text-[var(--text-secondary)]">{task.benefits}</span>
                    </div>
                </div>
                <div className="ml-4 flex flex-col gap-2">
                    {!isCompleted ? (
                        <button
                            type="button"
                            onClick={() => onComplete?.(task.id)}
                            className="px-4 py-2 bg-[var(--brand-mughal-green)] text-white rounded-[4px] text-sm font-medium hover:bg-[var(--brand-mughal-green-2)] transition-all whitespace-nowrap"
                        >
                            Mark Complete
                        </button>
                    ) : (
                        <button
                            type="button"
                            onClick={() => onUncomplete?.(task.id)}
                            className="px-4 py-2 bg-[var(--surface-bone)] text-[var(--text-primary)] border border-[var(--border-subtle)] rounded-[4px] text-sm font-medium hover:bg-[var(--surface-paper)] transition-all whitespace-nowrap"
                        >
                            Unmark Complete
                        </button>
                    )}
                </div>
            </div>
        </AnimatedCard>
    )
}
