# Fix Watchlist Limits Issue

## Problem
Users are getting "Ai atins limita de 0 companii în watchlist" error even though they should have limits based on their plan (e.g., 10 for starter plan).

## Root Cause
The database default for `watchlist_limit` is 0, and the `handle_new_user()` function sets all new users to 0 regardless of plan. Existing users also have 0 limits.

## Solution

### 1. Automatic Fix in Code
The `addToWatchlist()` function now automatically:
- Detects if `watchlist_limit` is 0
- Sets it based on the user's plan:
  - `free`: 0
  - `starter`: 10
  - `pro`: 250
  - `enterprise`: -1 (unlimited)
- Updates the database with the correct limit

### 2. Database Migration
A migration file has been created: `supabase/migrations/007_update_plan_limits.sql`

This migration:
- Creates a `get_plan_limits()` function to return limits for each plan
- Updates all existing users with 0 limits to have limits based on their plan
- Updates the `handle_new_user()` function to set correct limits for new users

### 3. How to Apply the Fix

**Option A: Automatic (Recommended)**
The code fix will automatically update limits when a user tries to add to watchlist. No action needed.

**Option B: Manual Database Update**
If you want to update all users at once, run the migration:

```sql
-- In Supabase SQL Editor, run:
\i supabase/migrations/007_update_plan_limits.sql
```

Or manually update your user:

```sql
-- Update a specific user to starter plan limits
UPDATE users
SET 
  watchlist_limit = 10,
  search_limit_monthly = 20,
  pdf_export_limit_monthly = 5,
  updated_at = NOW()
WHERE email = 'your-email@example.com';

-- Or update all starter plan users
UPDATE users
SET 
  watchlist_limit = 10,
  search_limit_monthly = 20,
  pdf_export_limit_monthly = 5,
  updated_at = NOW()
WHERE plan = 'starter' AND watchlist_limit = 0;
```

### 4. Plan Limits Reference

| Plan | Search Limit | Watchlist Limit | PDF Export Limit |
|------|--------------|-----------------|------------------|
| Free | 3/month | 0 | 0 |
| Starter | 20/month | 10 | 5/month |
| Pro | Unlimited | 250 | Unlimited |
| Enterprise | Unlimited | Unlimited | Unlimited |

## Testing
1. Try adding a company to watchlist
2. The limit should be automatically set based on your plan
3. You should be able to add companies up to your limit

