# API Integrations Guide

This document describes the API integrations available in MarketRisk and how to configure them.

## Current Integrations

### 1. ANAF (Agenția Națională de Administrare Fiscală) ✅ **ACTIVE**

**Status:** Fully integrated and working

**What it provides:**
- Company registration data (CUI, name, address)
- VAT registration status and periods
- Company status (active/inactive)
- Legal form and CAEN codes
- IBAN information
- e-Invoice status
- Split TVA status
- TVA la încasare status
- Fiscal and social addresses

**Configuration:**
- No API key required (public API)
- Endpoint: `https://webservicesp.anaf.ro/api/PlatitorTvaRest/v9/tva`
- Cache: 1 hour (configurable)

**Usage:**
```typescript
import { fetchCompanyByCUI, parseANAFResponse } from '@/lib/anaf/client'

const response = await fetchCompanyByCUI('12345678')
const companyData = parseANAFResponse(response)
```

**Enhanced Features:**
- ✅ VAT registration periods tracking
- ✅ Detailed VAT status (Split TVA, TVA la încasare)
- ✅ Company inactivity tracking
- ✅ Multiple address support (fiscal, social)

---

### 2. PortalJust (Litigation Database) ✅ **ACTIVE**

**Status:** Fully integrated and working

**What it provides:**
- Active lawsuits
- Closed cases (last 2 years)
- Bankruptcy filings
- Execution proceedings
- Case details (court, parties, dates, case numbers)
- Litigation risk metrics

**Configuration:**
- No API key required (public SOAP service)
- Endpoint: `http://portalquery.just.ro/query.asmx`
- WSDL: `http://portalquery.just.ro/query.asmx?WSDL`
- Cache: 24 hours (configurable)

**Implementation:**
- SOAP client implemented in `lib/portaljust/client.ts`
- Uses `CautareDosare` operation to search by company name
- Automatically integrated into company search flow
- Displays on search results and company detail pages

**Usage:**
```typescript
import { fetchPortalJustData, calculateLitigationRisk } from '@/lib/portaljust/client'

// Search by company name
const data = await fetchPortalJustData('COMPANIA SRL', '12345678', {
  includeClosed: true,
  dateRange: { start: new Date('2020-01-01'), end: new Date() }
})

const riskMetrics = calculateLitigationRisk(data.lawsuits)
// Returns: { activeLawsuits, lostCases2y, totalLawsuits, hasBankruptcyFiling, hasExecutionProceedings }
```

**Features:**
- ✅ SOAP 1.2 client implementation
- ✅ XML response parsing
- ✅ Automatic integration in search flow
- ✅ LitigationCard component for display
- ✅ Risk metrics calculation
- ✅ Support for all Romanian courts
- ✅ Party role detection (plaintiff/defendant)
- ✅ Case status tracking (active/closed/suspended/cancelled)
- ✅ **Integrated into risk scoring algorithm**
- ✅ **Differentiated scoring (plaintiff vs defendant)**
- ✅ **Financial viability impact assessment**
- ✅ Dashboard widget for latest cases

**Data Flow:**
1. User searches company by CUI
2. System fetches company name from ANAF
3. PortalJust SOAP request searches by company name
4. Results parsed and transformed to internal format
5. Litigation metrics extracted (plaintiff/defendant, case types, outcomes)
6. **Data transformed for risk calculation**
7. **Integrated into comprehensive risk score**
8. Risk metrics calculated for display
9. Displayed in LitigationCard component

**Risk Scoring Integration:**
- Litigation data automatically included in risk calculation
- Defendant cases: +10 points each (higher financial risk)
- Plaintiff cases: +3 points each (lower risk)
- Lost cases: +15 points each (financial liability)
- Bankruptcy/Execution: +30-40 points (critical risk)
- See `lib/risk-algorithm/factors.ts` for full scoring logic

---

### 3. BPI (Biroul de Publicitate a Insolvenței) 🔄 **PLACEHOLDER**

**Status:** Structure created, requires API access

**What it will provide:**
- Insolvency notices
- Reorganization proceedings
- Liquidation notices
- Bankruptcy filings
- Publication dates and court information

**Configuration Required:**
```env
BPI_API_URL=https://www.bpi.ro/api
BPI_API_KEY=your_api_key_here
```

**Current Implementation:**
- Client structure created in `lib/bpi/client.ts`
- Returns empty data if API key not configured
- Helper functions for risk analysis

**Usage:**
```typescript
import { fetchBPIData, hasActiveInsolvency, getLatestNotice } from '@/lib/bpi/client'

const data = await fetchBPIData('12345678')
const hasActive = hasActiveInsolvency(data.notices)
const latest = getLatestNotice(data.notices)
```

**Next Steps:**
1. Determine BPI access method (API or web scraping)
2. Implement data fetching
3. Set up daily monitoring cron job
4. Integrate into alerts system

---

## Financial Data Available

### From ANAF (Currently Available)

1. **VAT Information:**
   - Registration status
   - VAT periods (start/end dates)
   - Split TVA status
   - TVA la încasare status

2. **Company Status:**
   - Active/Inactive status
   - Inactivation dates
   - Reactivation dates

3. **Addresses:**
   - Fiscal address (domiciliu fiscal)
   - Social address (sediu social)

4. **Other:**
   - IBAN
   - e-Invoice status
   - CAEN code
   - Legal form

### 4. MFinante (Ministerul de Finanțe) ✅ **ACTIVE**

**Status:** Fully integrated and working

**What it provides:**
- Financial statements (situații financiare) from data.gov.ro
- Balance sheets (bilanțuri) with assets, liabilities, equity
- Profit & Loss statements (cont de profit și pierdere)
- Financial ratios (liquidity, debt-to-equity, return on assets/equity)
- Risk indicators (missing statements, delayed filing, negative equity, revenue drops)

**Configuration:**
- No API key required (public open data)
- Source: data.gov.ro (CKAN platform)
- Data format: CSV/TXT files downloadable from data.gov.ro
- Import: Manual or via API endpoint `/api/financial-statements/import`

**Implementation:**
- Client implemented in `lib/mfinante/client.ts`
- Service implemented in `lib/mfinante/service.ts`
- Database table: `financial_statements`
- Integrated into risk calculation algorithm
- Displays on company detail pages via `FinancialStatementsCard` component

**Usage:**
```typescript
import { calculateFinancialRiskFactors, getCompanyFinancialSummary } from '@/lib/mfinante/service'

// Get risk factors for risk calculation
const riskFactors = await calculateFinancialRiskFactors('12345678')

// Get comprehensive financial summary
const summary = await getCompanyFinancialSummary('12345678')
```

**Importing Data:**
```bash
# Import financial statements for a specific year
curl -X POST http://localhost:3000/api/financial-statements/import?year=2024

# List available datasets
curl http://localhost:3000/api/financial-statements/import
```

**Features:**
- ✅ Automatic dataset discovery from data.gov.ro
- ✅ CSV/TXT file parsing
- ✅ Database storage with deduplication
- ✅ Risk factor calculation (missing statements, negative equity, etc.)
- ✅ Financial ratios calculation
- ✅ Revenue trend analysis
- ✅ Integrated into comprehensive risk algorithm
- ✅ FinancialStatementsCard component for display
- ✅ API endpoint for data import

**Risk Scoring Integration:**
- Missing statements (last 2 years): +20 points
- Delayed filing: +10 points
- Negative equity: +25 points
- Revenue drop >50%: +15 points
- See `lib/risk-algorithm/factors.ts` for full scoring logic

**Data Flow:**
1. Admin/cron calls import API endpoint
2. System searches data.gov.ro for financial statement datasets
3. Downloads CSV/TXT files
4. Parses and transforms data
5. Stores in `financial_statements` table
6. When company is searched, financial risk factors are calculated
7. Risk factors integrated into comprehensive risk score
8. Displayed in FinancialStatementsCard component

---

### Future Enhancements

1. **State Debts (Datorii la Stat):**
   - Requires additional ANAF endpoint or integration
   - Can be added to risk calculation

2. **Payment History:**
   - Integration with payment processors
   - Credit bureau data (if available)

---

## Dashboard Components

### FinancialDataCard
Location: `components/app/FinancialDataCard.tsx`

Displays:
- VAT registration status
- VAT periods
- Split TVA and TVA la încasare warnings
- Company status (active/inactive)
- Addresses (fiscal and social)
- IBAN
- e-Invoice status

**Usage:**
```tsx
import FinancialDataCard from '@/components/app/FinancialDataCard'

<FinancialDataCard company={companyData} />
```

---

## Integration Roadmap

### Phase 1: ANAF Enhancement ✅
- [x] Extract VAT periods
- [x] Extract VAT details (Split, TVA la încasare)
- [x] Extract addresses
- [x] Create FinancialDataCard component
- [x] Integrate into search results

### Phase 2: PortalJust Integration ✅
- [x] Implement SOAP client
- [x] Add to search flow
- [x] Create LitigationCard component
- [x] Display on search and detail pages
- [x] Add to risk calculation (uses real data)
- [x] Integrate into comprehensive risk algorithm
- [x] Differentiate plaintiff vs defendant scoring
- [x] Dashboard widget for latest cases
- [ ] Set up alerts for new lawsuits
- [ ] Cache litigation data in database
- [ ] Incremental updates (only new cases)

### Phase 3: BPI Integration 🔄
- [ ] Determine access method
- [ ] Implement data fetching
- [ ] Add to risk calculation
- [ ] Create insolvency alerts
- [ ] Set up daily monitoring

### Phase 4: MFinante Integration ✅
- [x] Create database schema for financial statements
- [x] Implement data.gov.ro client for dataset discovery
- [x] Implement CSV/TXT file parser
- [x] Create service for database operations
- [x] Calculate financial risk factors
- [x] Integrate into risk calculation algorithm
- [x] Create FinancialStatementsCard component
- [x] Create API endpoint for data import
- [ ] Set up automated cron job for periodic imports
- [ ] Add data validation and error handling improvements
- [ ] Support for quarterly/semiannual statements

### Phase 5: Additional Data Sources
- [ ] State debts (ANAF additional endpoint)
- [ ] Credit bureau data
- [ ] Payment history

---

## Environment Variables

Add to `.env.local`:

```env
# ANAF (no key needed, but can configure cache)
ANAF_CACHE_HOURS=1

# PortalJust (when available)
PORTALJUST_API_URL=https://portal.just.ro/api
PORTALJUST_API_KEY=your_key_here

# BPI (when available)
BPI_API_URL=https://www.bpi.ro/api
BPI_API_KEY=your_key_here
```

---

## Testing

### Test ANAF Integration:
```bash
# Search for a company
curl -X POST http://localhost:3000/api/search \
  -H "Content-Type: application/json" \
  -d '{"cui": "12345678"}'
```

### Test PortalJust (when configured):
```typescript
import { fetchPortalJustData } from '@/lib/portaljust/client'
const data = await fetchPortalJustData('12345678')
console.log(data)
```

### Test BPI (when configured):
```typescript
import { fetchBPIData } from '@/lib/bpi/client'
const data = await fetchBPIData('12345678')
console.log(data)
```

---

## Notes

1. **ANAF API** is public and doesn't require authentication
2. **PortalJust** and **BPI** may require:
   - Official API access (if available)
   - Web scraping (if no API)
   - Commercial data provider integration
3. All integrations include error handling and fallback to empty data
4. Data is cached to reduce API calls and improve performance

---

## Support

For questions about API integrations:
- Check the individual client files in `lib/[service]/client.ts`
- Review the types in `lib/[service]/types.ts` (if available)
- See database schema in `supabase/complete_database_setup.sql`
- **PortalJust Integration**: See `PORTALJUST_INTEGRATION.md` for complete documentation
- **Risk Algorithm**: See `lib/risk-algorithm/` for scoring logic

## Related Documentation

- [PortalJust Integration Guide](./PORTALJUST_INTEGRATION.md) - Complete PortalJust documentation
- [Risk Scoring Algorithm](./README.md#-risk-scoring-algorithm) - How risk is calculated
- [Dashboard Features](./DASHBOARD_COMPLETE.md) - Dashboard implementation details

