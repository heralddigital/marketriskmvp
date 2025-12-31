import React from 'react'
import SEO from '../components/SEO.jsx'
import HeroV1 from '../components/HeroV1.jsx'
import HeroV2 from '../components/HeroV2.jsx'
import HeroV3 from '../components/HeroV3.jsx'
import HeroV4 from '../components/HeroV4.jsx'
import { 
  Shield, 
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
  ChevronDown,
  ChevronUp
} from 'lucide-react'

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

function BenefitCard({ title, description, bullets, icon: Icon }) {
  return (
    <div className="bg-white border border-border-subtle p-6 rounded-xl hover:shadow-sm transition-all duration-normal">
      {Icon && (
        <div className="mb-4">
          <div className="w-10 h-10 rounded-lg bg-brand-pistachio/10 flex items-center justify-center">
            <Icon className="w-5 h-5 text-brand-mughal-green" />
          </div>
        </div>
      )}
      <h3 className="text-lg font-medium text-text-primary mb-2">{title}</h3>
      <p className="text-sm text-text-secondary mb-4">{description}</p>
      {bullets && bullets.length > 0 && (
        <ul className="space-y-2">
          {bullets.map((b) => (
            <li key={b} className="text-sm text-text-secondary flex items-start gap-2">
              <span className="text-brand-mughal-green mt-[2px]">•</span>
              <span>{b}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

function FeatureCard({ icon: Icon, title, description }) {
  return (
    <div className="flex gap-4">
      <div className="flex-shrink-0">
        <div className="w-12 h-12 rounded-lg bg-brand-pistachio/10 flex items-center justify-center">
          <Icon className="w-6 h-6 text-brand-mughal-green" />
        </div>
      </div>
      <div>
        <h3 className="text-lg font-medium text-text-primary mb-2">{title}</h3>
        <p className="text-sm text-text-secondary">{description}</p>
      </div>
    </div>
  )
}

function StepCard({ number, title, description }) {
  return (
    <div className="bg-white border border-border-subtle p-6 rounded-xl">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-brand-mughal-green text-white flex items-center justify-center font-semibold text-sm">
          {number}
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-medium text-text-primary mb-2">{title}</h3>
          <p className="text-sm text-text-secondary">{description}</p>
        </div>
      </div>
    </div>
  )
}

function TestimonialCard({ quote, name, role, company, rating = 5 }) {
  return (
    <div className="bg-white border border-border-subtle p-6 rounded-xl">
      <div className="flex gap-1 mb-4">
        {Array.from({ length: rating }).map((_, i) => (
          <Star key={i} className="w-4 h-4 fill-brand-pistachio text-brand-pistachio" />
        ))}
      </div>
      <p className="text-sm text-text-secondary mb-4 italic">"{quote}"</p>
      <div>
        <p className="text-sm font-medium text-text-primary">{name}</p>
        <p className="text-xs text-text-muted">{role}, {company}</p>
      </div>
    </div>
  )
}

function UseCaseCard({ icon: Icon, title, description, features }) {
  return (
    <div className="bg-white border border-border-subtle p-6 rounded-xl hover:shadow-sm transition-all duration-normal">
      <div className="mb-4">
        <div className="w-12 h-12 rounded-lg bg-brand-pistachio/10 flex items-center justify-center">
          <Icon className="w-6 h-6 text-brand-mughal-green" />
        </div>
      </div>
      <h3 className="text-lg font-medium text-text-primary mb-2">{title}</h3>
      <p className="text-sm text-text-secondary mb-4">{description}</p>
      <ul className="space-y-2">
        {features.map((feature) => (
          <li key={feature} className="text-sm text-text-secondary flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-brand-pistachio mt-0.5 flex-shrink-0" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
    </div>
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

export default function LandingMarketingPage({ onViewDashboard, heroVersion = 1, onNavigate }) {
  const [currentHeroVersion, setCurrentHeroVersion] = React.useState(heroVersion)
  
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
    },
    {
      quote: "Simple, transparent pricing. No hidden fees, no surprises. Exactly what we needed.",
      name: "Cristian Moldovan",
      role: "CEO",
      company: "ServicePro",
      rating: 5
    }
  ]

  const useCases = [
    {
      icon: Building2,
      title: "Sales Teams",
      description: "Monitor prospects and customers before and after contracts.",
      features: [
        "Check credit status before onboarding",
        "Track payment behavior changes",
        "Identify at-risk customers early"
      ]
    },
    {
      icon: Users,
      title: "Finance Departments",
      description: "Protect cashflow by monitoring suppliers and partners.",
      features: [
        "Monitor supplier stability",
        "Get alerts on insolvency filings",
        "Track state debt and tax issues"
      ]
    },
    {
      icon: Target,
      title: "Credit Analysts",
      description: "Make informed credit decisions with comprehensive risk data.",
      features: [
        "Access real-time credit information",
        "Historical trend analysis",
        "Export detailed reports"
      ]
    }
  ]

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
      <div className="space-y-16 md:space-y-24">
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

        {/* Social Proof / Trust Logos */}
        <section className="py-8">
          <div className="text-center mb-8">
            <p className="text-sm text-text-muted mb-4">Trusted by Romanian SMEs</p>
            <div className="flex flex-wrap items-center justify-center gap-8 opacity-60">
              <img 
                src="/logos/anaf-logo.png" 
                alt="ANAF" 
                className="h-8 object-contain"
              />
              <img 
                src="/logos/mfp-logo.jpg" 
                alt="MFP" 
                className="h-8 object-contain"
              />
              <img 
                src="/logos/onrc-logo.png" 
                alt="ONRC" 
                className="h-8 object-contain"
              />
            </div>
          </div>
        </section>

        {/* How It Works */}
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
            <StepCard
              number={1}
              title="Create your watchlist"
              description="Add up to 25 companies by CUI. Organize with tags and notes for easy management."
            />
            <StepCard
              number={2}
              title="Set up alerts"
              description="Choose what matters: insolvency filings, legal changes, state debt signals, and more."
            />
            <StepCard
              number={3}
              title="Stay protected"
              description="Receive instant notifications when risks appear. Take action before it impacts your cashflow."
            />
          </div>
        </section>

        {/* Features Section */}
        <section className="bg-surface-paper rounded-2xl p-8 md:p-12">
          <div className="text-center mb-12">
            <p className="text-xs text-text-muted mb-2 uppercase tracking-wide">Features</p>
            <h2 className="text-3xl md:text-4xl font-semibold text-text-primary mb-4" style={{ letterSpacing: '-0.5px' }}>
              Everything you need to manage risk
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={Bell}
              title="Real-time alerts"
              description="Get instant notifications for insolvency filings, court cases, tax debts, and legal changes."
            />
            <FeatureCard
              icon={Search}
              title="Fast CUI lookup"
              description="Quick credit checks for any Romanian company. Get comprehensive risk profiles in seconds."
            />
            <FeatureCard
              icon={FileText}
              title="PDF reports"
              description="Export detailed reports for stakeholders, audits, or internal documentation."
            />
            <FeatureCard
              icon={TrendingUp}
              title="Risk trends"
              description="Track changes over time. See when risk levels increase or decrease for monitored companies."
            />
            <FeatureCard
              icon={Users}
              title="Team collaboration"
              description="Share watchlists with your team. Set permissions and keep everyone informed."
            />
            <FeatureCard
              icon={Shield}
              title="Bank-level security"
              description="Your data is encrypted and protected with industry-leading security standards."
            />
          </div>
        </section>

        {/* Use Cases */}
        <section>
          <div className="text-center mb-12">
            <p className="text-xs text-text-muted mb-2 uppercase tracking-wide">Use Cases</p>
            <h2 className="text-3xl md:text-4xl font-semibold text-text-primary mb-4" style={{ letterSpacing: '-0.5px' }}>
              Built for teams like yours
            </h2>
            <p className="text-text-secondary max-w-2xl mx-auto">
              Whether you're in sales, finance, or credit analysis, MarketRisk adapts to your workflow.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {useCases.map((useCase) => (
              <UseCaseCard key={useCase.title} {...useCase} />
            ))}
          </div>
        </section>

        {/* Benefits Section */}
        <section>
          <div className="text-center mb-12">
            <p className="text-xs text-text-muted mb-2 uppercase tracking-wide">Benefits</p>
            <h2 className="text-3xl md:text-4xl font-semibold text-text-primary mb-4" style={{ letterSpacing: '-0.5px' }}>
              Built for alerts — not information overload
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <BenefitCard
              icon={AlertTriangle}
              title="Proactive risk alerts"
              description="Get early warnings that tell you what changed and what to do next."
              bullets={['Insolvency & legal changes', 'State debt signals', 'Context + recommended action']}
            />
            <BenefitCard
              icon={BarChart3}
              title="SME-friendly watchlists"
              description="Set it once: monitor the 25 companies you care about most."
              bullets={['Fast search', 'Tags + notes', 'Clear status history']}
            />
            <BenefitCard
              icon={CheckCircle2}
              title="Simple, transparent pricing"
              description='Self-serve upgrades, no credits, no "contact sales to see price".'
              bullets={['Free plan to try', '€39 Starter for small portfolios', '€99 PRO for active sales', 'Enterprise for high volume']}
            />
            <BenefitCard
              icon={Zap}
              title="Mobile-first by default"
              description="Designed for busy operators — quick checks, fast alerts, calm UI."
              bullets={['Clean typography', 'Low cognitive load', 'Works great on phones']}
            />
          </div>
        </section>

        {/* Testimonials */}
        <section className="bg-surface-paper rounded-2xl p-8 md:p-12">
          <div className="text-center mb-12">
            <p className="text-xs text-text-muted mb-2 uppercase tracking-wide">Testimonials</p>
            <h2 className="text-3xl md:text-4xl font-semibold text-text-primary mb-4" style={{ letterSpacing: '-0.5px' }}>
              Loved by Romanian businesses
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard key={index} {...testimonial} />
            ))}
          </div>
        </section>

        {/* FAQ Section */}
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
            <FAQItem question="What data sources does marketrisk use?" answer="We monitor ANAF (tax authority), insolvency filings (BPI), court cases (Dosare), and other official Romanian business registries. All data is updated in real-time." />
            <FAQItem question="Are there limits on how many companies I can monitor?" answer="Free plan: 3 lookups/month. Starter: 20 lookups/month + 10 company watchlist. PRO: Unlimited lookups + 250 company watchlist. Enterprise: Unlimited everything." />
            <FAQItem question="How secure is my data?" answer="We use bank-level encryption, GDPR compliance, and store all data in EU data centers. Your watchlists and reports are never shared with third parties." />
            <FAQItem question="Can I access the API?" answer="API access is available for Enterprise plans. Contact our sales team to discuss integration options and custom requirements." />
            <FAQItem question="What happens if I exceed my plan limits?" answer="We'll notify you when you're approaching your limits. You can upgrade anytime, or we'll pause additional lookups until your next billing cycle. No surprise charges." />
            <FAQItem question="How quickly will I receive alerts?" answer="PRO and Enterprise plans receive real-time alerts within minutes of a filing or change. Starter plans receive daily digest emails. Free plan includes basic email notifications." />
          </div>
        </section>

        {/* Pricing Preview */}
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
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

            <div className="bg-brand-mughal-green border-2 border-brand-mughal-green p-6 rounded-xl text-white relative">
              <div className="absolute top-4 right-4">
                <span className="text-xs bg-brand-pistachio text-brand-mughal-green px-2 py-1 rounded font-medium">Most Popular</span>
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

          <div className="text-center mt-8">
            <button
              onClick={() => onNavigate?.('pricing')}
              className="text-sm text-brand-mughal-green hover:text-brand-mughal-green-2 font-medium inline-flex items-center gap-2"
            >
              View detailed pricing
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="bg-brand-mughal-green rounded-2xl p-8 md:p-12 relative overflow-hidden">
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
          
          <div className="relative z-10 max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-semibold text-text-inverse mb-4" style={{ letterSpacing: '-0.5px' }}>
              Ready to protect your business?
            </h2>
            <p className="text-lg text-text-inverse-muted mb-8 max-w-2xl mx-auto">
              Join the waitlist to be notified when we launch. Early access for beta testers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleScrollToWaitlist}
                className="px-8 py-3 bg-white text-brand-mughal-green rounded-lg font-medium text-sm hover:bg-brand-paper transition-all duration-normal inline-flex items-center justify-center gap-2"
              >
                Join the waitlist
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={onViewDashboard}
                className="px-8 py-3 bg-white/10 text-white border border-white/20 rounded-lg font-medium text-sm hover:bg-white/20 transition-all duration-normal"
              >
                View product demo
              </button>
            </div>
            <div className="mt-8 flex items-center justify-center gap-6 text-sm text-text-inverse-muted">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                <span>Free plan available</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
