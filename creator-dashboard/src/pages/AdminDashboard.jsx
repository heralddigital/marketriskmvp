import React from 'react'
import { ROADMAP_TASKS } from '../data/tasks.js'
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
  UserCheck,
  Activity,
  Zap,
  Server,
  Database,
  Mail,
  Webhook,
  CheckCircle2,
  Clock,
  AlertCircle,
} from 'lucide-react'

// Mock data - in production, this would come from API
const mockData = {
  users: {
    total: 1247,
    byPlan: {
      free: 892,
      starter: 234,
      pro: 98,
      enterprise: 23,
    },
    planPricing: {
      free: 0,
      starter: 29,
      pro: 99,
      enterprise: 299,
    },
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
  },
}

// Animated Card wrapper
function AnimatedCard({ children, delay = 0 }) {
  const [isVisible, setIsVisible] = React.useState(false)
  const [isHovered, setIsHovered] = React.useState(false)

  React.useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay)
    return () => clearTimeout(timer)
  }, [delay])

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`bg-white border border-border-subtle p-5 transition-all duration-normal ${isHovered ? 'hover:shadow-sm' : ''}`}
      style={{
        borderRadius: '4px',
        transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
        opacity: isVisible ? 1 : 0,
      }}
    >
      {children}
    </div>
  )
}

// SaaS KPI Metric Card - Polished design
function KPICard({ label, value, change, isUp, delay = 0, icon: Icon }) {
  const [isHovered, setIsHovered] = React.useState(false)
  const [isVisible, setIsVisible] = React.useState(false)

  React.useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay)
    return () => clearTimeout(timer)
  }, [delay])

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`bg-white border border-border-subtle p-5 transition-all duration-normal cursor-pointer flex flex-col h-full ${isHovered ? 'hover:shadow-sm' : ''}`}
      style={{
        borderRadius: '4px',
        transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
        opacity: isVisible ? 1 : 0,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '12px' }}>
        <p style={{ fontSize: '13px', color: 'rgba(11, 15, 12, 0.52)', margin: 0, fontWeight: 500 }}>{label}</p>
        {change !== undefined && (
          <span style={{
            fontSize: '12px',
            fontWeight: 600,
            padding: '4px 8px',
            borderRadius: '4px',
            backgroundColor: isUp ? 'var(--state-success-soft)' : 'var(--state-danger-soft)',
            color: isUp ? 'var(--state-success)' : 'var(--state-danger)'
          }}>
            {isUp ? '+' : ''}{change}%
          </span>
        )}
      </div>
      <div style={{ 
        display: 'flex', 
        alignItems: 'flex-end', 
        justifyContent: 'space-between',
        marginTop: 'auto',
        paddingTop: '8px'
      }}>
        <p style={{
          fontSize: '28px',
          fontWeight: 600,
          color: '#0B0F0C',
          margin: 0,
          letterSpacing: '-0.5px',
          lineHeight: '1'
        }}>{value}</p>
        {Icon && (
          <div style={{
            width: '40px',
            height: '40px',
            backgroundColor: 'var(--brand-mughal-green)',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            flexShrink: 0
          }}>
            <Icon size={20} strokeWidth={2} />
          </div>
        )}
      </div>
    </div>
  )
}

function SystemHealthCard({ name, health }) {
  const statusColors = {
    healthy: 'text-brand-mughal-green',
    warning: 'text-state-warning',
    error: 'text-state-danger',
  }
  const statusBg = {
    healthy: 'bg-brand-mughal-green/10',
    warning: 'bg-state-warning/10',
    error: 'bg-state-danger/10',
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
          <Icon size={18} className="text-text-secondary" />
          <h4 className="text-sm font-semibold text-text-primary">{name}</h4>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${statusColors[health.status]} ${statusBg[health.status]}`}>
          <StatusIcon size={12} />
          {health.status}
        </span>
      </div>
      <div className="space-y-2 text-xs">
        <div className="flex justify-between items-center">
          <span className="text-text-muted flex items-center gap-1">
            <Activity size={12} />
            Uptime
          </span>
          <span className="text-text-primary font-medium">{health.uptime}</span>
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

function TaskCard({ task, onComplete, onUncomplete, onAddToFeatures }) {
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
    security: 'bg-state-danger/10 text-state-danger',
    feature: 'bg-brand-bone/50 text-text-primary',
  }

  const isCompleted = task.status === 'completed'

  return (
    <AnimatedCard delay={100}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[task.status]}`}>
              {task.status}
            </span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${typeColors[task.type]}`}>
              {task.type}
            </span>
            <span className={`text-xs font-medium ${priorityColors[task.priority]}`}>
              {task.priority} priority
            </span>
          </div>
          <h4 className={`text-base font-semibold text-text-primary mb-2 ${isCompleted ? '' : ''}`}>
            {task.title}
          </h4>
          <p className="text-sm text-text-secondary mb-3">{task.description}</p>
          <div className="flex flex-wrap items-center gap-4 text-xs text-text-muted">
            <span>{task.costRange}</span>
            <span>{task.hours}h</span>
            <span>Due: {new Date(task.dueDate).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })}</span>
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
              className="px-4 py-2 bg-brand-mughal-green text-white rounded-lg text-sm font-medium hover:bg-brand-mughal-green-2 transition-all duration-normal whitespace-nowrap"
            >
              Mark Complete
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={() => onUncomplete(task.id)}
                className="px-4 py-2 bg-surface-bone text-text-primary border border-border-subtle rounded-lg text-sm font-medium hover:bg-surface-paper transition-all duration-normal whitespace-nowrap"
              >
                Unmark Complete
              </button>
              {task.type === 'feature' && (
                <button
                  type="button"
                  onClick={() => onAddToFeatures(task.id)}
                  className="px-4 py-2 bg-brand-pistachio text-text-on-bone rounded-lg text-sm font-medium hover:opacity-90 transition-all duration-normal whitespace-nowrap"
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

export default function AdminDashboard({ onNavigate }) {
  const [tasks, setTasks] = React.useState(ROADMAP_TASKS)
  const [activeTab, setActiveTab] = React.useState('overview')
  const [timeRange, setTimeRange] = React.useState('30d')

  const handleTaskComplete = (taskId) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, status: 'completed' } : task
      )
    )
  }

  const handleTaskUncomplete = (taskId) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, status: 'planned' } : task
      )
    )
  }

  const handleAddToFeatures = (taskId) => {
    const task = tasks.find(t => t.id === taskId)
    if (task && task.type === 'feature') {
      // Store in localStorage to be picked up by Documentation page
      const addedFeatures = JSON.parse(localStorage.getItem('addedFeatures') || '[]')
      if (!addedFeatures.find(f => f.id === taskId)) {
        addedFeatures.push({
          id: taskId,
          title: task.title,
          description: task.description,
          benefits: task.benefits,
          addedDate: new Date().toISOString(),
        })
        localStorage.setItem('addedFeatures', JSON.stringify(addedFeatures))
        // Trigger custom event for same-window components
        window.dispatchEvent(new Event('addedFeature'))
        // Navigate to documentation with features tab
        if (onNavigate) {
          onNavigate('documentation', 'features')
        }
      }
    }
  }

  const visibleTasks = tasks.filter((t) => t.visible)
  const allTasks = tasks
  const completedTasks = allTasks.filter((t) => t.status === 'completed')

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
                className="text-sm bg-white border border-border-subtle rounded-lg px-4 py-2.5 text-text-primary cursor-pointer"
                style={{
                  borderRadius: '4px',
                }}>
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
                <option value="1y">Last year</option>
              </select>
              <button
                type="button"
                onClick={() => onNavigate?.('documentation')}
                className="px-4 py-2.5 bg-white text-text-primary border border-border-subtle rounded-lg font-medium text-sm hover:shadow-sm transition-all duration-normal"
                style={{
                  borderRadius: '4px',
                }}
              >
                View Documentation
              </button>
            </div>
          </div>
          <p style={{ fontSize: '14px', color: 'rgba(11, 15, 12, 0.66)', margin: 0 }}>
            Comprehensive overview of your SaaS platform performance and operations
          </p>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '2px', marginBottom: '24px', borderBottom: '1px solid rgba(11, 15, 12, 0.08)' }}>
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
                borderBottom: activeTab === tab.id ? '2px solid var(--brand-mughal-green)' : '2px solid transparent',
                color: activeTab === tab.id ? 'var(--brand-mughal-green)' : 'rgba(11, 15, 12, 0.66)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                marginBottom: '-1px'
              }}
              onMouseEnter={(e) => {
                if (activeTab !== tab.id) {
                  e.target.style.color = '#0B0F0C'
                }
              }}
              onMouseLeave={(e) => {
                if (activeTab !== tab.id) {
                  e.target.style.color = 'rgba(11, 15, 12, 0.66)'
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
              <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#0B0F0C', margin: 0, marginBottom: '16px' }}>
                Growth & Efficiency Metrics
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
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
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
              {/* User Growth Chart */}
              <AnimatedCard delay={400}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <TrendingUp size={20} className="text-brand-mughal-green" />
                    <div>
                      <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#0B0F0C', margin: 0, marginBottom: '4px' }}>User Growth</h3>
                      <p style={{ fontSize: '13px', color: 'rgba(11, 15, 12, 0.52)', margin: 0 }}>Monthly active users trend</p>
                    </div>
                  </div>
                </div>
                <div style={{ height: '200px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '8px', paddingTop: '20px' }}>
                  {[65, 72, 78, 85, 82, 88, 95].map((value, i) => (
                    <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                      <div style={{
                        width: '100%',
                        maxWidth: '40px',
                        backgroundColor: 'var(--brand-mughal-green)',
                        borderRadius: '4px 4px 0 0',
                        height: `${value}%`,
                        transition: 'height 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
                      }} />
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
                  <Activity size={20} className="text-brand-mughal-green" />
                  <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#0B0F0C', margin: 0 }}>Engagement</h3>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid rgba(11, 15, 12, 0.06)' }}>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: '13px', color: 'rgba(11, 15, 12, 0.66)', margin: 0 }}>DAU</p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <p style={{ fontSize: '16px', fontWeight: 600, color: '#0B0F0C', margin: 0 }}>{mockData.engagement.dau.toLocaleString()}</p>
                      <span style={{ fontSize: '12px', fontWeight: 500, color: 'var(--state-success)' }}>+12%</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid rgba(11, 15, 12, 0.06)' }}>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: '13px', color: 'rgba(11, 15, 12, 0.66)', margin: 0 }}>MAU</p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <p style={{ fontSize: '16px', fontWeight: 600, color: '#0B0F0C', margin: 0 }}>{mockData.engagement.mau.toLocaleString()}</p>
                      <span style={{ fontSize: '12px', fontWeight: 500, color: 'var(--state-success)' }}>+8%</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid rgba(11, 15, 12, 0.06)' }}>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: '13px', color: 'rgba(11, 15, 12, 0.66)', margin: 0 }}>NPS</p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <p style={{ fontSize: '16px', fontWeight: 600, color: '#0B0F0C', margin: 0 }}>{mockData.engagement.nps}</p>
                      <span style={{ fontSize: '12px', fontWeight: 500, color: 'var(--state-success)' }}>+5</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0' }}>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: '13px', color: 'rgba(11, 15, 12, 0.66)', margin: 0 }}>Trial to Paid</p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <p style={{ fontSize: '16px', fontWeight: 600, color: '#0B0F0C', margin: 0 }}>{mockData.engagement.trialToPaid}%</p>
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
                {Object.entries(mockData.users.byPlan).map(([plan, count], idx) => {
                  const monthlyPrice = mockData.users.planPricing[plan]
                  const monthlyRevenue = count * monthlyPrice
                  return (
                    <AnimatedCard key={plan} delay={500 + idx * 50}>
                      <p style={{ fontSize: '13px', color: 'rgba(11, 15, 12, 0.52)', margin: 0, marginBottom: '8px', textTransform: 'capitalize' }}>{plan}</p>
                      <p style={{ fontSize: '24px', fontWeight: 600, color: '#0B0F0C', margin: 0, marginBottom: '4px' }}>{count.toLocaleString()}</p>
                      <p style={{ fontSize: '12px', color: 'rgba(11, 15, 12, 0.66)', margin: 0, marginBottom: '4px' }}>
                        {((count / mockData.users.total) * 100).toFixed(1)}% of total
                      </p>
                      {monthlyRevenue > 0 && (
                        <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--brand-mughal-green)', margin: 0, marginTop: '8px', paddingTop: '8px', borderTop: '1px solid rgba(11, 15, 12, 0.08)' }}>
                          €{monthlyRevenue.toLocaleString()}/mo
                        </p>
                      )}
                      {monthlyRevenue === 0 && (
                        <p style={{ fontSize: '12px', color: 'rgba(11, 15, 12, 0.52)', margin: 0, marginTop: '8px', paddingTop: '8px', borderTop: '1px solid rgba(11, 15, 12, 0.08)' }}>
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
              <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#0B0F0C', margin: 0, marginBottom: '16px' }}>Recent Users</h2>
              <div className="border border-border-subtle overflow-hidden" style={{ borderRadius: '4px' }}>
                <table style={{ width: '100%' }}>
                  <thead style={{ backgroundColor: 'var(--surface-paper)', borderBottom: '1px solid rgba(11, 15, 12, 0.08)' }}>
                    <tr>
                      <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: '12px', fontWeight: 600, color: '#0B0F0C' }}>Name</th>
                      <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: '12px', fontWeight: 600, color: '#0B0F0C' }}>Email</th>
                      <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: '12px', fontWeight: 600, color: '#0B0F0C' }}>Plan</th>
                      <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: '12px', fontWeight: 600, color: '#0B0F0C' }}>Joined</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockData.users.recent.map((user, idx) => (
                      <tr key={idx} style={{ borderBottom: idx < mockData.users.recent.length - 1 ? '1px solid rgba(11, 15, 12, 0.08)' : 'none' }}>
                        <td style={{ padding: '12px 16px', fontSize: '14px', color: '#0B0F0C' }}>{user.name}</td>
                        <td style={{ padding: '12px 16px', fontSize: '14px', color: 'rgba(11, 15, 12, 0.66)' }}>{user.email}</td>
                        <td style={{ padding: '12px 16px' }}>
                          <span style={{ padding: '4px 8px', backgroundColor: 'var(--surface-bone)', borderRadius: '4px', fontSize: '12px', fontWeight: 500, color: '#0B0F0C' }}>
                            {user.plan}
                          </span>
                        </td>
                        <td style={{ padding: '12px 16px', fontSize: '14px', color: 'rgba(11, 15, 12, 0.52)' }}>{user.joined}</td>
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
              <SystemHealthCard name="Supabase" health={mockData.systemHealth.supabase} />
              <SystemHealthCard name="ANAF API" health={mockData.systemHealth.anaf} />
              <SystemHealthCard name="SendGrid" health={mockData.systemHealth.sendgrid} />
              <SystemHealthCard name="Webhooks" health={mockData.systemHealth.webhooks} />
            </div>
          </div>
        )}

        {/* Tasks Tab */}
        {activeTab === 'tasks' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#0B0F0C', margin: 0 }}>Tasks & Roadmap</h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: 'rgba(11, 15, 12, 0.66)' }}>
                <span>Total: {allTasks.length}</span>
                <span>•</span>
                <span>Visible: {visibleTasks.length}</span>
                <span>•</span>
                <span>Completed: {completedTasks.length}</span>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
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
