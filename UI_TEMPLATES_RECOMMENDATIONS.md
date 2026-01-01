# UI Templates & Design Recommendations for MarketRisk

## Current Situation

You have a well-designed marketing website in `creator-dashboard/` with:
- Landing page with 4 hero variations
- Professional SaaS-style components
- MarketRisk branding (Mughal Green, Pistachio, Bone, Paper colors)
- Multiple page templates (About, Pricing, FAQ, Contact, Blog, etc.)

---

## Marketing Website Templates (From creator-dashboard)

### 1. Hero Sections (4 Variations Available)
Your existing landing page has 4 professional hero templates:

**HeroV1** - Clean & Modern
- Large headline
- Subheadline
- CTA buttons (primary + secondary)
- Hero image/illustration placeholder
- Best for: B2B SaaS, professional services

**HeroV2** - Feature-Focused
- Split layout (text + visual)
- Feature highlights
- Trust badges
- Social proof elements
- Best for: Feature-rich products

**HeroV3** - Conversion-Optimized
- Centered layout
- Strong value proposition
- Email capture form
- Customer logos
- Best for: Lead generation

**HeroV4** - Data-Driven
- Stats/metrics display
- Visual demo
- Multi-CTA layout
- Use case highlights
- Best for: Analytics/data products like MarketRisk

**Recommendation**: Use **HeroV4** - it's perfect for a credit risk monitoring platform with stats and data visualization.

### 2. Marketing Pages You Already Have

✅ **Landing** (`Landing.jsx`)
- Hero section
- Features grid
- How it works (steps)
- Testimonials
- Pricing teaser
- FAQ section
- CTA section

✅ **About** (`About.jsx`)
- Company story
- Mission/Vision
- Team section
- Values

✅ **Pricing** (`Pricing.jsx`)
- 4-tier pricing (Free, Starter, Pro, Enterprise)
- Feature comparison
- FAQ
- CTA

✅ **FAQ** (`FAQ.jsx`)
- Accordion-style Q&A
- Categorized questions
- Search functionality

✅ **Contact** (`Contact.jsx`)
- Contact form
- Email/phone
- Map (optional)

✅ **Blog** (`BlogIndex.jsx`, `BlogPost.jsx`)
- Blog listing
- Individual post template
- Categories/tags

✅ **Privacy & Terms** (`Privacy.jsx`, `Terms.jsx`)
- Legal pages

---

## Dashboard/App Templates - Recommendations

Since you'll have the app at `/app/dashboard`, here are modern SaaS dashboard templates I recommend:

### Option 1: Clean Minimalist Dashboard (Recommended)
**Style**: Similar to Stripe, Linear, Notion
**Layout**:
```
┌─────────────────────────────────────────┐
│  Logo  │  Search  │  User │  Notifications│
├────────┴──────────────────────────────┤
│ Sidebar │ Main Content Area            │
│         │                              │
│ • Dashboard │ Stats Cards (3-4)       │
│ • Search    │ ┌────┐ ┌────┐ ┌────┐  │
│ • Watchlist │ │    │ │    │ │    │  │
│ • Alerts    │ └────┘ └────┘ └────┘  │
│ • Reports   │                        │
│ • Settings  │ Recent Activity Table  │
│             │ ┌────────────────────┐ │
│             │ │                    │ │
│             │ │                    │ │
│             │ └────────────────────┘ │
└─────────────────────────────────────────┘
```

**Components Needed**:
- Sidebar navigation
- Stat cards (searches left, watchlist count, alerts)
- Data table (companies, alerts, history)
- Company risk score badge (GREEN/YELLOW/RED)
- Chart components (risk trends)
- Search bar with autocomplete

**Color Usage**:
- Mughal Green: Primary actions, headers
- Pistachio: Success states, positive metrics
- Red/Yellow: Risk indicators
- Bone/Paper: Backgrounds, cards

### Option 2: Card-Based Dashboard
**Style**: Similar to Airtable, Monday.com
**Layout**: Grid of interactive cards
**Best for**: Visual data exploration

### Option 3: Data-Heavy Dashboard
**Style**: Similar to Tableau, Metabase
**Layout**: Charts and graphs prominent
**Best for**: Analytics-focused users

**Recommendation**: **Option 1 (Clean Minimalist)** - Perfect balance for credit risk monitoring.

---

## Admin Dashboard Template Recommendations

For the admin panel (if needed), here's what I suggest:

### Admin Dashboard Layout
```
┌─────────────────────────────────────────┐
│  Logo  │  Admin Panel │  User │  Logout  │
├────────┴──────────────────────────────┤
│ Sidebar │ Main Content                 │
│         │                              │
│ • Overview  │ Key Metrics Grid        │
│ • Users     │ ┌────┐ ┌────┐ ┌────┐  │
│ • Companies │ │Users│ │Srch│ │Rev │ │
│ • Analytics │ └────┘ └────┘ └────┘  │
│ • Settings  │                        │
│ • Billing   │ Users Table            │
│ • Logs      │ ┌────────────────────┐ │
│             │ │ Name │ Plan │ Usage││
│             │ │ ...  │ ...  │ ... ││
│             │ └────────────────────┘ │
└─────────────────────────────────────────┘
```

**Features**:
- User management (view, edit, delete, change plans)
- Usage analytics (searches, API calls)
- Revenue metrics
- System health monitoring
- Activity logs
- Billing management
- Email templates editor

**Style**: More data-dense than user dashboard, tables and charts

---

## Recommended Dashboard Components

### 1. Stats Cards
```tsx
<StatsCard
  title="Căutări Rămase"
  value="47"
  limit="50"
  icon={Search}
  trend="+12 luna aceasta"
  color="green"
/>
```

### 2. Risk Score Badge
```tsx
<RiskBadge
  score={45}
  level="YELLOW" // GREEN, YELLOW, RED
  size="large"
/>
```

### 3. Company Card
```tsx
<CompanyCard
  name="SC Example SRL"
  cui="12345678"
  riskScore={25}
  riskLevel="GREEN"
  lastChecked="2 ore"
  onView={() => ...}
  onRemove={() => ...}
/>
```

### 4. Alert Card
```tsx
<AlertCard
  type="risk_change"
  severity="warning"
  company="SC Example SRL"
  message="Scorul de risc a crescut de la 15 la 45"
  timestamp="acum 3 ore"
  read={false}
/>
```

### 5. Data Table
```tsx
<DataTable
  columns={['Companie', 'CUI', 'Risc', 'Ultima verificare', 'Acțiuni']}
  data={companies}
  sortable
  filterable
  pagination
/>
```

### 6. Search Bar with Autocomplete
```tsx
<SearchBar
  placeholder="Caută companie după CUI sau denumire..."
  onSearch={handleSearch}
  suggestions={recentSearches}
  loading={isSearching}
/>
```

### 7. Chart Components
```tsx
<RiskTrendChart
  data={riskHistory}
  period="30d"
  height={300}
/>
```

---

## Design System Consistency

### Colors (Already Defined)
- **Primary**: Mughal Green (#2F5232) - buttons, links, headers
- **Success**: Pistachio (#8ACA74) - low risk, positive actions
- **Warning**: Yellow (#B78A2A) - medium risk
- **Danger**: Red (#B23A3A) - high risk
- **Background**: Paper (#F4F4EE) - page background
- **Cards**: White (#FFFFFF) - content cards
- **Borders**: Bone (#DCDEC5) - subtle borders

### Typography
- **Font**: Sora (already loaded)
- **Headings**: Semibold, -0.3px letter spacing
- **Body**: Regular, 14px
- **Small**: 12px for metadata

### Spacing
- Base unit: 4px
- Consistent 4px border radius (already defined)

### Components to Build
Priority order for dashboard:
1. Sidebar navigation
2. Stat cards
3. Company search component
4. Risk score badge
5. Watchlist table
6. Alerts list
7. Company detail page
8. Settings page

---

## Migration Strategy

I'll migrate the marketing pages to Next.js with this structure:

```
app/
├── (marketing)/          # Public marketing pages
│   ├── layout.tsx        # Marketing layout (header, footer)
│   ├── page.tsx          # Homepage (from Landing.jsx)
│   ├── about/
│   ├── pricing/
│   ├── contact/
│   ├── faq/
│   ├── blog/
│   ├── privacy/
│   └── terms/
│
├── (auth)/               # Authentication pages
│   ├── login/
│   ├── signup/
│   └── forgot-password/
│
└── (app)/                # Protected app
    ├── layout.tsx        # App layout (sidebar, header)
    ├── dashboard/        # Main dashboard at /app/dashboard
    ├── search/           # Company search
    ├── watchlist/        # Monitored companies
    ├── alerts/           # Notifications
    ├── history/          # Search history
    └── settings/         # User settings
```

---

## Next Steps

Would you like me to:

1. **Start migrating marketing pages** from creator-dashboard to Next.js (recommended order: Homepage → Pricing → About → FAQ → Contact → Blog)

2. **Build the dashboard components** I described above (sidebar, stats cards, search, etc.)

3. **Create an admin dashboard** for managing users and viewing analytics

4. **All of the above** (full migration + dashboard build)

Let me know which path you'd like to take!
