import React from 'react'
import SEO from '../components/SEO.jsx'
import { Check, Star, ArrowRight, Users, Shield, Clock, Lock, Calculator, Building2, FileText, TrendingUp, Bell, Target, Zap, BarChart3 } from 'lucide-react'

export default function PricingPage({ onNavigate }) {
  const [isYearly, setIsYearly] = React.useState(false)

  const handleGetStarted = () => {
    onNavigate?.('landing')
  }

  const pricingTiers = [
    {
      name: 'Free',
      monthlyPrice: 0,
      annualPrice: 0,
      description: 'Perfect for trying out MarketRisk',
      features: [
        '3 CUI lookups / month',
        'Basic credit checks',
        'Email support',
        'Mobile app access',
        'No credit card required'
      ],
      cta: 'Get started free',
      ctaVariant: 'outline',
      highlight: false
    },
    {
      name: 'Starter',
      monthlyPrice: 39,
      annualPrice: 312,
      description: 'Ideal for small portfolios',
      features: [
        'Everything in Free, plus:',
        '20 CUI lookups / month',
        '10 CUI watchlist',
        'Insolvency alerts',
        '5 PDF exports / month',
        '5 team users',
        'Priority email support'
      ],
      cta: 'Start Starter',
      ctaVariant: 'primary',
      highlight: false
    },
    {
      name: 'PRO',
      monthlyPrice: 99,
      annualPrice: 792,
      description: 'Best for active B2B sales teams',
      features: [
        'Everything in Starter, plus:',
        'Unlimited CUI lookups',
        '250 CUI watchlist',
        'Real-time alerts',
        'Court cases & tax debts',
        'Unlimited PDF exports',
        'Custom team users',
        'Priority 24/7 support',
        'Advanced analytics'
      ],
      cta: 'Start PRO',
      ctaVariant: 'primary',
      highlight: true
    },
    {
      name: 'Enterprise',
      monthlyPrice: null,
      annualPrice: null,
      description: 'For high volume and financial institutions',
      features: [
        'Everything in PRO, plus:',
        'Unlimited watchlist',
        'Admin access',
        'Full API integration',
        'Dedicated support',
        'Custom integrations',
        'SLA guarantees',
        'On-premise options',
        'White-label options'
      ],
      cta: 'Contact sales',
      ctaVariant: 'primary',
      highlight: false
    }
  ]

  const comparisonFeatures = [
    { feature: 'Monthly Price', free: '€0', starter: '€39', pro: '€99', enterprise: 'Custom' },
    { feature: 'Annual Price (20% off)', free: '€0', starter: '€312', pro: '€792', enterprise: 'Custom' },
    { feature: 'CUI Lookups / Month', free: '3', starter: '20', pro: 'Unlimited', enterprise: 'Unlimited' },
    { feature: 'CUI Watchlist', free: '—', starter: '10', pro: '250', enterprise: 'Unlimited' },
    { feature: 'Insolvency Alerts', free: '—', starter: '✓', pro: '✓', enterprise: '✓' },
    { feature: 'Real-time Alerts', free: '—', starter: '—', pro: '✓', enterprise: '✓' },
    { feature: 'Court Cases Monitoring', free: '—', starter: '—', pro: '✓', enterprise: '✓' },
    { feature: 'Tax Debts Monitoring', free: '—', starter: '—', pro: '✓', enterprise: '✓' },
    { feature: 'PDF Exports / Month', free: '—', starter: '5', pro: 'Unlimited', enterprise: 'Unlimited' },
    { feature: 'Team Users', free: '1', starter: '5', pro: 'Custom', enterprise: 'Unlimited' },
    { feature: 'Email Support', free: '✓', starter: '✓', pro: '✓', enterprise: '✓' },
    { feature: 'Priority Email Support', free: '—', starter: '✓', pro: '✓', enterprise: '✓' },
    { feature: '24/7 Priority Support', free: '—', starter: '—', pro: '✓', enterprise: '✓' },
    { feature: 'Dedicated Support', free: '—', starter: '—', pro: '—', enterprise: '✓' },
    { feature: 'Advanced Analytics', free: '—', starter: '—', pro: '✓', enterprise: '✓' },
    { feature: 'API Integration', free: '—', starter: '—', pro: '—', enterprise: '✓' },
    { feature: 'Custom Integrations', free: '—', starter: '—', pro: '—', enterprise: '✓' },
    { feature: 'SLA Guarantees', free: '—', starter: '—', pro: '—', enterprise: '✓' },
    { feature: 'On-premise Options', free: '—', starter: '—', pro: '—', enterprise: '✓' },
    { feature: 'White-label Options', free: '—', starter: '—', pro: '—', enterprise: '✓' },
    { feature: 'Admin Access', free: '—', starter: '—', pro: '—', enterprise: '✓' },
    { feature: 'Mobile App Access', free: '✓', starter: '✓', pro: '✓', enterprise: '✓' }
  ]

  const faqs = [
    {
      q: 'What happens if I exceed my plan limits?',
      a: 'We\'ll notify you when you\'re approaching limits. You can upgrade anytime, or we\'ll pause additional lookups until your next billing cycle. No surprise fees.'
    },
    {
      q: 'Can I change plans later?',
      a: 'Absolutely! Upgrade or downgrade anytime. Changes take effect immediately, and billing is prorated accordingly.'
    },
    {
      q: 'What payment methods do you accept?',
      a: 'We accept all major cards (Visa, Mastercard, American Express) and bank transfer for Enterprise plans. All payments are securely processed through Stripe.'
    },
    {
      q: 'Is there a setup fee?',
      a: 'No setup fees, ever. What you see is what you pay. No hidden costs, no surprises.'
    },
    {
      q: 'How does the money-back guarantee work?',
      a: 'If you\'re not satisfied with MarketRisk within the first 30 days, contact us and we\'ll issue a full refund. No questions asked, no hassle.'
    },
    {
      q: 'What kind of support do you offer?',
      a: 'All plans include email support. PRO and Enterprise plans receive priority support with faster response times. Enterprise customers also get dedicated account management.'
    }
  ]

  return (
    <>
      <SEO 
        title="Pricing - MarketRisk | Simple, Transparent Credit Risk Monitoring"
        description="Choose the perfect plan for your business. Free plan available. Starter from €39/month, PRO from €99/month. 30-day money-back guarantee. 24/7 support."
        keywords="pricing, credit risk monitoring pricing, Romanian SME pricing, risk management cost, credit monitoring plans"
      />
      
      <div className="space-y-12">
        {/* Prominent Hero Header */}
        <section className="bg-brand-mughal-green rounded-2xl p-8 md:p-12 relative overflow-hidden">
          {/* Decorative Background */}
          <div className="absolute inset-0 opacity-20">
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M 70% 70% Q 80% 75%, 85% 85% T 95% 95% Q 98% 98%, 100% 100%"
                stroke="#8ACA74"
                strokeWidth="25"
                strokeLinecap="round"
                fill="none"
                opacity="0.5"
              />
              <rect
                x="62%"
                y="-12%"
                width="360"
                height="220"
                rx="4"
                fill="none"
                stroke="rgba(220, 222, 197, 0.28)"
                strokeWidth="1"
              />
              <rect
                x="70%"
                y="62%"
                width="420"
                height="260"
                rx="4"
                fill="none"
                stroke="rgba(220, 222, 197, 0.28)"
                strokeWidth="1"
              />
            </svg>
          </div>

          <div className="relative z-10 max-w-4xl mx-auto text-center">
            <p className="text-text-inverse-muted text-sm mb-2 uppercase tracking-wide">Pricing</p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-text-inverse mb-6" style={{ letterSpacing: '-0.8px' }}>
              Simple, transparent pricing that scales with you
            </h1>
            <p className="text-text-inverse-muted text-lg md:text-xl mb-8 max-w-2xl mx-auto">
              No hidden fees. No "contact sales" walls. Choose the plan that fits your needs, and upgrade anytime.
            </p>
            
            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-text-inverse-muted">
              <div className="flex items-center gap-2">
                <Check size={16} className="text-brand-pistachio" />
                <span>30-day money-back guarantee</span>
              </div>
              <div className="flex items-center gap-2">
                <Check size={16} className="text-brand-pistachio" />
                <span>24/7 support</span>
              </div>
              <div className="flex items-center gap-2">
                <Check size={16} className="text-brand-pistachio" />
                <span>Secured payments</span>
              </div>
              <div className="flex items-center gap-2">
                <Check size={16} className="text-brand-pistachio" />
                <span>No credit card required for Free plan</span>
              </div>
            </div>
          </div>
        </section>

        {/* Social Proof - Scrolling Cards */}
        <section>
          <div className="text-center mb-6">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Users className="w-6 h-6 text-brand-mughal-green" />
              <h2 className="text-2xl md:text-3xl font-semibold text-text-primary" style={{ letterSpacing: '-0.5px' }}>
                Trusted by hundreds of accountants and practices
              </h2>
            </div>
            <p className="text-text-secondary text-lg max-w-2xl mx-auto">
              Join over 500+ Romanian businesses, accounting practices, and financial advisors who trust MarketRisk to protect their cashflow and make informed credit decisions.
            </p>
          </div>

          {/* Horizontal Scrolling Cards */}
          <div className="overflow-x-auto pb-4 -mx-12 px-12">
            <div className="flex gap-6 min-w-max">
              <div className="bg-white border border-border-subtle rounded-xl p-6 min-w-[200px] text-center hover:shadow-sm transition-all duration-normal">
                <div className="text-4xl font-bold text-brand-mughal-green mb-2">500+</div>
                <div className="text-sm text-text-secondary">Active Companies</div>
              </div>
              <div className="bg-white border border-border-subtle rounded-xl p-6 min-w-[200px] text-center hover:shadow-sm transition-all duration-normal">
                <div className="text-4xl font-bold text-brand-mughal-green mb-2">150+</div>
                <div className="text-sm text-text-secondary">Accounting Practices</div>
              </div>
              <div className="bg-white border border-border-subtle rounded-xl p-6 min-w-[200px] text-center hover:shadow-sm transition-all duration-normal">
                <div className="text-4xl font-bold text-brand-mughal-green mb-2">€2M+</div>
                <div className="text-sm text-text-secondary">Bad Debt Prevented</div>
              </div>
              <div className="bg-white border border-border-subtle rounded-xl p-6 min-w-[200px] text-center hover:shadow-sm transition-all duration-normal">
                <div className="text-4xl font-bold text-brand-mughal-green mb-2">99.9%</div>
                <div className="text-sm text-text-secondary">Uptime Guarantee</div>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Cards Section */}
        <section>
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 gap-4">
            <div>
              <p className="text-xs text-text-muted mb-2">Choose Your Plan</p>
              <h2 className="text-2xl font-semibold text-text-primary" style={{ letterSpacing: '-0.3px' }}>
                Plans that grow with your business
              </h2>
            </div>
            
            {/* Billing Toggle - Design System Pattern */}
            <div className="flex items-center gap-3 bg-surface-bone p-1.5 rounded-xl">
              <button
                type="button"
                onClick={() => setIsYearly(false)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-normal ${
                  !isYearly
                    ? 'bg-white text-text-primary shadow-sm'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                Monthly
              </button>
              <button
                type="button"
                onClick={() => setIsYearly(true)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-normal flex items-center gap-2 ${
                  isYearly
                    ? 'bg-white text-text-primary shadow-sm'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                Yearly
                <span className="text-xs bg-brand-mughal-green text-white px-2 py-0.5 rounded-pill">
                  2 months free
                </span>
              </button>
            </div>
          </div>

          {/* Pricing Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {pricingTiers.map((tier) => {
              const price = isYearly ? tier.annualPrice : tier.monthlyPrice
              const displayPrice = price === null ? 'Custom' : `€${price}`
              const period = price === null ? '' : isYearly ? '/year' : '/month'
              const monthlyEquivalent = isYearly && price !== null ? `€${Math.round(price / 12)}/mo` : null

              return (
                <PricingCard
                  key={tier.name}
                  highlight={tier.highlight}
                  name={tier.name}
                  price={displayPrice}
                  period={period}
                  monthlyEquivalent={monthlyEquivalent}
                  description={tier.description}
                  features={tier.features}
                  cta={tier.cta}
                  ctaVariant={tier.ctaVariant}
                  onCta={handleGetStarted}
                />
              )
            })}
          </div>

          {/* Trust Message */}
          <div className="mt-6 text-center">
            <p className="text-sm text-text-secondary">
              All plans include 24/7 support, bank-level security, and a 30-day money-back guarantee.
            </p>
          </div>
        </section>

        {/* Comprehensive Feature Comparison Table */}
        <section>
          <div className="mb-6">
            <p className="text-xs text-text-muted mb-2">Feature Comparison</p>
            <h2 className="text-2xl font-semibold text-text-primary" style={{ letterSpacing: '-0.3px' }}>
              Compare all features side by side
            </h2>
          </div>

          <div className="relative pt-4">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse bg-white rounded-xl border border-border-subtle">
                <thead>
                  <tr>
                    <th className="text-left p-4 bg-surface-paper border-b border-border-subtle text-sm font-semibold text-text-primary sticky left-0 z-10">Feature</th>
                    <th className="text-center p-4 bg-white border-b border-border-subtle text-sm font-semibold text-text-primary min-w-[100px]">Free</th>
                    <th className="text-center p-4 bg-white border-b border-border-subtle text-sm font-semibold text-text-primary min-w-[100px]">Starter</th>
                    <th className="text-center pt-8 pb-4 px-4 bg-brand-mughal-green border-b border-border-subtle text-sm font-semibold text-text-inverse relative">
                      <span
                        className="absolute -top-3 right-4 text-[11px] font-semibold bg-brand-pistachio text-brand-mughal-green px-3 py-1 rounded-full shadow-sm z-20"
                        style={{ whiteSpace: 'nowrap', display: 'inline-block', minWidth: 'max-content' }}
                      >
                        ★ Best Value
                      </span>
                      PRO
                    </th>
                    <th className="text-center p-4 bg-white border-b border-border-subtle text-sm font-semibold text-text-primary min-w-[100px]">Enterprise</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonFeatures.map((row, idx) => (
                    <tr key={idx} className="hover:bg-surface-paper transition-colors">
                      <td className="p-4 bg-surface-paper border-b border-border-subtle text-sm font-medium text-text-primary sticky left-0 z-10">{row.feature}</td>
                      <td className="p-4 bg-white border-b border-border-subtle text-center text-sm text-text-secondary">{row.free}</td>
                      <td className="p-4 bg-white border-b border-border-subtle text-center text-sm text-text-secondary">{row.starter}</td>
                      <td className="p-4 bg-brand-mughal-green border-b border-border-subtle text-center text-sm font-semibold text-text-inverse">{row.pro}</td>
                      <td className="p-4 bg-white border-b border-border-subtle text-center text-sm text-text-secondary">{row.enterprise}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td className="p-4 bg-surface-paper"></td>
                    <td className="p-4 bg-white text-center">
                      <button
                        type="button"
                        onClick={handleGetStarted}
                        className="px-6 py-3 bg-white border-2 border-brand-mughal-green text-brand-mughal-green rounded-lg font-medium text-sm hover:bg-surface-paper transition-all duration-normal"
                      >
                        Get started
                      </button>
                    </td>
                    <td className="p-4 bg-white text-center">
                      <button
                        type="button"
                        onClick={handleGetStarted}
                        className="px-6 py-3 bg-brand-mughal-green text-white rounded-lg font-medium text-sm hover:bg-brand-mughal-green-2 transition-all duration-normal"
                      >
                        Start Starter
                      </button>
                    </td>
                    <td className="p-4 bg-brand-mughal-green text-center">
                      <button
                        type="button"
                        onClick={handleGetStarted}
                        className="px-6 py-3 bg-white text-brand-mughal-green rounded-lg font-medium text-sm hover:shadow-sm transition-all duration-normal font-semibold"
                      >
                        Start PRO
                      </button>
                    </td>
                    <td className="p-4 bg-white text-center">
                      <button
                        type="button"
                        onClick={() => onNavigate?.('contact')}
                        className="px-6 py-3 bg-white border-2 border-brand-mughal-green text-brand-mughal-green rounded-lg font-medium text-sm hover:bg-surface-paper transition-all duration-normal"
                      >
                        Contact Sales
                      </button>
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </section>

        {/* Why Accountants Choose Us */}
        <section>
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Calculator className="w-8 h-8 text-brand-mughal-green" />
              <h2 className="text-2xl md:text-3xl font-semibold text-text-primary" style={{ letterSpacing: '-0.5px' }}>
                Why accountants choose MarketRisk
              </h2>
            </div>
            <p className="text-text-secondary text-lg max-w-2xl mx-auto">
              Built specifically for accounting practices in Romania. Simplify your workflow, protect your clients, and save hours every week.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <BenefitCard
              icon={Building2}
              title="Multi-client management"
              description="Monitor credit risk for dozens of clients in one unified dashboard. Organize by client, add notes, and generate reports instantly."
            />
            <BenefitCard
              icon={FileText}
              title="Audit-ready reports"
              description="Export professional PDF reports perfect for client meetings and audits. Includes all relevant data with one click."
            />
            <BenefitCard
              icon={TrendingUp}
              title="Prove your value"
              description="Show clients exactly how much bad debt you've helped them avoid. Quantify your advisory value with real numbers."
            />
            <BenefitCard
              icon={Bell}
              title="Early warning system"
              description="Get alerts before problems escalate. Insolvency procedures, court cases, and tax debts—all in real-time."
            />
            <BenefitCard
              icon={Users}
              title="Team collaboration"
              description="Share access with your team. Assign clients to team members, set permissions, and collaborate seamlessly."
            />
            <BenefitCard
              icon={Target}
              title="Built for Romania"
              description="Built specifically for Romanian business data: ANAF, court cases, insolvency procedures. No generic international solutions."
            />
          </div>
        </section>

        {/* ROI Calculator */}
        <section className="bg-brand-mughal-green rounded-2xl p-8 md:p-12 relative overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <rect
                x="6%"
                y="16%"
                width="420"
                height="260"
                rx="4"
                fill="none"
                stroke="rgba(220, 222, 197, 0.28)"
                strokeWidth="1"
              />
            </svg>
          </div>

          <div className="relative z-10 max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <TrendingUp className="w-12 h-12 text-brand-pistachio mx-auto mb-4" />
              <h2 className="text-2xl md:text-3xl font-semibold text-text-inverse mb-4" style={{ letterSpacing: '-0.5px' }}>
                Calculate your ROI
              </h2>
              <p className="text-text-inverse-muted text-lg">
                See how much MarketRisk can save for your practice
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 text-center">
                <div className="text-3xl font-bold text-brand-pistachio mb-2">12x</div>
                <div className="text-sm text-text-inverse-muted mb-4">Average ROI</div>
                <div className="text-xs text-text-inverse">
                  PRO plan customers save an average of €1,200/month in prevented bad debt
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 text-center">
                <div className="text-3xl font-bold text-brand-pistachio mb-2">15 hours</div>
                <div className="text-sm text-text-inverse-muted mb-4">Time saved/week</div>
                <div className="text-xs text-text-inverse">
                  Automate credit checks and monitoring instead of manual research
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 text-center">
                <div className="text-3xl font-bold text-brand-pistachio mb-2">€50,000+</div>
                <div className="text-sm text-text-inverse-muted mb-4">Average prevented</div>
                <div className="text-xs text-text-inverse">
                  Typical amount of bad debt prevented per client per year
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="bg-surface-paper rounded-2xl p-8 md:p-12">
          <div className="text-center mb-10">
            <div className="flex items-center justify-center gap-2 mb-3">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={24} className="text-brand-pistachio fill-brand-pistachio" />
              ))}
            </div>
            <h2 className="text-2xl md:text-3xl font-semibold text-text-primary mb-4" style={{ letterSpacing: '-0.5px' }}>
              Loved by accountants and businesses
            </h2>
            <p className="text-text-secondary text-lg">
              See what accounting practices and companies say about MarketRisk
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <TestimonialCard
              quote="MarketRisk saved us from a €50K bad debt. The early warning system caught an insolvency filing we would have missed."
              name="Maria Popescu"
              role="CFO, TechStart SRL"
            />
            <TestimonialCard
              quote="As an accounting practice, we manage credit risk for dozens of clients. MarketRisk's watchlist feature lets us track them all efficiently. Game changer!"
              name="Lucian Popescu"
              role="Senior Partner, Popescu & Associates"
            />
            <TestimonialCard
              quote="The ROI is incredible. We helped clients avoid over €200K in bad debt just this year. The PRO plan pays for itself in days."
              name="Mihai Constantinescu"
              role="Chief Accountant, FinanceAdvisors RO"
            />
          </div>
        </section>

        {/* Trust Badges */}
        <section>
          <div className="mb-6 text-center">
            <p className="text-xs text-text-muted mb-2">Why Choose MarketRisk</p>
            <h2 className="text-2xl font-semibold text-text-primary" style={{ letterSpacing: '-0.3px' }}>
              Your peace of mind is our priority
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <TrustBadge
              icon={Clock}
              title="24/7 Support"
              description="Round-the-clock assistance whenever you need it. Our team is always ready to help. Average response time under 2 hours."
            />
            <TrustBadge
              icon={Shield}
              title="Bank-level security"
              description="Your data is encrypted and protected with industry-leading security standards. GDPR compliant and SOC 2 certified."
            />
            <TrustBadge
              icon={Lock}
              title="Secured payments"
              description="All payments are securely processed through PCI-compliant payment gateways. Your financial data is never stored."
            />
            <TrustBadge
              icon={Users}
              title="Trusted by 500+ companies"
              description="Hundreds of accountants, practices, and businesses trust MarketRisk to protect their cashflow daily."
            />
            <TrustBadge
              icon={Star}
              title="99.9% Uptime SLA"
              description="Enterprise-level reliability. Your monitoring never stops, ensuring you never miss a critical alert."
            />
            <TrustBadge
              icon={Check}
              title="30-day money-back guarantee"
              description="Not satisfied? Get your money back within 30 days, no questions asked. We're confident you'll love it."
            />
          </div>
        </section>

        {/* Value Propositions */}
        <section>
          <div className="mb-6">
            <p className="text-xs text-text-muted mb-2">Value</p>
            <h2 className="text-2xl font-semibold text-text-primary" style={{ letterSpacing: '-0.3px' }}>
              More than monitoring—complete risk intelligence
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ValueProp
              icon={Zap}
              title="Real-time monitoring"
              description="Get instant alerts when insolvency procedures, court cases, or tax debts appear. Never miss a critical update."
            />
            <ValueProp
              icon={Users}
              title="Team collaboration"
              description="Share watchlists with your team. Set permissions, add notes, and keep everyone informed."
            />
            <ValueProp
              icon={BarChart3}
              title="Comprehensive reports"
              description="Export detailed PDF reports for stakeholders, audits, or internal documentation."
            />
            <ValueProp
              icon={Bell}
              title="Smart alerts"
              description="Customize alert preferences. Get notifications via email, SMS, or in-app notifications."
            />
          </div>
        </section>

        {/* FAQs */}
        <section>
          <div className="mb-6">
            <p className="text-xs text-text-muted mb-2">FAQs</p>
            <h2 className="text-2xl font-semibold text-text-primary" style={{ letterSpacing: '-0.3px' }}>
              Everything you need to know
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <details key={idx} className="bg-white border border-border-subtle rounded-xl p-4 group">
                <summary className="cursor-pointer text-sm font-medium text-text-primary flex items-center justify-between">
                  <span>{faq.q}</span>
                  <ArrowRight size={16} className="text-text-muted transform transition-transform duration-normal group-open:rotate-90" />
                </summary>
                <p className="text-sm text-text-secondary mt-3">{faq.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* Final CTA */}
        <section className="bg-brand-mughal-green rounded-2xl p-8 md:p-12 relative overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <rect
                x="6%"
                y="16%"
                width="420"
                height="260"
                rx="4"
                fill="none"
                stroke="rgba(220, 222, 197, 0.28)"
                strokeWidth="1"
              />
            </svg>
          </div>
          <div className="relative z-10 max-w-2xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-semibold text-text-inverse mb-4" style={{ letterSpacing: '-0.5px' }}>
              Ready to protect your business?
            </h2>
            <p className="text-text-inverse-muted text-lg mb-6">
              Start with our Free plan—no credit card required. Upgrade anytime when you're ready.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                type="button"
                onClick={handleGetStarted}
                className="px-6 py-3 bg-white text-brand-mughal-green rounded-lg font-medium text-sm hover:shadow-sm transition-all duration-normal"
              >
                Start free trial
              </button>
              <button
                type="button"
                onClick={() => onNavigate?.('contact')}
                className="px-6 py-3 bg-white/10 text-white border border-white/20 rounded-lg font-medium text-sm hover:bg-white/20 transition-all duration-normal"
              >
                Talk to sales
              </button>
            </div>
            <p className="text-text-inverse-muted text-xs mt-4">
              30-day money-back guarantee • 24/7 support • Bank-level security
            </p>
          </div>
        </section>
      </div>
    </>
  )
}

function PricingCard({ highlight, name, price, period, monthlyEquivalent, description, features, cta, ctaVariant, onCta }) {
  return (
    <div
      className={`relative p-6 rounded-xl border flex flex-col h-full transition-all duration-normal ${
        highlight
          ? 'bg-brand-mughal-green text-white border-border-inverse-subtle'
          : 'bg-white border-border-subtle hover:shadow-sm'
      }`}
    >
      {/* Most Popular Badge - Design System Pattern */}
      {highlight && (
        <span
          className="absolute -top-3 right-4 text-[11px] font-semibold bg-brand-pistachio text-brand-mughal-green px-3 py-1 rounded-full shadow-sm"
          style={{ whiteSpace: 'nowrap', display: 'inline-block', minWidth: 'max-content' }}
        >
          ★ Most popular
        </span>
      )}

      {/* Plan Name & Description */}
      <div className="mb-4">
        <p className={`text-sm font-medium ${highlight ? 'text-text-inverse' : 'text-text-primary'}`}>
          {name}
        </p>
        <p className={`text-xs ${highlight ? 'text-text-inverse-muted' : 'text-text-muted'}`}>
          {description}
        </p>
      </div>

      {/* Pricing Display - Design System Pattern */}
      <div className="mb-4">
        <div className="flex items-baseline gap-2">
          <span className={`text-3xl font-light ${highlight ? 'text-text-inverse' : 'text-text-primary'}`}>
            {price}
          </span>
          {period && (
            <span className={`text-xs ${highlight ? 'text-text-inverse-muted' : 'text-text-muted'}`}>
              {period}
            </span>
          )}
        </div>
        {monthlyEquivalent && (
          <p className={`text-xs mt-1 ${highlight ? 'text-text-inverse-muted' : 'text-text-muted'}`}>
            {monthlyEquivalent} billed annually
          </p>
        )}
      </div>

      {/* Feature List - Design System Pattern */}
      <ul className="space-y-2 mb-6 flex-grow">
        {features.map((feature, idx) => {
          const isHeader = feature.includes('Everything in')
          return (
            <li
              key={idx}
              className={`text-sm flex items-start gap-2 ${
                highlight
                  ? isHeader
                    ? 'text-text-inverse font-semibold'
                    : 'text-text-inverse-muted'
                  : isHeader
                  ? 'text-text-primary font-semibold'
                  : 'text-text-secondary'
              }`}
            >
              <Check
                size={16}
                className={`mt-[2px] flex-shrink-0 ${
                  highlight ? 'text-brand-pistachio' : 'text-brand-mughal-green'
                }`}
              />
              <span>{feature}</span>
            </li>
          )
        })}
      </ul>

      {/* CTA Button - Design System Pattern */}
      <button
        type="button"
        onClick={onCta}
        className={`w-full px-6 py-3 rounded-lg font-medium text-sm transition-all duration-normal mt-auto ${
          ctaVariant === 'outline'
            ? 'bg-white border-2 border-brand-mughal-green text-brand-mughal-green hover:bg-surface-paper hover:shadow-sm'
            : highlight
            ? 'bg-white text-brand-mughal-green hover:shadow-sm'
            : 'bg-brand-mughal-green text-white hover:bg-brand-mughal-green-2'
        }`}
      >
        {cta}
      </button>
    </div>
  )
}

function BenefitCard({ icon: Icon, title, description }) {
  return (
    <div className="bg-white border border-border-subtle p-6 rounded-xl hover:shadow-sm transition-all duration-normal">
      <div className="w-12 h-12 bg-brand-pistachio/10 rounded-lg flex items-center justify-center mb-4">
        <Icon className="w-6 h-6 text-brand-mughal-green" />
      </div>
      <h3 className="text-lg font-medium text-text-primary mb-2">{title}</h3>
      <p className="text-sm text-text-secondary">{description}</p>
    </div>
  )
}

function TestimonialCard({ quote, name, role }) {
  return (
    <div className="bg-white border border-border-subtle rounded-xl p-6 hover:shadow-sm transition-all duration-normal">
      <div className="flex items-center gap-1 mb-3">
        {[...Array(5)].map((_, i) => (
          <Star key={i} size={14} className="text-brand-pistachio fill-brand-pistachio" />
        ))}
      </div>
      <p className="text-text-secondary text-sm mb-4 italic">&ldquo;{quote}&rdquo;</p>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-surface-bone rounded-lg flex items-center justify-center flex-shrink-0">
          <span className="text-sm font-medium text-text-primary">
            {name.split(' ').map(n => n[0]).join('')}
          </span>
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium text-text-primary">{name}</p>
          <p className="text-xs text-text-muted">{role}</p>
        </div>
      </div>
    </div>
  )
}

function TrustBadge({ icon: Icon, title, description }) {
  return (
    <div className="bg-white border border-border-subtle p-6 rounded-xl hover:shadow-sm transition-all duration-normal text-center">
      <div className="w-12 h-12 bg-surface-bone rounded-lg flex items-center justify-center mx-auto mb-4">
        <Icon size={24} className="text-brand-mughal-green" />
      </div>
      <h3 className="text-lg font-medium text-text-primary mb-2">{title}</h3>
      <p className="text-sm text-text-secondary">{description}</p>
    </div>
  )
}

function ValueProp({ icon: Icon, title, description }) {
  return (
    <div className="bg-white border border-border-subtle p-6 rounded-xl hover:shadow-sm transition-all duration-normal">
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 bg-surface-bone flex items-center justify-center rounded-lg flex-shrink-0">
          <Icon size={20} className="text-brand-mughal-green" />
        </div>
        <div className="min-w-0">
          <h3 className="text-lg font-medium text-text-primary mb-2">{title}</h3>
          <p className="text-sm text-text-secondary">{description}</p>
        </div>
      </div>
    </div>
  )
}
