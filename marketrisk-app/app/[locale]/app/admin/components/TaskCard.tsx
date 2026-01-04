'use client'

import React from 'react'
import { CheckCircle2 } from 'lucide-react'
import { AnimatedCard } from './AnimatedCard'
import type { RoadmapTask } from '@/lib/admin/tasks'

interface TaskCardProps {
    task: RoadmapTask
    onComplete: (id: number) => void
    onUncomplete: (id: number) => void
    onAddToFeatures: (id: number) => void
}

export function TaskCard({ task, onComplete, onUncomplete, onAddToFeatures }: TaskCardProps) {
    const priorityColors = {
        high: 'text-state-danger',
        medium: 'text-state-warning',
        low: 'text-brand-mughal-green',
    }

    const statusColors = {
        planned: 'bg-surface-bone text-text-secondary',
        'in-progress': 'bg-brand-pistachio/20 text-brand-mughal-green',
        completed: 'bg-brand-mughal-green/20 text-brand-mughal-green',
    }

    const typeColors = {
        optimization: 'bg-brand-pistachio/20 text-brand-mughal-green',
        integration: 'bg-brand-mughal-green/10 text-brand-mughal-green',
        security: 'bg-state-danger-soft text-state-danger',
        feature: 'bg-surface-bone text-text-primary border border-border-subtle',
    }

    const isCompleted = task.status === 'completed'

    return (
        <AnimatedCard delay={100}>
            <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${statusColors[task.status]}`}>
                            {task.status}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${typeColors[task.type]}`}>
                            {task.type}
                        </span>
                        <span className={`text-xs font-medium capitalize ${priorityColors[task.priority]}`}>
                            {task.priority} priority
                        </span>
                    </div>
                    <h4 className="text-base font-semibold text-text-primary mb-2">
                        {task.title}
                    </h4>
                    <p className="text-sm text-text-secondary mb-3">{task.description}</p>
                    <div className="flex flex-wrap items-center gap-4 text-xs text-text-muted">
                        <span>{task.costRange}</span>
                        <span>{task.hours}h</span>
                        <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                    </div>
                    <div className="mt-3 flex items-start gap-2">
                        <CheckCircle2 size={14} className="text-brand-mughal-green mt-0.5 flex-shrink-0" />
                        <span className="text-xs text-text-secondary">{task.benefits}</span>
                    </div>
                </div>
                <div className="ml-4 flex flex-col gap-2">
                    {!isCompleted ? (
                        <button
                            type="button"
                            onClick={() => onComplete(task.id)}
                            className="px-4 py-2 bg-brand-mughal-green text-white rounded-[4px] text-sm font-medium hover:bg-brand-mughal-green-2 transition-all duration-300 whitespace-nowrap"
                        >
                            Mark Complete
                        </button>
                    ) : (
                        <>
                            <button
                                type="button"
                                onClick={() => onUncomplete(task.id)}
                                className="px-4 py-2 bg-surface-bone text-text-primary border border-border-subtle rounded-[4px] text-sm font-medium hover:bg-surface-paper transition-all duration-300 whitespace-nowrap"
                            >
                                Unmark Complete
                            </button>
                            {task.type === 'feature' && (
                                <button
                                    type="button"
                                    onClick={() => onAddToFeatures(task.id)}
                                    className="px-4 py-2 bg-brand-pistachio text-text-on-bone rounded-[4px] text-sm font-medium hover:opacity-90 transition-all duration-300 whitespace-nowrap"
                                >
                                    Add to Features
                                </button>
                            )}
                        </>
                    )}
                </div>
            </div>
        </AnimatedCard>
    )
}
