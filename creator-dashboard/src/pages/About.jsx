import React from 'react'

export default function AboutPage() {
  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs text-text-muted mb-2">About</p>
        <h1 className="text-2xl font-semibold text-text-primary" style={{ letterSpacing: '-0.3px' }}>
          Built for calm, credible risk reporting.
        </h1>
        <p className="text-sm text-text-secondary mt-3 max-w-2xl">
          MarketRisk helps teams turn exposure data into clear decisions—without noisy dashboards, spreadsheet drift, or
          last-minute surprises.
        </p>
      </div>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-border-subtle p-6 rounded-xl">
          <p className="text-xs text-text-muted mb-2">Principle</p>
          <h2 className="text-lg font-medium text-text-primary mb-2">Clarity over clutter</h2>
          <p className="text-sm text-text-secondary">
            Hierarchy, spacing, and deliberate defaults make the story obvious at a glance.
          </p>
        </div>
        <div className="bg-white border border-border-subtle p-6 rounded-xl">
          <p className="text-xs text-text-muted mb-2">Principle</p>
          <h2 className="text-lg font-medium text-text-primary mb-2">Trustworthy numbers</h2>
          <p className="text-sm text-text-secondary">
            Consistent formatting, readable deltas, and audit-friendly patterns reduce “Which number is right?” moments.
          </p>
        </div>
        <div className="bg-white border border-border-subtle p-6 rounded-xl">
          <p className="text-xs text-text-muted mb-2">Principle</p>
          <h2 className="text-lg font-medium text-text-primary mb-2">Fast decisions</h2>
          <p className="text-sm text-text-secondary">
            Summaries are designed for action: what changed, why it matters, and what to do next.
          </p>
        </div>
      </section>

      <section className="bg-brand-mughal-green rounded-2xl p-8 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <rect
              x="66%"
              y="-10%"
              width="360"
              height="220"
              rx="4"
              fill="none"
              stroke="rgba(220, 222, 197, 0.28)"
              strokeWidth="1"
            />
          </svg>
        </div>
        <div className="relative z-10">
          <h2 className="text-xl font-semibold text-text-inverse mb-2" style={{ letterSpacing: '-0.3px' }}>
            Designed for high-stakes updates.
          </h2>
          <p className="text-text-inverse-muted text-sm max-w-2xl">
            Whether it’s a weekly committee pack or an executive check-in, MarketRisk keeps the narrative clean and the
            signal strong.
          </p>
        </div>
      </section>
    </div>
  )
}


