import React from 'react'

function PrimaryButton({ children, onClick, type = 'button', disabled = false }) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className="px-6 py-3 bg-brand-mughal-green text-white rounded-lg font-medium text-sm hover:bg-brand-mughal-green-2 transition-all duration-normal disabled:opacity-60 disabled:cursor-not-allowed"
    >
      {children}
    </button>
  )
}

function SecondaryButton({ children, onClick, type = 'button' }) {
  return (
    <button
      type={type}
      onClick={onClick}
      className="px-6 py-3 bg-white text-brand-mughal-green rounded-lg font-medium text-sm hover:shadow-sm transition-all duration-normal"
    >
      {children}
    </button>
  )
}

// Simplified Analytics Dashboard Mockup
function AnalyticsMockup() {
  return (
    <div className="bg-white rounded-xl p-6 shadow-2xl border border-border-subtle max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-xs text-text-muted mb-1">Overview Dashboard</p>
          <h3 className="text-lg font-semibold text-text-primary">Risk Monitoring Analytics</h3>
        </div>
        <select className="text-xs bg-surface-paper border border-border-subtle rounded-lg px-3 py-2 text-text-primary">
          <option>Last 7 days</option>
          <option>Last 30 days</option>
        </select>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        <div className="bg-surface-paper rounded-lg p-3 border border-border-subtle">
          <p className="text-xs text-text-muted mb-1">Monitored</p>
          <p className="text-lg font-semibold text-text-primary">25</p>
          <p className="text-xs text-brand-mughal-green mt-1">+3 this week</p>
        </div>
        <div className="bg-surface-paper rounded-lg p-3 border border-border-subtle">
          <p className="text-xs text-text-muted mb-1">Alerts</p>
          <p className="text-lg font-semibold text-text-primary">12</p>
          <p className="text-xs text-state-warning mt-1">3 new today</p>
        </div>
        <div className="bg-surface-paper rounded-lg p-3 border border-border-subtle">
          <p className="text-xs text-text-muted mb-1">At Risk</p>
          <p className="text-lg font-semibold text-text-primary">2</p>
          <p className="text-xs text-state-danger mt-1">Action needed</p>
        </div>
        <div className="bg-surface-paper rounded-lg p-3 border border-border-subtle">
          <p className="text-xs text-text-muted mb-1">Healthy</p>
          <p className="text-lg font-semibold text-text-primary">23</p>
          <p className="text-xs text-brand-mughal-green mt-1">All clear</p>
        </div>
      </div>

      {/* Chart Area */}
      <div className="bg-surface-paper rounded-lg p-4 border border-border-subtle">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-sm font-semibold text-text-primary">Risk Trends</h4>
          <div className="flex items-center gap-3 text-xs">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-brand-mughal-green"></div>
              <span className="text-text-muted">Alerts</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-brand-pistachio"></div>
              <span className="text-text-muted">Resolved</span>
            </div>
          </div>
        </div>
        {/* Simple bar chart visualization */}
        <div className="flex items-end justify-between gap-2 h-32">
          {[45, 52, 38, 61, 48, 55, 42].map((height, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <div
                className="w-full rounded-t"
                style={{
                  height: `${height}%`,
                  backgroundColor: i % 2 === 0 ? 'var(--brand-mughal-green)' : 'var(--brand-pistachio)',
                  minHeight: '20px'
                }}
              ></div>
              <span className="text-xs text-text-muted">{['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i]}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Stats Row */}
      <div className="grid grid-cols-3 gap-3 mt-4">
        <div className="bg-surface-paper rounded-lg p-3 border border-border-subtle">
          <p className="text-xs text-text-muted mb-1">Insolvency Checks</p>
          <p className="text-sm font-semibold text-text-primary">156</p>
        </div>
        <div className="bg-surface-paper rounded-lg p-3 border border-border-subtle">
          <p className="text-xs text-text-muted mb-1">Debt Updates</p>
          <p className="text-sm font-semibold text-text-primary">89</p>
        </div>
        <div className="bg-surface-paper rounded-lg p-3 border border-border-subtle">
          <p className="text-xs text-text-muted mb-1">Status Changes</p>
          <p className="text-sm font-semibold text-text-primary">23</p>
        </div>
      </div>
    </div>
  )
}

export default function HeroV4({ onViewDashboard, onScrollToWaitlist }) {
  return (
    <section className="bg-gradient-to-br from-brand-mughal-green via-brand-mughal-green-2 to-brand-mughal-green rounded-2xl p-8 md:p-12 relative overflow-visible pb-24 md:pb-32">
      {/* Background pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-10 overflow-hidden rounded-2xl" style={{ zIndex: 5 }}>
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid-v4" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="var(--brand-pistachio)" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid-v4)" />
        </svg>
      </div>

      {/* Floating elements */}
      <div className="absolute top-10 right-10 w-32 h-32 bg-brand-pistachio/20 rounded-full blur-3xl" style={{ zIndex: 5 }}></div>
      <div className="absolute bottom-20 left-10 w-24 h-24 bg-brand-pistachio/15 rounded-full blur-2xl" style={{ zIndex: 5 }}></div>

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Top Content */}
        <div className="text-center mb-8">
          <div className="inline-block px-4 py-2 bg-brand-pistachio/20 rounded-full mb-6">
            <p className="text-brand-pistachio text-sm font-medium">Early Access Available</p>
          </div>
          <h1 className="text-4xl md:text-6xl font-semibold text-text-inverse mb-6 leading-tight" style={{ letterSpacing: '-1.2px' }}>
            Stop bad debt before it stops your business
          </h1>
          <p className="text-text-inverse-muted text-lg md:text-xl max-w-2xl mx-auto mb-8 leading-relaxed">
            Monitor credit risk for your Romanian SME partners. Get smart alerts when something changes—so you can act fast and protect your cashflow.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
            <PrimaryButton onClick={onScrollToWaitlist}>
              Get early access
            </PrimaryButton>
            <SecondaryButton onClick={onViewDashboard}>See how it works</SecondaryButton>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-text-inverse-muted mb-8">
            <div className="flex items-center gap-2">
              <span className="text-brand-pistachio">✓</span>
              <span>Free plan available</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-brand-pistachio">✓</span>
              <span>No credit cards required</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-brand-pistachio">✓</span>
              <span>Launching Q1 2025</span>
            </div>
          </div>
        </div>
      </div>

      {/* Analytics Dashboard Mockup - Positioned 50% inside, 50% outside */}
      <div className="relative z-20 max-w-6xl mx-auto" style={{ marginTop: '2rem', transform: 'translateY(50%)' }}>
        <AnalyticsMockup />
      </div>
    </section>
  )
}

