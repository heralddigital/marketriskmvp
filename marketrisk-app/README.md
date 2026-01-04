# MarketRisk - B2B Credit Risk Monitoring SaaS

**Monitoringul riscului de credit pentru piața românească**

A production-ready Next.js 15 application for monitoring Romanian company credit risk using ANAF, PortalJust, and BPI data sources.

---

## 🎯 Project Status

### ✅ Completed Phases

#### PHASE 1: Project Foundation
- ✅ Next.js 15 with App Router initialized
- ✅ TypeScript configuration
- ✅ Tailwind CSS 4 with custom MarketRisk theme
- ✅ Complete folder structure (marketing, auth, app routes)
- ✅ Environment variables template

#### PHASE 2: Database Schema & Supabase Setup
- ✅ Complete PostgreSQL schema (7 tables)
- ✅ Row Level Security (RLS) policies
- ✅ Database triggers and functions
- ✅ Indexes for performance optimization
- ✅ Supabase client utilities (browser, server, service role)
- ✅ TypeScript type definitions for database

#### PHASE 3: Proprietary Risk Scoring Algorithm
- ✅ MarketRisk Credit Score (MRCS) implementation
- ✅ 5 risk categories with weighted scoring
- ✅ GREEN/YELLOW/RED risk levels
- ✅ Risk trend analysis
- ✅ Romanian language factor descriptions

#### PHASE 4: ANAF API Integration ✅
- ✅ ANAF API v9 client implementation
- ✅ Company data fetching and parsing
- ✅ Risk scoring algorithm (24 factors)
- ✅ Search history tracking
- ✅ Plan-based usage limits

#### PHASE 5: PortalJust API Integration ✅
- ✅ SOAP client for PortalJust (Romanian Ministry of Justice)
- ✅ Court case data fetching
- ✅ Litigation risk metrics calculation
- ✅ Integration into risk scoring algorithm
- ✅ LitigationCard component for display
- ✅ Dashboard widget for latest cases
- ✅ Plaintiff/defendant role differentiation in scoring

### 🚧 Next Steps

1. **Set up Supabase Project**
   - Create project at [supabase.com](https://supabase.com)
   - Run migrations from `supabase/migrations/`
   - Update `.env.local` with credentials

2. **BPI API Integration** (Insolvency Registry)
3. **Email Notifications** (Resend integration)
4. **PDF Report Generation**
5. **Payment Processing** (Stripe integration)

---

## 📋 Features

### Core Functionality
- ✅ **Multi-factor Risk Scoring Algorithm**
  - Legal & Regulatory Status (60 points max)
  - Litigation & Legal Risk (40 points max)
  - Financial Behavior (30 points max)
  - Operational Red Flags (20 points max)
  - Positive Adjustments (negative points)

- ✅ **Data Integrations**
  - ✅ ANAF (Romanian Tax Authority) - Fully integrated
  - ✅ PortalJust (Litigation Database) - Fully integrated with SOAP API
  - 🚧 BPI (Insolvency Registry) - Structure ready, needs API access
  - ✅ 24-hour response caching for all APIs

- ✅ **SaaS Features**
  - ✅ Company search (CUI lookup) with ANAF + PortalJust data
  - ✅ Watchlist management with plan-based limits
  - ✅ Automated daily monitoring (6 AM cron) - Structure ready
  - ✅ Risk scoring with real litigation data
  - ✅ Dashboard with latest litigation cases
  - ✅ Plan-based usage limits (searches, watchlist, PDF exports)
  - 🚧 Email alerts on risk changes
  - 🚧 PDF report generation

### Pricing Tiers
| Feature | Free | Starter | Pro | Enterprise |
|---------|------|---------|-----|------------|
| Searches/month | 3 | 20 | Unlimited | Unlimited |
| Watchlist | 0 | 10 | 250 | Unlimited |
| PDF Exports | 0 | 5/month | Unlimited | Unlimited |
| Team Users | 1 | 1 | 5 | Unlimited |
| Email Alerts | ❌ | ✅ | ✅ | ✅ |
| API Access | ❌ | ❌ | ✅ | ✅ |

---

## 🗄️ Database Schema

### Tables
1. **users** - User accounts with plan tiers and usage tracking
2. **companies** - Cached company data from ANAF, PortalJust, BPI
3. **watchlist** - User-company watchlist relationships
4. **alerts** - Notification history
5. **search_history** - Search usage tracking for limits
6. **litigation** - Lawsuit data from PortalJust
7. **risk_scores** - Historical risk score tracking

### Key Functions
- `calculate_market_risk_score()` - Main risk calculator
- `check_search_limit()`, `check_watchlist_limit()`, `check_pdf_limit()` - Plan limit enforcement
- `get_companies_for_monitoring()` - Daily monitoring query
- `create_risk_change_alert()` - Alert generation
- `reset_monthly_limits()` - Monthly usage reset (run via cron)

---

## 🛠️ Tech Stack

### Frontend
- **Next.js 15** (App Router)
- **TypeScript**
- **Tailwind CSS 4** (CSS-based configuration)
- **React Server Components**

### Backend
- **Supabase** (PostgreSQL + Auth + Edge Functions)
- **Row Level Security (RLS)** for data isolation
- **pg_cron** or **Vercel Cron** for scheduled tasks

### APIs & Integrations
- ✅ **ANAF API** - Romanian tax authority data (v9, fully integrated)
- ✅ **PortalJust SOAP API** - Litigation database (fully integrated)
  - Endpoint: `http://portalquery.just.ro/query.asmx`
  - Uses `CautareDosare` operation
  - Real-time court case data
  - Integrated into risk scoring
- 🚧 **BPI API** - Insolvency registry (structure ready)
- 🚧 **Stripe** - Payment processing (planned)
- 🚧 **Resend** - Email notifications (planned)

### Development
- **TypeScript** - Type safety
- **ESLint** - Code linting
- **Prettier** (recommended) - Code formatting

---

## 📁 Project Structure

```
marketrisk-app/
├── app/
│   ├── (marketing)/          # Public pages (SSG)
│   │   ├── page.tsx          # Homepage
│   │   ├── features/
│   │   ├── pricing/
│   │   └── about/
│   ├── (auth)/               # Auth pages
│   │   ├── login/
│   │   ├── signup/
│   │   └── reset-password/
│   ├── (app)/                # Protected app (CSR)
│   │   ├── dashboard/
│   │   ├── search/
│   │   ├── company/[cui]/
│   │   ├── watchlist/
│   │   ├── alerts/
│   │   └── settings/
│   ├── blog/                 # MDX blog
│   ├── docs/                 # Documentation
│   ├── api/                  # API routes
│   │   ├── anaf/
│   │   ├── portaljust/
│   │   ├── risk-score/
│   │   └── pdf/
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── marketing/            # Landing page components
│   ├── app/                  # App UI components
│   ├── ui/                   # Reusable UI primitives
│   └── layout/               # Layout components
├── lib/
│   ├── supabase/             # Supabase clients
│   │   ├── client.ts         # Browser client
│   │   ├── server.ts         # Server client
│   │   └── middleware.ts     # Auth middleware
│   ├── risk-algorithm/       # Risk scoring engine
│   │   ├── calculator.ts     # Main calculator
│   │   ├── factors.ts        # Risk factors
│   │   └── litigation-transformer.ts  # PortalJust data transformer
│   ├── anaf/                 # ANAF API client
│   │   ├── client.ts         # ANAF v9 API client
│   │   ├── types.ts          # ANAF types
│   │   └── risk-calculator.ts # ANAF-based scoring (legacy)
│   ├── portaljust/           # PortalJust SOAP client
│   │   ├── client.ts         # SOAP client implementation
│   │   └── types.ts          # PortalJust types
│   └── pdf/                  # PDF generation
├── types/
│   ├── company.ts            # Company types
│   ├── user.ts               # User types
│   ├── alert.ts              # Alert types
│   └── supabase.ts           # Generated DB types
├── supabase/
│   └── migrations/
│       ├── 001_initial_schema.sql
│       ├── 002_rls_policies.sql
│       └── 003_functions_triggers.sql
├── public/
│   ├── images/
│   ├── og-images/
│   └── pdfs/
├── .env.local.example
├── middleware.ts
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Supabase account
- ANAF API credentials
- PortalJust API credentials (optional)

### Installation

1. **Clone and Install**
```bash
cd marketrisk-app
npm install
```

2. **Set up Environment Variables**
```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
ANAF_API_URL=https://webservicesp.anaf.ro/...
ANAF_API_TOKEN=your-token
```

3. **Set up Supabase**

```bash
# Install Supabase CLI
npm install -g supabase

# Link to your project
supabase link --project-ref your-project-ref

# Run migrations
supabase db push

# Generate TypeScript types
npx supabase gen types typescript --project-id your-project-id > types/supabase.ts
```

4. **Run Development Server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 🧮 Risk Scoring Algorithm

### MarketRisk Credit Score (MRCS)

The proprietary algorithm analyzes multiple risk factors:

#### Category 1: Legal & Regulatory (60 pts max)
- Inactive company: +50
- Active insolvency: +40
- VAT deregistered: +35
- State debts (high >€10k): +30
- Split VAT regime: +15

#### Category 2: Litigation & Legal Risk (Enhanced with PortalJust)
- **Active as Defendant**: +10 per case (max 40) - Higher risk, being sued
- **Active as Plaintiff**: +3 per case (max 15) - Lower risk, pursuing claims
- **Lost Cases (2y)**: +15 per case (max 45) - Financial liability indicator
- **Won Cases (as Plaintiff)**: -2 points (1-2 cases only) - Small positive
- **Bankruptcy Filing**: +40 - Critical financial distress
- **Execution Proceedings**: +30 - Assets can be seized
- **Commercial Disputes**: +8 per case (max 24) - High financial impact
- **High-Value Cases**: +5 per case (max 15) - Significant financial impact
- **Labor Disputes**: +6 per case (max 18) - Operational issues

#### Category 3: Financial (30 pts max)
- Missing statements: +20
- Negative equity: +25
- Revenue drop >50%: +15
- Delayed filing: +10

#### Category 4: Operational (20 pts max)
- Company age <6 months: +15
- 3+ address changes: +10
- No employees: +8

#### Category 5: Positive Adjustments
- Company age >10 years: -10
- Large company (50+ employees): -15
- Certified accounts: -10
- Exporter: -8

### Risk Levels
- **GREEN (0-14 points)**: Low risk - Normal monitoring
- **YELLOW (15-49 points)**: Medium risk - Close monitoring required
- **RED (50+ points)**: High risk - Avoid or request guarantees

---

## 📊 Database Migrations

All migrations are in `supabase/migrations/`:

1. `001_initial_schema.sql` - Create all tables and indexes
2. `002_rls_policies.sql` - Row Level Security policies
3. `003_functions_triggers.sql` - Helper functions and triggers

To run manually:
```bash
supabase db push
```

---

## 🔐 Authentication & Authorization

- **Supabase Auth** for user management
- **Row Level Security (RLS)** for data isolation
- **Middleware** for route protection
- **Service Role** client for admin operations

Protected routes: `/app/*`, `/dashboard`, `/search`, `/watchlist`, `/alerts`, `/settings`

---

## 📝 Development Guidelines

### Code Style
- Use TypeScript for type safety
- Follow Next.js App Router conventions
- Use Server Components by default, Client Components only when needed
- Keep components small and focused

### Database Operations
- Always use Supabase RLS policies
- Use service role client only for admin operations
- Cache ANAF responses for 24 hours

### Risk Scoring
- **Main Algorithm**: `lib/risk-algorithm/calculator.ts` (comprehensive scoring)
- **Uses Real Data**: ANAF + PortalJust litigation data
- **Differentiated Scoring**: Plaintiff vs Defendant roles weighted differently
- Run risk calculation when:
  - New company search (automatic PortalJust fetch)
  - Daily monitoring (6 AM)
  - Manual refresh request
- Store historical scores in `risk_scores` table
- Generate alerts on risk level changes
- **Litigation Impact**: Real court cases affect risk score based on:
  - Role (defendant = higher risk, plaintiff = lower risk)
  - Case outcomes (lost cases = financial liability)
  - Case types (commercial, execution, bankruptcy = higher impact)

---

## 🔄 Cron Jobs & Automation

### Daily Monitoring (6 AM)
```sql
SELECT get_companies_for_monitoring();
```

For each company:
1. Fetch latest ANAF data
2. Recalculate risk score
3. Compare with previous score
4. Generate alerts if risk level changed
5. Send email notifications

### Monthly Reset (1st of month)
```sql
SELECT reset_monthly_limits();
```

Resets `searches_this_month` and `pdf_exports_this_month` for all users.

---

## 🎨 Design System

### Colors
- **Primary**: Mughal Green (#2F5232)
- **Accent**: Pistachio (#8ACA74)
- **Neutrals**: Bone (#DCDEC5), Paper (#F4F4EE)
- **Risk Levels**:
  - GREEN: #2F5232
  - YELLOW: #B78A2A
  - RED: #B23A3A

### Typography
- **Font**: Sora (Google Fonts)
- **Sizes**: 12px - 72px (xs to 5xl)
- **Line Heights**: Optimized for readability

### Spacing
- 4px base unit
- Scale: 0, 4, 8, 12, 16, 20, 24, 28, 32, 40, 48, 56, 64, 80, 96, 120px

### Border Radius
- All corners: 4px (consistent design rule)

---

## 📈 Roadmap

- [x] Phase 1: Foundation
- [x] Phase 2: Database Schema
- [x] Phase 3: Risk Algorithm
- [x] Phase 4: Authentication
- [x] Phase 5: ANAF API Integration
- [x] Phase 6: PortalJust API Integration
- [x] Phase 7: Risk Calculation with Real Data
- [x] Phase 8: Core SaaS Features (Search, Watchlist, Dashboard)
- [ ] Phase 9: BPI Integration
- [ ] Phase 10: Email Notifications
- [ ] Phase 11: PDF Export
- [ ] Phase 12: Automated Monitoring (Cron Jobs)
- [ ] Phase 13: Payment Processing
- [ ] Phase 14: Testing & QA
- [ ] Phase 15: Deployment & Launch

---

## 🤝 Contributing

This is a proprietary project. For questions or support, contact the development team.

---

## 📄 License

Proprietary - All rights reserved

---

## 🔗 Resources

### Documentation
- **[Documentation Index](./DOCUMENTATION_INDEX.md)** - Master index of all docs
- [API Integrations Guide](./API_INTEGRATIONS.md) - Complete API documentation
- [PortalJust Integration](./PORTALJUST_INTEGRATION.md) - PortalJust complete guide
- [Architecture Documentation](./ARCHITECTURE.md) - System architecture
- [Integration Status](./INTEGRATION_STATUS.md) - Current integration status
- [Dashboard Features](./DASHBOARD_COMPLETE.md) - Dashboard implementation
- [Quick Start Guide](./QUICK_START.md) - Setup instructions

### External Resources
- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [ANAF API Documentation](https://www.anaf.ro)
- [PortalJust WSDL](http://portalquery.just.ro/query.asmx?WSDL)

---

**Built with ❤️ for the Romanian B2B market**
