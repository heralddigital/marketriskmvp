'use client'

import React from 'react'
import Link from 'next/link'
import { Check } from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section>
        <div>
          <p className="text-xs text-text-muted mb-2">About Us</p>
          <h1 className="text-3xl md:text-4xl font-semibold text-text-primary mb-4" style={{ letterSpacing: '-0.5px' }}>
            Built for calm, credible risk reporting
          </h1>
          <p className="text-lg text-text-secondary max-w-3xl">
            <span className="text-brand-mughal-green font-medium">marketrisk</span> helps Romanian SMEs turn credit risk data into clear decisions—without noisy dashboards, spreadsheet drift, or last-minute surprises.
          </p>
        </div>
      </section>

      {/* Who We Are */}
      <section>
        <div className="mb-6">
          <p className="text-xs text-text-muted mb-2">Who We Are</p>
          <h2 className="text-2xl font-semibold text-text-primary" style={{ letterSpacing: '-0.3px' }}>
            A team focused on Romanian business success
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white border border-border-subtle p-6 rounded-xl hover:shadow-sm transition-all duration-normal">
            <h3 className="text-lg font-medium text-text-primary mb-3">Our Story</h3>
            <p className="text-sm text-text-secondary mb-4">
              <span className="text-brand-mughal-green font-medium">marketrisk</span> was born from a simple observation: Romanian SMEs were losing money to bad debt because they lacked simple, affordable tools to monitor their partners' credit risk. Traditional solutions were either too expensive, too complex, or didn't focus on the Romanian market.
            </p>
            <p className="text-sm text-text-secondary">
              We set out to build something different—a tool that's accessible, transparent, and designed specifically for how Romanian businesses operate. No enterprise sales cycles, no hidden costs, just clear alerts when something changes.
            </p>
          </div>
          <div className="bg-white border border-border-subtle p-6 rounded-xl hover:shadow-sm transition-all duration-normal">
            <h3 className="text-lg font-medium text-text-primary mb-3">Our Mission</h3>
            <p className="text-sm text-text-secondary mb-4">
              To empower Romanian SMEs with the tools they need to protect their cashflow and make informed business decisions. We believe every business, regardless of size, deserves access to professional-grade risk monitoring.
            </p>
            <p className="text-sm text-text-secondary">
              We're committed to transparency, simplicity, and putting our customers' success first. That means clear pricing, straightforward features, and support that actually helps.
            </p>
          </div>
        </div>
      </section>

      {/* What We Do */}
      <section>
        <div className="mb-6">
          <p className="text-xs text-text-muted mb-2">What We Do</p>
          <h2 className="text-2xl font-semibold text-text-primary" style={{ letterSpacing: '-0.3px' }}>
            Simple credit risk monitoring for Romanian SMEs
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border border-border-subtle p-6 rounded-xl hover:shadow-sm transition-all duration-normal">
            <div className="w-10 h-10 bg-surface-bone flex items-center justify-center rounded-lg mb-4">
              <div className="w-5 h-5 bg-brand-mughal-green rounded-md" />
            </div>
            <h3 className="text-lg font-medium text-text-primary mb-2">Credit Risk Monitoring</h3>
            <p className="text-sm text-text-secondary">
              Monitor up to 250 companies in your watchlist. Get real-time alerts on insolvency filings, court cases, tax debts, and other critical changes that could impact your business.
            </p>
          </div>
          <div className="bg-white border border-border-subtle p-6 rounded-xl hover:shadow-sm transition-all duration-normal">
            <div className="w-10 h-10 bg-surface-bone flex items-center justify-center rounded-lg mb-4">
              <div className="w-5 h-5 bg-brand-mughal-green rounded-md" />
            </div>
            <h3 className="text-lg font-medium text-text-primary mb-2">Proactive Alerts</h3>
            <p className="text-sm text-text-secondary">
              Don't wait for problems to surface. Our system monitors BPI (Insolvency Proceedings), court cases (Dosare), and ANAF tax debts, sending you actionable alerts when something changes.
            </p>
          </div>
          <div className="bg-white border border-border-subtle p-6 rounded-xl hover:shadow-sm transition-all duration-normal">
            <div className="w-10 h-10 bg-surface-bone flex items-center justify-center rounded-lg mb-4">
              <div className="w-5 h-5 bg-brand-mughal-green rounded-md" />
            </div>
            <h3 className="text-lg font-medium text-text-primary mb-2">Transparent Pricing</h3>
            <p className="text-sm text-text-secondary">
              No hidden fees, no "contact sales" walls. Choose from Free, Starter (€39), PRO (€99), or Enterprise plans. Self-serve upgrades, clear limits, and pricing that scales with your needs.
            </p>
          </div>
        </div>
      </section>

      {/* How We Do It */}
      <section>
        <div className="mb-6">
          <p className="text-xs text-text-muted mb-2">How We Do It</p>
          <h2 className="text-2xl font-semibold text-text-primary" style={{ letterSpacing: '-0.3px' }}>
            Built on principles that matter
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white border border-border-subtle p-6 rounded-xl hover:shadow-sm transition-all duration-normal">
            <p className="text-xs text-text-muted mb-2">Principle</p>
            <h3 className="text-lg font-medium text-text-primary mb-2">Clarity over clutter</h3>
            <p className="text-sm text-text-secondary">
              Hierarchy, spacing, and deliberate defaults make the story obvious at a glance. No information overload—just what you need, when you need it.
            </p>
          </div>
          <div className="bg-white border border-border-subtle p-6 rounded-xl hover:shadow-sm transition-all duration-normal">
            <p className="text-xs text-text-muted mb-2">Principle</p>
            <h3 className="text-lg font-medium text-text-primary mb-2">Trustworthy numbers</h3>
            <p className="text-sm text-text-secondary">
              Consistent formatting, readable deltas, and audit-friendly patterns reduce "Which number is right?" moments. You can trust the data because we source it from official Romanian registries.
            </p>
          </div>
          <div className="bg-white border border-border-subtle p-6 rounded-xl hover:shadow-sm transition-all duration-normal">
            <p className="text-xs text-text-muted mb-2">Principle</p>
            <h3 className="text-lg font-medium text-text-primary mb-2">Fast decisions</h3>
            <p className="text-sm text-text-secondary">
              Summaries are designed for action: what changed, why it matters, and what to do next. Get alerts on your phone, check status in seconds, act before problems escalate.
            </p>
          </div>
        </div>
        <div className="bg-brand-mughal-green rounded-2xl p-8 relative overflow-hidden">
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
            <h3 className="text-xl font-semibold text-text-inverse mb-3" style={{ letterSpacing: '-0.3px' }}>
              Designed for high-stakes updates
            </h3>
            <p className="text-text-inverse-muted text-sm max-w-2xl mb-4">
              Whether it's a weekly risk review or an executive check-in, <span className="text-brand-mughal-green font-medium">marketrisk</span> keeps the narrative clean and the signal strong. Mobile-first design means you can check alerts anywhere, anytime.
            </p>
            <ul className="space-y-2 text-sm text-text-inverse-muted">
              <li className="flex items-start gap-2">
                <Check size={16} className="text-brand-pistachio mt-[2px] flex-shrink-0" />
                <span>Real-time monitoring of Romanian business registries (ONRC, BPI, ANAF)</span>
              </li>
              <li className="flex items-start gap-2">
                <Check size={16} className="text-brand-pistachio mt-[2px] flex-shrink-0" />
                <span>Simple watchlist management with tags and notes</span>
              </li>
              <li className="flex items-start gap-2">
                <Check size={16} className="text-brand-pistachio mt-[2px] flex-shrink-0" />
                <span>PDF exports for reports and documentation</span>
              </li>
              <li className="flex items-start gap-2">
                <Check size={16} className="text-brand-pistachio mt-[2px] flex-shrink-0" />
                <span>Team collaboration with role-based access</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Why We Do It */}
      <section>
        <div className="mb-6">
          <p className="text-xs text-text-muted mb-2">Why We Do It</p>
          <h2 className="text-2xl font-semibold text-text-primary" style={{ letterSpacing: '-0.3px' }}>
            Because bad debt shouldn't be a surprise
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white border border-border-subtle p-6 rounded-xl hover:shadow-sm transition-all duration-normal">
            <h3 className="text-lg font-medium text-text-primary mb-3">The Problem We Solve</h3>
            <p className="text-sm text-text-secondary mb-4">
              Romanian SMEs lose millions of euros each year to bad debt. Often, the warning signs were there—insolvency filings, court cases, tax debts—but businesses didn't know about them in time to act.
            </p>
            <p className="text-sm text-text-secondary">
              Traditional credit monitoring solutions are expensive, complex, or don't focus on the Romanian market. Small businesses end up either paying too much for enterprise tools they don't need, or going without protection entirely.
            </p>
          </div>
          <div className="bg-white border border-border-subtle p-6 rounded-xl hover:shadow-sm transition-all duration-normal">
            <h3 className="text-lg font-medium text-text-primary mb-3">Our Vision</h3>
            <p className="text-sm text-text-secondary mb-4">
              We envision a Romania where every SME has access to professional-grade risk monitoring tools. Where bad debt is the exception, not the rule. Where businesses can focus on growth, not worry about whether their partners will pay.
            </p>
            <p className="text-sm text-text-secondary">
              We believe in transparency, fairness, and building tools that actually work for the people who use them. No enterprise bloat, no confusing features—just clear, actionable risk intelligence.
            </p>
          </div>
        </div>
        <div className="bg-surface-paper border border-border-subtle rounded-xl p-8">
          <h3 className="text-lg font-medium text-text-primary mb-4">Our Values</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-medium text-text-primary mb-2">Transparency</h4>
              <p className="text-sm text-text-secondary">
                Clear pricing, honest communication, and no hidden surprises. What you see is what you get.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-text-primary mb-2">Simplicity</h4>
              <p className="text-sm text-text-secondary">
                Complex problems deserve simple solutions. We cut through the noise to deliver what matters.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-text-primary mb-2">Accessibility</h4>
              <p className="text-sm text-text-secondary">
                Professional tools shouldn't be reserved for large enterprises. Every business deserves protection.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-text-primary mb-2">Customer Success</h4>
              <p className="text-sm text-text-secondary">
                Your success is our success. We build features that solve real problems, not check boxes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-brand-mughal-green rounded-2xl p-8 md:p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid-about" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="var(--brand-pistachio)" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid-about)" />
          </svg>
        </div>
        <div className="relative z-10 max-w-2xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-semibold text-text-inverse mb-4" style={{ letterSpacing: '-0.5px' }}>
            Ready to protect your business?
          </h2>
          <p className="text-text-inverse-muted text-lg mb-6">
            Join the waitlist to be notified when we launch. Early access available for beta testers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="px-6 py-3 bg-white text-brand-mughal-green rounded-lg font-medium text-sm hover:shadow-sm transition-all duration-normal text-center"
            >
              Join the waitlist
            </Link>
            <Link
              href="/pricing"
              className="px-6 py-3 bg-white/10 text-white border border-white/20 rounded-lg font-medium text-sm hover:bg-white/20 transition-all duration-normal text-center"
            >
              View pricing
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
