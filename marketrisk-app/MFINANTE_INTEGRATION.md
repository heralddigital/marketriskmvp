# MFinante (Ministry of Finance) Integration

This document describes the integration of financial statements data from the Romanian Ministry of Finance (Ministerul de Finanțe) via data.gov.ro.

## Overview

The integration allows MarketRisk to:
- Download financial statements (situații financiare) from data.gov.ro
- Store balance sheets, profit & loss statements, and financial ratios
- Calculate financial risk factors (missing statements, negative equity, etc.)
- Integrate financial data into the comprehensive risk scoring algorithm
- Display financial data in the UI

## Architecture

### Database Schema

**Table: `financial_statements`**
- Stores financial statements with balance sheet and P&L data
- Includes calculated financial ratios
- Tracks risk indicators (negative equity, delayed filing)
- Migration: `supabase/migrations/010_financial_statements.sql`

### Components

1. **Client** (`lib/mfinante/client.ts`)
   - Searches data.gov.ro for financial statement datasets
   - Downloads CSV/TXT files
   - Parses and transforms data

2. **Service** (`lib/mfinante/service.ts`)
   - Database operations (save, query)
   - Risk factor calculation
   - Financial summary generation

3. **Types** (`lib/mfinante/types.ts`)
   - TypeScript interfaces for financial data

4. **UI Component** (`components/app/FinancialStatementsCard.tsx`)
   - Displays financial statements in company detail pages

5. **API Endpoint** (`app/api/financial-statements/import/route.ts`)
   - Endpoint for importing financial data

## Usage

### Importing Financial Data

#### Manual Import (via API)

```bash
# Import financial statements for a specific year
curl -X POST http://localhost:3000/api/financial-statements/import?year=2024

# List available datasets
curl http://localhost:3000/api/financial-statements/import
```

#### Programmatic Import

```typescript
import { importFinancialStatementsFromDataGovRo } from '@/lib/mfinante/client'
import { saveFinancialStatements } from '@/lib/mfinante/service'

// Search and download datasets
const { imported, errors } = await importFinancialStatementsFromDataGovRo(2024)

// Or process a specific file
const statements = await processFinancialStatementsFile(content, 'csv', 2024)
await saveFinancialStatements(statements)
```

### Querying Financial Data

```typescript
import { 
  getFinancialStatements, 
  getLatestFinancialStatement,
  calculateFinancialRiskFactors,
  getCompanyFinancialSummary 
} from '@/lib/mfinante/service'

// Get all statements for a company
const statements = await getFinancialStatements('12345678')

// Get latest statement
const latest = await getLatestFinancialStatement('12345678')

// Calculate risk factors
const riskFactors = await calculateFinancialRiskFactors('12345678')
// Returns: { missingStatements, delayedFiling, negativeEquity, revenueDrop50 }

// Get comprehensive summary
const summary = await getCompanyFinancialSummary('12345678')
```

### Integration in Search Flow

Financial data is automatically integrated into the search flow:

1. When a company is searched, financial risk factors are calculated
2. Risk factors are included in the comprehensive risk score
3. Financial data is displayed in the `FinancialStatementsCard` component

The integration happens in `app/[locale]/app/search/actions.ts`:

```typescript
// Financial risk factors are automatically fetched and included in risk calculation
const financialRiskFactors = await calculateFinancialRiskFactors(companyData.cui)
```

## Risk Scoring

Financial data contributes to the risk score as follows:

| Factor | Points | Max | Description |
|--------|--------|-----|-------------|
| Missing Statements (2y) | +20 | 20 | No financial statements for last 2 years |
| Delayed Filing | +10 | 10 | Delayed filing of financial statements |
| Negative Equity | +25 | 25 | Capital propriu negativ |
| Revenue Drop >50% | +15 | 15 | Year-over-year revenue drop >50% |

**Total Financial Category: 30 points max**

See `lib/risk-algorithm/factors.ts` for full implementation.

## Data Structure

### Financial Statement Fields

**Balance Sheet:**
- `totalAssets` - Total active
- `currentAssets` - Active circulante
- `fixedAssets` - Active imobilizate
- `totalLiabilities` - Total datorii
- `currentLiabilities` - Datorii curente
- `longTermLiabilities` - Datorii pe termen lung
- `equity` - Capital propriu
- `shareCapital` - Capital social

**Profit & Loss:**
- `revenue` - Cifră de afaceri / Venituri
- `operatingExpenses` - Cheltuieli de exploatare
- `operatingProfit` - Profit din exploatare
- `netProfit` - Profit net
- `netLoss` - Pierdere netă

**Financial Ratios (calculated):**
- `currentRatio` - Current assets / Current liabilities
- `debtToEquity` - Total liabilities / Equity
- `returnOnAssets` - Net profit / Total assets
- `returnOnEquity` - Net profit / Equity

## Setting Up Automated Imports

### Option 1: Cron Job (Recommended)

Create a cron job that calls the import endpoint periodically:

```bash
# Add to crontab (runs monthly)
0 2 1 * * curl -X POST https://your-domain.com/api/financial-statements/import
```

### Option 2: Vercel Cron

Add to `vercel.json`:

```json
{
  "crons": [
    {
      "path": "/api/financial-statements/import",
      "schedule": "0 2 1 * *"
    }
  ]
}
```

### Option 3: Next.js API Route with Cron

Create a cron route that triggers the import:

```typescript
// app/api/cron/financial-statements/route.ts
import { importFinancialStatementsFromDataGovRo } from '@/lib/mfinante/client'
import { saveFinancialStatements } from '@/lib/mfinante/service'

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 })
  }

  // Import current year and previous year
  const currentYear = new Date().getFullYear()
  await importFinancialStatementsFromDataGovRo(currentYear)
  await importFinancialStatementsFromDataGovRo(currentYear - 1)

  return Response.json({ success: true })
}
```

## Data.gov.ro Dataset Format

The integration expects datasets from data.gov.ro with:
- CSV or TXT format
- CUI column for company identification
- Financial statement fields (balance sheet, P&L)

**Note:** The actual column names may vary. The parser attempts to match common Romanian financial terms. You may need to adjust the `mapRowToFinancialStatement` function in `lib/mfinante/client.ts` based on the actual file structure.

## Troubleshooting

### No Data Available

If financial statements are not showing:
1. Check if data has been imported: Query `financial_statements` table
2. Verify data.gov.ro has datasets for the year you need
3. Check import logs for errors

### Import Errors

Common issues:
- **File format mismatch**: Adjust parser in `client.ts`
- **Column name differences**: Update `mapRowToFinancialStatement` function
- **Network errors**: Check data.gov.ro availability
- **Database errors**: Verify migration has been run

### Missing Risk Factors

If risk factors are not calculated correctly:
1. Verify statements exist in database for the company
2. Check date ranges (last 2 years)
3. Review `calculateFinancialRiskFactors` function logic

## Next Steps

1. **Set up automated imports** - Configure cron job for periodic data updates
2. **Validate data quality** - Add data validation and error handling
3. **Support quarterly/semiannual** - Extend to support non-annual statements
4. **Historical analysis** - Add trend analysis and forecasting
5. **Data quality checks** - Implement validation rules for financial data

## Related Documentation

- [API Integrations Guide](./API_INTEGRATIONS.md) - Complete API integration documentation
- [Risk Scoring Algorithm](./README.md#-risk-scoring-algorithm) - How risk is calculated
- [Database Schema](./supabase/migrations/010_financial_statements.sql) - Financial statements table structure

