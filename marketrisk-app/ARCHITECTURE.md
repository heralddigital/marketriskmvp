# MarketRisk Architecture Documentation

**Last Updated**: January 2026  
**Version**: 1.0

---

## System Overview

MarketRisk is a B2B credit risk monitoring SaaS platform for the Romanian market, built with Next.js 15, TypeScript, and Supabase. The platform integrates multiple Romanian government APIs to provide comprehensive risk assessment.

---

## Technology Stack

### Frontend
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript 5
- **UI**: React 19, Tailwind CSS 4
- **Internationalization**: next-intl (Romanian/English)
- **Icons**: Lucide React

### Backend
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Security**: Row Level Security (RLS)
- **API**: Next.js API Routes + Server Actions

### External APIs
- ✅ **ANAF** - Romanian Tax Authority (REST API)
- ✅ **PortalJust** - Romanian Ministry of Justice (SOAP API)
- 🚧 **BPI** - Insolvency Registry (Structure ready)

---

## Application Architecture

### Route Structure

```
app/
├── [locale]/              # Internationalized routes
│   ├── (marketing)/       # Public pages
│   │   ├── page.tsx       # Homepage
│   │   ├── pricing/
│   │   ├── about/
│   │   └── ...
│   ├── (auth)/            # Authentication
│   │   ├── login/
│   │   ├── signup/
│   │   └── forgot-password/
│   └── app/               # Protected app
│       ├── dashboard/     # Main dashboard
│       ├── search/        # Company search
│       ├── company/[cui]/ # Company detail
│       ├── watchlist/     # Watchlist management
│       ├── alerts/        # Notifications
│       └── settings/      # User settings
└── api/                   # API routes
    ├── cron/              # Scheduled jobs
    └── company-history/   # History API
```

### Component Structure

```
components/
├── app/                    # App-specific components
│   ├── FinancialDataCard.tsx
│   ├── CompanyHistoryTimeline.tsx
│   └── LitigationCard.tsx  # Court cases display
├── marketing/              # Marketing pages
│   ├── Header.tsx
│   └── Footer.tsx
├── dashboard/              # Dashboard components
│   └── Sidebar.tsx
├── ui/                     # Reusable UI primitives
└── layout/                 # Layout components
```

---

## Data Flow

### Company Search Flow

```
1. User enters CUI
   ↓
2. Validate CUI format
   ↓
3. Check user authentication & plan limits
   ↓
4. Fetch ANAF data (company name, status, VAT, etc.)
   ↓
5. Fetch PortalJust data (court cases) - Parallel
   ↓
6. Transform PortalJust data to risk format
   ↓
7. Calculate comprehensive risk score
   (ANAF + PortalJust + other factors)
   ↓
8. Save to database (companies, search_history, risk_scores)
   ↓
9. Return results with litigation data
   ↓
10. Display in UI (Search page + LitigationCard)
```

### Risk Calculation Flow

```
1. Gather data from multiple sources
   - ANAF: Company status, VAT, addresses
   - PortalJust: Court cases, litigation metrics
   - BPI: Insolvency data (when available)
   ↓
2. Transform to CompanyRiskData format
   - ANAF → anaf object
   - PortalJust → portaljust object (with role differentiation)
   - BPI → bpi object
   ↓
3. Calculate points for each category
   - Legal & Regulatory (60 pts max)
   - Litigation (enhanced with PortalJust)
   - Financial (30 pts max)
   - Operational (20 pts max)
   - Positive Adjustments (negative pts)
   ↓
4. Sum all points
   ↓
5. Determine risk level
   - GREEN: 0-14 points
   - YELLOW: 15-49 points
   - RED: 50+ points
   ↓
6. Generate recommendation
   ↓
7. Return RiskScore object
```

---

## Risk Scoring Algorithm

### Main Algorithm
**Location**: `lib/risk-algorithm/calculator.ts`

**Function**: `calculateMarketRiskScore(companyData: CompanyRiskData)`

**Categories**:
1. **Legal & Regulatory** (60 points max)
2. **Litigation & Legal Risk** (Enhanced with PortalJust)
3. **Financial Behavior** (30 points max)
4. **Operational Red Flags** (20 points max)
5. **Positive Adjustments** (negative points)

### Litigation Scoring Details

**Location**: `lib/risk-algorithm/factors.ts` - `calculateLitigationPoints()`

**Scoring Logic**:

| Factor | Points | Max | Financial Impact |
|--------|--------|-----|------------------|
| Active as Defendant | +10/case | 40 | High - Being sued |
| Active as Plaintiff | +3/case | 15 | Low - Pursuing claims |
| Lost Cases (2y) | +15/case | 45 | High - Financial liability |
| Won Cases (as Plaintiff) | -2 (1-2 only) | -2 | Small positive |
| Bankruptcy Filing | +40 | 40 | Critical |
| Execution Proceedings | +30 | 30 | Critical - Assets at risk |
| Commercial Disputes | +8/case | 24 | High - Significant amounts |
| High-Value Cases | +5/case | 15 | High - Financial impact |
| Labor Disputes | +6/case | 18 | Medium - Operational issues |

**Rationale**:
- **Defendant cases** indicate the company is being sued (potential financial exposure)
- **Plaintiff cases** indicate the company is pursuing claims (less immediate risk)
- **Lost cases** show actual financial liability and poor legal outcomes
- **Execution proceedings** mean assets can be seized (severe distress)
- **Commercial disputes** often involve significant financial amounts

---

## Database Schema

### Core Tables

1. **users** - User accounts with plan tiers
2. **companies** - Cached company data (ANAF + PortalJust)
3. **watchlist** - User-company monitoring relationships
4. **alerts** - Risk change notifications
5. **search_history** - Search usage tracking
6. **litigation** - Court case data (PortalJust)
7. **risk_scores** - Historical risk score tracking
8. **company_history** - Company data snapshots over time

### Key Relationships

```
users (1) ──< (many) watchlist ──> (many) companies
users (1) ──< (many) search_history
users (1) ──< (many) alerts
companies (1) ──< (many) litigation
companies (1) ──< (many) risk_scores
companies (1) ──< (many) company_history
```

---

## API Integrations

### ANAF (Agenția Națională de Administrare Fiscală)

**Type**: REST API  
**Endpoint**: `https://webservicesp.anaf.ro/api/PlatitorTvaRest/v9/tva`  
**Auth**: None (public)  
**Cache**: 1 hour

**Data Provided**:
- Company registration data
- VAT status and periods
- Company status (active/inactive)
- Addresses (fiscal, social)
- Legal form, CAEN codes
- IBAN, e-Invoice status

**Client**: `lib/anaf/client.ts`

### PortalJust (Romanian Ministry of Justice)

**Type**: SOAP 1.2  
**Endpoint**: `http://portalquery.just.ro/query.asmx`  
**WSDL**: `http://portalquery.just.ro/query.asmx?WSDL`  
**Auth**: None (public)  
**Cache**: 24 hours

**Operation**: `CautareDosare` (Search Cases)

**Data Provided**:
- Court case numbers
- Court names and departments
- Case types (civil, commercial, insolvency, labor)
- Case status (active, closed, suspended, cancelled)
- Parties (plaintiff, defendant, third party)
- Dates (filing, closing, last update)
- Case descriptions

**Client**: `lib/portaljust/client.ts`  
**Transformer**: `lib/risk-algorithm/litigation-transformer.ts`

---

## Authentication & Authorization

### Authentication Flow

1. User signs up/logs in via Supabase Auth
2. Middleware validates session on protected routes
3. Server actions check authentication before operations
4. RLS policies enforce data isolation

### Protected Routes

- `/app/*` - All app routes require authentication
- Middleware redirects to `/login` if not authenticated
- Preserves redirect URL for post-login navigation

### Authorization

- **Plan-based limits**: Enforced in server actions
- **RLS policies**: Database-level data isolation
- **Service role**: Used only for admin operations

---

## State Management

### Server State
- Supabase client (server-side)
- Database queries via Supabase
- Server Actions for mutations

### Client State
- React hooks (`useState`, `useEffect`)
- Form state management
- UI state (modals, dropdowns, etc.)

### Caching
- API responses cached (ANAF: 1h, PortalJust: 24h)
- Database queries use Supabase caching
- Next.js static generation for marketing pages

---

## Error Handling

### API Errors
- Graceful degradation (continue without failed data)
- User-friendly error messages (Romanian)
- Logging for debugging
- Fallback to empty data

### Database Errors
- Transaction rollback on failures
- RLS policy violations handled gracefully
- User-friendly error messages

### Network Errors
- Retry logic (future enhancement)
- Timeout handling
- Offline state detection

---

## Performance Optimizations

### Frontend
- Server Components by default
- Client Components only when needed
- Code splitting (Next.js automatic)
- Image optimization (Next.js Image)

### Backend
- API response caching
- Database query optimization (indexes)
- Parallel API calls (ANAF + PortalJust)
- Non-blocking operations (litigation fetch)

### Database
- Indexes on frequently queried columns
- GIN indexes for JSONB searches
- Efficient RLS policies
- Connection pooling (Supabase)

---

## Security

### Data Protection
- Row Level Security (RLS) on all tables
- User data isolation
- Service role only for admin operations
- Input validation (CUI format, etc.)

### API Security
- Server-side API calls only
- No API keys exposed to client
- Rate limiting (via caching)
- Error message sanitization

### Authentication Security
- Supabase Auth (industry standard)
- Session management via cookies
- CSRF protection (Next.js built-in)
- Password reset via email

---

## Deployment

### Environment Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# APIs (no keys needed for ANAF/PortalJust)
ANAF_CACHE_HOURS=1
PORTALJUST_CACHE_HOURS=24

# Cron Jobs
CRON_SECRET=

# Optional (future)
RESEND_API_KEY=
STRIPE_SECRET_KEY=
```

### Build Process

```bash
npm run build  # Next.js production build
npm run start  # Start production server
```

### Deployment Platforms
- **Vercel** (recommended) - Automatic deployments
- **Other platforms** - Standard Next.js deployment

---

## Monitoring & Logging

### Current
- Console logging for errors
- Supabase logs for database operations
- Next.js error boundaries

### Future Enhancements
- Structured logging service
- Error tracking (Sentry, etc.)
- Performance monitoring
- Analytics dashboard

---

## Testing Strategy

### Current
- Manual testing via UI
- TypeScript type checking
- ESLint code quality

### Future
- Unit tests for risk algorithm
- Integration tests for API clients
- E2E tests for critical flows
- Performance testing

---

## Development Workflow

### Making Changes

1. **Feature Development**
   - Create feature branch
   - Implement changes
   - Test locally
   - Update documentation
   - Commit and push

2. **Database Changes**
   - Create migration file
   - Test in Supabase SQL Editor
   - Add to migrations folder
   - Document in schema comments

3. **API Integration**
   - Implement client in `lib/[service]/client.ts`
   - Add types in `lib/[service]/types.ts`
   - Integrate into search flow
   - Update risk calculation
   - Update documentation

---

## Key Design Decisions

### 1. Why SOAP for PortalJust?
- PortalJust only provides SOAP API
- No REST alternative available
- Regex-based parsing for server-side compatibility

### 2. Why Differentiate Plaintiff/Defendant?
- **Financial viability**: Being sued (defendant) = higher risk
- **Business context**: Pursuing claims (plaintiff) = lower risk
- **B2B focus**: Credit risk assessment needs role differentiation

### 3. Why Point-Based Scoring?
- Transparent and explainable
- Easy to adjust weights
- Clear risk level thresholds
- Romanian market context

### 4. Why Server Actions?
- Type-safe
- Secure (no client exposure)
- Integrated with Next.js
- Better performance

---

## File Organization

### Key Directories

- `app/` - Next.js App Router pages
- `components/` - React components
- `lib/` - Business logic and utilities
  - `anaf/` - ANAF API client
  - `portaljust/` - PortalJust SOAP client
  - `risk-algorithm/` - Risk scoring engine
  - `supabase/` - Database clients
- `types/` - TypeScript type definitions
- `supabase/` - Database migrations
- `public/` - Static assets

---

## Related Documentation

- [README.md](./README.md) - Project overview
- [API_INTEGRATIONS.md](./API_INTEGRATIONS.md) - API details
- [PORTALJUST_INTEGRATION.md](./PORTALJUST_INTEGRATION.md) - PortalJust guide
- [DASHBOARD_COMPLETE.md](./DASHBOARD_COMPLETE.md) - Dashboard features
- [QUICK_START.md](./QUICK_START.md) - Setup guide

---

**Maintained By**: MarketRisk Development Team  
**Last Updated**: January 2026

