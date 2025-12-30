import React from 'react'
import LandingMarketingPage from './pages/Landing.jsx'
import AboutPage from './pages/About.jsx'
import ContactPage from './pages/Contact.jsx'
import PrivacyPage from './pages/Privacy.jsx'
import TermsPage from './pages/Terms.jsx'
import BlogIndexPage from './pages/BlogIndex.jsx'
import BlogPostPage from './pages/BlogPost.jsx'
import { BLOG_POSTS, getBlogPostBySlug } from './data/blogPosts.js'

const THEME_SWATCHES = [
  {
    id: 'risk-red',
    name: 'Risk Red',
    description: 'Primary/secondary ramps plus neutral ramps (100–700) and base tokens.',
    groups: [
      {
        label: 'Primary',
        base: '#D91B24',
        stops: ['#FDD8D8', '#FBA1A2', '#F95E61', '#D91B24', '#991016', '#5E0609', '#2B0102'],
      },
      {
        label: 'Secondary',
        base: '#761F21',
        stops: ['#FBEEEE', '#F3C6C7', '#EA9192', '#E55053', '#B03335', '#761F21', '#410D0E'],
      },
      {
        label: 'Tertiary',
        base: '#C4C4C4',
        stops: ['#ECECEC', '#C4C4C4', '#9D9D9D', '#787878', '#555555', '#353535', '#171717'],
      },
      {
        label: 'Quaternary',
        base: '#504141',
        stops: ['#DCD7D7', '#B9AEAE', '#9B8585', '#776161', '#504141', '#2C2323', '#151010'],
      },
      {
        label: 'Grey',
        base: '#534949',
        stops: ['#E2E0E0', '#BDB7B7', '#9B9090', '#786B6B', '#534949', '#302A2A', '#131010'],
      },
    ],
  },
  {
    id: 'mint-citrus',
    name: 'Mint Citrus',
    description: 'Soft stone neutrals + mint ramp + cool greys + citrus ramp (100–700) and base tokens.',
    groups: [
      {
        label: 'Primary',
        base: '#EBEBDC',
        stops: ['#EBEBDC', '#C3C3B6', '#9C9C92', '#77776F', '#54544E', '#33332F', '#161613'],
      },
      {
        label: 'Secondary',
        base: '#28694B',
        stops: ['#C9FCE0', '#60E5A8', '#4DBA87', '#3A9068', '#28694B', '#17442F', '#082216'],
      },
      {
        label: 'Tertiary',
        base: '#6E6E73',
        stops: ['#E1E1E2', '#B9B9BB', '#939396', '#6E6E73', '#4C4C51', '#2C2C2F', '#111113'],
      },
      {
        label: 'Quaternary',
        base: '#FF5F2D',
        stops: ['#FFDAD6', '#FFA294', '#FF5F2D', '#C84100', '#8D2B00', '#571700', '#270600'],
      },
      {
        label: 'Grey',
        base: '#535351',
        stops: ['#EAEAE4', '#C2C2BD', '#9B9B97', '#767673', '#535351', '#333331', '#151514'],
      },
    ],
  },
  {
    id: 'sage-forest',
    name: 'Sage Forest',
    description: 'Dusty warm neutrals + layered greens (100–900) and base tokens.',
    groups: [
      {
        label: 'Dust Grey',
        base: '#DAD7CD',
        stops: ['#312E24', '#615B48', '#92896C', '#B6B09C', '#DAD7CD', '#E2DFD7', '#E9E7E1', '#F0EFEB', '#F8F7F5'],
      },
      {
        label: 'Dry Sage',
        base: '#A3B18A',
        stops: ['#212619', '#434C33', '#64724C', '#859865', '#A3B18A', '#B6C1A2', '#C8D0B9', '#DAE0D0', '#EDEFE8'],
      },
      {
        label: 'Fern',
        base: '#588157',
        stops: ['#111911', '#233323', '#344C34', '#466645', '#588157', '#739F72', '#96B795', '#B9CFB9', '#DCE7DC'],
      },
      {
        label: 'Hunter Green',
        base: '#3A5A40',
        stops: ['#0C120D', '#172419', '#233626', '#2E4833', '#3A5A40', '#56865F', '#7AAA83', '#A7C7AC', '#D3E3D6'],
      },
      {
        label: 'Pine Teal',
        base: '#344E41',
        stops: ['#0A0F0D', '#141F1A', '#1F2E26', '#293D33', '#344E41', '#527A66', '#75A38C', '#A3C2B3', '#D1E0D9'],
      },
    ],
  },
]

function hexToRgb(hex) {
  const cleaned = String(hex).trim().replace('#', '')
  if (cleaned.length !== 6) return null
  const r = Number.parseInt(cleaned.slice(0, 2), 16)
  const g = Number.parseInt(cleaned.slice(2, 4), 16)
  const b = Number.parseInt(cleaned.slice(4, 6), 16)
  if (Number.isNaN(r) || Number.isNaN(g) || Number.isNaN(b)) return null
  return { r, g, b }
}

function relativeLuminance({ r, g, b }) {
  const srgb = [r, g, b].map((v) => v / 255)
  const lin = srgb.map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4))
  return 0.2126 * lin[0] + 0.7152 * lin[1] + 0.0722 * lin[2]
}

function getSwatchTextColor(hex) {
  const rgb = hexToRgb(hex)
  if (!rgb) return '#3A2D2D'
  const lum = relativeLuminance(rgb)
  return lum < 0.35 ? '#E5E1E2' : '#3A2D2D'
}

function App() {
  const COLOR_THEME_STORAGE_KEY = 'marketrisk_color_theme_v1'

  const [colorTheme, setColorTheme] = React.useState(() => {
    try {
      const stored = localStorage.getItem(COLOR_THEME_STORAGE_KEY) || 'default'
      return stored === 'risk-red' || stored === 'mint-citrus' || stored === 'sage-forest' ? stored : 'default'
    } catch {
      return 'default'
    }
  })

  const [route, setRoute] = React.useState({
    page: 'landing',
    blogSlug: null,
    blogBackTarget: 'dashboard',
  })

  React.useLayoutEffect(() => {
    try {
      localStorage.setItem(COLOR_THEME_STORAGE_KEY, colorTheme)
    } catch {
      // ignore storage failures
    }

    if (colorTheme === 'risk-red' || colorTheme === 'mint-citrus' || colorTheme === 'sage-forest' || colorTheme === 'ocean-blue' || colorTheme === 'lavender-purple' || colorTheme === 'crimson-rose') {
      document.documentElement.setAttribute('data-theme', colorTheme)
      document.body?.setAttribute?.('data-theme', colorTheme)
    } else {
      document.documentElement.removeAttribute('data-theme')
      document.body?.removeAttribute?.('data-theme')
    }
  }, [colorTheme])

  const page = route.page

  const navigate = (nextPage) => {
    setRoute((r) => ({ ...r, page: nextPage }))
  }

  const openBlogPost = (slug, backTarget = 'dashboard') => {
    setRoute((r) => ({
      ...r,
      page: 'blog',
      blogSlug: slug,
      blogBackTarget: backTarget,
    }))
  }

  const navItems = [
    { key: 'landing', label: 'Landing' },
    { key: 'home', label: 'Home' },
    { key: 'dashboard', label: 'Dashboard' },
    { key: 'analytics', label: 'Analytics' },
    { key: 'settings', label: 'Settings' },
  ]

  return (
    <div className="min-h-screen bg-surface-paper">
      {/* Header */}
      <header className="sticky top-0 z-50 h-[72px] bg-surface-paper border-b border-border-subtle">
        <div className="max-w-[1200px] mx-auto px-12 h-full flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-brand-bone rounded-xl flex items-center justify-center">
              <div className="w-5 h-5 bg-brand-mughal-green rounded-md flex items-center justify-center">
                <span
                  aria-hidden="true"
                  className="text-brand-pistachio select-none"
                  style={{
                    fontFamily: "'Corinthia', cursive",
                    fontSize: '20px',
                    lineHeight: '20px',
                    fontWeight: 700,
                    display: 'block',
                    width: '20px',
                    textAlign: 'center',
                    transform: 'translateY(-1px)',
                  }}
                >
                  b
                </span>
              </div>
            </div>
            <span className="text-lg font-semibold text-text-primary">MarketRisk</span>
          </div>
          <nav className="flex items-center gap-6">
            {navItems.map((item) => (
              <NavItem
                key={item.key}
                active={page === item.key}
                onClick={() => navigate(item.key)}
              >
                {item.label}
              </NavItem>
            ))}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      {page === 'analytics' ? (
        <AnalyticsPage />
      ) : (
        <main className="max-w-[1200px] mx-auto px-12 py-12">
          {page === 'landing' && <LandingMarketingPage onViewDashboard={() => navigate('dashboard')} />}
          {page === 'home' && <LandingPage onPrimaryCta={() => navigate('dashboard')} />}
          {page === 'dashboard' && (
            <DashboardPage
              onOpenBlogPost={(slug) => openBlogPost(slug, 'dashboard')}
              onViewAllBlog={() => navigate('blogIndex')}
            />
          )}
          {page === 'blogIndex' && (
            <BlogIndexPage
              posts={BLOG_POSTS}
              onOpenPost={(slug) => openBlogPost(slug, 'blogIndex')}
            />
          )}
          {page === 'blog' && (
            <BlogPostPage
              post={getBlogPostBySlug(route.blogSlug)}
              onBack={() => navigate(route.blogBackTarget)}
              onAllArticles={() => navigate('blogIndex')}
            />
          )}
          {page === 'about' && <AboutPage />}
          {page === 'contact' && <ContactPage />}
          {page === 'privacy' && <PrivacyPage />}
          {page === 'terms' && <TermsPage />}
          {page === 'settings' && (
            <SettingsPage
              colorTheme={colorTheme}
              onChangeColorTheme={setColorTheme}
            />
          )}
        </main>
      )}

      <AppFooter onNavigate={navigate} />
    </div>
  )
}

function NavItem({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`text-sm transition-colors duration-normal ${
        active ? 'text-text-primary' : 'text-text-secondary hover:text-text-primary'
      }`}
    >
      {children}
    </button>
  )
}

function LandingPage({ onPrimaryCta }) {
  const [isYearly, setIsYearly] = React.useState(false)
  
  return (
    <div className="space-y-12">
      {/* Hero */}
      <section className="bg-brand-mughal-green rounded-2xl p-8 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
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

        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          <div>
            <p className="text-text-inverse-muted text-sm mb-2">MarketRisk</p>
            <h1 className="text-4xl font-semibold text-text-inverse mb-4" style={{ letterSpacing: '-0.8px' }}>
              Make risk reporting feel effortless.
            </h1>
            <p className="text-text-inverse-muted text-md max-w-xl mb-6">
              A calm, modern dashboard that turns messy exposure into clear decisions—fast.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button variant="primary" onClick={onPrimaryCta}>
                Get started
              </Button>
              <Button variant="secondary" onClick={onPrimaryCta}>
                View the dashboard
              </Button>
            </div>
            <p className="text-text-inverse-muted text-xs mt-4">
              No credit card required. Set up in minutes.
            </p>
          </div>

          {/* Form card */}
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6">
            <p className="text-text-inverse text-sm font-medium mb-4">Request a demo</p>
            <div className="space-y-3">
              <input
                className="w-full bg-white/10 text-text-inverse placeholder:text-text-inverse-muted border border-white/20 rounded-lg px-4 py-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
                placeholder="Work email"
              />
              <input
                className="w-full bg-white/10 text-text-inverse placeholder:text-text-inverse-muted border border-white/20 rounded-lg px-4 py-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
                placeholder="Company"
              />
              <button
                type="button"
                onClick={onPrimaryCta}
                className="w-full px-6 py-3 bg-white text-brand-mughal-green rounded-lg font-medium text-sm hover:shadow-sm transition-all duration-normal"
              >
                Send me a link
              </button>
              <p className="text-text-inverse-muted text-xs">
                We’ll email a short walkthrough and sample dashboard.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* PAS */}
      <section>
        <div className="flex items-end justify-between mb-6">
          <div>
            <p className="text-xs text-text-muted mb-2">Problem → Agitation → Solution</p>
            <h2 className="text-2xl font-semibold text-text-primary" style={{ letterSpacing: '-0.3px' }}>
              Clarity wins when stakes are high.
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border border-border-subtle p-6 rounded-xl">
            <p className="text-xs text-text-muted mb-2">Problem</p>
            <h3 className="text-lg font-medium text-text-primary mb-2">Scattered data</h3>
            <p className="text-sm text-text-secondary">
              Risk metrics live in spreadsheets, emails, and dashboards that disagree with each other.
            </p>
          </div>
          <div className="bg-white border border-border-subtle p-6 rounded-xl">
            <p className="text-xs text-text-muted mb-2">Agitation</p>
            <h3 className="text-lg font-medium text-text-primary mb-2">Slow decisions</h3>
            <p className="text-sm text-text-secondary">
              Teams lose hours reconciling numbers and explaining charts no one trusts.
            </p>
          </div>
          <div className="bg-white border border-border-subtle p-6 rounded-xl">
            <p className="text-xs text-text-muted mb-2">Solution</p>
            <h3 className="text-lg font-medium text-text-primary mb-2">One calm view</h3>
            <p className="text-sm text-text-secondary">
              MarketRisk brings exposures, trends, and deltas into a clean, executive-ready narrative.
            </p>
          </div>
        </div>
      </section>

      {/* Features & benefits */}
      <section>
        <div className="flex items-end justify-between mb-6">
          <div>
            <p className="text-xs text-text-muted mb-2">Benefits & features</p>
            <h2 className="text-2xl font-semibold text-text-primary" style={{ letterSpacing: '-0.3px' }}>
              Designed for trust, not noise.
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FeatureCard
            title="Executive-ready summaries"
            description="Turn raw metrics into a quick story: what changed, why it matters, what to do next."
            bullets={['Clear hierarchy', 'Readable deltas', 'Calm visual rhythm']}
          />
          <FeatureCard
            title="A single source of truth"
            description="Bring multiple feeds together and keep outputs consistent across teams."
            bullets={['Token-based UI', 'Consistent formatting', 'Audit-friendly']}
          />
          <FeatureCard
            title="Fast, responsive dashboards"
            description="Spacious layouts that still work beautifully on smaller screens."
            bullets={['Mobile-first grids', 'Subtle motion', 'Accessible focus states']}
          />
          <FeatureCard
            title="Simple sharing"
            description="Export or share the view your stakeholders actually need."
            bullets={['Export data', 'Schedule reviews', 'Repeatable reporting']}
          />
        </div>
      </section>

      {/* CTA */}
      <section className="bg-brand-pistachio rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h2 className="text-2xl font-semibold text-text-on-bone mb-2" style={{ letterSpacing: '-0.3px' }}>
            See it in action in under 2 minutes.
          </h2>
          <p className="text-text-on-bone opacity-80 text-md">
            Jump into a sample dashboard and explore the flow.
          </p>
        </div>
        <div className="flex gap-3 flex-shrink-0">
          <Button variant="secondary" onClick={onPrimaryCta}>
            Open dashboard
          </Button>
          <Button variant="primary" onClick={onPrimaryCta}>
            Get started
          </Button>
        </div>
      </section>

      {/* Testimonials */}
      <section>
        <div className="flex items-end justify-between mb-6">
          <div>
            <p className="text-xs text-text-muted mb-2">Social proof</p>
            <h2 className="text-2xl font-semibold text-text-primary" style={{ letterSpacing: '-0.3px' }}>
              Trusted for clear reporting.
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <TestimonialCard
            quote="“Our weekly risk readout went from 45 minutes to 12. The story is obvious now.”"
            name="Priya S."
            role="Head of Risk"
          />
          <TestimonialCard
            quote="“It’s the first dashboard that feels calm—and still answers the hard questions.”"
            name="Marcus L."
            role="CFO"
          />
          <TestimonialCard
            quote="“We stopped arguing about the numbers and started acting on them.”"
            name="Elena R."
            role="Portfolio Ops"
          />
        </div>
      </section>

      {/* Pricing */}
      <section>
        <div className="mb-6">
          <p className="text-xs text-text-muted mb-2">Pricing</p>
          <h2 className="text-2xl font-semibold text-text-primary" style={{ letterSpacing: '-0.3px' }}>
            Simple plans that scale with you.
          </h2>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <PricingCard
            name="Free"
            price="€0"
            period=""
            description="For one-off checks."
            features={['3 CUI lookups / month', 'Basic credit checks', 'Email support']}
            cta="Get started"
            onCta={onPrimaryCta}
          />
          <PricingCard
            name="Starter"
            price="€39"
            period="per month"
            description="For small portfolios."
            features={['20 CUI lookups / month', '10 CUI watchlist', 'Insolvency alerts', '5 PDF exports / month', '5 team users']}
            cta="Start Starter"
            onCta={onPrimaryCta}
          />
          <PricingCard
            highlight
            name="PRO"
            price="€99"
            period="per month"
            description="For active B2B sales."
            features={['Unlimited CUI lookups', '250 CUI watchlist', 'Real-time alerts', 'Court cases & tax debts', 'Unlimited exports', 'Custom team users']}
            cta="Start PRO"
            onCta={onPrimaryCta}
          />
          <PricingCard
            name="Enterprise"
            price="Contact Us"
            period=""
            description="For high volume and banks."
            features={['Everything in PRO', 'Unlimited watchlist', 'Admin access', 'Full API integration', 'Dedicated support']}
            cta="Talk to sales"
            onCta={onPrimaryCta}
          />
        </div>

        {/* Full Comparison Table */}
        <div className="mb-6">
          <p className="text-xs text-text-muted mb-2">Feature Comparison</p>
          <h3 className="text-xl font-semibold text-text-primary mb-4" style={{ letterSpacing: '-0.3px' }}>
            Compare all features
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="text-left p-4 bg-surface-paper border-b border-border-subtle text-sm font-semibold text-text-primary">Feature</th>
                <th className="text-center p-4 bg-white border-b border-border-subtle text-sm font-semibold text-text-primary">Free</th>
                <th className="text-center p-4 bg-white border-b border-border-subtle text-sm font-semibold text-text-primary">Starter</th>
                <th className="text-center p-4 bg-brand-mughal-green border-b border-border-subtle text-sm font-semibold text-text-inverse relative">
                  <span className="absolute -top-3 left-1/2 transform -translate-x-1/2 text-[11px] font-semibold bg-brand-pistachio text-brand-mughal-green px-3 py-1 rounded-full shadow-sm whitespace-nowrap">
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
                <td className="p-4 bg-white border-b border-border-subtle text-center text-sm text-text-primary">Contact Us</td>
              </tr>
              <tr>
                <td className="p-4 bg-surface-paper border-b border-border-subtle text-sm text-text-primary font-medium">Best For</td>
                <td className="p-4 bg-white border-b border-border-subtle text-center text-sm text-text-secondary">One-off checks</td>
                <td className="p-4 bg-white border-b border-border-subtle text-center text-sm text-text-secondary">Small Portfolios</td>
                <td className="p-4 bg-brand-mughal-green border-b border-border-subtle text-center text-sm text-text-inverse-muted">Active B2B Sales</td>
                <td className="p-4 bg-white border-b border-border-subtle text-center text-sm text-text-secondary">High Volume/Banks</td>
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
                <td className="p-4 bg-surface-paper border-b border-border-subtle text-sm text-text-primary font-medium">Admin</td>
                <td className="p-4 bg-white border-b border-border-subtle text-center text-sm text-text-muted">—</td>
                <td className="p-4 bg-white border-b border-border-subtle text-center text-sm text-text-muted">—</td>
                <td className="p-4 bg-brand-mughal-green border-b border-border-subtle text-center text-sm text-text-inverse-muted">—</td>
                <td className="p-4 bg-white border-b border-border-subtle text-center text-sm text-text-secondary">Included</td>
              </tr>
              <tr>
                <td className="p-4 bg-surface-paper border-b border-border-subtle text-sm text-text-primary font-medium">API Access</td>
                <td className="p-4 bg-white border-b border-border-subtle text-center text-sm text-text-muted">—</td>
                <td className="p-4 bg-white border-b border-border-subtle text-center text-sm text-text-muted">—</td>
                <td className="p-4 bg-brand-mughal-green border-b border-border-subtle text-center text-sm text-text-inverse-muted">—</td>
                <td className="p-4 bg-white border-b border-border-subtle text-center text-sm text-text-secondary">Full Integration</td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td className="p-4 bg-surface-paper"></td>
                <td className="p-4 bg-white text-center">
                  <button
                    type="button"
                    onClick={onPrimaryCta}
                    className="px-6 py-3 bg-brand-mughal-green text-white rounded-lg font-medium text-sm hover:bg-brand-mughal-green-2 transition-all duration-normal"
                  >
                    Get started
                  </button>
                </td>
                <td className="p-4 bg-white text-center">
                  <button
                    type="button"
                    onClick={onPrimaryCta}
                    className="px-6 py-3 bg-brand-mughal-green text-white rounded-lg font-medium text-sm hover:bg-brand-mughal-green-2 transition-all duration-normal"
                  >
                    Start Starter
                  </button>
                </td>
                <td className="p-4 bg-brand-mughal-green text-center">
                  <button
                    type="button"
                    onClick={onPrimaryCta}
                    className="px-6 py-3 bg-white text-brand-mughal-green rounded-lg font-medium text-sm hover:shadow-sm transition-all duration-normal"
                  >
                    Start PRO
                  </button>
                </td>
                <td className="p-4 bg-white text-center">
                  <button
                    type="button"
                    onClick={onPrimaryCta}
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
              Answers, upfront.
            </h2>
          </div>
        </div>

        <div className="space-y-3">
          <FaqItem
            q="Do I need to connect all data sources to try it?"
            a="No. Start with a sample dashboard to see the workflow, then connect sources when you’re ready."
          />
          <FaqItem
            q="Is this built for executives or analysts?"
            a="Both. Analysts get trustworthy consistency; executives get clear summaries and deltas."
          />
          <FaqItem
            q="Can we export or share reports?"
            a="Yes. Export data and share views designed for stakeholder updates."
          />
        </div>
      </section>

      {/* Final CTA + Footer */}
      <section className="bg-brand-mughal-green rounded-2xl p-8 relative overflow-hidden">
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
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl font-semibold text-text-inverse mb-2" style={{ letterSpacing: '-0.3px' }}>
              Ready to make reporting feel easy?
            </h2>
            <p className="text-text-inverse-muted text-md">
              Open the dashboard and see the flow in minutes.
            </p>
          </div>
          <div className="flex gap-3 flex-shrink-0">
            <button
              type="button"
              onClick={onPrimaryCta}
              className="px-6 py-3 bg-white text-brand-mughal-green rounded-lg font-medium text-sm hover:shadow-sm transition-all duration-normal"
            >
              Open dashboard
            </button>
            <button
              type="button"
              onClick={onPrimaryCta}
              className="px-6 py-3 bg-brand-mughal-green-2 text-white rounded-lg font-medium text-sm hover:bg-brand-mughal-green transition-all duration-normal"
            >
              Get started
            </button>
          </div>
        </div>
      </section>

    </div>
  )
}

function AppFooter({ onNavigate }) {
  const email = 'hello@marketrisk.com'
  const phone = '+40 712 345 678'
  const telHref = `tel:${phone.replace(/\s+/g, '')}`

  return (
    <footer className="bg-surface-paper mt-12 pb-12">
      <div className="max-w-[1200px] mx-auto px-6 md:px-12">
        <div className="bg-brand-mughal-green text-text-inverse rounded-2xl overflow-hidden">
          <div className="px-6 md:px-12 py-10">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
              <div className="min-w-0">
                <p className="text-sm text-text-inverse-muted">
                  <span className="text-text-inverse font-semibold">MarketRisk</span> — calm reporting for high-stakes
                  decisions.
                </p>
                <div className="mt-4 flex flex-col sm:flex-row gap-3 sm:gap-6">
                  <a
                    href={`mailto:${email}`}
                    className="text-sm text-text-inverse-muted hover:text-text-inverse transition-colors duration-normal"
                  >
                    {email}
                  </a>
                  <a
                    href={telHref}
                    className="text-sm text-text-inverse-muted hover:text-text-inverse transition-colors duration-normal"
                  >
                    {phone}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-6 flex-wrap">
                <button
                  type="button"
                  onClick={() => onNavigate?.('about')}
                  className="text-sm text-text-inverse-muted hover:text-text-inverse transition-colors duration-normal"
                >
                  About
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate?.('privacy')}
                  className="text-sm text-text-inverse-muted hover:text-text-inverse transition-colors duration-normal"
                >
                  Privacy
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate?.('terms')}
                  className="text-sm text-text-inverse-muted hover:text-text-inverse transition-colors duration-normal"
                >
                  Terms
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate?.('contact')}
                  className="text-sm text-text-inverse-muted hover:text-text-inverse transition-colors duration-normal"
                >
                  Contact
                </button>
                <div className="w-px h-5 bg-border-inverse-subtle" />
                <a
                  href="https://instagram.com/marketrisk"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Instagram"
                  className="inline-flex items-center justify-center w-10 h-10 bg-white/10 text-text-inverse-muted hover:text-text-inverse transition-colors duration-normal rounded-lg"
                >
                  <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" aria-hidden="true">
                    <path
                      d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2Z"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    />
                    <path
                      d="M12 16.25a4.25 4.25 0 1 0 0-8.5 4.25 4.25 0 0 0 0 8.5Z"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    />
                    <path d="M17.5 6.5h.01" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
                  </svg>
                </a>
                <a
                  href="https://x.com/marketrisk"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="X"
                  className="inline-flex items-center justify-center w-10 h-10 bg-white/10 text-text-inverse-muted hover:text-text-inverse transition-colors duration-normal rounded-lg"
                >
                  <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" aria-hidden="true">
                    <path
                      d="M18.5 2H21l-6.7 7.65L22 22h-6.3l-4.93-6.55L5 22H2.5l7.28-8.32L2 2h6.46l4.45 5.93L18.5 2Z"
                      fill="currentColor"
                    />
                  </svg>
                </a>
              </div>
            </div>

            <div className="mt-8 py-6 border-t border-white/15 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <p className="text-xs text-text-inverse-muted">
                © {new Date().getFullYear()} MarketRisk. All rights reserved.
              </p>
              <p className="text-xs text-text-inverse-muted">Made with calm defaults.</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

function Button({ variant, onClick, children }) {
  if (variant === 'primary') {
    return (
      <button
        type="button"
        onClick={onClick}
        className="px-6 py-3 bg-brand-mughal-green text-white rounded-lg font-medium text-sm hover:bg-brand-mughal-green-2 transition-all duration-normal"
      >
        {children}
      </button>
    )
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className="px-6 py-3 bg-white text-brand-mughal-green rounded-lg font-medium text-sm hover:shadow-sm transition-all duration-normal"
    >
      {children}
    </button>
  )
}

function FeatureCard({ title, description, bullets }) {
  return (
    <div className="bg-white border border-border-subtle p-6 rounded-xl">
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 bg-surface-bone flex items-center justify-center rounded-lg flex-shrink-0">
          <div className="w-5 h-5 bg-brand-mughal-green rounded-md" />
        </div>
        <div className="min-w-0">
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
      </div>
    </div>
  )
}

function TestimonialCard({ quote, name, role }) {
  return (
    <div className="bg-white border border-border-subtle p-6 rounded-xl">
      <p className="text-sm text-text-secondary mb-4">{quote}</p>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-surface-bone rounded-lg flex items-center justify-center flex-shrink-0">
          <span className="text-sm font-medium text-brand-mughal-green">{name.slice(0, 1)}</span>
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium text-text-primary">{name}</p>
          <p className="text-xs text-text-muted">{role}</p>
        </div>
      </div>
    </div>
  )
}

function PricingCard({ highlight, name, price, period, description, features, cta, onCta }) {
  return (
    <div
      className={`p-6 rounded-xl border relative ${
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

      <ul className="space-y-2 mb-6">
        {features.map((f) => (
          <li key={f} className={`text-sm flex items-start gap-2 ${highlight ? 'text-text-inverse-muted' : 'text-text-secondary'}`}>
            <span className={`${highlight ? 'text-brand-pistachio' : 'text-brand-mughal-green'} mt-[2px]`}>•</span>
            <span>{f}</span>
          </li>
        ))}
      </ul>

      <button
        type="button"
        onClick={onCta}
        className={`w-full px-6 py-3 rounded-lg font-medium text-sm transition-all duration-normal ${
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

function FaqItem({ q, a }) {
  return (
    <details className="bg-white border border-border-subtle rounded-xl p-4">
      <summary className="cursor-pointer text-sm font-medium text-text-primary">
        {q}
      </summary>
      <p className="text-sm text-text-secondary mt-3">{a}</p>
    </details>
  )
}

function PlaceholderPage({ title }) {
  return (
    <div className="bg-white border border-border-subtle p-8 rounded-xl">
      <p className="text-xs text-text-muted mb-2">Coming soon</p>
      <h1 className="text-2xl font-semibold text-text-primary" style={{ letterSpacing: '-0.3px' }}>
        {title}
      </h1>
      <p className="text-sm text-text-secondary mt-3">
        This section isn't implemented yet. Use Home and Dashboard for now.
      </p>
    </div>
  )
}

// Settings Page Component
function SettingsPage({ colorTheme, onChangeColorTheme }) {
  const AVATAR_STORAGE_KEY = 'marketrisk_profile_avatar_v1'
  const [user, setUser] = React.useState(() => {
    let avatarUrl = ''
    try {
      avatarUrl = localStorage.getItem(AVATAR_STORAGE_KEY) || ''
    } catch {
      avatarUrl = ''
    }

    return {
      firstName: 'Alex',
      lastName: 'Morgan',
      email: 'alex.morgan@company.com',
      role: 'Risk Analyst',
      company: 'Acme Holdings',
      phone: '+40 712 345 678',
      timezone: 'Europe/Bucharest',
      avatarUrl,
    }
  })

  const [notifications, setNotifications] = React.useState({
    emailAlerts: true,
    riskUpdates: true,
    weeklyDigest: false,
    productNews: true,
    securityAlerts: true,
    marketingEmails: false,
  })

  const [preferences, setPreferences] = React.useState({
    twoFactorAuth: false,
    darkMode: false,
    compactView: false,
    autoRefresh: true,
  })

  const [passwordForm, setPasswordForm] = React.useState({
    current: '',
    new: '',
    confirm: '',
  })

  const [editingProfile, setEditingProfile] = React.useState(false)
  const [saveStatus, setSaveStatus] = React.useState({ show: false, type: '' })
  const avatarFileInputRef = React.useRef(null)

  const currentPlan = {
    name: 'Pro',
    price: '€39',
    period: 'month',
    features: ['Unlimited watchlists', 'Priority alerts', 'Custom views', 'API access'],
    nextBilling: 'January 15, 2026',
  }

  const handleSaveProfile = () => {
    setEditingProfile(false)
    setSaveStatus({ show: true, type: 'profile' })
    setTimeout(() => setSaveStatus({ show: false, type: '' }), 3000)
  }

  React.useEffect(() => {
    try {
      if (user.avatarUrl) {
        localStorage.setItem(AVATAR_STORAGE_KEY, user.avatarUrl)
      } else {
        localStorage.removeItem(AVATAR_STORAGE_KEY)
      }
    } catch {
      // ignore storage failures
    }
  }, [user.avatarUrl])

  const handleAvatarFile = (e) => {
    const file = e.target.files?.[0]
    // allow re-uploading same file by clearing the input
    e.target.value = ''
    if (!file) return

    // basic guardrail (5MB) to keep localStorage safe-ish
    if (file.size > 5 * 1024 * 1024) {
      // eslint-disable-next-line no-alert
      alert('Please choose an image smaller than 5MB.')
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      const result = typeof reader.result === 'string' ? reader.result : ''
      setUser((p) => ({ ...p, avatarUrl: result }))
    }
    reader.readAsDataURL(file)
  }

  const handlePasswordChange = (e) => {
    e.preventDefault()
    if (passwordForm.new !== passwordForm.confirm) {
      return
    }
    setPasswordForm({ current: '', new: '', confirm: '' })
    setSaveStatus({ show: true, type: 'password' })
    setTimeout(() => setSaveStatus({ show: false, type: '' }), 3000)
  }

  const toggleNotification = (key) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const togglePreference = (key) => {
    setPreferences((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-semibold text-text-primary mb-2" style={{ letterSpacing: '-0.3px' }}>
          Settings
        </h1>
        <p className="text-sm text-text-secondary">
          Manage your account, preferences, and notifications.
        </p>
      </div>

      {/* Success Toast */}
      {saveStatus.show && (
        <div className="fixed top-24 right-8 z-50 animate-[fadeInUp_0.3s_ease]">
          <div className="bg-brand-mughal-green text-white px-4 py-3 rounded-lg shadow-md flex items-center gap-3">
            <svg className="w-5 h-5 text-brand-pistachio" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-sm font-medium">
              {saveStatus.type === 'profile' ? 'Profile updated successfully' : 'Password changed successfully'}
            </span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Profile & Password */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Card */}
          <div className="bg-white rounded-xl border border-border-subtle overflow-hidden">
            <div className="p-6 border-b border-border-subtle">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium text-text-primary">Profile Information</h2>
                <button
                  type="button"
                  onClick={() => editingProfile ? handleSaveProfile() : setEditingProfile(true)}
                  className="text-sm text-brand-mughal-green hover:text-brand-mughal-green-2 transition-colors font-medium"
                >
                  {editingProfile ? 'Save changes' : 'Edit profile'}
                </button>
              </div>
            </div>

            <div className="p-6">
              {/* Avatar Section */}
              <div className="flex items-center gap-6 mb-8">
                <div className="relative">
                  {user.avatarUrl ? (
                    <img
                      src={user.avatarUrl}
                      alt={`${user.firstName} ${user.lastName} profile`}
                      className="w-20 h-20 rounded-xl object-cover"
                    />
                  ) : (
                    <div className="w-20 h-20 bg-brand-mughal-green rounded-xl flex items-center justify-center">
                      <span className="text-2xl font-semibold text-white">
                        {user.firstName[0]}{user.lastName[0]}
                      </span>
                    </div>
                  )}

                  <input
                    ref={avatarFileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarFile}
                    disabled={!editingProfile}
                  />
                  {editingProfile && (
                    <button
                      type="button"
                      onClick={() => avatarFileInputRef.current?.click()}
                      aria-label="Upload profile picture"
                      className="absolute -bottom-1 -right-1 w-7 h-7 bg-white border border-border-subtle rounded-lg flex items-center justify-center hover:shadow-sm transition-all"
                    >
                      <svg className="w-4 h-4 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M7 16V12m0 0l-2 2m2-2l2 2" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 8a4 4 0 00-3-3.87M7 8a4 4 0 013-3.87" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 16a4 4 0 004 4h6a4 4 0 004-4v-1a3 3 0 00-3-3H8a3 3 0 00-3 3v1z" />
                      </svg>
                    </button>
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-medium text-text-primary">{user.firstName} {user.lastName}</h3>
                  <p className="text-sm text-text-secondary">{user.role} at {user.company}</p>
                </div>
              </div>

              {/* Profile Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <SettingsInput
                  label="First name"
                  value={user.firstName}
                  onChange={(v) => setUser((p) => ({ ...p, firstName: v }))}
                  disabled={!editingProfile}
                />
                <SettingsInput
                  label="Last name"
                  value={user.lastName}
                  onChange={(v) => setUser((p) => ({ ...p, lastName: v }))}
                  disabled={!editingProfile}
                />
                <SettingsInput
                  label="Email address"
                  value={user.email}
                  onChange={(v) => setUser((p) => ({ ...p, email: v }))}
                  disabled={!editingProfile}
                  type="email"
                />
                <SettingsInput
                  label="Phone number"
                  value={user.phone}
                  onChange={(v) => setUser((p) => ({ ...p, phone: v }))}
                  disabled={!editingProfile}
                  type="tel"
                />
                <SettingsInput
                  label="Company"
                  value={user.company}
                  onChange={(v) => setUser((p) => ({ ...p, company: v }))}
                  disabled={!editingProfile}
                />
                <SettingsSelect
                  label="Timezone"
                  value={user.timezone}
                  onChange={(v) => setUser((p) => ({ ...p, timezone: v }))}
                  disabled={!editingProfile}
                  options={[
                    { value: 'Europe/Bucharest', label: '(GMT+2) Bucharest' },
                    { value: 'Europe/London', label: '(GMT+0) London' },
                    { value: 'America/New_York', label: '(GMT-5) New York' },
                    { value: 'America/Los_Angeles', label: '(GMT-8) Los Angeles' },
                  ]}
                />
              </div>
            </div>
          </div>

          {/* Change Password Card */}
          <div className="bg-white rounded-xl border border-border-subtle overflow-hidden">
            <div className="p-6 border-b border-border-subtle">
              <h2 className="text-lg font-medium text-text-primary">Change Password</h2>
              <p className="text-sm text-text-muted mt-1">Update your password regularly to keep your account secure.</p>
            </div>

            <form onSubmit={handlePasswordChange} className="p-6 space-y-6">
              <SettingsInput
                label="Current password"
                value={passwordForm.current}
                onChange={(v) => setPasswordForm((p) => ({ ...p, current: v }))}
                type="password"
                placeholder="Enter current password"
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <SettingsInput
                  label="New password"
                  value={passwordForm.new}
                  onChange={(v) => setPasswordForm((p) => ({ ...p, new: v }))}
                  type="password"
                  placeholder="Enter new password"
                />
                <SettingsInput
                  label="Confirm new password"
                  value={passwordForm.confirm}
                  onChange={(v) => setPasswordForm((p) => ({ ...p, confirm: v }))}
                  type="password"
                  placeholder="Confirm new password"
                  error={passwordForm.confirm && passwordForm.new !== passwordForm.confirm ? 'Passwords do not match' : ''}
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={!passwordForm.current || !passwordForm.new || passwordForm.new !== passwordForm.confirm}
                  className="px-6 py-3 bg-brand-mughal-green text-white rounded-lg font-medium text-sm hover:bg-brand-mughal-green-2 transition-all duration-normal disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Update password
                </button>
              </div>
            </form>
          </div>

          {/* Notification Preferences */}
          <div className="bg-white rounded-xl border border-border-subtle overflow-hidden">
            <div className="p-6 border-b border-border-subtle">
              <h2 className="text-lg font-medium text-text-primary">Notification Preferences</h2>
              <p className="text-sm text-text-muted mt-1">Choose how and when you want to be notified.</p>
            </div>

            <div className="p-6 space-y-1">
              <SettingsToggle
                label="Email alerts"
                description="Receive instant email notifications for critical risk alerts"
                checked={notifications.emailAlerts}
                onChange={() => toggleNotification('emailAlerts')}
              />
              <SettingsToggle
                label="Risk updates"
                description="Get notified when there are changes to your watchlist companies"
                checked={notifications.riskUpdates}
                onChange={() => toggleNotification('riskUpdates')}
              />
              <SettingsToggle
                label="Weekly digest"
                description="Receive a weekly summary of all activity and trends"
                checked={notifications.weeklyDigest}
                onChange={() => toggleNotification('weeklyDigest')}
              />
              <SettingsToggle
                label="Product news"
                description="Stay updated on new features and improvements"
                checked={notifications.productNews}
                onChange={() => toggleNotification('productNews')}
              />
              <SettingsToggle
                label="Security alerts"
                description="Get notified about security-related activities on your account"
                checked={notifications.securityAlerts}
                onChange={() => toggleNotification('securityAlerts')}
              />
              <SettingsToggle
                label="Marketing emails"
                description="Receive tips, offers, and promotional content"
                checked={notifications.marketingEmails}
                onChange={() => toggleNotification('marketingEmails')}
              />
            </div>
          </div>

          {/* Theme Swatches */}
          <div className="bg-white rounded-xl border border-border-subtle overflow-hidden">
            <div className="p-6 border-b border-border-subtle">
              <h2 className="text-lg font-medium text-text-primary">Theme swatch</h2>
              <p className="text-sm text-text-muted mt-1">
                A preview of a palette ramp (100–700) plus base tokens.
              </p>
            </div>

            <div className="p-6 space-y-6">
              {THEME_SWATCHES.map((theme) => (
                <div key={theme.id}>
                  <div className="flex items-baseline justify-between gap-4 mb-3">
                    <div>
                      <p className="text-sm font-medium text-text-primary">{theme.name}</p>
                      <p className="text-xs text-text-muted mt-1">{theme.description}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-text-muted">Base</span>
                      <span
                        className="px-3 py-2 rounded-lg text-xs font-semibold border border-border-subtle"
                        style={{
                          background: theme.groups?.[0]?.base || '#FFFFFF',
                          color: getSwatchTextColor(theme.groups?.[0]?.base || '#FFFFFF'),
                        }}
                      >
                        {(theme.groups?.[0]?.base || '').toUpperCase()}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {theme.groups.map((group) => (
                      <div key={group.label}>
                        <div className="flex items-center justify-between gap-3 mb-2">
                          <p className="text-xs font-semibold text-text-muted tracking-wide uppercase">
                            {group.label}
                          </p>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-text-muted">Base</span>
                            <span
                              className="px-3 py-2 rounded-lg text-xs font-semibold border border-border-subtle"
                              style={{
                                background: group.base,
                                color: getSwatchTextColor(group.base),
                              }}
                            >
                              {group.base.toUpperCase()}
                            </span>
                          </div>
                        </div>

                        <div className="overflow-x-auto">
                          <div
                            className="overflow-hidden rounded-lg border border-border-subtle grid"
                            style={{
                              gridTemplateColumns: `repeat(${group.stops.length}, minmax(96px, 1fr))`,
                              minWidth: `${group.stops.length * 96}px`,
                            }}
                          >
                            {group.stops.map((hex) => (
                              <div
                                key={hex}
                                className="h-[72px] flex items-end justify-center p-2"
                                style={{ background: hex }}
                                title={hex.toUpperCase()}
                              >
                                <span
                                  className="text-[11px] leading-[14px] font-medium uppercase"
                                  style={{ color: getSwatchTextColor(hex) }}
                                >
                                  {hex.toUpperCase()}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Plan & Preferences */}
        <div className="space-y-6">
          {/* Current Plan Card */}
          <div className="bg-brand-mughal-green rounded-xl overflow-hidden">
            <div className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xs font-medium text-brand-pistachio bg-white/15 px-2.5 py-1 rounded-lg">
                  Current Plan
                </span>
              </div>
              <h3 className="text-2xl font-semibold text-white mb-1">{currentPlan.name}</h3>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-3xl font-light text-white">{currentPlan.price}</span>
                <span className="text-sm text-text-inverse-muted">/{currentPlan.period}</span>
              </div>
              
              <ul className="space-y-2 mb-6">
                {currentPlan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm text-text-inverse-muted">
                    <svg className="w-4 h-4 text-brand-pistachio flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>

              <div className="pt-4 border-t border-white/15">
                <p className="text-xs text-text-inverse-muted mb-4">
                  Next billing: {currentPlan.nextBilling}
                </p>
                <div className="flex gap-3">
                  <button
                    type="button"
                    className="flex-1 px-4 py-2.5 bg-white text-brand-mughal-green rounded-lg font-medium text-sm hover:shadow-sm transition-all"
                  >
                    Upgrade
                  </button>
                  <button
                    type="button"
                    className="px-4 py-2.5 bg-white/10 text-white rounded-lg font-medium text-sm hover:bg-white/20 transition-all"
                  >
                    Manage
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* App Preferences Card */}
          <div className="bg-white rounded-xl border border-border-subtle overflow-hidden">
            <div className="p-6 border-b border-border-subtle">
              <h2 className="text-lg font-medium text-text-primary">App Preferences</h2>
            </div>

            <div className="p-6 space-y-1">
              <div className="py-3 border-b border-border-subtle">
                <div className="flex items-start justify-between gap-6">
                  <div>
                    <p className="text-sm font-medium text-text-primary">Color theme</p>
                    <p className="text-xs text-text-muted mt-1">
                      Change the app’s palette (updates instantly).
                    </p>
                  </div>
                  <div className="w-[240px]">
                    <SettingsSelect
                      label=""
                      value={colorTheme}
                      onChange={onChangeColorTheme}
                      options={[
                        { value: 'default', label: 'Default (Editorial Green)' },
                        { value: 'risk-red', label: 'Risk Red' },
                        { value: 'mint-citrus', label: 'Mint Citrus' },
                        { value: 'sage-forest', label: 'Sage Forest' },
                        { value: 'ocean-blue', label: 'Ocean Blue' },
                        { value: 'lavender-purple', label: 'Lavender Purple' },
                        { value: 'crimson-rose', label: 'Crimson Rose' },
                      ]}
                    />
                  </div>
                </div>
              </div>
              <SettingsToggle
                label="Two-factor authentication"
                description="Add an extra layer of security"
                checked={preferences.twoFactorAuth}
                onChange={() => togglePreference('twoFactorAuth')}
              />
              <SettingsToggle
                label="Dark mode"
                description="Switch to a darker color scheme"
                checked={preferences.darkMode}
                onChange={() => togglePreference('darkMode')}
              />
              <SettingsToggle
                label="Compact view"
                description="Show more data in less space"
                checked={preferences.compactView}
                onChange={() => togglePreference('compactView')}
              />
              <SettingsToggle
                label="Auto-refresh data"
                description="Automatically refresh dashboard data"
                checked={preferences.autoRefresh}
                onChange={() => togglePreference('autoRefresh')}
              />
            </div>
          </div>

          {/* Danger Zone */}
          <div className="bg-white rounded-xl border border-border-subtle overflow-hidden">
            <div className="p-6 border-b border-border-subtle">
              <h2 className="text-lg font-medium text-text-primary">Danger Zone</h2>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="text-sm font-medium text-text-primary">Export data</p>
                  <p className="text-xs text-text-muted mt-0.5">Download all your data</p>
                </div>
                <button
                  type="button"
                  className="px-4 py-2 border border-border-subtle text-text-primary rounded-lg text-sm font-medium hover:bg-surface-bone transition-all"
                >
                  Export
                </button>
              </div>
              <div className="flex items-center justify-between py-3 border-t border-border-subtle">
                <div>
                  <p className="text-sm font-medium text-state-danger">Delete account</p>
                  <p className="text-xs text-text-muted mt-0.5">Permanently remove your account</p>
                </div>
                <button
                  type="button"
                  className="px-4 py-2 bg-state-danger-soft text-state-danger rounded-lg text-sm font-medium hover:bg-state-danger hover:text-white transition-all"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Settings Input Component
function SettingsInput({ label, value, onChange, disabled, type = 'text', placeholder, error }) {
  return (
    <div>
      <label className="block text-xs font-medium text-text-muted mb-2">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        placeholder={placeholder}
        className={`w-full px-4 py-3 border rounded-lg text-sm transition-all duration-normal ${
          disabled
            ? 'bg-surface-bone border-transparent text-text-primary cursor-not-allowed'
            : 'bg-white border-border-subtle text-text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring'
        } ${error ? 'border-state-danger' : ''}`}
      />
      {error && <p className="text-xs text-state-danger mt-1">{error}</p>}
    </div>
  )
}

// Settings Select Component
function SettingsSelect({ label, value, onChange, disabled, options }) {
  return (
    <div>
      {label ? (
        <label className="block text-xs font-medium text-text-muted mb-2">{label}</label>
      ) : null}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className={`w-full px-4 py-3 border rounded-lg text-sm transition-all duration-normal appearance-none bg-no-repeat ${
          disabled
            ? 'bg-surface-bone border-transparent text-text-primary cursor-not-allowed'
            : 'bg-white border-border-subtle text-text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring'
        }`}
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%230B0F0C' stroke-width='2'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`,
          backgroundPosition: 'right 12px center',
          backgroundSize: '16px',
        }}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  )
}

// Settings Toggle Component
function SettingsToggle({ label, description, checked, onChange }) {
  return (
    <div className="flex items-center justify-between py-4 border-b border-border-subtle last:border-0">
      <div className="pr-4">
        <p className="text-sm font-medium text-text-primary">{label}</p>
        <p className="text-xs text-text-muted mt-0.5">{description}</p>
      </div>
      <button
        type="button"
        onClick={onChange}
        className={`relative w-10 h-5 rounded-full transition-colors duration-normal flex-shrink-0 ${
          checked ? 'bg-brand-mughal-green' : 'bg-border-subtle'
        }`}
        role="switch"
        aria-checked={checked}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-normal ${
            checked ? 'translate-x-[18px]' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  )
}

// Analytics Page - Backend Overview (Dashboard + Analytics Hybrid)
function AnalyticsPage() {
  const [timeRange, setTimeRange] = React.useState('7d')

  return (
    <div style={{ backgroundColor: 'var(--surface-paper)', minHeight: 'calc(100vh - 72px)' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '48px' }}>
        {/* Welcome Header */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <div>
              <p style={{ fontSize: '14px', color: 'rgba(11, 15, 12, 0.52)', margin: 0, marginBottom: '4px' }}>
                Welcome back
              </p>
              <h1 style={{ fontSize: '32px', fontWeight: 600, color: '#0B0F0C', letterSpacing: '-0.5px', margin: 0 }}>
                Overview Dashboard
              </h1>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                style={{
                  fontSize: '14px',
                  backgroundColor: '#fff',
                  border: '1px solid rgba(11, 15, 12, 0.12)',
                  borderRadius: '8px',
                  padding: '10px 14px',
                  color: 'var(--text-primary)',
                  cursor: 'pointer'
                }}>
                <option value="24h">Last 24 hours</option>
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
              </select>
              <button type="button" style={{
                padding: '10px 18px',
                backgroundColor: 'var(--brand-mughal-green)',
                color: '#fff',
                borderRadius: '8px',
                fontWeight: 500,
                fontSize: '14px',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--brand-mughal-green-2)'}
              onMouseLeave={(e) => e.target.style.backgroundColor = 'var(--brand-mughal-green)'}
              >
                Export Report
              </button>
            </div>
          </div>
          <p style={{ fontSize: '14px', color: 'rgba(11, 15, 12, 0.66)', margin: 0 }}>
            Here's what's happening with your platform today
          </p>
        </div>

        {/* Key Metrics - 4 Column Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
          <BackendMetricCard
            label="Total Revenue"
            value="$24,580"
            change="+12.5%"
            isUp={true}
            icon="dollar"
            delay={0}
          />
          <BackendMetricCard
            label="Active Users"
            value="8,249"
            change="+8.2%"
            isUp={true}
            icon="users"
            delay={50}
          />
          <BackendMetricCard
            label="Conversion Rate"
            value="3.24%"
            change="+0.8%"
            isUp={true}
            icon="trending"
            delay={100}
          />
          <BackendMetricCard
            label="Avg. Session"
            value="4m 12s"
            change="-0.3%"
            isUp={false}
            icon="clock"
            delay={150}
          />
        </div>

        {/* Main Content Grid - 2 Column */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', marginBottom: '20px' }}>
          {/* Revenue Chart */}
          <AnimatedCard delay={200}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#0B0F0C', margin: 0, marginBottom: '4px' }}>Revenue Overview</h3>
                <p style={{ fontSize: '13px', color: 'rgba(11, 15, 12, 0.52)', margin: 0 }}>Daily revenue and transactions</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '12px', height: '12px', backgroundColor: 'var(--brand-mughal-green)', borderRadius: '2px' }} />
                  <span style={{ fontSize: '12px', color: 'rgba(11, 15, 12, 0.52)' }}>Revenue</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '12px', height: '12px', backgroundColor: 'var(--brand-pistachio)', borderRadius: '2px' }} />
                  <span style={{ fontSize: '12px', color: 'rgba(11, 15, 12, 0.52)' }}>Transactions</span>
                </div>
              </div>
            </div>
            <SimpleBarChart />
          </AnimatedCard>

          {/* Quick Stats */}
          <AnimatedCard delay={250}>
            <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#0B0F0C', margin: 0, marginBottom: '20px' }}>Quick Stats</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <QuickStatRow label="Page Views" value="124.5K" trend="+18%" isUp={true} />
              <QuickStatRow label="Unique Visitors" value="42.1K" trend="+12%" isUp={true} />
              <QuickStatRow label="Bounce Rate" value="32.8%" trend="-5%" isUp={true} />
              <QuickStatRow label="Avg. Order Value" value="$84.50" trend="+7%" isUp={true} />
            </div>
            <div style={{ marginTop: '20px', padding: '16px', backgroundColor: 'var(--brand-bone)', borderRadius: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <span style={{ width: '8px', height: '8px', backgroundColor: 'var(--brand-pistachio)', borderRadius: '50%' }} />
                <p style={{ fontSize: '12px', fontWeight: 500, color: 'rgba(11, 15, 12, 0.66)', margin: 0 }}>System Status</p>
              </div>
              <p style={{ fontSize: '13px', color: '#0B0F0C', margin: 0 }}>All systems operational</p>
            </div>
          </AnimatedCard>
        </div>

        {/* Secondary Row - 3 Columns */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '20px' }}>
          {/* Top Products */}
          <AnimatedCard delay={300}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#0B0F0C', margin: 0 }}>Top Products</h3>
              <button type="button" style={{
                fontSize: '12px',
                color: 'var(--brand-mughal-green)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontWeight: 500
              }}>
                View all →
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <ProductRow name="Premium Plan" sales="1,234" revenue="$37K" />
              <ProductRow name="Starter Plan" sales="892" revenue="$18K" />
              <ProductRow name="Enterprise Plan" sales="234" revenue="$47K" />
              <ProductRow name="Add-on Services" sales="456" revenue="$9K" />
            </div>
          </AnimatedCard>

          {/* Traffic Sources */}
          <AnimatedCard delay={350}>
            <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#0B0F0C', margin: 0, marginBottom: '16px' }}>Traffic Sources</h3>
            <DonutChart />
            <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <SourceRow label="Organic Search" value="42%" color="var(--brand-mughal-green)" />
              <SourceRow label="Direct" value="28%" color="var(--brand-pistachio)" />
              <SourceRow label="Social Media" value="18%" color="var(--brand-bone)" />
              <SourceRow label="Referral" value="12%" color="#2C6B57" />
            </div>
          </AnimatedCard>

          {/* Recent Activity */}
          <AnimatedCard delay={400}>
            <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#0B0F0C', margin: 0, marginBottom: '16px' }}>Recent Activity</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <ActivityItem action="New user signup" time="2 min ago" type="success" />
              <ActivityItem action="Payment received" time="12 min ago" type="success" />
              <ActivityItem action="Support ticket opened" time="28 min ago" type="warning" />
              <ActivityItem action="Plan upgraded" time="1 hour ago" type="success" />
              <ActivityItem action="Invoice generated" time="2 hours ago" type="info" />
            </div>
          </AnimatedCard>
        </div>

        {/* Bottom Row - Full Width */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          {/* User Growth */}
          <AnimatedCard delay={450}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#0B0F0C', margin: 0 }}>User Growth</h3>
              <span style={{ fontSize: '12px', color: 'rgba(11, 15, 12, 0.52)', backgroundColor: 'var(--brand-bone)', padding: '6px 12px', borderRadius: '6px' }}>Last 30 days</span>
            </div>
            <div style={{ marginBottom: '16px' }}>
              <p style={{ fontSize: '28px', fontWeight: 600, color: '#0B0F0C', margin: 0, letterSpacing: '-0.5px' }}>8,249</p>
              <p style={{ fontSize: '13px', color: 'rgba(11, 15, 12, 0.66)', margin: 0, marginTop: '4px' }}>Active users this month</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <PerformanceBar label="Week 1" value={68} index={0} />
              <PerformanceBar label="Week 2" value={82} index={1} />
              <PerformanceBar label="Week 3" value={91} index={2} />
              <PerformanceBar label="Week 4" value={100} index={3} />
            </div>
          </AnimatedCard>

          {/* Top Pages */}
          <AnimatedCard delay={500}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#0B0F0C', margin: 0 }}>Top Pages</h3>
              <span style={{ fontSize: '12px', color: 'rgba(11, 15, 12, 0.52)', backgroundColor: 'var(--brand-bone)', padding: '6px 12px', borderRadius: '6px' }}>Last 7 days</span>
            </div>
            <div style={{ display: 'flex', padding: '8px 0', borderBottom: '1px solid rgba(11, 15, 12, 0.08)', marginBottom: '8px' }}>
              <span style={{ flex: 1, fontSize: '12px', fontWeight: 500, color: 'rgba(11, 15, 12, 0.52)' }}>Page</span>
              <span style={{ width: '80px', fontSize: '12px', fontWeight: 500, color: 'rgba(11, 15, 12, 0.52)', textAlign: 'right' }}>Views</span>
              <span style={{ width: '70px', fontSize: '12px', fontWeight: 500, color: 'rgba(11, 15, 12, 0.52)', textAlign: 'right' }}>Unique</span>
            </div>
            <PageRow page="/dashboard" views="24,521" bounce="18.2K" time="" />
            <PageRow page="/pricing" views="18,234" bounce="12.8K" time="" />
            <PageRow page="/features" views="12,087" bounce="8.4K" time="" />
            <PageRow page="/about" views="9,456" bounce="6.2K" time="" />
            <PageRow page="/contact" views="7,823" bounce="5.1K" time="" />
          </AnimatedCard>
        </div>
      </div>
    </div>
  )
}

// Animated Card wrapper
function AnimatedCard({ children, delay = 0 }) {
  const [isVisible, setIsVisible] = React.useState(false)
  const [isHovered, setIsHovered] = React.useState(false)

  React.useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay)
    return () => clearTimeout(timer)
  }, [delay])

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        backgroundColor: '#fff',
        borderRadius: '8px',
        padding: '16px',
        border: '1px solid rgba(11, 15, 12, 0.08)',
        transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
        opacity: isVisible ? 1 : 0,
        boxShadow: isHovered ? '0 8px 20px rgba(11, 15, 12, 0.08)' : 'none',
        transition: 'all 0.5s cubic-bezier(0.2, 0, 0, 1)'
      }}
    >
      {children}
    </div>
  )
}

// Backend Metric Card - More prominent design for main KPIs
function BackendMetricCard({ label, value, change, isUp, icon, delay = 0 }) {
  const [isHovered, setIsHovered] = React.useState(false)
  const [isVisible, setIsVisible] = React.useState(false)

  React.useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay)
    return () => clearTimeout(timer)
  }, [delay])

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        backgroundColor: '#fff',
        borderRadius: '12px',
        padding: '20px',
        border: '1px solid rgba(11, 15, 12, 0.08)',
        transform: isVisible ? (isHovered ? 'translateY(-4px)' : 'translateY(0)') : 'translateY(20px)',
        opacity: isVisible ? 1 : 0,
        boxShadow: isHovered ? '0 8px 24px rgba(11, 15, 12, 0.1)' : 'none',
        transition: 'all 0.4s cubic-bezier(0.2, 0, 0, 1)',
        cursor: 'pointer'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '12px' }}>
        <p style={{ fontSize: '13px', color: 'rgba(11, 15, 12, 0.52)', margin: 0, fontWeight: 500 }}>{label}</p>
        <span style={{
          fontSize: '12px',
          fontWeight: 600,
          padding: '4px 8px',
          borderRadius: '6px',
          backgroundColor: isUp ? 'var(--state-success-soft)' : 'var(--state-danger-soft)',
          color: isUp ? 'var(--state-success)' : 'var(--state-danger)'
        }}>
          {change}
        </span>
      </div>
      <p style={{
        fontSize: '28px',
        fontWeight: 600,
        color: '#0B0F0C',
        margin: 0,
        letterSpacing: '-0.5px'
      }}>{value}</p>
    </div>
  )
}

// Quick Stat Row Component
function QuickStatRow({ label, value, trend, isUp }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid rgba(11, 15, 12, 0.06)' }}>
      <div style={{ flex: 1 }}>
        <p style={{ fontSize: '13px', color: 'rgba(11, 15, 12, 0.66)', margin: 0 }}>{label}</p>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <p style={{ fontSize: '16px', fontWeight: 600, color: '#0B0F0C', margin: 0 }}>{value}</p>
        <span style={{
          fontSize: '12px',
          fontWeight: 500,
          color: isUp ? 'var(--state-success)' : 'var(--state-danger)'
        }}>
          {trend}
        </span>
      </div>
    </div>
  )
}

// Product Row Component
function ProductRow({ name, sales, revenue }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', backgroundColor: 'var(--brand-bone)', borderRadius: '8px' }}>
      <p style={{ fontSize: '13px', fontWeight: 500, color: '#0B0F0C', margin: 0, flex: 1 }}>{name}</p>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <p style={{ fontSize: '12px', color: 'rgba(11, 15, 12, 0.66)', margin: 0 }}>{sales} sales</p>
        <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--brand-mughal-green)', margin: 0 }}>{revenue}</p>
      </div>
    </div>
  )
}

// Activity Item Component
function ActivityItem({ action, time, type }) {
  const getColor = () => {
    switch (type) {
      case 'success': return 'var(--state-success)'
      case 'warning': return '#F59E0B'
      case 'info': return '#3B82F6'
      default: return 'rgba(11, 15, 12, 0.52)'
    }
  }

  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
      <span style={{
        width: '8px',
        height: '8px',
        backgroundColor: getColor(),
        borderRadius: '50%',
        marginTop: '6px',
        flexShrink: 0
      }} />
      <div style={{ flex: 1 }}>
        <p style={{ fontSize: '13px', color: '#0B0F0C', margin: 0, marginBottom: '2px' }}>{action}</p>
        <p style={{ fontSize: '12px', color: 'rgba(11, 15, 12, 0.52)', margin: 0 }}>{time}</p>
      </div>
    </div>
  )
}

// Interactive Bar Chart with animations
function SimpleBarChart() {
  const data = [
    { label: 'Mon', value: 65, views: '4.2K' },
    { label: 'Tue', value: 80, views: '5.1K' },
    { label: 'Wed', value: 72, views: '4.6K' },
    { label: 'Thu', value: 95, views: '6.1K' },
    { label: 'Fri', value: 85, views: '5.4K' },
    { label: 'Sat', value: 55, views: '3.5K' },
    { label: 'Sun', value: 60, views: '3.8K' },
  ]
  
  const [hoveredIndex, setHoveredIndex] = React.useState(null)
  const [animated, setAnimated] = React.useState(false)
  
  React.useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), 300)
    return () => clearTimeout(timer)
  }, [])
  
  return (
    <div style={{ height: '200px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '8px', paddingTop: '20px', position: 'relative' }}>
      {data.map((d, i) => (
        <div 
          key={d.label} 
          style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', position: 'relative' }}
          onMouseEnter={() => setHoveredIndex(i)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          {/* Tooltip */}
          {hoveredIndex === i && (
            <div style={{
              position: 'absolute',
              bottom: '100%',
              left: '50%',
              transform: 'translateX(-50%)',
              backgroundColor: 'var(--brand-mughal-green-2)',
              color: '#fff',
              padding: '8px 12px',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: 500,
              whiteSpace: 'nowrap',
              zIndex: 10,
              animation: 'fadeInUp 0.2s ease',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
            }}>
              {d.views} views
              <div style={{
                position: 'absolute',
                bottom: '-6px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: 0,
                height: 0,
                borderLeft: '6px solid transparent',
                borderRight: '6px solid transparent',
                borderTop: '6px solid var(--brand-mughal-green-2)'
              }} />
            </div>
          )}
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', height: '160px', justifyContent: 'flex-end' }}>
            <div style={{ 
              width: '100%', 
              maxWidth: '40px', 
              backgroundColor: hoveredIndex === i ? 'var(--brand-pistachio)' : 'var(--brand-mughal-green)', 
              borderRadius: '4px 4px 0 0', 
              height: animated ? `${d.value}%` : '0%',
              transition: `height 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) ${i * 0.08}s, background-color 0.2s ease`,
              cursor: 'pointer',
              transform: hoveredIndex === i ? 'scaleX(1.1)' : 'scaleX(1)',
            }} />
          </div>
          <span style={{ 
            fontSize: '12px', 
            color: hoveredIndex === i ? 'var(--brand-mughal-green)' : 'rgba(11, 15, 12, 0.52)',
            fontWeight: hoveredIndex === i ? 600 : 400,
            transition: 'all 0.2s ease'
          }}>{d.label}</span>
        </div>
      ))}
    </div>
  )
}

// Source Row with hover effect
function SourceRow({ label, value, color }) {
  const [isHovered, setIsHovered] = React.useState(false)
  
  return (
    <div 
      style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        padding: '10px 8px',
        margin: '0 -8px',
        borderRadius: '6px',
        backgroundColor: isHovered ? 'rgba(11, 15, 12, 0.04)' : 'transparent',
        transition: 'all 0.2s ease',
        cursor: 'pointer'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ 
          width: '12px', 
          height: '12px', 
          backgroundColor: color, 
          borderRadius: '2px',
          transform: isHovered ? 'scale(1.3)' : 'scale(1)',
          transition: 'transform 0.2s ease'
        }} />
        <span style={{ 
          fontSize: '14px', 
          color: isHovered ? '#0B0F0C' : 'rgba(11, 15, 12, 0.70)',
          transition: 'color 0.2s ease'
        }}>{label}</span>
      </div>
      <span style={{ 
        fontSize: '14px', 
        fontWeight: 500, 
        color: '#0B0F0C',
        transform: isHovered ? 'scale(1.1)' : 'scale(1)',
        transition: 'transform 0.2s ease'
      }}>{value}</span>
    </div>
  )
}

// Animated Performance Bar
function PerformanceBar({ label, value, index = 0 }) {
  const [isHovered, setIsHovered] = React.useState(false)
  const [animated, setAnimated] = React.useState(false)
  
  React.useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), 500 + index * 100)
    return () => clearTimeout(timer)
  }, [index])
  
  return (
    <div 
      style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '16px', 
        marginBottom: '16px',
        padding: '8px',
        margin: '0 -8px 16px -8px',
        borderRadius: '8px',
        backgroundColor: isHovered ? 'var(--accent-soft-weak)' : 'transparent',
        transition: 'all 0.2s ease',
        cursor: 'pointer'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <span style={{ 
        fontSize: '14px', 
        color: isHovered ? 'var(--brand-mughal-green)' : 'rgba(11, 15, 12, 0.70)', 
        width: '100px', 
        flexShrink: 0,
        fontWeight: isHovered ? 500 : 400,
        transition: 'all 0.2s ease'
      }}>{label}</span>
      <div style={{ 
        flex: 1, 
        height: isHovered ? '14px' : '12px', 
        backgroundColor: 'var(--brand-bone)', 
        borderRadius: '4px', 
        overflow: 'hidden',
        transition: 'height 0.2s ease'
      }}>
        <div style={{ 
          height: '100%', 
          width: animated ? `${value}%` : '0%', 
          backgroundColor: isHovered ? 'var(--brand-pistachio)' : 'var(--brand-mughal-green)', 
          borderRadius: '4px',
          transition: `width 0.8s cubic-bezier(0.34, 1.56, 0.64, 1), background-color 0.2s ease`
        }} />
      </div>
      <span style={{ 
        fontSize: '14px', 
        fontWeight: 600, 
        color: isHovered ? 'var(--brand-mughal-green)' : '#0B0F0C', 
        width: '48px', 
        textAlign: 'right',
        transition: 'all 0.2s ease'
      }}>{value}%</span>
    </div>
  )
}

// Page Row with hover effect
function PageRow({ page, views, bounce, time }) {
  const [isHovered, setIsHovered] = React.useState(false)
  
  return (
    <div 
      style={{ 
        display: 'flex', 
        padding: '12px 8px', 
        margin: '0 -8px',
        borderBottom: '1px solid rgba(11, 15, 12, 0.08)',
        borderRadius: isHovered ? '6px' : '0',
        backgroundColor: isHovered ? 'var(--accent-soft)' : 'transparent',
        transform: isHovered ? 'translateX(4px)' : 'translateX(0)',
        transition: 'all 0.2s ease',
        cursor: 'pointer'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <span style={{ 
        flex: 1, 
        fontSize: '14px', 
        fontWeight: isHovered ? 600 : 500, 
        color: isHovered ? 'var(--brand-mughal-green)' : '#0B0F0C',
        transition: 'all 0.2s ease'
      }}>{page}</span>
      <span style={{ width: '80px', fontSize: '14px', color: 'rgba(11, 15, 12, 0.70)', textAlign: 'right' }}>{views}</span>
      <span style={{ width: '64px', fontSize: '14px', color: 'rgba(11, 15, 12, 0.70)', textAlign: 'right' }}>{bounce}</span>
      <span style={{ width: '64px', fontSize: '14px', color: 'rgba(11, 15, 12, 0.70)', textAlign: 'right' }}>{time}</span>
    </div>
  )
}

// Insight Card with animations
function InsightCard({ title, description, metric, metricLabel, delay = 0 }) {
  const [isHovered, setIsHovered] = React.useState(false)
  const [isVisible, setIsVisible] = React.useState(false)
  const [count, setCount] = React.useState(0)
  
  // Extract number from metric for animation
  const numericValue = parseFloat(metric.replace(/[^0-9.]/g, '')) || 0
  const suffix = metric.replace(/[0-9.]/g, '')
  
  React.useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay)
    return () => clearTimeout(timer)
  }, [delay])
  
  // Animate counter
  React.useEffect(() => {
    if (!isVisible) return
    
    const duration = 1000
    const steps = 30
    const increment = numericValue / steps
    let current = 0
    
    const timer = setInterval(() => {
      current += increment
      if (current >= numericValue) {
        setCount(numericValue)
        clearInterval(timer)
      } else {
        setCount(current)
      }
    }, duration / steps)
    
    return () => clearInterval(timer)
  }, [isVisible, numericValue])
  
  return (
    <div 
      style={{ 
        backgroundColor: isHovered ? 'var(--brand-mughal-green)' : '#fff', 
        borderRadius: '8px', 
        padding: '24px', 
        border: '1px solid rgba(11, 15, 12, 0.08)',
        transform: isVisible ? (isHovered ? 'scale(1.02)' : 'scale(1)') : 'translateY(20px)',
        opacity: isVisible ? 1 : 0,
        transition: 'all 0.4s cubic-bezier(0.2, 0, 0, 1)',
        cursor: 'pointer'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <h4 style={{ 
        fontSize: '14px', 
        fontWeight: 500, 
        color: isHovered ? '#fff' : '#0B0F0C', 
        margin: 0, 
        marginBottom: '4px',
        transition: 'color 0.3s ease'
      }}>{title}</h4>
      <p style={{ 
        fontSize: '12px', 
        color: isHovered ? 'rgba(255,255,255,0.66)' : 'rgba(11, 15, 12, 0.52)', 
        margin: 0, 
        marginBottom: '16px',
        transition: 'color 0.3s ease'
      }}>{description}</p>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
        <span style={{ 
          fontSize: '28px', 
          fontWeight: 300, 
          color: isHovered ? 'var(--brand-pistachio)' : 'var(--brand-mughal-green)', 
          letterSpacing: '-0.3px',
          transition: 'all 0.3s ease'
        }}>
          {metric.includes(':') ? metric : `${Math.round(count)}${suffix}`}
        </span>
        <span style={{ 
          fontSize: '12px', 
          color: isHovered ? 'rgba(255,255,255,0.66)' : 'rgba(11, 15, 12, 0.52)',
          transition: 'color 0.3s ease'
        }}>{metricLabel}</span>
      </div>
    </div>
  )
}

// Sidebar Nav Item with animation
function SidebarNavItem({ item, isActive, onClick, delay }) {
  const [isHovered, setIsHovered] = React.useState(false)
  const [isVisible, setIsVisible] = React.useState(false)
  
  React.useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay)
    return () => clearTimeout(timer)
  }, [delay])
  
  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '12px 16px',
        borderRadius: '8px',
        fontSize: '14px',
        fontWeight: 500,
        border: 'none',
        cursor: 'pointer',
        marginBottom: '4px',
        backgroundColor: isActive ? 'rgba(255,255,255,0.15)' : (isHovered ? 'rgba(255,255,255,0.08)' : 'transparent'),
        color: isActive ? '#fff' : (isHovered ? '#fff' : 'rgba(255,255,255,0.66)'),
        transform: isVisible ? (isHovered && !isActive ? 'translateX(4px)' : 'translateX(0)') : 'translateX(-20px)',
        opacity: isVisible ? 1 : 0,
        transition: 'all 0.25s cubic-bezier(0.2, 0, 0, 1)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Active indicator */}
      {isActive && (
        <span style={{
          position: 'absolute',
          left: 0,
          top: '50%',
          transform: 'translateY(-50%)',
          width: '3px',
          height: '60%',
          backgroundColor: 'var(--brand-pistachio)',
          borderRadius: '0 4px 4px 0'
        }} />
      )}
      <span style={{
        transform: isHovered && !isActive ? 'scale(1.15)' : 'scale(1)',
        transition: 'transform 0.2s ease'
      }}>
        <SidebarIcon type={item.icon} />
      </span>
      {item.label}
    </button>
  )
}

// Sidebar Icon Component
function SidebarIcon({ type }) {
  const icons = {
    grid: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.75">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
    activity: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.75">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12h4l3-9 4 18 3-9h4" />
      </svg>
    ),
    users: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.75">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M23 20v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    file: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.75">
        <path strokeLinecap="round" strokeLinejoin="round" d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
      </svg>
    ),
    dollar: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.75">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    ),
  }
  return icons[type] || null
}

// KPI Card with Sparkline
function KpiCard({ label, value, change, trend, sparkData }) {
  const max = Math.max(...sparkData)
  const points = sparkData.map((v, i) => `${(i / (sparkData.length - 1)) * 100},${100 - (v / max) * 100}`).join(' ')
  
  return (
    <div className="bg-white rounded-xl p-5 border border-border-subtle">
      <div className="flex items-start justify-between mb-3">
        <p className="text-xs text-text-muted">{label}</p>
        <span className={`text-xs font-medium px-2 py-0.5 rounded ${
          trend === 'up' 
            ? 'bg-state-success-soft text-state-success' 
            : 'bg-state-danger-soft text-state-danger'
        }`}>
          {change}
        </span>
      </div>
      <p className="text-2xl font-semibold text-text-primary mb-3" style={{ letterSpacing: '-0.3px' }}>
        {value}
      </p>
      {/* Mini Sparkline */}
      <svg className="w-full h-8" viewBox="0 0 100 100" preserveAspectRatio="none">
        <polyline
          fill="none"
          stroke={trend === 'up' ? 'var(--state-success)' : 'var(--state-danger)'}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={points}
        />
      </svg>
    </div>
  )
}

// Area Chart Component
function AreaChart() {
  const data = [
    { label: 'Mon', views: 4200, visitors: 2800 },
    { label: 'Tue', views: 5100, visitors: 3200 },
    { label: 'Wed', views: 4800, visitors: 3000 },
    { label: 'Thu', views: 6200, visitors: 4100 },
    { label: 'Fri', views: 5500, visitors: 3600 },
    { label: 'Sat', views: 3800, visitors: 2400 },
    { label: 'Sun', views: 4100, visitors: 2600 },
  ]
  const maxVal = Math.max(...data.map(d => d.views))
  
  return (
    <div className="relative h-48">
      {/* Y-axis labels */}
      <div className="absolute left-0 top-0 bottom-6 w-10 flex flex-col justify-between text-xs text-text-muted">
        <span>{(maxVal / 1000).toFixed(0)}k</span>
        <span>{(maxVal / 2000).toFixed(0)}k</span>
        <span>0</span>
      </div>
      
      {/* Chart area */}
      <div className="ml-12 h-full flex items-end justify-between gap-2 pb-6 border-b border-border-subtle">
        {data.map((d, i) => (
          <div key={d.label} className="flex-1 flex flex-col items-center gap-1">
            <div className="w-full flex flex-col items-center gap-1" style={{ height: '140px' }}>
              {/* Views bar */}
              <div 
                className="w-full bg-brand-mughal-green rounded-t transition-all duration-slow"
                style={{ height: `${(d.views / maxVal) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
      
      {/* X-axis labels */}
      <div className="ml-12 flex justify-between pt-2">
        {data.map(d => (
          <span key={d.label} className="flex-1 text-center text-xs text-text-muted">{d.label}</span>
        ))}
      </div>
    </div>
  )
}

// Animated Donut Chart Component
function DonutChart() {
  const size = 160
  const strokeWidth = 24
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  
  const segments = [
    { percent: 42, color: 'var(--brand-mughal-green)', label: 'Organic' },
    { percent: 28, color: 'var(--brand-pistachio)', label: 'Direct' },
    { percent: 18, color: 'var(--brand-bone)', label: 'Social' },
    { percent: 12, color: '#2C6B57', label: 'Referral' },
  ]
  
  const [animated, setAnimated] = React.useState(false)
  const [hoveredIndex, setHoveredIndex] = React.useState(null)
  
  React.useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), 400)
    return () => clearTimeout(timer)
  }, [])
  
  let offset = 0
  
  return (
    <div style={{ display: 'flex', justifyContent: 'center', position: 'relative' }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        {segments.map((seg, i) => {
          const dashArray = (seg.percent / 100) * circumference
          const dashOffset = -offset
          offset += dashArray
          
          const isHovered = hoveredIndex === i
          
          return (
            <circle
              key={i}
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={seg.color}
              strokeWidth={isHovered ? strokeWidth + 6 : strokeWidth}
              strokeDasharray={animated ? `${dashArray} ${circumference}` : `0 ${circumference}`}
              strokeDashoffset={dashOffset}
              style={{ 
                transition: `stroke-dasharray 1s cubic-bezier(0.34, 1.56, 0.64, 1) ${i * 0.15}s, stroke-width 0.2s ease`,
                cursor: 'pointer',
                filter: isHovered ? 'brightness(1.1)' : 'none'
              }}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
            />
          )
        })}
      </svg>
      {/* Center text */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        textAlign: 'center',
        transition: 'all 0.3s ease'
      }}>
        <p style={{ 
          fontSize: hoveredIndex !== null ? '24px' : '20px', 
          fontWeight: 600, 
          color: '#0B0F0C', 
          margin: 0,
          transition: 'all 0.3s ease'
        }}>
          {hoveredIndex !== null ? `${segments[hoveredIndex].percent}%` : '100%'}
        </p>
        <p style={{ 
          fontSize: '11px', 
          color: 'rgba(11, 15, 12, 0.52)', 
          margin: 0 
        }}>
          {hoveredIndex !== null ? segments[hoveredIndex].label : 'Total'}
        </p>
      </div>
    </div>
  )
}

// Source Legend Item
function SourceLegendItem({ label, value, color }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className={`w-3 h-3 ${color} rounded-sm`} />
        <span className="text-sm text-text-secondary">{label}</span>
      </div>
      <span className="text-sm font-medium text-text-primary">{value}</span>
    </div>
  )
}

// Bar Chart Component
function BarChart() {
  const data = [
    { label: 'Blog Posts', value: 85 },
    { label: 'Videos', value: 72 },
    { label: 'Podcasts', value: 58 },
    { label: 'Tutorials', value: 45 },
    { label: 'Case Studies', value: 38 },
  ]
  
  return (
    <div className="space-y-4">
      {data.map(item => (
        <div key={item.label} className="flex items-center gap-4">
          <span className="text-sm text-text-secondary w-24 flex-shrink-0">{item.label}</span>
          <div className="flex-1 h-3 bg-surface-bone rounded-pill overflow-hidden">
            <div 
              className="h-full bg-brand-mughal-green rounded-pill transition-all duration-slow"
              style={{ width: `${item.value}%` }}
            />
          </div>
          <span className="text-sm font-medium text-text-primary w-12 text-right">{item.value}%</span>
        </div>
      ))}
    </div>
  )
}

// Table Row Component
function TableRow({ page, views, bounce, time, isLast }) {
  return (
    <div className={`flex items-center py-3 ${!isLast ? 'border-b border-border-subtle' : ''}`}>
      <span className="flex-1 text-sm font-medium text-text-primary truncate">{page}</span>
      <span className="w-20 text-sm text-text-secondary text-right">{views}</span>
      <span className="w-16 text-sm text-text-secondary text-right">{bounce}</span>
      <span className="w-16 text-sm text-text-secondary text-right">{time}</span>
    </div>
  )
}

// Trend Card Component
function TrendCard({ title, description, metric, metricLabel }) {
  return (
    <div className="bg-white rounded-xl p-6 border border-border-subtle">
      <h4 className="text-sm font-medium text-text-primary mb-1">{title}</h4>
      <p className="text-xs text-text-muted mb-4">{description}</p>
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-light text-brand-mughal-green" style={{ letterSpacing: '-0.3px' }}>
          {metric}
        </span>
        <span className="text-xs text-text-muted">{metricLabel}</span>
      </div>
    </div>
  )
}

function DashboardPage({ onOpenBlogPost, onViewAllBlog }) {
  return (
    <div className="space-y-12">
      {/* Hero Panel */}
      <section className="bg-brand-mughal-green rounded-2xl p-8 relative overflow-hidden">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-20">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <rect
              x="60%"
              y="-10%"
              width="300"
              height="200"
              rx="4"
              fill="none"
              stroke="rgba(220, 222, 197, 0.28)"
              strokeWidth="1"
            />
            <rect
              x="70%"
              y="60%"
              width="400"
              height="250"
              rx="4"
              fill="none"
              stroke="rgba(220, 222, 197, 0.28)"
              strokeWidth="1"
            />
          </svg>
        </div>

        <div className="relative z-10">
          <p className="text-text-inverse-muted text-sm mb-2">Creator Analytics</p>
          <h1 className="text-4xl font-semibold text-text-inverse mb-4" style={{ letterSpacing: '-0.8px' }}>
            Performance Overview
          </h1>
          <p className="text-text-inverse-muted text-md max-w-xl mb-8">
            Track your content performance, audience growth, and engagement metrics across all platforms.
          </p>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <MetricCard label="Total Views" value="2.4M" change="+12.5%" trend="up" />
            <MetricCard label="Engagement Rate" value="8.3%" change="+2.1%" trend="up" />
            <MetricCard label="Avg. Watch Time" value="4m 32s" change="-0.8%" trend="down" />
          </div>
        </div>
      </section>

      {/* Content Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Audience Growth Card */}
        <div className="bg-white rounded-xl p-6 border border-border-subtle">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-medium text-text-primary">Audience Growth</h2>
            <span className="text-xs text-text-muted bg-surface-bone px-3 py-1.5 rounded-pill">Last 30 days</span>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-light text-text-primary mb-1" style={{ letterSpacing: '-0.5px' }}>
                  124.5K
                </p>
                <p className="text-sm text-text-secondary">Total Followers</p>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 bg-state-success-soft rounded-lg">
                <svg className="w-4 h-4 text-state-success" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M8 12a.5.5 0 0 0 .5-.5V5.707l2.146 2.147a.5.5 0 0 0 .708-.708l-3-3a.5.5 0 0 0-.708 0l-3 3a.5.5 0 1 0 .708.708L7.5 5.707V11.5a.5.5 0 0 0 .5.5z" />
                </svg>
                <span className="text-sm font-medium text-state-success">+18.2%</span>
              </div>
            </div>

            {/* Simple bar chart representation */}
            <div className="space-y-3 pt-4">
              <ChartBar label="Week 1" value={75} />
              <ChartBar label="Week 2" value={88} />
              <ChartBar label="Week 3" value={92} />
              <ChartBar label="Week 4" value={100} />
            </div>
          </div>
        </div>

        {/* Top Content Card */}
        <div className="bg-white rounded-xl p-6 border border-border-subtle">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-medium text-text-primary">Top Performing Content</h2>
            <button className="text-sm text-brand-mughal-green hover:text-brand-mughal-green-2 transition-colors" type="button">
              View all
            </button>
          </div>

          <div className="space-y-4">
            <ContentItem title="How to Build Better Products" views="342K" engagement="9.2%" />
            <ContentItem title="Design Systems 101" views="298K" engagement="8.7%" />
            <ContentItem title="Creator Economy Trends" views="267K" engagement="8.1%" />
            <ContentItem title="Monetization Strategies" views="189K" engagement="7.5%" />
          </div>
        </div>
      </div>

      {/* Action Panel */}
      <div className="bg-brand-pistachio rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h2 className="text-2xl font-semibold text-text-on-bone mb-2" style={{ letterSpacing: '-0.3px' }}>
            Ready to dive deeper?
          </h2>
          <p className="text-text-on-bone opacity-80 text-md">
            Export your analytics or schedule a detailed performance review.
          </p>
        </div>
        <div className="flex gap-3 flex-shrink-0">
          <button className="px-6 py-3 bg-white text-brand-mughal-green rounded-lg font-medium text-sm hover:shadow-sm transition-all duration-normal" type="button">
            Export Data
          </button>
          <button className="px-6 py-3 bg-brand-mughal-green text-white rounded-lg font-medium text-sm hover:bg-brand-mughal-green-2 transition-all duration-normal" type="button">
            Schedule Review
          </button>
        </div>
      </div>

      {/* Blog Section */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-medium text-text-primary">Latest articles</h2>
          <button
            type="button"
            onClick={() => onViewAllBlog?.()}
            className="text-sm text-brand-mughal-green hover:text-brand-mughal-green-2 transition-colors"
          >
            View all
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {BLOG_POSTS.map((post) => (
            <BlogCard
              key={post.slug}
              post={post}
              onOpen={() => onOpenBlogPost?.(post.slug)}
            />
          ))}
        </div>
      </section>
    </div>
  )
}

// Component: Metric Card for Hero Panel
function MetricCard({ label, value, change, trend }) {
  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-5 border border-white/20">
      <p className="text-text-inverse-muted text-xs mb-2">{label}</p>
      <div className="flex items-baseline gap-3">
        <p className="text-3xl font-light text-text-inverse" style={{ letterSpacing: '-0.5px' }}>
          {value}
        </p>
        <span className={`text-sm font-medium ${trend === 'up' ? 'text-brand-pistachio' : 'text-red-300'}`}>
          {change}
        </span>
      </div>
    </div>
  )
}

// Component: Chart Bar
function ChartBar({ label, value }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-text-muted w-12 flex-shrink-0">{label}</span>
      <div className="flex-1 h-2 bg-surface-bone rounded-pill overflow-hidden">
        <div 
          className="h-full bg-brand-mughal-green rounded-pill transition-all duration-slow"
          style={{ width: `${value}%` }}
        />
      </div>
      <span className="text-xs text-text-secondary font-medium w-8 text-right">{value}%</span>
    </div>
  )
}

// Component: Content Item
function ContentItem({ title, views, engagement }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-border-subtle last:border-0">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-text-primary mb-1 truncate">{title}</p>
        <p className="text-xs text-text-muted">{views} views</p>
      </div>
      <div className="flex items-center gap-2 ml-4">
        <span className="text-xs font-medium text-text-primary bg-surface-bone px-2.5 py-1 rounded-pill">
          {engagement}
        </span>
      </div>
    </div>
  )
}

// Component: Blog Card (teaser)
function BlogCard({ post, onOpen }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="text-left bg-white border border-border-subtle p-6 rounded-xl hover:shadow-sm transition-all duration-normal focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
    >
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xs font-medium text-text-primary bg-surface-bone px-2.5 py-1 rounded-pill">
          {post.tag}
        </span>
        <span className="text-xs text-text-muted">{post.date}</span>
      </div>
      <h3 className="text-lg font-medium text-text-primary mb-2">{post.title}</h3>
      <p className="text-sm text-text-secondary">{post.excerpt}</p>
      <div className="mt-4 flex items-center justify-between">
        <span className="text-sm text-brand-mughal-green">Read more</span>
        <span className="text-xs text-text-muted">{post.readingTime}</span>
      </div>
    </button>
  )
}

export default App
