import React from 'react'
import SEO from '../components/SEO.jsx'
import { 
  ChevronDown, 
  ChevronUp, 
  Search,
  HelpCircle,
  MessageCircle,
  Mail,
  ArrowRight
} from 'lucide-react'

function FAQItem({ question, answer, category }) {
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <div className="bg-white border border-border-subtle rounded-xl overflow-hidden hover:shadow-sm transition-all duration-normal">
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
          <p className="text-sm text-text-secondary leading-relaxed">{answer}</p>
        </div>
      )}
    </div>
  )
}

export default function FAQPage({ onNavigate }) {
  const [searchQuery, setSearchQuery] = React.useState('')
  const [selectedCategory, setSelectedCategory] = React.useState('all')

  const faqCategories = [
    { id: 'all', label: 'All Questions', count: 0 },
    { id: 'getting-started', label: 'Getting Started', count: 0 },
    { id: 'pricing', label: 'Pricing & Billing', count: 0 },
    { id: 'features', label: 'Features & Functionality', count: 0 },
    { id: 'security', label: 'Security & Privacy', count: 0 },
    { id: 'account', label: 'Account Management', count: 0 },
    { id: 'support', label: 'Support & Help', count: 0 },
    { id: 'technical', label: 'Technical Questions', count: 0 }
  ]

  const allFAQs = [
    // Getting Started
    {
      category: 'getting-started',
      question: "What is marketrisk and how does it work?",
      answer: "marketrisk is a credit risk monitoring platform designed specifically for Romanian SMEs. We monitor official Romanian business registries (ANAF, BPI, court cases) and send you real-time alerts when something changes with companies you're monitoring. You create a watchlist of companies by CUI, set up alerts for what matters to you (insolvency filings, court cases, tax debts), and receive instant notifications when risks appear."
    },
    {
      category: 'getting-started',
      question: "Do I need a credit card to get started?",
      answer: "No! Our Free plan requires no credit card. You can sign up and start using marketrisk immediately with 3 CUI lookups per month. If you want to upgrade later, you can do so anytime from your account dashboard."
    },
    {
      category: 'getting-started',
      question: "How quickly can I start using marketrisk?",
      answer: "You can start using marketrisk in minutes. Simply sign up for a free account, add companies to your watchlist by entering their CUI numbers, and configure your alert preferences. Your monitoring begins immediately."
    },
    {
      category: 'getting-started',
      question: "What data do I need to get started?",
      answer: "All you need is the CUI (Company Unique Identifier) numbers of the companies you want to monitor. You can find CUI numbers on invoices, contracts, or by searching the Romanian business registry. Once you have the CUI, simply add it to your watchlist in marketrisk."
    },
    {
      category: 'getting-started',
      question: "Is there a mobile app?",
      answer: "Yes! marketrisk is fully responsive and works great on mobile devices. You can access your dashboard, view alerts, and manage your watchlist from any smartphone or tablet. We're also working on native mobile apps for iOS and Android."
    },
    {
      category: 'getting-started',
      question: "Can I try marketrisk before committing to a paid plan?",
      answer: "Absolutely! Our Free plan gives you 3 CUI lookups per month with no credit card required. This lets you test all core features and see how marketrisk works for your business. You can upgrade to a paid plan anytime when you're ready."
    },

    // Pricing & Billing
    {
      category: 'pricing',
      question: "What are the different pricing plans?",
      answer: "We offer four plans: Free (€0/month - 3 lookups), Starter (€39/month - 20 lookups + 10 company watchlist), PRO (€99/month - Unlimited lookups + 250 company watchlist), and Enterprise (Custom pricing - Unlimited everything). All plans include email support and access to our mobile-friendly dashboard."
    },
    {
      category: 'pricing',
      question: "Can I change plans later?",
      answer: "Yes! You can upgrade or downgrade your plan at any time from your account settings. Changes take effect immediately, and we'll prorate your billing accordingly. If you downgrade, you'll receive a credit for the unused portion of your current plan."
    },
    {
      category: 'pricing',
      question: "Do you offer annual billing discounts?",
      answer: "Yes! Annual plans save you 2 months compared to monthly billing—that's a 16.7% discount. For example, PRO is €990/year instead of €1,188 if paid monthly. You can switch to annual billing anytime from your account settings."
    },
    {
      category: 'pricing',
      question: "What happens if I exceed my plan limits?",
      answer: "We'll notify you via email when you're approaching your limits (at 80% and 95%). You can upgrade your plan anytime to continue using the service. If you don't upgrade, we'll pause additional lookups until your next billing cycle. No surprise charges—you're always in control."
    },
    {
      category: 'pricing',
      question: "Is there a setup fee or hidden costs?",
      answer: "No setup fees, ever. What you see is what you pay. There are no hidden costs, no per-alert fees, no data export charges (within plan limits), and no cancellation fees. Our pricing is completely transparent."
    },
    {
      category: 'pricing',
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards (Visa, Mastercard, American Express) and debit cards. For Enterprise plans, we also accept bank transfers. All payments are processed securely through Stripe, a PCI-compliant payment processor. We never store your full card details."
    },
    {
      category: 'pricing',
      question: "Do you offer refunds?",
      answer: "Yes! We offer a 30-day money-back guarantee on all paid plans. If you're not satisfied with marketrisk within the first 30 days of your subscription, contact us and we'll issue a full refund—no questions asked."
    },
    {
      category: 'pricing',
      question: "What happens to my data if I cancel?",
      answer: "You can export all your data at any time before canceling. After cancellation, we'll keep your data for 30 days in case you want to reactivate your account. After 30 days, we'll permanently delete all your data unless you request earlier deletion. You can request data deletion at any time."
    },

    // Features & Functionality
    {
      category: 'features',
      question: "What data sources does marketrisk monitor?",
      answer: "We monitor multiple official Romanian business registries: ANAF (tax authority) for tax debts and payment behavior, BPI (Insolvency Proceedings Bulletin) for insolvency filings, court cases from Dosare.ro, and other official Romanian business registries. All data is updated in real-time as new filings appear."
    },
    {
      category: 'features',
      question: "How many companies can I monitor?",
      answer: "It depends on your plan: Free plan doesn't include watchlist monitoring, Starter allows 10 companies, PRO allows 250 companies, and Enterprise has unlimited monitoring. You can upgrade anytime if you need to monitor more companies."
    },
    {
      category: 'features',
      question: "What types of alerts can I receive?",
      answer: "You can receive alerts for: insolvency filings (BPI), court cases, tax debts (ANAF), legal status changes, and other significant business events. PRO and Enterprise plans get real-time alerts, while Starter plans receive daily digest emails. You can customize which alerts you want to receive."
    },
    {
      category: 'features',
      question: "How quickly will I receive alerts?",
      answer: "PRO and Enterprise plans receive real-time alerts within minutes of a filing or change appearing in official registries. Starter plans receive daily digest emails with all changes from the previous day. Free plan includes basic email notifications for lookups."
    },
    {
      category: 'features',
      question: "Can I export reports?",
      answer: "Yes! Starter plans include 5 PDF exports per month, while PRO and Enterprise plans have unlimited exports. Reports include comprehensive credit information, risk assessments, historical data, and can be customized for your needs. Reports are perfect for client meetings, audits, or internal documentation."
    },
    {
      category: 'features',
      question: "Can I share my watchlist with team members?",
      answer: "Yes! All paid plans support team collaboration. Starter includes 5 team users, PRO includes custom team users, and Enterprise includes unlimited team users. You can set permissions, assign companies to team members, add notes, and keep everyone informed."
    },
    {
      category: 'features',
      question: "Can I organize companies with tags or categories?",
      answer: "Yes! You can add tags, notes, and custom categories to organize your watchlist. This makes it easy to group companies by client, supplier, project, or any other system that works for your business. You can also filter and search by tags."
    },
    {
      category: 'features',
      question: "Is there an API available?",
      answer: "API access is available for Enterprise plans. Our REST API allows you to integrate marketrisk data into your own systems, automate workflows, and build custom integrations. Contact our sales team to discuss API access and integration options."
    },
    {
      category: 'features',
      question: "Can I see historical data for companies?",
      answer: "Yes! When you add a company to your watchlist, we start tracking its history. You can see when risk levels changed, view past alerts, and track trends over time. Historical data helps you understand patterns and make better decisions."
    },
    {
      category: 'features',
      question: "What information is included in a credit check?",
      answer: "Each credit check includes: company registration details, current legal status, insolvency filings, active court cases, tax debt information, payment behavior indicators, risk score, and recommended actions. All information comes from official Romanian registries."
    },

    // Security & Privacy
    {
      category: 'security',
      question: "How secure is my data?",
      answer: "We use bank-level encryption (AES-256) for data at rest and TLS 1.3 for data in transit. All data is stored in EU data centers that comply with GDPR requirements. We undergo regular security audits and are SOC 2 Type II certified. Your data is never shared with third parties except as required by law."
    },
    {
      category: 'security',
      question: "Are you GDPR compliant?",
      answer: "Yes! We are fully GDPR compliant. We only collect data necessary for providing our service, we have clear data processing agreements, and we respect all data subject rights including the right to access, rectify, and delete personal data. Our data processing addendum is available upon request."
    },
    {
      category: 'security',
      question: "Where is my data stored?",
      answer: "All data is stored in EU data centers located in Germany and Ireland. We never transfer your data outside the European Union. This ensures compliance with GDPR and Romanian data protection regulations."
    },
    {
      category: 'security',
      question: "Who has access to my watchlist data?",
      answer: "Only you and the team members you explicitly invite have access to your watchlist. Our support team can access your account only with your explicit permission to help resolve issues. We never share your watchlist data with third parties or use it for marketing purposes."
    },
    {
      category: 'security',
      question: "How do you protect against data breaches?",
      answer: "We implement multiple layers of security: encrypted data storage, secure authentication (including optional 2FA), regular security audits, intrusion detection systems, and automated backups. We also have an incident response plan and will notify affected users immediately if any security issue occurs."
    },
    {
      category: 'security',
      question: "Do you offer two-factor authentication?",
      answer: "Yes! Two-factor authentication (2FA) is available for all accounts. We recommend enabling 2FA for additional security. You can set it up from your account settings using an authenticator app like Google Authenticator or Authy."
    },
    {
      category: 'security',
      question: "What happens if there's a security incident?",
      answer: "In the unlikely event of a security incident, we have a comprehensive incident response plan. We'll immediately investigate, contain the issue, notify affected users within 72 hours as required by GDPR, and take steps to prevent future incidents. We maintain detailed logs for security auditing."
    },

    // Account Management
    {
      category: 'account',
      question: "How do I update my account information?",
      answer: "You can update your account information anytime from the Settings page. This includes your email address, company name, billing information, password, and notification preferences. Changes to billing information take effect on your next billing cycle."
    },
    {
      category: 'account',
      question: "Can I have multiple accounts?",
      answer: "Yes, you can have multiple accounts if needed. Each account requires a unique email address. If you need to manage multiple organizations, you can either create separate accounts or use our Enterprise plan which supports multi-organization management."
    },
    {
      category: 'account',
      question: "How do I cancel my subscription?",
      answer: "You can cancel your subscription anytime from your account settings. There are no cancellation fees. Your subscription will remain active until the end of your current billing period, and you'll continue to have access to all features until then. After cancellation, you can reactivate within 30 days."
    },
    {
      category: 'account',
      question: "What happens when my trial ends?",
      answer: "If you're on a free trial, we'll notify you 3 days before it ends. You can upgrade to a paid plan anytime during or after the trial. If you don't upgrade, your account will automatically switch to the Free plan, and you'll retain access to basic features."
    },
    {
      category: 'account',
      question: "Can I transfer my account to someone else?",
      answer: "Account transfers are possible but require verification for security purposes. Contact our support team with the details, and we'll help you transfer the account. This is useful if you're changing roles or if your company is restructuring."
    },
    {
      category: 'account',
      question: "How do I download my data?",
      answer: "You can export your data anytime from the Settings page. We provide exports in JSON and CSV formats, including all watchlists, alerts history, and account information. For Enterprise customers, we can provide custom export formats if needed."
    },

    // Support & Help
    {
      category: 'support',
      question: "What kind of support do you offer?",
      answer: "All plans include email support. Free and Starter plans receive standard email support with responses within 24-48 hours. PRO plans receive priority support with responses within 4-8 hours. Enterprise plans include dedicated account management and phone support."
    },
    {
      category: 'support',
      question: "How can I contact support?",
      answer: "You can contact support via email at support@marketrisk.ro, through the in-app help center, or by using the contact form on our website. Enterprise customers also have access to a dedicated support phone line and Slack channel."
    },
    {
      category: 'support',
      question: "Do you offer training or onboarding?",
      answer: "Yes! We provide comprehensive onboarding materials, video tutorials, and documentation. PRO and Enterprise customers receive personalized onboarding sessions with our team. We also offer webinars and training sessions for teams."
    },
    {
      category: 'support',
      question: "Is there a knowledge base or documentation?",
      answer: "Yes! We maintain a comprehensive knowledge base with articles, video tutorials, and step-by-step guides. You can access it from your dashboard or visit our documentation site. We're constantly updating it based on user questions and feedback."
    },
    {
      category: 'support',
      question: "Can I request a feature?",
      answer: "Absolutely! We love hearing from our users. You can submit feature requests through the in-app feedback form, email us directly, or discuss ideas with your account manager (Enterprise customers). We review all requests and prioritize based on user needs."
    },
    {
      category: 'support',
      question: "Do you offer custom integrations?",
      answer: "Yes! Enterprise customers can request custom integrations with their existing systems (CRM, ERP, accounting software, etc.). We work with your team to design and implement integrations that fit your workflow. Contact sales to discuss integration options."
    },

    // Technical Questions
    {
      category: 'technical',
      question: "What browsers are supported?",
      answer: "marketrisk works on all modern browsers including Chrome, Firefox, Safari, and Edge. We support the latest two versions of each browser. For the best experience, we recommend using Chrome or Firefox on desktop and Safari or Chrome on mobile."
    },
    {
      category: 'technical',
      question: "What's your uptime guarantee?",
      answer: "We maintain 99.9% uptime SLA for all plans. Enterprise customers have a 99.95% uptime guarantee with service level agreements. We use redundant infrastructure, automated failover, and 24/7 monitoring to ensure high availability."
    },
    {
      category: 'technical',
      question: "How often is data updated?",
      answer: "We monitor official registries continuously and update our database in real-time as new filings appear. PRO and Enterprise customers receive alerts within minutes of a filing. Data is refreshed multiple times per day to ensure accuracy."
    },
    {
      category: 'technical',
      question: "What if I find incorrect data?",
      answer: "If you notice incorrect data, please contact our support team immediately. We'll investigate and correct any errors. Our data comes directly from official Romanian registries, but if there's a discrepancy, we'll work with you to resolve it."
    },
    {
      category: 'technical',
      question: "Can I integrate marketrisk with my existing systems?",
      answer: "Yes! Enterprise plans include full API access for custom integrations. We also offer pre-built integrations with popular CRM and accounting systems. Contact our sales team to discuss your integration needs and available options."
    },
    {
      category: 'technical',
      question: "Do you have a mobile app?",
      answer: "marketrisk is fully responsive and works great on mobile browsers. We're currently developing native iOS and Android apps that will be available soon. The mobile web experience already provides full functionality including alerts, watchlist management, and reports."
    },
    {
      category: 'technical',
      question: "What happens during maintenance?",
      answer: "We schedule maintenance during low-traffic hours (typically weekends) and notify users at least 48 hours in advance. Most maintenance is performed without service interruption. If downtime is required, it's typically less than 30 minutes and scheduled for minimal impact."
    }
  ]

  // Calculate category counts
  faqCategories.forEach(cat => {
    if (cat.id !== 'all') {
      cat.count = allFAQs.filter(faq => faq.category === cat.id).length
    } else {
      cat.count = allFAQs.length
    }
  })

  // Filter FAQs based on search and category
  const filteredFAQs = allFAQs.filter(faq => {
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory
    const matchesSearch = searchQuery === '' || 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const handleContactSupport = () => {
    onNavigate?.('contact')
  }

  return (
    <>
      <SEO 
        title="FAQ - marketrisk | Frequently Asked Questions"
        description="Find answers to common questions about marketrisk: pricing, features, security, support, and more. Get help with credit risk monitoring for Romanian SMEs."
        keywords="FAQ, frequently asked questions, marketrisk help, credit risk monitoring questions, Romanian SME support"
      />
      
      <div className="space-y-12">
        {/* Hero Section */}
        <section>
          <div className="text-center max-w-3xl mx-auto">
            <div className="flex items-center justify-center gap-2 mb-4">
              <HelpCircle className="w-8 h-8 text-brand-mughal-green" />
              <h1 className="text-4xl md:text-5xl font-semibold text-text-primary" style={{ letterSpacing: '-0.8px' }}>
                Frequently Asked Questions
              </h1>
            </div>
            <p className="text-lg text-text-secondary mb-8">
              Find answers to common questions about marketrisk. Can't find what you're looking for? 
              <button
                onClick={handleContactSupport}
                className="text-brand-mughal-green hover:text-brand-mughal-green-2 font-medium ml-1 underline"
              >
                Contact our support team
              </button>
            </p>

            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-muted" />
              <input
                type="text"
                placeholder="Search for questions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white border border-border-subtle rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-mughal-green focus:border-transparent text-text-primary placeholder:text-text-muted"
              />
            </div>
          </div>
        </section>

        {/* Category Filter */}
        <section>
          <div className="flex flex-wrap gap-3 justify-center">
            {faqCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-normal ${
                  selectedCategory === category.id
                    ? 'bg-brand-mughal-green text-white'
                    : 'bg-white text-text-primary border border-border-subtle hover:bg-surface-paper'
                }`}
              >
                {category.label}
                {category.count > 0 && (
                  <span className={`ml-2 px-2 py-0.5 rounded text-xs ${
                    selectedCategory === category.id
                      ? 'bg-white/20 text-white'
                      : 'bg-surface-bone text-text-muted'
                  }`}>
                    {category.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </section>

        {/* FAQ List */}
        <section>
          {filteredFAQs.length > 0 ? (
            <div className="space-y-4">
              {filteredFAQs.map((faq, index) => (
                <FAQItem
                  key={index}
                  question={faq.question}
                  answer={faq.answer}
                  category={faq.category}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white border border-border-subtle rounded-xl">
              <Search className="w-12 h-12 text-text-muted mx-auto mb-4" />
              <h3 className="text-lg font-medium text-text-primary mb-2">No questions found</h3>
              <p className="text-sm text-text-secondary mb-4">
                Try adjusting your search or category filter
              </p>
              <button
                onClick={() => {
                  setSearchQuery('')
                  setSelectedCategory('all')
                }}
                className="text-sm text-brand-mughal-green hover:text-brand-mughal-green-2 font-medium"
              >
                Clear filters
              </button>
            </div>
          )}
        </section>

        {/* Still Have Questions CTA */}
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
          
          <div className="relative z-10 max-w-3xl mx-auto text-center">
            <MessageCircle className="w-12 h-12 text-brand-pistachio mx-auto mb-4" />
            <h2 className="text-3xl md:text-4xl font-semibold text-text-inverse mb-4" style={{ letterSpacing: '-0.5px' }}>
              Still have questions?
            </h2>
            <p className="text-lg text-text-inverse-muted mb-8 max-w-2xl mx-auto">
              Our support team is here to help. Get in touch and we'll respond as soon as possible.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleContactSupport}
                className="px-8 py-3 bg-white text-brand-mughal-green rounded-lg font-medium text-sm hover:shadow-sm transition-all duration-normal inline-flex items-center justify-center gap-2"
              >
                <Mail className="w-4 h-4" />
                Contact Support
              </button>
              <button
                onClick={() => onNavigate?.('documentation')}
                className="px-8 py-3 bg-white/10 text-white border border-white/20 rounded-lg font-medium text-sm hover:bg-white/20 transition-all duration-normal inline-flex items-center justify-center gap-2"
              >
                View Documentation
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            <div className="mt-8 flex items-center justify-center gap-6 text-sm text-text-inverse-muted">
              <div className="flex items-center gap-2">
                <span>Average response time: 4-8 hours (PRO plans)</span>
              </div>
              <div className="flex items-center gap-2">
                <span>24/7 support available</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}

