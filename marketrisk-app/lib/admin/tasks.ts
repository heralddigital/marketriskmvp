export interface RoadmapTask {
    id: number
    title: string
    priority: 'high' | 'medium' | 'low'
    status: 'planned' | 'in-progress' | 'completed'
    type: 'optimization' | 'integration' | 'security' | 'feature'
    description: string
    costRange: string
    hours: number
    dueDate: string
    benefits: string
    visible: boolean
}

export const ROADMAP_TASKS: RoadmapTask[] = [
    {
        id: 1,
        title: 'Database & API Performance Optimization',
        priority: 'medium',
        status: 'planned',
        type: 'optimization',
        description: 'Optimize database queries and API response times.',
        costRange: '€100-200',
        hours: 15,
        dueDate: '2026-02-23',
        benefits: 'Faster user experience.',
        visible: true,
    },
    {
        id: 2,
        title: 'RECOM Financial Statements Integration',
        priority: 'medium',
        status: 'planned',
        type: 'integration',
        description: 'Add financial health indicators from Trade Register.',
        costRange: '€500-2000',
        hours: 25,
        dueDate: '2026-03-23',
        benefits: 'Financial ratios and revenue trends.',
        visible: true,
    },
    {
        id: 3,
        title: 'Multi-factor Authentication',
        priority: 'high',
        status: 'in-progress',
        type: 'security',
        description: 'Implement MFA for enhanced account security.',
        costRange: '€300-500',
        hours: 20,
        dueDate: '2026-02-15',
        benefits: 'Improved security and compliance.',
        visible: false,
    },
    {
        id: 4,
        title: 'Advanced Reporting Dashboard',
        priority: 'high',
        status: 'completed',
        type: 'feature',
        description: 'Build comprehensive reporting dashboard for users.',
        costRange: '€800-1500',
        hours: 40,
        dueDate: '2026-01-30',
        benefits: 'Better insights and decision-making.',
        visible: true,
    },
    {
        id: 5,
        title: 'API Rate Limiting',
        priority: 'medium',
        status: 'planned',
        type: 'optimization',
        description: 'Implement rate limiting to prevent abuse.',
        costRange: '€200-400',
        hours: 12,
        dueDate: '2026-03-01',
        benefits: 'Better system stability and cost control.',
        visible: false,
    },
    {
        id: 6,
        title: 'Real-time BPI Alerts',
        priority: 'high',
        status: 'planned',
        type: 'feature',
        description: 'Push notifications for insolvency proceedings.',
        costRange: '€400-600',
        hours: 18,
        dueDate: '2026-02-28',
        benefits: 'Immediate risk detection.',
        visible: true,
    },
    {
        id: 7,
        title: 'Bulk CUI Import',
        priority: 'medium',
        status: 'planned',
        type: 'feature',
        description: 'Allow users to import multiple CUIs via CSV.',
        costRange: '€300-500',
        hours: 16,
        dueDate: '2026-03-15',
        benefits: 'Faster watchlist setup.',
        visible: true,
    },
]
