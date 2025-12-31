import React from 'react'
import SEO from '../components/SEO.jsx'
import { Check, Shield, Clock, RefreshCw, Lock, Star, ArrowRight, Zap, Users, BarChart3, FileText, Bell, TrendingUp, Award, Building2, Calculator, Target, CheckCircle2 } from 'lucide-react'

export default function PricingPage({ onNavigate }) {
  const [isYearly, setIsYearly] = React.useState(false)

  const handleGetStarted = () => {
    onNavigate?.('landing')
  }

  const testimonials = [
    {
      quote: "marketrisk saved us from a €50K bad debt. The early warning system caught an insolvency filing we would have missed.",
      name: "Maria Popescu",
      role: "CFO, TechStart SRL",
      rating: 5,
      company: "TechStart SRL",
      category: "business"
    },
    {
      quote: "The 24/7 monitoring gives us peace of mind. We know immediately when something changes with our partners.",
      name: "Alexandru Ionescu",
      role: "Risk Manager, FinanceCorp",
      rating: 5,
      company: "FinanceCorp",
      category: "business"
    },
    {
      quote: "Best investment we made this year. The PRO plan pays for itself by preventing just one bad debt.",
      name: "Elena Radu",
      role: "Operations Director, RetailGroup",
      rating: 5,
      company: "RetailGroup",
      category: "business"
    },
    {
      quote: "Simple, transparent pricing. No hidden fees, no surprises. Exactly what we needed.",
      name: "Cristian Moldovan",
      role: "CEO, ServicePro",
      rating: 5,
      company: "ServicePro",
      category: "business"
    },
    {
      quote: "The support team is incredible. They helped us set up our watchlist and answered all our questions within hours.",
      name: "Andreea Stan",
      role: "Finance Director, ManufacturingPlus",
      rating: 5,
      company: "ManufacturingPlus",
      category: "business"
    },
    {
      quote: "We tried other solutions, but marketrisk is the only one built specifically for Romanian businesses. It shows.",
      name: "Dragos Constantinescu",
      role: "Head of Credit, BankPartners",
      rating: 5,
      company: "BankPartners",
      category: "business"
    },
    {
      quote: "As an accounting practice, we manage credit risk for dozens of clients. marketrisk lets us monitor all of them in one place. Game changer!",
      name: "Lucian Popescu",
      role: "Senior Partner, Popescu & Associates",
      rating: 5,
      company: "Popescu & Associates",
      category: "accountant"
    },
    {
      quote: "We recommend marketrisk to all our clients. The export reports are perfect for audits, and the alerts save us hours of manual checking.",
      name: "Ioana Georgescu",
      role: "Managing Partner, Georgescu Accounting Group",
      rating: 5,
      company: "Georgescu Accounting Group",
      category: "accountant"
    },
    {
      quote: "The ROI is incredible. We've helped clients avoid over €200K in bad debt this year alone. The PRO plan pays for itself in days.",
      name: "Mihai Constantinescu",
      role: "Lead Accountant, FinanceAdvisors RO",
      rating: 5,
      company: "FinanceAdvisors RO",
      category: "accountant"
    },
    {
      quote: "Finally, a tool built for Romanian accounting practices. The ANAF and court case monitoring alone is worth the subscription.",
      name: "Ana Dumitrescu",
      role: "CFO Services Director, BusinessConsult",
      rating: 5,
      company: "BusinessConsult",
      category: "accountant"
    },
    {
      quote: "Our practice manages risk for 150+ clients. marketrisk's watchlist feature lets us track them all efficiently. Best decision we made.",
      name: "Radu Ionescu",
      role: "Partner, Ionescu & Partners",
      rating: 5,
      company: "Ionescu & Partners",
      category: "accountant"
    },
    {
      quote: "The client reporting features are exceptional. We export PDFs directly for client meetings. Professional and comprehensive every time.",
      name: "Carmen Stoica",
      role: "Senior Accountant, Stoica Financial Services",
      rating: 5,
      company: "Stoica Financial Services",
      category: "accountant"
    }
  ]

  const trustBadges = [
    {
      icon: Clock,
      title: "24/7 Support",
      description: "Round-the-clock assistance whenever you need it. Our team is always ready to help. Average response time under 2 hours."
    },
    {
      icon: RefreshCw,
      title: "30-Day Money-Back Guarantee",
      description: "Not satisfied? Get a full refund within 30 days, no questions asked. We're confident you'll love it."
    },
    {
      icon: Shield,
      title: "Bank-Level Security",
      description: "Your data is encrypted and protected with industry-leading security standards. GDPR compliant and SOC 2 certified."
    },
    {
      icon: Lock,
      title: "Secured Payments",
      description: "All payments are processed securely through PCI-compliant payment gateways. Your financial data is never stored."
    },
    {
      icon: Users,
      title: "Trusted by 500+ Companies",
      description: "Hundreds of accountants, practices, and businesses trust marketrisk to protect their cashflow daily."
    },
    {
      icon: Award,
      title: "99.9% Uptime SLA",
      description: "Enterprise-grade reliability. Your monitoring never stops, ensuring you never miss a critical alert."
    }
  ]

  const valueProps = [
    {
      icon: Zap,
      title: "Real-Time Monitoring",
      description: "Get instant alerts when insolvency filings, court cases, or tax debts appear. Never miss a critical update."
    },
    {
      icon: Users,
      title: "Team Collaboration",
      description: "Share watchlists with your team. Set permissions, add notes, and keep everyone informed."
    },
    {
      icon: BarChart3,
      title: "Comprehensive Reports",
      description: "Export detailed PDF reports for stakeholders, audits, or internal documentation."
    },
    {
      icon: Bell,
      title: "Smart Alerts",
      description: "Customize alert preferences. Get notified via email, SMS, or in-app notifications."
    }
  ]

  const faqs = [
    {
      q: "What happens if I exceed my plan limits?",
      a: "We'll notify you when you're approaching your limits. You can upgrade anytime, or we'll pause additional lookups until your next billing cycle. No surprise charges."
    },
    {
      q: "Can I change plans later?",
      a: "Absolutely! Upgrade or downgrade at any time. Changes take effect immediately, and we'll prorate your billing accordingly."
    },
    {
      q: "What payment methods do you accept?",
      a: "We accept all major credit cards (Visa, Mastercard, American Express) and bank transfers for Enterprise plans. All payments are processed securely through Stripe."
    },
    {
      q: "Is there a setup fee?",
      a: "No setup fees, ever. What you see is what you pay. No hidden costs, no surprises."
    },
    {
      q: "How does the money-back guarantee work?",
      a: "If you're not satisfied with marketrisk within the first 30 days, contact us and we'll issue a full refund. No questions asked, no hassle."
    },
    {
      q: "What kind of support do you offer?",
      a: "All plans include email support. PRO and Enterprise plans get priority support with faster response times. Enterprise customers also get dedicated account management."
    },
    {
      q: "Can I try before I buy?",
      a: "Yes! Our Free plan lets you try 3 CUI lookups per month at no cost. No credit card required."
    },
    {
      q: "How secure is my data?",
      a: "We use bank-level encryption, regular security audits, and comply with GDPR. Your data is stored securely in EU data centers and never shared with third parties."
    },
    {
      q: "What happens to my data if I cancel?",
      a: "You can export all your data at any time. After cancellation, we'll keep your data for 30 days, then permanently delete it unless you request earlier deletion."
    },
    {
      q: "Do you offer discounts for annual plans?",
      a: "Yes! Annual plans save you 2 months compared to monthly billing. That's a 16.7% discount."
    }
  ]

  return (
    <>
      <SEO 
        title="Pricing - marketrisk | Simple, Transparent Credit Risk Monitoring"
        description="Choose the perfect plan for your business. Free plan available. Starter from €39/month, PRO from €99/month. 30-day money-back guarantee. 24/7 support."
        keywords="pricing, credit risk monitoring pricing, Romanian SME pricing, risk management cost, credit monitoring plans"
      />
      
      <div className="space-y-12">
        {/* Hero Section */}
        <section className="text-center">
          <div className="max-w-3xl mx-auto">
            <p className="text-xs text-text-muted mb-2 uppercase tracking-wide">Pricing</p>
            <h1 className="text-4xl md:text-5xl font-semibold text-text-primary mb-4" style={{ letterSpacing: '-0.8px' }}>
              Simple, transparent pricing that scales with you
            </h1>
            <p className="text-lg text-text-secondary mb-8">
              No hidden fees. No "contact sales" walls. Choose the plan that fits your needs, and upgrade anytime.
            </p>
            
            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-text-secondary mb-8">
              <div className="flex items-center gap-2">
                <Check size={16} className="text-brand-mughal-green" />
                <span>30-day money-back guarantee</span>
              </div>
              <div className="flex items-center gap-2">
                <Check size={16} className="text-brand-mughal-green" />
                <span>24/7 support</span>
              </div>
              <div className="flex items-center gap-2">
                <Check size={16} className="text-brand-mughal-green" />
                <span>Secured payments</span>
              </div>
              <div className="flex items-center gap-2">
                <Check size={16} className="text-brand-mughal-green" />
                <span>No credit card required for Free plan</span>
              </div>
            </div>
          </div>
        </section>

        {/* Social Proof - Trusted By */}
        <section className="bg-surface-paper rounded-2xl p-8 md:p-12">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Users className="w-6 h-6 text-brand-mughal-green" />
              <h2 className="text-2xl md:text-3xl font-semibold text-text-primary" style={{ letterSpacing: '-0.5px' }}>
                Trusted by hundreds of Accountants and Practices
              </h2>
            </div>
            <p className="text-text-secondary text-lg max-w-2xl mx-auto">
              Join over 500+ Romanian businesses, accounting practices, and financial advisors who trust marketrisk to protect their cashflow and make informed credit decisions.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-10">
            <div className="text-center">
              <div className="text-4xl font-bold text-brand-mughal-green mb-2">500+</div>
              <div className="text-sm text-text-secondary">Active Companies</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-brand-mughal-green mb-2">150+</div>
              <div className="text-sm text-text-secondary">Accounting Practices</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-brand-mughal-green mb-2">€2M+</div>
              <div className="text-sm text-text-secondary">Bad Debt Prevented</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-brand-mughal-green mb-2">99.9%</div>
              <div className="text-sm text-text-secondary">Uptime Guarantee</div>
            </div>
          </div>
        </section>

        {/* Pricing Cards */}
        <section>
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 gap-4">
            <div>
              <p className="text-xs text-text-muted mb-2">Choose Your Plan</p>
              <h2 className="text-2xl font-semibold text-text-primary" style={{ letterSpacing: '-0.3px' }}>
                Plans that grow with your business
              </h2>
            </div>
            
            {/* Billing Toggle */}
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
                <span className="text-xs bg-brand-mughal-green text-white px-2 py-0.5 rounded">
                  2 months free
                </span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <PricingCard
              name="Free"
              price="€0"
              period=""
              description="Perfect for trying out marketrisk"
              features={[
                '3 CUI lookups / month',
                'Basic credit checks',
                'Email support',
                'Mobile app access',
                'No credit card required'
              ]}
              cta="Get started free"
              onCta={handleGetStarted}
            />
            <PricingCard
              name="Starter"
              price={isYearly ? '€390' : '€39'}
              period={isYearly ? 'per year' : 'per month'}
              description="Ideal for small portfolios"
              features={[
                '20 CUI lookups / month',
                '10 CUI watchlist',
                'Insolvency alerts',
                '5 PDF exports / month',
                '5 team users',
                'Priority email support'
              ]}
              cta="Start Starter"
              onCta={handleGetStarted}
            />
            <PricingCard
              highlight
              name="PRO"
              price={isYearly ? '€990' : '€99'}
              period={isYearly ? 'per year' : 'per month'}
              description="Best for active B2B sales teams"
              features={[
                'Unlimited CUI lookups',
                '250 CUI watchlist',
                'Real-time alerts',
                'Court cases & tax debts',
                'Unlimited PDF exports',
                'Custom team users',
                'Priority support',
                'Advanced analytics'
              ]}
              cta="Start PRO"
              onCta={handleGetStarted}
            />
            <PricingCard
              name="Enterprise"
              price="Custom"
              period=""
              description="For high volume and financial institutions"
              features={[
                'Everything in PRO',
                'Unlimited watchlist',
                'Admin access',
                'Full API integration',
                'Dedicated support',
                'Custom integrations',
                'SLA guarantees',
                'On-premise options'
              ]}
              cta="Contact sales"
              onCta={handleGetStarted}
            />
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-text-secondary">
              All plans include 24/7 support, bank-level security, and a 30-day money-back guarantee.
            </p>
          </div>
        </section>

        {/* Why Accountants Choose Us */}
        <section>
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Calculator className="w-8 h-8 text-brand-mughal-green" />
              <h2 className="text-3xl md:text-4xl font-semibold text-text-primary" style={{ letterSpacing: '-0.5px' }}>
                Why Accountants Choose marketrisk
              </h2>
            </div>
            <p className="text-text-secondary text-lg max-w-2xl mx-auto">
              Built specifically for Romanian accounting practices. Streamline your workflow, protect your clients, and save hours every week.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white border border-border-subtle p-6 rounded-xl hover:shadow-sm transition-all duration-normal">
              <div className="w-12 h-12 bg-brand-pistachio/10 rounded-lg flex items-center justify-center mb-4">
                <Building2 className="w-6 h-6 text-brand-mughal-green" />
              </div>
              <h3 className="text-lg font-medium text-text-primary mb-2">Multi-Client Management</h3>
              <p className="text-sm text-text-secondary">
                Monitor credit risk for dozens of clients in one unified dashboard. Organize by client, add notes, and generate reports instantly.
              </p>
            </div>

            <div className="bg-white border border-border-subtle p-6 rounded-xl hover:shadow-sm transition-all duration-normal">
              <div className="w-12 h-12 bg-brand-pistachio/10 rounded-lg flex items-center justify-center mb-4">
                <FileText className="w-6 h-6 text-brand-mughal-green" />
              </div>
              <h3 className="text-lg font-medium text-text-primary mb-2">Audit-Ready Reports</h3>
              <p className="text-sm text-text-secondary">
                Export professional PDF reports perfect for client meetings and audits. Include all relevant data with one click.
              </p>
            </div>

            <div className="bg-white border border-border-subtle p-6 rounded-xl hover:shadow-sm transition-all duration-normal">
              <div className="w-12 h-12 bg-brand-pistachio/10 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-brand-mughal-green" />
              </div>
              <h3 className="text-lg font-medium text-text-primary mb-2">Prove Your Value</h3>
              <p className="text-sm text-text-secondary">
                Show clients exactly how much bad debt you've helped them avoid. Quantify your advisory value with real numbers.
              </p>
            </div>

            <div className="bg-white border border-border-subtle p-6 rounded-xl hover:shadow-sm transition-all duration-normal">
              <div className="w-12 h-12 bg-brand-pistachio/10 rounded-lg flex items-center justify-center mb-4">
                <Bell className="w-6 h-6 text-brand-mughal-green" />
              </div>
              <h3 className="text-lg font-medium text-text-primary mb-2">Early Warning System</h3>
              <p className="text-sm text-text-secondary">
                Get alerts before problems escalate. Insolvency filings, court cases, and tax debts—all in real-time.
              </p>
            </div>

            <div className="bg-white border border-border-subtle p-6 rounded-xl hover:shadow-sm transition-all duration-normal">
              <div className="w-12 h-12 bg-brand-pistachio/10 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-brand-mughal-green" />
              </div>
              <h3 className="text-lg font-medium text-text-primary mb-2">Team Collaboration</h3>
              <p className="text-sm text-text-secondary">
                Share access with your team. Assign clients to team members, set permissions, and collaborate seamlessly.
              </p>
            </div>

            <div className="bg-white border border-border-subtle p-6 rounded-xl hover:shadow-sm transition-all duration-normal">
              <div className="w-12 h-12 bg-brand-pistachio/10 rounded-lg flex items-center justify-center mb-4">
                <Target className="w-6 h-6 text-brand-mughal-green" />
              </div>
              <h3 className="text-lg font-medium text-text-primary mb-2">Romanian-Focused</h3>
              <p className="text-sm text-text-secondary">
                Built specifically for Romanian business data: ANAF, court cases, insolvency filings. No generic international solutions.
              </p>
            </div>
          </div>
        </section>

        {/* ROI Calculator / Value Section */}
        <section className="bg-brand-mughal-green rounded-2xl p-8 md:p-12 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
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
          
          <div className="relative z-10 max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <TrendingUp className="w-12 h-12 text-brand-pistachio mx-auto mb-4" />
              <h2 className="text-3xl md:text-4xl font-semibold text-text-inverse mb-4" style={{ letterSpacing: '-0.5px' }}>
                Calculate Your ROI
              </h2>
              <p className="text-text-inverse-muted text-lg">
                See how much marketrisk can save your practice
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
                <div className="text-3xl font-bold text-brand-pistachio mb-2">15 hrs</div>
                <div className="text-sm text-text-inverse-muted mb-4">Time Saved/Week</div>
                <div className="text-xs text-text-inverse">
                  Automate credit checks and monitoring instead of manual research
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 text-center">
                <div className="text-3xl font-bold text-brand-pistachio mb-2">€50K+</div>
                <div className="text-sm text-text-inverse-muted mb-4">Average Prevented</div>
                <div className="text-xs text-text-inverse">
                  Typical amount of bad debt prevented per customer per year
                </div>
              </div>
            </div>

            <div className="mt-10 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <CheckCircle2 className="w-6 h-6 text-brand-pistachio flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-lg font-semibold text-text-inverse mb-2">Real Example</h3>
                  <p className="text-sm text-text-inverse-muted">
                    A Bucharest accounting practice with 80 clients uses marketrisk PRO (€99/month) to monitor all their clients' 
                    suppliers and customers. In the first quarter, they prevented €45,000 in bad debt by catching early insolvency 
                    warnings. That's a 150x ROI—and that's just one quarter.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Reviews/Testimonials - Prominently Displayed */}
        <section className="bg-surface-paper rounded-2xl p-8 md:p-12">
          <div className="text-center mb-10">
            <div className="flex items-center justify-center gap-2 mb-3">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={24} className="text-brand-pistachio fill-brand-pistachio" />
              ))}
            </div>
            <h2 className="text-3xl md:text-4xl font-semibold text-text-primary mb-4" style={{ letterSpacing: '-0.5px' }}>
              Loved by Accountants and Businesses
            </h2>
            <p className="text-text-secondary text-lg">
              See what accounting practices and companies say about marketrisk
            </p>
          </div>

          <div className="space-y-8">
            {/* Accountant Testimonials */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <Calculator className="w-6 h-6 text-brand-mughal-green" />
                <h3 className="text-xl font-semibold text-text-primary">From Accounting Practices</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {testimonials.filter(t => t.category === 'accountant').map((testimonial, idx) => (
                  <div key={idx} className="bg-white border border-border-subtle rounded-xl p-6 hover:shadow-sm transition-all duration-normal">
                    <div className="flex items-center gap-1 mb-3">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} size={14} className="text-brand-pistachio fill-brand-pistachio" />
                      ))}
                    </div>
                    <p className="text-text-secondary text-sm mb-4 italic">"{testimonial.quote}"</p>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-surface-bone rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-medium text-text-primary">
                          {testimonial.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-text-primary">{testimonial.name}</p>
                        <p className="text-xs text-text-muted">{testimonial.role}</p>
                        <p className="text-xs text-text-muted">{testimonial.company}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Business Testimonials */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <Building2 className="w-6 h-6 text-brand-mughal-green" />
                <h3 className="text-xl font-semibold text-text-primary">From Businesses</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {testimonials.filter(t => t.category === 'business').map((testimonial, idx) => (
                  <div key={idx} className="bg-white border border-border-subtle rounded-xl p-6 hover:shadow-sm transition-all duration-normal">
                    <div className="flex items-center gap-1 mb-3">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} size={14} className="text-brand-pistachio fill-brand-pistachio" />
                      ))}
                    </div>
                    <p className="text-text-secondary text-sm mb-4 italic">"{testimonial.quote}"</p>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-surface-bone rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-medium text-text-primary">
                          {testimonial.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-text-primary">{testimonial.name}</p>
                        <p className="text-xs text-text-muted">{testimonial.role}</p>
                        <p className="text-xs text-text-muted">{testimonial.company}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Trust Badges */}
        <section>
          <div className="mb-6 text-center">
            <p className="text-xs text-text-muted mb-2">Why Choose marketrisk</p>
            <h2 className="text-2xl font-semibold text-text-primary" style={{ letterSpacing: '-0.3px' }}>
              Your peace of mind is our priority
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trustBadges.map((badge, idx) => (
              <div key={idx} className="bg-white border border-border-subtle p-6 rounded-xl hover:shadow-sm transition-all duration-normal text-center">
                <div className="w-12 h-12 bg-surface-bone rounded-lg flex items-center justify-center mx-auto mb-4">
                  <badge.icon size={24} className="text-brand-mughal-green" />
                </div>
                <h3 className="text-lg font-medium text-text-primary mb-2">{badge.title}</h3>
                <p className="text-sm text-text-secondary">{badge.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Value Proposition */}
        <section>
          <div className="mb-6">
            <p className="text-xs text-text-muted mb-2">Value</p>
            <h2 className="text-2xl font-semibold text-text-primary" style={{ letterSpacing: '-0.3px' }}>
              More than just monitoring—complete risk intelligence
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {valueProps.map((prop, idx) => (
              <div key={idx} className="bg-white border border-border-subtle p-6 rounded-xl hover:shadow-sm transition-all duration-normal">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-surface-bone flex items-center justify-center rounded-lg flex-shrink-0">
                    <prop.icon size={20} className="text-brand-mughal-green" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-lg font-medium text-text-primary mb-2">{prop.title}</h3>
                    <p className="text-sm text-text-secondary">{prop.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Feature Comparison Table */}
        <section>
          <div className="mb-6">
            <p className="text-xs text-text-muted mb-2">Feature Comparison</p>
            <h2 className="text-2xl font-semibold text-text-primary" style={{ letterSpacing: '-0.3px' }}>
              Compare all features side by side
            </h2>
          </div>

          <div className="overflow-x-auto overflow-y-visible">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="text-left p-4 bg-surface-paper border-b border-border-subtle text-sm font-semibold text-text-primary">Feature</th>
                  <th className="text-center p-4 bg-white border-b border-border-subtle text-sm font-semibold text-text-primary">Free</th>
                  <th className="text-center p-4 bg-white border-b border-border-subtle text-sm font-semibold text-text-primary">Starter</th>
                  <th className="text-center pt-8 pb-4 px-4 bg-brand-mughal-green border-b border-border-subtle text-sm font-semibold text-text-inverse relative overflow-visible">
                    <span 
                      className="absolute -top-3 right-4 text-[11px] font-semibold bg-brand-pistachio text-brand-mughal-green px-3 py-1 rounded-full shadow-sm z-10"
                      style={{ whiteSpace: 'nowrap', display: 'inline-block', minWidth: 'max-content' }}
                    >
                      ★ Best Value
                    </span>
                    PRO
                  </th>
                  <th className="text-center p-4 bg-white border-b border-border-subtle text-sm font-semibold text-text-primary">Enterprise</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-4 bg-surface-paper border-b border-border-subtle text-sm text-text-primary font-medium">Monthly Price</td>
                  <td className="p-4 bg-white border-b border-border-subtle text-center text-sm text-text-primary">€0</td>
                  <td className="p-4 bg-white border-b border-border-subtle text-center text-sm text-text-primary">€39</td>
                  <td className="p-4 bg-brand-mughal-green border-b border-border-subtle text-center text-sm text-text-inverse font-semibold">€99</td>
                  <td className="p-4 bg-white border-b border-border-subtle text-center text-sm text-text-primary">Custom</td>
                </tr>
                <tr>
                  <td className="p-4 bg-surface-paper border-b border-border-subtle text-sm text-text-primary font-medium">CUI Credit Lookups</td>
                  <td className="p-4 bg-white border-b border-border-subtle text-center text-sm text-text-secondary">3 / month</td>
                  <td className="p-4 bg-white border-b border-border-subtle text-center text-sm text-text-secondary">20 / month</td>
                  <td className="p-4 bg-brand-mughal-green border-b border-border-subtle text-center text-sm text-text-inverse-muted">Unlimited</td>
                  <td className="p-4 bg-white border-b border-border-subtle text-center text-sm text-text-secondary">Unlimited</td>
                </tr>
                <tr>
                  <td className="p-4 bg-surface-paper border-b border-border-subtle text-sm text-text-primary font-medium">Monitoring (Watchlist)</td>
                  <td className="p-4 bg-white border-b border-border-subtle text-center text-sm text-text-muted">—</td>
                  <td className="p-4 bg-white border-b border-border-subtle text-center text-sm text-text-secondary">10 CUIs</td>
                  <td className="p-4 bg-brand-mughal-green border-b border-border-subtle text-center text-sm text-text-inverse-muted">250 CUIs</td>
                  <td className="p-4 bg-white border-b border-border-subtle text-center text-sm text-text-secondary">Unlimited</td>
                </tr>
                <tr>
                  <td className="p-4 bg-surface-paper border-b border-border-subtle text-sm text-text-primary font-medium">Insolvency (BPI) Alerts</td>
                  <td className="p-4 bg-white border-b border-border-subtle text-center text-sm text-text-muted">—</td>
                  <td className="p-4 bg-white border-b border-border-subtle text-center text-sm text-text-secondary">Included</td>
                  <td className="p-4 bg-brand-mughal-green border-b border-border-subtle text-center text-sm text-text-inverse-muted">Real-Time</td>
                  <td className="p-4 bg-white border-b border-border-subtle text-center text-sm text-text-secondary">Real-Time</td>
                </tr>
                <tr>
                  <td className="p-4 bg-surface-paper border-b border-border-subtle text-sm text-text-primary font-medium">Court Cases (Dosare)</td>
                  <td className="p-4 bg-white border-b border-border-subtle text-center text-sm text-text-muted">—</td>
                  <td className="p-4 bg-white border-b border-border-subtle text-center text-sm text-text-muted">—</td>
                  <td className="p-4 bg-brand-mughal-green border-b border-border-subtle text-center text-sm text-text-inverse-muted">Included</td>
                  <td className="p-4 bg-white border-b border-border-subtle text-center text-sm text-text-secondary">Included</td>
                </tr>
                <tr>
                  <td className="p-4 bg-surface-paper border-b border-border-subtle text-sm text-text-primary font-medium">Tax Debts (ANAF)</td>
                  <td className="p-4 bg-white border-b border-border-subtle text-center text-sm text-text-muted">—</td>
                  <td className="p-4 bg-white border-b border-border-subtle text-center text-sm text-text-muted">—</td>
                  <td className="p-4 bg-brand-mughal-green border-b border-border-subtle text-center text-sm text-text-inverse-muted">Included</td>
                  <td className="p-4 bg-white border-b border-border-subtle text-center text-sm text-text-secondary">Included</td>
                </tr>
                <tr>
                  <td className="p-4 bg-surface-paper border-b border-border-subtle text-sm text-text-primary font-medium">PDF Report Exports</td>
                  <td className="p-4 bg-white border-b border-border-subtle text-center text-sm text-text-muted">—</td>
                  <td className="p-4 bg-white border-b border-border-subtle text-center text-sm text-text-secondary">5 / month</td>
                  <td className="p-4 bg-brand-mughal-green border-b border-border-subtle text-center text-sm text-text-inverse-muted">Unlimited</td>
                  <td className="p-4 bg-white border-b border-border-subtle text-center text-sm text-text-secondary">Unlimited</td>
                </tr>
                <tr>
                  <td className="p-4 bg-surface-paper border-b border-border-subtle text-sm text-text-primary font-medium">Team Users</td>
                  <td className="p-4 bg-white border-b border-border-subtle text-center text-sm text-text-secondary">1</td>
                  <td className="p-4 bg-white border-b border-border-subtle text-center text-sm text-text-secondary">5 Included</td>
                  <td className="p-4 bg-brand-mughal-green border-b border-border-subtle text-center text-sm text-text-inverse-muted">Custom</td>
                  <td className="p-4 bg-white border-b border-border-subtle text-center text-sm text-text-secondary">Custom</td>
                </tr>
                <tr>
                  <td className="p-4 bg-surface-paper border-b border-border-subtle text-sm text-text-primary font-medium">Support</td>
                  <td className="p-4 bg-white border-b border-border-subtle text-center text-sm text-text-secondary">Email</td>
                  <td className="p-4 bg-white border-b border-border-subtle text-center text-sm text-text-secondary">Priority Email</td>
                  <td className="p-4 bg-brand-mughal-green border-b border-border-subtle text-center text-sm text-text-inverse-muted">Priority 24/7</td>
                  <td className="p-4 bg-white border-b border-border-subtle text-center text-sm text-text-secondary">Dedicated</td>
                </tr>
                <tr>
                  <td className="p-4 bg-surface-paper border-b border-border-subtle text-sm text-text-primary font-medium">API Access</td>
                  <td className="p-4 bg-white border-b border-border-subtle text-center text-sm text-text-muted">—</td>
                  <td className="p-4 bg-white border-b border-border-subtle text-center text-sm text-text-muted">—</td>
                  <td className="p-4 bg-brand-mughal-green border-b border-border-subtle text-center text-sm text-text-muted">—</td>
                  <td className="p-4 bg-white border-b border-border-subtle text-center text-sm text-text-secondary">Full Integration</td>
                </tr>
              </tbody>
              <tfoot>
                <tr>
                  <td className="p-4 bg-surface-paper"></td>
                  <td className="p-4 bg-white text-center">
                    <button
                      type="button"
                      onClick={handleGetStarted}
                      className="px-6 py-3 bg-brand-mughal-green text-white rounded-lg font-medium text-sm hover:bg-brand-mughal-green-2 transition-all duration-normal"
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
                      className="px-6 py-3 bg-white text-brand-mughal-green rounded-lg font-medium text-sm hover:shadow-sm transition-all duration-normal"
                    >
                      Start PRO
                    </button>
                  </td>
                  <td className="p-4 bg-white text-center">
                    <button
                      type="button"
                      onClick={handleGetStarted}
                      className="px-6 py-3 bg-white text-brand-mughal-green border border-brand-mughal-green rounded-lg font-medium text-sm hover:bg-surface-paper transition-all duration-normal"
                    >
                      Contact Us
                    </button>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </section>

        {/* FAQs */}
        <section>
          <div className="flex items-end justify-between mb-6">
            <div>
              <p className="text-xs text-text-muted mb-2">FAQs</p>
              <h2 className="text-2xl font-semibold text-text-primary" style={{ letterSpacing: '-0.3px' }}>
                Everything you need to know
              </h2>
            </div>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <details key={idx} className="bg-white border border-border-subtle rounded-xl p-4">
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

function PricingCard({ highlight, name, price, period, description, features, cta, onCta }) {
  return (
    <div
      className={`p-6 rounded-xl border relative flex flex-col h-full ${
        highlight ? 'bg-brand-mughal-green text-white border-border-inverse-subtle' : 'bg-white border-border-subtle'
      }`}
    >
      {highlight && (
        <span 
          className="absolute -top-3 right-4 text-[11px] font-semibold bg-brand-pistachio text-brand-mughal-green px-3 py-1 rounded-full shadow-sm"
          style={{ whiteSpace: 'nowrap', display: 'inline-block', minWidth: 'max-content' }}
        >
          ★ Most popular
        </span>
      )}
      <div className="mb-4">
        <p className={`text-sm font-medium ${highlight ? 'text-text-inverse' : 'text-text-primary'}`}>{name}</p>
        <p className={`text-xs ${highlight ? 'text-text-inverse-muted' : 'text-text-muted'}`}>{description}</p>
      </div>

      <div className="mb-4">
        <div className="flex items-baseline gap-2">
          <p className={`text-3xl font-light ${highlight ? 'text-text-inverse' : 'text-text-primary'}`}>{price}</p>
          <p className={`text-xs ${highlight ? 'text-text-inverse-muted' : 'text-text-muted'}`}>{period}</p>
        </div>
      </div>

      <ul className="space-y-2 mb-6 flex-grow">
        {features.map((f) => (
          <li key={f} className={`text-sm flex items-start gap-2 ${highlight ? 'text-text-inverse-muted' : 'text-text-secondary'}`}>
            <Check size={16} className={`${highlight ? 'text-brand-pistachio' : 'text-brand-mughal-green'} mt-[2px] flex-shrink-0`} />
            <span>{f}</span>
          </li>
        ))}
      </ul>

      <button
        type="button"
        onClick={onCta}
        className={`w-full px-6 py-3 rounded-lg font-medium text-sm transition-all duration-normal mt-auto ${
          highlight
            ? 'bg-white text-brand-mughal-green hover:shadow-sm'
            : 'bg-brand-mughal-green text-white hover:bg-brand-mughal-green-2'
        }`}
      >
        {cta}
      </button>
    </div>
  )
}

