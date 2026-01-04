# PortalJust Integration - Complete Documentation

**Status**: ✅ Fully Integrated and Active  
**Date**: January 2026  
**API**: Romanian Ministry of Justice - PortalJust SOAP Service

---

## Overview

PortalJust integration provides real-time access to Romanian court case data, enabling comprehensive litigation risk assessment for B2B credit monitoring. The integration uses the official SOAP Web Service from the Romanian Ministry of Justice.

**Endpoint**: `http://portalquery.just.ro/query.asmx`  
**WSDL**: `http://portalquery.just.ro/query.asmx?WSDL`  
**Operation**: `CautareDosare` (Search Cases)

---

## Implementation Details

### 1. SOAP Client (`lib/portaljust/client.ts`)

**Features:**
- SOAP 1.2 protocol implementation
- XML request/response parsing
- Server-side compatible (regex-based XML parsing)
- Error handling and fallbacks
- 24-hour caching

**Key Functions:**
```typescript
fetchPortalJustData(
  companyName: string,
  cui?: string,
  options?: {
    includeClosed?: boolean
    dateRange?: { start: Date; end: Date }
    institution?: Institutie | null
  }
): Promise<PortalJustResponse>
```

**Usage:**
```typescript
import { fetchPortalJustData } from '@/lib/portaljust/client'

const data = await fetchPortalJustData('COMPANIA SRL', '12345678', {
  includeClosed: true,
  dateRange: {
    start: new Date('2020-01-01'),
    end: new Date()
  }
})
```

### 2. Type Definitions (`lib/portaljust/types.ts`)

**Key Types:**
- `PortalJustLawsuit` - Transformed lawsuit data
- `Dosar` - Raw SOAP response format
- `Institutie` - Romanian court types (100+ courts supported)
- `CategorieCaz` - Case categories (Civil, Commercial, Insolvency, etc.)
- `StadiuProcesual` - Case status (Active, Closed, Suspended, Cancelled)

### 3. Litigation Transformer (`lib/risk-algorithm/litigation-transformer.ts`)

**Purpose**: Transforms PortalJust lawsuit data into risk calculation format

**Key Functions:**
- `analyzeLitigationData()` - Extracts metrics from lawsuits
- `transformLitigationToRiskData()` - Converts to `CompanyRiskData.portaljust` format

**Metrics Extracted:**
- Active lawsuits (total, as defendant, as plaintiff)
- Lost/won cases in last 2 years
- Bankruptcy filings
- Execution proceedings
- Case type categorization (commercial, civil, labor)
- High-value case identification

### 4. Risk Calculation Integration

**Location**: `lib/risk-algorithm/factors.ts` - `calculateLitigationPoints()`

**Scoring Logic:**

| Factor | Points | Max | Rationale |
|--------|--------|-----|-----------|
| Active as Defendant | +10 per case | 40 | Being sued = financial risk |
| Active as Plaintiff | +3 per case | 15 | Pursuing claims = lower risk |
| Lost Cases (2y) | +15 per case | 45 | Financial liability indicator |
| Won Cases (as Plaintiff) | -2 (1-2 cases) | -2 | Small positive for competence |
| Bankruptcy Filing | +40 | 40 | Critical financial distress |
| Execution Proceedings | +30 | 30 | Assets can be seized |
| Commercial Disputes | +8 per case | 24 | High financial impact |
| High-Value Cases | +5 per case | 15 | Significant financial impact |
| Labor Disputes | +6 per case | 18 | Operational issues |

**Financial Viability Impact:**
- **Defendant cases** weighted 3x higher than plaintiff cases
- **Lost cases** indicate actual financial liability
- **Execution proceedings** indicate severe financial distress
- **Commercial disputes** often involve significant amounts
- **Bankruptcy filings** are critical red flags

---

## Integration Points

### 1. Company Search (`app/[locale]/app/search/actions.ts`)

**Flow:**
1. User searches company by CUI
2. Fetch ANAF data (company name, status, etc.)
3. Fetch PortalJust data using company name
4. Transform litigation data to risk format
5. Calculate comprehensive risk score (includes litigation)
6. Return results with litigation data

**Code:**
```typescript
// Fetch PortalJust litigation data
const portalJustResponse = await fetchPortalJustData(
  companyData.name,
  companyData.cui,
  { includeClosed: true }
)

// Transform to risk calculation format
const portalJustRiskData = transformLitigationToRiskData(
  portalJustResponse.lawsuits
)

// Use in comprehensive risk calculation
const riskData: CompanyRiskData = {
  anaf: { ... },
  portaljust: portalJustRiskData,
  // ...
}
const riskScore = calculateMarketRiskScore(riskData)
```

### 2. Search Results Page (`app/[locale]/app/search/page.tsx`)

**Displays:**
- `LitigationCard` component showing all court cases
- Risk metrics summary (active, lost, bankruptcy, execution)
- Expandable case details
- Links to company detail page

### 3. Company Detail Page (`app/[locale]/app/company/[cui]/page.tsx`)

**Displays:**
- Full litigation information
- Case-by-case breakdown
- Risk impact visualization

### 4. Dashboard (`app/[locale]/app/dashboard/page.tsx`)

**Feature:**
- "Procese juridice recente" widget
- Shows 5 latest court cases from watchlist companies
- Sorted by most recent update date
- Clickable links to company detail pages

---

## Data Flow

```
User searches CUI
    ↓
ANAF API → Company Name
    ↓
PortalJust SOAP → Court Cases
    ↓
Litigation Transformer → Risk Metrics
    ↓
Risk Calculator → Comprehensive Score
    ↓
Display Results (Search/Detail/Dashboard)
```

---

## Risk Scoring Examples

### Example 1: High-Risk Company
- 5 active cases as defendant: 50 points (capped at 40)
- 3 lost cases (2y): 45 points
- 1 execution proceeding: 30 points
- **Total Litigation Points: 115** → RED risk level

### Example 2: Medium-Risk Company
- 2 active cases as defendant: 20 points
- 1 lost case (2y): 15 points
- 1 commercial dispute: 8 points
- **Total Litigation Points: 43** → YELLOW risk level

### Example 3: Low-Risk Company
- 2 active cases as plaintiff: 6 points
- 1 won case (as plaintiff): -2 points
- **Total Litigation Points: 4** → Minimal impact

---

## Components

### LitigationCard (`components/app/LitigationCard.tsx`)

**Features:**
- Expandable/collapsible interface
- Risk metrics summary cards
- Case-by-case breakdown
- Status color coding
- Party role indicators
- Date formatting (Romanian locale)

**Props:**
```typescript
interface LitigationCardProps {
  lawsuits: PortalJustLawsuit[]
  total: number
  riskMetrics: {
    activeLawsuits: number
    lostCases2y: number
    totalLawsuits: number
    hasBankruptcyFiling: boolean
    hasExecutionProceedings: boolean
  }
}
```

---

## Error Handling

**Graceful Degradation:**
- If PortalJust API fails, search continues without litigation data
- Risk calculation uses available data (ANAF only)
- UI shows empty state if no cases found
- Errors logged but don't block user flow

**Common Issues:**
1. **SOAP parsing errors** - Fallback to regex parser
2. **Network timeouts** - Retry logic (future enhancement)
3. **Invalid company names** - Returns empty results
4. **API rate limiting** - 24-hour caching reduces calls

---

## Caching Strategy

**Current:**
- 24-hour cache on PortalJust responses
- Cache key: company name + date range
- Reduces API load and improves performance

**Future Enhancements:**
- Database caching of litigation data
- Incremental updates (only fetch new cases)
- Smart cache invalidation on case updates

---

## Performance Considerations

**Optimizations:**
- Non-blocking PortalJust fetch (doesn't delay search)
- Parallel API calls (ANAF + PortalJust)
- Efficient XML parsing (regex-based for server-side)
- Limited date range queries (default: 5 years)

**Limitations:**
- SOAP requests can be slower than REST
- Large result sets may take time to parse
- No pagination support in PortalJust API

---

## Testing

### Manual Testing

1. **Search a company with known cases:**
   ```bash
   # Search in UI: /app/search
   # Enter CUI of company with court cases
   # Verify LitigationCard appears
   ```

2. **Test different case types:**
   - Companies with bankruptcy filings
   - Companies with execution proceedings
   - Companies with only plaintiff cases
   - Companies with only defendant cases

3. **Verify risk scoring:**
   - Check risk score changes based on litigation
   - Verify plaintiff vs defendant differentiation
   - Confirm lost cases impact scoring

### Test Cases

```typescript
// Test PortalJust client
import { fetchPortalJustData } from '@/lib/portaljust/client'

const testCases = [
  { name: 'COMPANIA SRL', cui: '12345678' },
  { name: 'FIRMA SA', cui: '87654321' },
]

for (const test of testCases) {
  const result = await fetchPortalJustData(test.name, test.cui)
  console.log(`Found ${result.total} cases for ${test.name}`)
}
```

---

## Future Enhancements

1. **Database Caching**
   - Store litigation data in `litigation` table
   - Incremental updates (only new cases)
   - Faster dashboard loading

2. **Alerts System**
   - Notify users of new lawsuits
   - Alert on risk level changes due to litigation
   - Email notifications for critical cases

3. **Advanced Filtering**
   - Filter by case type
   - Filter by court
   - Filter by date range
   - Filter by party role

4. **Case Details**
   - Full case history
   - Document links (if available)
   - Hearing schedules
   - Judgment details

5. **Analytics**
   - Litigation trends over time
   - Most common case types
   - Average case duration
   - Win/loss ratios

---

## Troubleshooting

### Issue: No cases found for known company

**Possible Causes:**
1. Company name mismatch (PortalJust uses exact name matching)
2. Cases are older than search date range
3. Company name changed (use CUI to find current name first)

**Solution:**
- Verify company name matches ANAF registration
- Expand date range in search options
- Check if company has name variations

### Issue: SOAP parsing errors

**Possible Causes:**
1. PortalJust API response format changed
2. Special characters in XML
3. Network issues

**Solution:**
- Check console logs for XML response
- Verify SOAP envelope format
- Test with different companies

### Issue: Risk score not reflecting litigation

**Possible Causes:**
1. Litigation data not fetched
2. Transformation failed
3. Risk calculation using wrong algorithm

**Solution:**
- Verify `calculateMarketRiskScore` is used (not `calculateRiskScore`)
- Check litigation data in search result
- Verify `transformLitigationToRiskData` is called

---

## Related Files

- `lib/portaljust/client.ts` - SOAP client implementation
- `lib/portaljust/types.ts` - Type definitions
- `lib/risk-algorithm/litigation-transformer.ts` - Data transformation
- `lib/risk-algorithm/factors.ts` - Litigation scoring logic
- `components/app/LitigationCard.tsx` - UI component
- `app/[locale]/app/search/actions.ts` - Search integration
- `app/[locale]/app/dashboard/actions.ts` - Dashboard integration

---

## References

- [PortalJust WSDL](http://portalquery.just.ro/query.asmx?WSDL)
- [PortalJust Service](http://portalquery.just.ro/query.asmx)
- [API Integrations Guide](./API_INTEGRATIONS.md)
- [Risk Algorithm Documentation](./README.md#-risk-scoring-algorithm)

---

**Last Updated**: January 2026  
**Maintained By**: MarketRisk Development Team

