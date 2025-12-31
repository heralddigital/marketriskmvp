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

export default function HeroV1({ onViewDashboard, onScrollToWaitlist, waitlistForm }) {
  return (
    <section className="bg-brand-mughal-green rounded-2xl p-8 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 5 }}>
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          {/* Curvy line in bottom right */}
          <path
            d="M 70% 70% Q 80% 75%, 85% 85% T 95% 95% Q 98% 98%, 100% 100%"
            stroke="var(--brand-pistachio)"
            strokeWidth="25"
            strokeLinecap="round"
            fill="none"
            opacity="0.5"
          />
          
          {/* Rectangle decorations */}
          <rect
            x="62%"
            y="-12%"
            width="360"
            height="220"
            rx="4"
            fill="none"
            stroke="var(--pattern-line-on-green)"
            strokeWidth="1"
          />
          <rect
            x="70%"
            y="62%"
            width="420"
            height="260"
            rx="4"
            fill="none"
            stroke="var(--pattern-line-on-green)"
            strokeWidth="1"
          />
        </svg>
      </div>

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <div>
          <p className="text-text-inverse-muted text-sm mb-2">marketrisk</p>
          <h1 className="text-4xl font-semibold text-text-inverse mb-4" style={{ letterSpacing: '-0.8px' }}>
            Termene gives you data. We tell you when to worry.
          </h1>
          <p className="text-text-inverse-muted text-md max-w-xl mb-6">
            Simple credit risk monitoring for Romanian SMEs: build a watchlist, get actionable alerts, and avoid bad debt
            before it hits cashflow.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <PrimaryButton onClick={onScrollToWaitlist}>
              Join the waitlist
            </PrimaryButton>
            <SecondaryButton onClick={onViewDashboard}>View the product UI</SecondaryButton>
          </div>
            <p className="text-text-inverse-muted text-xs mt-4">
              Launching soon. Transparent pricing: Free / €39 / €99 / Enterprise.
            </p>
        </div>

        {/* Waitlist card */}
        {waitlistForm && (
          <div id="waitlist" className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6">
            <p className="text-text-inverse text-sm font-medium mb-4">Stay in the know</p>
            {waitlistForm}
          </div>
        )}
      </div>
    </section>
  )
}

