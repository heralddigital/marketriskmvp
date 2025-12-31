import React from 'react'
import { Check } from 'lucide-react'

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

export default function HeroV3({ onViewDashboard, onScrollToWaitlist }) {
  return (
    <section className="bg-brand-mughal-green rounded-2xl p-8 md:p-16 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 5 }}>
        {/* Diagonal lines */}
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <line x1="0" y1="0" x2="100%" y2="100%" stroke="var(--brand-pistachio)" strokeWidth="2" opacity="0.15" />
          <line x1="100%" y1="0" x2="0" y2="100%" stroke="var(--brand-pistachio)" strokeWidth="2" opacity="0.15" />
          <line x1="0" y1="50%" x2="100%" y2="50%" stroke="var(--brand-pistachio)" strokeWidth="1" opacity="0.1" />
        </svg>
        
        {/* Corner accents */}
        <div className="absolute top-0 right-0 w-64 h-64 border-t-2 border-r-2 border-brand-pistachio/30 rounded-tl-3xl"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 border-b-2 border-l-2 border-brand-pistachio/30 rounded-br-3xl"></div>
      </div>

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-brand-pistachio/20 rounded-full mb-6">
            <div className="w-2 h-2 bg-brand-pistachio rounded-full animate-pulse"></div>
            <p className="text-brand-pistachio text-xs font-medium">Coming Soon</p>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-text-inverse mb-6 leading-tight" style={{ letterSpacing: '-1px' }}>
            Credit risk monitoring that actually works for SMEs
          </h1>
          <p className="text-text-inverse-muted text-base md:text-lg mb-8 leading-relaxed">
            Built specifically for Romanian businesses. Track your partners, get instant alerts on insolvency and debt changes, and make decisions with confidence—not guesswork.
          </p>
          <div className="space-y-4 mb-8">
            <div className="flex items-start gap-3">
              <div className="mt-1 w-5 h-5 rounded-full bg-brand-pistachio/30 flex items-center justify-center flex-shrink-0">
                <Check size={12} className="text-brand-pistachio" />
              </div>
              <div>
                <p className="text-text-inverse font-medium text-sm">Proactive alerts</p>
                <p className="text-text-inverse-muted text-xs">Know about risks before they become problems</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="mt-1 w-5 h-5 rounded-full bg-brand-pistachio/30 flex items-center justify-center flex-shrink-0">
                <Check size={12} className="text-brand-pistachio" />
              </div>
              <div>
                <p className="text-text-inverse font-medium text-sm">Simple pricing</p>
                <p className="text-text-inverse-muted text-xs">Free, €39, €99, or Enterprise—no hidden fees</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="mt-1 w-5 h-5 rounded-full bg-brand-pistachio/30 flex items-center justify-center flex-shrink-0">
                <Check size={12} className="text-brand-pistachio" />
              </div>
              <div>
                <p className="text-text-inverse font-medium text-sm">Mobile-first design</p>
                <p className="text-text-inverse-muted text-xs">Check alerts and manage watchlists on the go</p>
              </div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <PrimaryButton onClick={onScrollToWaitlist}>
              Join waitlist
            </PrimaryButton>
            <SecondaryButton onClick={onViewDashboard}>Preview dashboard</SecondaryButton>
          </div>
        </div>
        
        {/* Right side - Stats or visual element */}
        <div className="lg:pl-8">
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-8 space-y-6">
            <div>
              <div className="text-3xl font-semibold text-text-inverse mb-1">25</div>
              <div className="text-sm text-text-inverse-muted">Companies per watchlist</div>
            </div>
            <div>
              <div className="text-3xl font-semibold text-text-inverse mb-1">Real-time</div>
              <div className="text-sm text-text-inverse-muted">Insolvency & debt alerts</div>
            </div>
            <div>
              <div className="text-3xl font-semibold text-text-inverse mb-1">3 plans</div>
              <div className="text-sm text-text-inverse-muted">Free, Starter, Pro</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

