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

export default function HeroV2({ onViewDashboard, onScrollToWaitlist }) {
  return (
    <section className="bg-gradient-to-br from-brand-mughal-green via-brand-mughal-green-2 to-brand-mughal-green rounded-2xl p-8 md:p-12 relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-10" style={{ zIndex: 5 }}>
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="var(--brand-pistachio)" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Floating elements */}
      <div className="absolute top-10 right-10 w-32 h-32 bg-brand-pistachio/20 rounded-full blur-3xl" style={{ zIndex: 5 }}></div>
      <div className="absolute bottom-20 left-10 w-24 h-24 bg-brand-pistachio/15 rounded-full blur-2xl" style={{ zIndex: 5 }}></div>

      <div className="relative z-10 max-w-5xl mx-auto text-center">
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
        <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-text-inverse-muted">
          <div className="flex items-center gap-2">
            <Check size={16} className="text-brand-pistachio flex-shrink-0" />
            <span>Free plan available</span>
          </div>
          <div className="flex items-center gap-2">
            <Check size={16} className="text-brand-pistachio flex-shrink-0" />
            <span>No credit cards required</span>
          </div>
          <div className="flex items-center gap-2">
            <Check size={16} className="text-brand-pistachio flex-shrink-0" />
            <span>Launching Q1 2025</span>
          </div>
        </div>
      </div>
    </section>
  )
}

