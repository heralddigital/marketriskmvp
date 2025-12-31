import React from 'react'
import SEO from '../components/SEO.jsx'
import { 
  Bell, 
  Search, 
  FileText, 
  TrendingUp, 
  Users, 
  Zap, 
  CheckCircle2, 
  Star,
  ArrowRight,
  BarChart3,
  Clock,
  Building2,
  Target,
  AlertTriangle,
  Shield,
  ChevronDown,
  ChevronUp
} from 'lucide-react'

function isValidEmail(email) {
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
    // ignore
  }
}

function PrimaryButton({ children, onClick, type = 'button', disabled = false, className = '' }) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`px-6 py-3 bg-brand-mughal-green text-white rounded-lg font-medium text-sm hover:bg-brand-mughal-green-2 transition-all duration-normal disabled:opacity-60 disabled:cursor-not-allowed ${className}`}
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
        ? "Thanks - you're on the list for launch updates and beta access."
        : "Thanks - you're on the list for launch updates.",
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

function FAQItem({ question, answer }) {
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <div className="bg-white border border-border-subtle rounded-xl overflow-hidden">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-surface-paper transition-colors"
      >
        <span className="text-sm font-medium text-text-primary pr-4">{question}</span>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-text-muted flex-shrink-0" />
        ) : (
          <ChevronDown className="w-5 h-5 text-text-muted flex-shrink-0" />
        )}
      </button>
      {isOpen && (
        <div className="px-6 pb-4">
          <p className="text-sm text-text-secondary">{answer}</p>
        </div>
      )}
    </div>
  )
}

export default function Homepage2({ onViewDashboard, onNavigate }) {
  const handleScrollToWaitlist = () => {
    document.getElementById('waitlist')?.scrollIntoView({ behavior: 'smooth' })
  }

  const testimonials = [
    {
      quote: "marketrisk saved us from a €50K bad debt. The early warning system caught an insolvency filing we would have missed.",
      name: "Maria Popescu",
      role: "CFO",
      company: "TechStart SRL",
      rating: 5
    },
    {
      quote: "The 24/7 monitoring gives us peace of mind. We know immediately when something changes with our partners.",
      name: "Alexandru Ionescu",
      role: "Risk Manager",
      company: "FinanceCorp",
      rating: 5
    },
    {
      quote: "Best investment we made this year. The PRO plan pays for itself by preventing just one bad debt.",
      name: "Elena Radu",
      role: "Operations Director",
      company: "RetailGroup",
      rating: 5
    }
  ]

  const faqs = [
    {
      question: "What data sources does marketrisk use?",
      answer: "We monitor ANAF (tax authority), insolvency filings (BPI), court cases (Dosare), and other official Romanian business registries. All data is updated in real-time."
    },
    {
      question: "Are there limits on how many companies I can monitor?",
      answer: "Free plan: 3 lookups/month. Starter: 20 lookups/month + 10 company watchlist. PRO: Unlimited lookups + 250 company watchlist. Enterprise: Unlimited everything."
    },
    {
      question: "How secure is my data?",
      answer: "We use bank-level encryption, GDPR compliance, and store all data in EU data centers. Your watchlists and reports are never shared with third parties."
    },
    {
      question: "Can I access the API?",
      answer: "API access is available for Enterprise plans. Contact our sales team to discuss integration options and custom requirements."
    },
    {
      question: "What happens if I exceed my plan limits?",
      answer: "We'll notify you when you're approaching your limits. You can upgrade anytime, or we'll pause additional lookups until your next billing cycle. No surprise charges."
    },
    {
      question: "How quickly will I receive alerts?",
      answer: "PRO and Enterprise plans receive real-time alerts within minutes of a filing or change. Starter plans receive daily digest emails. Free plan includes basic email notifications."
    }
  ]

  return (
    <>
      <SEO 
        title="MarketRisk - Credit Risk Monitoring for Romanian SMEs"
        description="Simple credit risk monitoring for Romanian SMEs: build a watchlist, get actionable alerts, and avoid bad debt before it hits cashflow."
        keywords="credit risk monitoring, Romanian SMEs, risk alerts, insolvency monitoring, debt management, business credit check"
      />
      <div className="space-y-16 md:space-y-24">
        {/* 1. Hero Section - Version 2 with different layout */}
        <section className="bg-gradient-to-br from-brand-mughal-green to-brand-mughal-green-2 rounded-2xl p-8 md:p-12 relative overflow-hidden">
          {/* Different decorative elements */}
          <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 5 }}>
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              {/* Different pattern */}
              <circle cx="80%" cy="20%" r="120" fill="none" stroke="var(--brand-pistachio)" strokeWidth="2" opacity="0.3" />
              <circle cx="15%" cy="80%" r="80" fill="none" stroke="var(--brand-pistachio)" strokeWidth="2" opacity="0.3" />
              <rect
                x="50%"
                y="30%"
                width="300"
                height="180"
                rx="4"
                fill="none"
                stroke="var(--pattern-line-on-green)"
                strokeWidth="1"
                transform="rotate(15 50% 30%)"
              />
            </svg>
          </div>

          <div className="relative z-10 max-w-5xl mx-auto">
            <div className="text-center mb-8">
              <p className="text-text-inverse-muted text-sm mb-2 uppercase tracking-wide">Version 2</p>
              <h1 className="text-4xl md:text-5xl font-semibold text-text-inverse mb-4" style={{ letterSpacing: '-0.8px' }}>
                Protect your business from bad debt
              </h1>
              <p className="text-text-inverse-muted text-lg max-w-2xl mx-auto mb-8">
                Real-time credit risk monitoring for Romanian SMEs. Get instant alerts on insolvency filings, court cases, and tax debts before they impact your cashflow.
              </p>
            </div>

            {/* Primary and Secondary CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <PrimaryButton onClick={handleScrollToWaitlist}>
                Start free trial
              </PrimaryButton>
              <SecondaryButton onClick={onViewDashboard}>
                See how it works
              </SecondaryButton>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-text-inverse-muted">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-brand-pistachio" />
                <span>Free plan available</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-brand-pistachio" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-brand-pistachio" />
                <span>Setup in 5 minutes</span>
              </div>
            </div>
          </div>
        </section>

        {/* Rest of the sections remain the same as Homepage1 */}
        {/* 2. Social Proof */}
        <section className="py-8">
          <div className="text-center mb-8">
            <p className="text-sm text-text-muted mb-4">Trusted by Romanian SMEs</p>
            <div className="flex flex-wrap items-center justify-center gap-8 opacity-60">
              <div className="text-sm font-medium text-text-secondary">TechStart</div>
              <div className="text-sm font-medium text-text-secondary">FinanceCorp</div>
              <div className="text-sm font-medium text-text-secondary">RetailGroup</div>
              <div className="text-sm font-medium text-text-secondary">ServicePro</div>
              <div className="text-sm font-medium text-text-secondary">ManufacturingPlus</div>
            </div>
          </div>
        </section>

        {/* 3. How It Works */}
        <section>
          <div className="text-center mb-12">
            <p className="text-xs text-text-muted mb-2 uppercase tracking-wide">How It Works</p>
            <h2 className="text-3xl md:text-4xl font-semibold text-text-primary mb-4" style={{ letterSpacing: '-0.5px' }}>
              Get started in minutes
            </h2>
            <p className="text-text-secondary max-w-2xl mx-auto">
              Simple setup, powerful protection. Start monitoring your business partners today.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white border border-border-subtle p-6 rounded-xl">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-brand-mughal-green text-white flex items-center justify-center font-semibold text-sm">
                  1
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-text-primary mb-2">Create your watchlist</h3>
                  <p className="text-sm text-text-secondary">Add up to 25 companies by CUI. Organize with tags and notes for easy management.</p>
                </div>
              </div>
            </div>
            <div className="bg-white border border-border-subtle p-6 rounded-xl">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-brand-mughal-green text-white flex items-center justify-center font-semibold text-sm">
                  2
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-text-primary mb-2">Set up alerts</h3>
                  <p className="text-sm text-text-secondary">Choose what matters: insolvency filings, legal changes, state debt signals, and more.</p>
                </div>
              </div>
            </div>
            <div className="bg-white border border-border-subtle p-6 rounded-xl">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-brand-mughal-green text-white flex items-center justify-center font-semibold text-sm">
                  3
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-text-primary mb-2">Stay protected</h3>
                  <p className="text-sm text-text-secondary">Receive instant notifications when risks appear. Take action before it impacts your cashflow.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4. Features/Benefits */}
        <section className="bg-surface-paper rounded-2xl p-8 md:p-12">
          <div className="text-center mb-12">
            <p className="text-xs text-text-muted mb-2 uppercase tracking-wide">Features</p>
            <h2 className="text-3xl md:text-4xl font-semibold text-text-primary mb-4" style={{ letterSpacing: '-0.5px' }}>
              Everything you need to manage risk
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white border border-border-subtle p-6 rounded-xl hover:shadow-sm transition-all duration-normal">
              <div className="mb-4">
                <div className="w-10 h-10 rounded-lg bg-brand-pistachio/10 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-brand-mughal-green" />
                </div>
              </div>
              <h3 className="text-lg font-medium text-text-primary mb-2">Proactive Risk Alerts</h3>
              <p className="text-sm text-text-secondary">Get early warnings that tell you what changed and what to do next. Insolvency & legal changes, state debt signals, context + recommended action.</p>
            </div>

            <div className="bg-white border border-border-subtle p-6 rounded-xl hover:shadow-sm transition-all duration-normal">
              <div className="mb-4">
                <div className="w-10 h-10 rounded-lg bg-brand-pistachio/10 flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-brand-mughal-green" />
                </div>
              </div>
              <h3 className="text-lg font-medium text-text-primary mb-2">SME-Friendly Watchlists</h3>
              <p className="text-sm text-text-secondary">Set it once: monitor the 25 companies you care about most. Fast search, tags + notes, clear status history.</p>
            </div>

            <div className="bg-white border border-border-subtle p-6 rounded-xl hover:shadow-sm transition-all duration-normal">
              <div className="mb-4">
                <div className="w-10 h-10 rounded-lg bg-brand-pistachio/10 flex items-center justify-center">
                  <Bell className="w-5 h-5 text-brand-mughal-green" />
                </div>
              </div>
              <h3 className="text-lg font-medium text-text-primary mb-2">Real-Time Monitoring</h3>
              <p className="text-sm text-text-secondary">24/7 monitoring of ANAF, court cases, and insolvency filings. Get instant notifications when something changes.</p>
            </div>

            <div className="bg-white border border-border-subtle p-6 rounded-xl hover:shadow-sm transition-all duration-normal">
              <div className="mb-4">
                <div className="w-10 h-10 rounded-lg bg-brand-pistachio/10 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-brand-mughal-green" />
                </div>
              </div>
              <h3 className="text-lg font-medium text-text-primary mb-2">Mobile-First Design</h3>
              <p className="text-sm text-text-secondary">Designed for busy operators - quick checks, fast alerts, calm UI. Clean typography, low cognitive load, works great on phones.</p>
            </div>
          </div>
        </section>

        {/* 5. Use Cases */}
        <section>
          <div className="text-center mb-12">
            <p className="text-xs text-text-muted mb-2 uppercase tracking-wide">Use Cases</p>
            <h2 className="text-3xl md:text-4xl font-semibold text-text-primary mb-4" style={{ letterSpacing: '-0.5px' }}>
              Built for teams like yours
            </h2>
            <p className="text-text-secondary max-w-2xl mx-auto">
              Whether you're in sales, finance, or procurement, MarketRisk adapts to your workflow.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white border border-border-subtle p-6 rounded-xl hover:shadow-sm transition-all duration-normal">
              <div className="mb-4">
                <div className="w-12 h-12 rounded-lg bg-brand-pistachio/10 flex items-center justify-center">
                  <Users className="w-6 h-6 text-brand-mughal-green" />
                </div>
              </div>
              <h3 className="text-lg font-medium text-text-primary mb-2">B2B Sales Teams</h3>
              <p className="text-sm text-text-secondary mb-4">Monitor prospects and customers before and after contracts.</p>
              <ul className="space-y-2">
                <li className="text-sm text-text-secondary flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-brand-pistachio mt-0.5 flex-shrink-0" />
                  <span>Check credit status before onboarding</span>
                </li>
                <li className="text-sm text-text-secondary flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-brand-pistachio mt-0.5 flex-shrink-0" />
                  <span>Track payment behavior changes</span>
                </li>
                <li className="text-sm text-text-secondary flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-brand-pistachio mt-0.5 flex-shrink-0" />
                  <span>Identify at-risk customers early</span>
                </li>
              </ul>
            </div>

            <div className="bg-white border border-border-subtle p-6 rounded-xl hover:shadow-sm transition-all duration-normal">
              <div className="mb-4">
                <div className="w-12 h-12 rounded-lg bg-brand-pistachio/10 flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-brand-mughal-green" />
                </div>
              </div>
              <h3 className="text-lg font-medium text-text-primary mb-2">Financial Officers</h3>
              <p className="text-sm text-text-secondary mb-4">Protect cashflow by monitoring suppliers and partners.</p>
              <ul className="space-y-2">
                <li className="text-sm text-text-secondary flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-brand-pistachio mt-0.5 flex-shrink-0" />
                  <span>Monitor supplier stability</span>
                </li>
                <li className="text-sm text-text-secondary flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-brand-pistachio mt-0.5 flex-shrink-0" />
                  <span>Get alerts on insolvency filings</span>
                </li>
                <li className="text-sm text-text-secondary flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-brand-pistachio mt-0.5 flex-shrink-0" />
                  <span>Track state debt and tax issues</span>
                </li>
              </ul>
            </div>

            <div className="bg-white border border-border-subtle p-6 rounded-xl hover:shadow-sm transition-all duration-normal">
              <div className="mb-4">
                <div className="w-12 h-12 rounded-lg bg-brand-pistachio/10 flex items-center justify-center">
                  <Target className="w-6 h-6 text-brand-mughal-green" />
                </div>
              </div>
              <h3 className="text-lg font-medium text-text-primary mb-2">Procurement Teams</h3>
              <p className="text-sm text-text-secondary mb-4">Make informed decisions with comprehensive risk data.</p>
              <ul className="space-y-2">
                <li className="text-sm text-text-secondary flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-brand-pistachio mt-0.5 flex-shrink-0" />
                  <span>Vet suppliers before contracts</span>
                </li>
                <li className="text-sm text-text-secondary flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-brand-pistachio mt-0.5 flex-shrink-0" />
                  <span>Monitor ongoing supplier health</span>
                </li>
                <li className="text-sm text-text-secondary flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-brand-pistachio mt-0.5 flex-shrink-0" />
                  <span>Export reports for compliance</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* 6. Testimonials - Green Background */}
        <section className="bg-brand-mughal-green rounded-2xl p-8 md:p-12">
          <div className="text-center mb-12">
            <p className="text-xs text-text-inverse-muted mb-2 uppercase tracking-wide">Testimonials</p>
            <h2 className="text-3xl md:text-4xl font-semibold text-text-inverse mb-4" style={{ letterSpacing: '-0.5px' }}>
              Loved by Romanian businesses
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-sm border border-white/20 p-6 rounded-xl">
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-brand-pistachio text-brand-pistachio" />
                  ))}
                </div>
                <p className="text-sm text-text-inverse mb-4 italic">"{testimonial.quote}"</p>
                <div>
                  <p className="text-sm font-medium text-text-inverse">{testimonial.name}</p>
                  <p className="text-xs text-text-inverse-muted">{testimonial.role}, {testimonial.company}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 7. Pricing Preview */}
        <section>
          <div className="text-center mb-12">
            <p className="text-xs text-text-muted mb-2 uppercase tracking-wide">Pricing</p>
            <h2 className="text-3xl md:text-4xl font-semibold text-text-primary mb-4" style={{ letterSpacing: '-0.5px' }}>
              Simple, transparent pricing
            </h2>
            <p className="text-text-secondary max-w-2xl mx-auto mb-8">
              Start free, upgrade when you're ready. No hidden fees, no surprises.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {/* Free Plan */}
            <div className="bg-white border border-border-subtle p-6 rounded-xl">
              <h3 className="text-lg font-medium text-text-primary mb-2">Free</h3>
              <div className="mb-4">
                <span className="text-3xl font-semibold text-text-primary">€0</span>
              </div>
              <p className="text-sm text-text-secondary mb-6">For one-off checks</p>
              <ul className="space-y-3 mb-6">
                <li className="text-sm text-text-secondary flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-brand-pistachio mt-0.5 flex-shrink-0" />
                  <span>3 CUI lookups / month</span>
                </li>
                <li className="text-sm text-text-secondary flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-brand-pistachio mt-0.5 flex-shrink-0" />
                  <span>Basic credit checks</span>
                </li>
                <li className="text-sm text-text-secondary flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-brand-pistachio mt-0.5 flex-shrink-0" />
                  <span>Email support</span>
                </li>
              </ul>
              <PrimaryButton onClick={handleScrollToWaitlist} className="w-full">Get started</PrimaryButton>
            </div>

            {/* Starter Plan */}
            <div className="bg-white border border-border-subtle p-6 rounded-xl">
              <h3 className="text-lg font-medium text-text-primary mb-2">Starter</h3>
              <div className="mb-4">
                <span className="text-3xl font-semibold text-text-primary">€39</span>
                <span className="text-text-secondary text-sm">/month</span>
              </div>
              <p className="text-sm text-text-secondary mb-6">For small portfolios</p>
              <ul className="space-y-3 mb-6">
                <li className="text-sm text-text-secondary flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-brand-pistachio mt-0.5 flex-shrink-0" />
                  <span>20 CUI lookups / month</span>
                </li>
                <li className="text-sm text-text-secondary flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-brand-pistachio mt-0.5 flex-shrink-0" />
                  <span>10 CUI watchlist</span>
                </li>
                <li className="text-sm text-text-secondary flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-brand-pistachio mt-0.5 flex-shrink-0" />
                  <span>Insolvency alerts</span>
                </li>
                <li className="text-sm text-text-secondary flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-brand-pistachio mt-0.5 flex-shrink-0" />
                  <span>5 PDF exports / month</span>
                </li>
              </ul>
              <PrimaryButton onClick={handleScrollToWaitlist} className="w-full">Start Starter</PrimaryButton>
            </div>

            {/* PRO Plan - Highlighted */}
            <div className="bg-brand-mughal-green border-2 border-brand-mughal-green p-6 rounded-xl text-white relative">
              <div className="absolute top-4 right-4">
                <span className="text-xs bg-brand-pistachio text-brand-mughal-green px-2 py-1 rounded font-medium">POPULAR</span>
              </div>
              <h3 className="text-lg font-medium text-white mb-2">PRO</h3>
              <div className="mb-4">
                <span className="text-3xl font-semibold text-white">€99</span>
                <span className="text-text-inverse-muted text-sm">/month</span>
              </div>
              <p className="text-sm text-text-inverse-muted mb-6">For active sales teams</p>
              <ul className="space-y-3 mb-6">
                <li className="text-sm text-text-inverse-muted flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-brand-pistachio mt-0.5 flex-shrink-0" />
                  <span>Unlimited CUI lookups</span>
                </li>
                <li className="text-sm text-text-inverse-muted flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-brand-pistachio mt-0.5 flex-shrink-0" />
                  <span>50 CUI watchlist</span>
                </li>
                <li className="text-sm text-text-inverse-muted flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-brand-pistachio mt-0.5 flex-shrink-0" />
                  <span>All alerts enabled</span>
                </li>
                <li className="text-sm text-text-inverse-muted flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-brand-pistachio mt-0.5 flex-shrink-0" />
                  <span>Unlimited PDF exports</span>
                </li>
                <li className="text-sm text-text-inverse-muted flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-brand-pistachio mt-0.5 flex-shrink-0" />
                  <span>Priority support</span>
                </li>
              </ul>
              <button
                onClick={handleScrollToWaitlist}
                className="w-full px-6 py-3 bg-white text-brand-mughal-green rounded-lg font-medium text-sm hover:bg-brand-paper transition-all duration-normal"
              >
                Start PRO trial
              </button>
            </div>

            {/* Enterprise Plan */}
            <div className="bg-white border border-border-subtle p-6 rounded-xl">
              <h3 className="text-lg font-medium text-text-primary mb-2">Enterprise</h3>
              <div className="mb-4">
                <span className="text-3xl font-semibold text-text-primary">Custom</span>
              </div>
              <p className="text-sm text-text-secondary mb-6">For high-volume needs</p>
              <ul className="space-y-3 mb-6">
                <li className="text-sm text-text-secondary flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-brand-pistachio mt-0.5 flex-shrink-0" />
                  <span>Unlimited everything</span>
                </li>
                <li className="text-sm text-text-secondary flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-brand-pistachio mt-0.5 flex-shrink-0" />
                  <span>Custom integrations</span>
                </li>
                <li className="text-sm text-text-secondary flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-brand-pistachio mt-0.5 flex-shrink-0" />
                  <span>Dedicated support</span>
                </li>
                <li className="text-sm text-text-secondary flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-brand-pistachio mt-0.5 flex-shrink-0" />
                  <span>SLA guarantees</span>
                </li>
              </ul>
              <button
                onClick={() => onNavigate?.('contact')}
                className="w-full px-6 py-3 bg-brand-mughal-green text-white rounded-lg font-medium text-sm hover:bg-brand-mughal-green-2 transition-all duration-normal"
              >
                Contact sales
              </button>
            </div>
          </div>
        </section>

        {/* 8. FAQ Section */}
        <section>
          <div className="text-center mb-12">
            <p className="text-xs text-text-muted mb-2 uppercase tracking-wide">FAQ</p>
            <h2 className="text-3xl md:text-4xl font-semibold text-text-primary mb-4" style={{ letterSpacing: '-0.5px' }}>
              Frequently asked questions
            </h2>
            <p className="text-text-secondary max-w-2xl mx-auto">
              Everything you need to know about marketrisk
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <FAQItem key={index} question={faq.question} answer={faq.answer} />
            ))}
          </div>
        </section>

        {/* 9. Final CTA/Waitlist */}
        <section id="waitlist" className="bg-brand-mughal-green rounded-2xl p-8 md:p-12 relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 5 }}>
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M 70% 70% Q 80% 75%, 85% 85% T 95% 95% Q 98% 98%, 100% 100%"
                stroke="var(--brand-pistachio)"
                strokeWidth="25"
                strokeLinecap="round"
                fill="none"
                opacity="0.3"
              />
            </svg>
          </div>
          
          <div className="relative z-10 max-w-3xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-semibold text-text-inverse mb-4" style={{ letterSpacing: '-0.5px' }}>
                Ready to protect your business?
              </h2>
              <p className="text-lg text-text-inverse-muted mb-8 max-w-2xl mx-auto">
                Join the waitlist to be notified when we launch. Early access for beta testers.
              </p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6">
              <p className="text-text-inverse text-lg font-medium mb-4">Stay in the know</p>
              <WaitlistForm />
            </div>
          </div>
        </section>
      </div>
    </>
  )
}

