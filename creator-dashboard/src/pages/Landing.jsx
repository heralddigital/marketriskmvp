import React from 'react'
import SEO from '../components/SEO.jsx'
import HeroV1 from '../components/HeroV1.jsx'
import HeroV2 from '../components/HeroV2.jsx'
import HeroV3 from '../components/HeroV3.jsx'
import HeroV4 from '../components/HeroV4.jsx'

function isValidEmail(email) {
  // Intentionally simple: enough for client-side validation without being overly strict.
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).trim())
}

function loadWaitlist() {
  try {
    const raw = localStorage.getItem('marketrisk_waitlist_v1')
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function saveWaitlist(entries) {
  try {
    localStorage.setItem('marketrisk_waitlist_v1', JSON.stringify(entries))
  } catch {
    // ignore (storage can fail in private mode or if quota exceeded)
  }
}

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

function BenefitCard({ title, description, bullets }) {
  return (
    <div className="bg-white border border-border-subtle p-6 rounded-xl hover:shadow-sm transition-all duration-normal">
      <h3 className="text-lg font-medium text-text-primary mb-2">{title}</h3>
      <p className="text-sm text-text-secondary mb-4">{description}</p>
      <ul className="space-y-2">
        {bullets.map((b) => (
          <li key={b} className="text-sm text-text-secondary flex items-start gap-2">
            <span className="text-brand-mughal-green mt-[2px]">•</span>
            <span>{b}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

function WaitlistForm() {
  const [email, setEmail] = React.useState('')
  const [company, setCompany] = React.useState('')
  const [wantsBeta, setWantsBeta] = React.useState(false)
  const [status, setStatus] = React.useState({ type: 'idle', message: '' })

  const onSubmit = (e) => {
    e.preventDefault()

    const normalizedEmail = email.trim().toLowerCase()
    if (!isValidEmail(normalizedEmail)) {
      setStatus({ type: 'error', message: 'Please enter a valid email address.' })
      return
    }

    const entry = {
      email: normalizedEmail,
      company: company.trim() || null,
      wantsBeta,
      createdAt: new Date().toISOString(),
    }

    const existing = loadWaitlist()
    const withoutDupes = existing.filter((x) => x?.email !== entry.email)
    saveWaitlist([entry, ...withoutDupes])

    setStatus({
      type: 'success',
      message: wantsBeta
        ? 'Thanks — you’re on the list for launch updates and beta access.'
        : 'Thanks — you’re on the list for launch updates.',
    })
    setEmail('')
    setCompany('')
    setWantsBeta(false)
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="block text-xs text-text-inverse-muted mb-2" htmlFor="waitlist-email">
          Email
        </label>
        <input
          id="waitlist-email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          inputMode="email"
          autoComplete="email"
          placeholder="Work email"
          className="w-full bg-white/10 text-text-inverse placeholder:text-text-inverse-muted border border-white/20 rounded-lg px-4 py-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
        />
      </div>

      <div>
        <label className="block text-xs text-text-inverse-muted mb-2" htmlFor="waitlist-company">
          Company (optional)
        </label>
        <input
          id="waitlist-company"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          autoComplete="organization"
          placeholder="Company"
          className="w-full bg-white/10 text-text-inverse placeholder:text-text-inverse-muted border border-white/20 rounded-lg px-4 py-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
        />
      </div>

      <label className="flex items-start gap-3 text-sm text-text-inverse-muted select-none">
        <input
          type="checkbox"
          checked={wantsBeta}
          onChange={(e) => setWantsBeta(e.target.checked)}
          className="mt-1 h-4 w-4 rounded border border-white/30 bg-white/10 text-brand-pistachio focus-visible:ring-2 focus-visible:ring-focus-ring"
        />
        <span>
          I want to join the <span className="text-text-inverse">BETA testing</span> group (early access + feedback calls).
        </span>
      </label>

      <div className="flex flex-col sm:flex-row gap-3">
        <PrimaryButton type="submit">Stay in the know</PrimaryButton>
        <SecondaryButton
          type="button"
          onClick={() => {
            setEmail('')
            setCompany('')
            setWantsBeta(false)
            setStatus({ type: 'idle', message: '' })
          }}
        >
          Reset
        </SecondaryButton>
      </div>

      {status.type !== 'idle' && (
        <div
          role={status.type === 'error' ? 'alert' : 'status'}
          className={`text-sm rounded-lg border px-4 py-3 ${
            status.type === 'error'
              ? 'bg-white/10 border-white/25 text-text-inverse'
              : 'bg-white/10 border-white/25 text-text-inverse'
          }`}
        >
          {status.message}
        </div>
      )}

      <p className="text-xs text-text-inverse-muted">
        No spam. One email for launch, plus occasional beta updates if you opt in.
      </p>
    </form>
  )
}

export default function LandingMarketingPage({ onViewDashboard, heroVersion = 1 }) {
  const [currentHeroVersion, setCurrentHeroVersion] = React.useState(heroVersion)
  
  const handleScrollToWaitlist = () => {
    document.getElementById('waitlist')?.scrollIntoView({ behavior: 'smooth' })
  }

  const renderHero = () => {
    const commonProps = {
      onViewDashboard,
      onScrollToWaitlist: handleScrollToWaitlist,
    }

    switch (currentHeroVersion) {
      case 1:
        return <HeroV1 {...commonProps} waitlistForm={<WaitlistForm />} />
      case 2:
        return <HeroV2 {...commonProps} />
      case 3:
        return <HeroV3 {...commonProps} />
      case 4:
        return <HeroV4 {...commonProps} />
      default:
        return <HeroV1 {...commonProps} waitlistForm={<WaitlistForm />} />
    }
  }

  return (
    <>
      <SEO 
        title="MarketRisk - Credit Risk Monitoring for Romanian SMEs"
        description="Simple credit risk monitoring for Romanian SMEs: build a watchlist, get actionable alerts, and avoid bad debt before it hits cashflow."
        keywords="credit risk monitoring, Romanian SMEs, risk alerts, insolvency monitoring, debt management, business credit check"
      />
      <div className="space-y-12">
        {/* Hero Version Selector - Always visible for testing */}
        <div className="flex gap-2 p-4 bg-surface-paper rounded-lg border border-border-subtle">
          <span className="text-sm text-text-secondary mr-2">Hero Version:</span>
          {[1, 2, 3, 4].map((v) => (
            <button
              key={v}
              onClick={() => setCurrentHeroVersion(v)}
              className={`px-3 py-1 text-xs rounded transition-colors ${
                currentHeroVersion === v
                  ? 'bg-brand-mughal-green text-white'
                  : 'bg-white text-text-primary border border-border-subtle hover:bg-surface-paper'
              }`}
            >
              Version {v}
            </button>
          ))}
        </div>

        {/* Hero Section */}
        {renderHero()}

        {/* Waitlist Section (shown below hero for V2, V3, and V4, V1 has it inline) */}
        {currentHeroVersion !== 1 && (
          <section id="waitlist" className="bg-brand-mughal-green rounded-2xl p-8">
            <div className="max-w-2xl mx-auto">
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6">
                <p className="text-text-inverse text-lg font-medium mb-4">Stay in the know</p>
                <WaitlistForm />
              </div>
            </div>
          </section>
        )}

      {/* Benefits */}
      <section>
        <div className="mb-6">
          <p className="text-xs text-text-muted mb-2">Benefits</p>
          <h2 className="text-2xl font-semibold text-text-primary" style={{ letterSpacing: '-0.3px' }}>
            Built for alerts — not information overload.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <BenefitCard
            title="Proactive risk alerts"
            description="Get early warnings that tell you what changed and what to do next."
            bullets={['Insolvency & legal changes', 'State debt signals', 'Context + recommended action']}
          />
          <BenefitCard
            title="SME-friendly watchlists"
            description="Set it once: monitor the 25 companies you care about most."
            bullets={['Fast search', 'Tags + notes', 'Clear status history']}
          />
          <BenefitCard
            title="Simple, transparent pricing"
            description="Self-serve upgrades, no credits, no “contact sales to see price”."
            bullets={['Free plan to try', '€39 Starter for small portfolios', '€99 PRO for active sales', 'Enterprise for high volume']}
          />
          <BenefitCard
            title="Mobile-first by default"
            description="Designed for busy operators — quick checks, fast alerts, calm UI."
            bullets={['Clean typography', 'Low cognitive load', 'Works great on phones']}
          />
        </div>
      </section>
    </div>
    </>
  )
}
