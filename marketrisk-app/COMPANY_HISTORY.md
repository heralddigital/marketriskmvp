# Company History Tracking System

## Overview

The company history system tracks all changes to company data over the past 5 years, including:
- Address changes (sediu social, domiciliu fiscal)
- Status changes (active/inactive)
- VAT registration changes
- Company name changes
- Risk score evolution
- And more...

## Database Schema

### `company_history` Table

Created in `supabase/migrations/006_company_history.sql`

**Key Features:**
- Stores complete snapshots of company data at each check
- Tracks specific fields for easy querying (addresses, status, VAT)
- Automatic cleanup of data older than 5 years
- Indexed for fast queries by CUI and date

**Fields:**
- `snapshot_data` (JSONB) - Complete company data snapshot
- `fiscal_address` (JSONB) - Fiscal address at time of snapshot
- `social_address` (JSONB) - Social address at time of snapshot
- `changes_detected` (JSONB) - Array of field names that changed
- `recorded_at` (TIMESTAMPTZ) - When the snapshot was taken

## API & Services

### Service: `lib/company-history/service.ts`

**Functions:**

1. **`saveCompanyHistory()`** - Saves a snapshot of company data
   - Automatically called after each company search
   - Detects changes from previous snapshot
   - Stores addresses, VAT info, status, etc.

2. **`getCompanyHistory()`** - Retrieves history for past N years
   - Default: 5 years
   - Returns all snapshots with full data

3. **`getAddressChanges()`** - Gets address change history
   - Uses database function `get_address_changes()`
   - Shows before/after for each change
   - Tracks both fiscal and social addresses

4. **`detectChanges()`** - Compares current data with last snapshot
   - Returns array of changed field names
   - Used to highlight what changed

5. **`getChangeSummary()`** - Provides statistics
   - Total changes
   - Changes by type (address, status, VAT)
   - Last change date

### API Route: `/api/company-history`

**GET Parameters:**
- `cui` (required) - Company CUI
- `years` (optional) - Number of years (default: 5)

**Response:**
```json
{
  "history": [...], // Array of history entries
  "addressChanges": [...], // Array of address changes
  "summary": {
    "total_changes": 5,
    "address_changes": 2,
    "status_changes": 1,
    "vat_changes": 2,
    "last_change_date": "2024-01-15T10:30:00Z",
    "changes_by_type": {...}
  }
}
```

## UI Components

### `CompanyHistoryTimeline` Component

Location: `components/app/CompanyHistoryTimeline.tsx`

**Features:**
- Visual timeline of all changes
- Address change highlights with before/after
- Change summary statistics
- Filter by time period (1, 2, 3, or 5 years)
- Color-coded change types
- Risk score history

**Displays:**
- ✅ Address changes (fiscal & social)
- ✅ Status changes (active/inactive)
- ✅ VAT registration changes
- ✅ Company name changes
- ✅ Risk score evolution
- ✅ Change detection badges

## Integration

### Automatic History Saving

History is automatically saved when:
1. A company is searched via `/app/search`
2. Company data is fetched from ANAF
3. Changes are detected from previous snapshot

**Flow:**
```
User searches company
  ↓
Fetch from ANAF
  ↓
Detect changes from last snapshot
  ↓
Save/update company record
  ↓
Save to company_history table
  ↓
Display in timeline component
```

## Usage Example

```typescript
// In search actions (already integrated)
import { saveCompanyHistory, detectChanges } from '@/lib/company-history/service'

// Detect changes
const changes = await detectChanges(cui, companyData)

// Save history
await saveCompanyHistory(
  companyId,
  cui,
  companyData,
  riskScore,
  changes
)
```

```tsx
// In component
import CompanyHistoryTimeline from '@/components/app/CompanyHistoryTimeline'

<CompanyHistoryTimeline cui={company.cui} />
```

## Database Functions

### `get_address_changes(p_cui, p_years)`

Returns address change history for a company.

**Returns:**
- `change_date` - When the change occurred
- `change_type` - Type of change
- `old_value` - Previous address
- `new_value` - New address
- `field_name` - Which address changed (fiscal/social)

### `detect_company_changes(old_snapshot, new_snapshot)`

Compares two snapshots and returns array of changed field names.

### `cleanup_old_company_history()`

Automatically removes history older than 5 years (can be run via cron).

## Migration

To set up the history system:

1. **Run the migration:**
```sql
-- Run this in your Supabase SQL editor
\i supabase/migrations/006_company_history.sql
```

Or via Supabase CLI:
```bash
supabase db push
```

2. **Verify table creation:**
```sql
SELECT * FROM company_history LIMIT 1;
```

## What Gets Tracked

### Addresses
- ✅ Sediu social (social address)
- ✅ Domiciliu fiscal (fiscal address)
- Full address details (street, number, city, county, postal code)

### Status
- ✅ Company status (ACTIV/INACTIV)
- ✅ Inactive dates
- ✅ Reactivation dates

### VAT
- ✅ VAT registration status
- ✅ VAT periods
- ✅ Split TVA status
- ✅ TVA la încasare status

### Other
- ✅ Company name
- ✅ Registration number
- ✅ Risk score and level
- ✅ Any other field in company data

## Future Enhancements

Potential additions:
- [ ] Email alerts when addresses change
- [ ] Export history to PDF
- [ ] Compare any two snapshots side-by-side
- [ ] Visual diff view for changes
- [ ] Integration with watchlist alerts
- [ ] Historical risk score charts
- [ ] Change frequency analysis

## Notes

- History is automatically cleaned up after 5 years
- Each search creates a new snapshot (if data changed)
- Address changes are highlighted separately for easy viewing
- All data is stored in JSONB for flexibility
- Indexes ensure fast queries even with large history

