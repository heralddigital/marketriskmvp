# Database Setup Instructions

## Quick Setup

1. **Open your Supabase Dashboard**
   - Go to https://supabase.com/dashboard
   - Select your project

2. **Open SQL Editor**
   - Click on "SQL Editor" in the left sidebar
   - Click "New query"

3. **Run the Setup Script**
   - Open the file: `supabase/complete_database_setup.sql`
   - Copy the entire contents
   - Paste into the SQL Editor
   - Click "Run" (or press Cmd/Ctrl + Enter)

4. **Verify Setup**
   - Go to "Table Editor" in the left sidebar
   - You should see these tables:
     - `users`
     - `companies`
     - `watchlist`
     - `alerts`
     - `search_history`
     - `litigation`
     - `risk_scores`
     - `risk_score_history`

## What This Script Does

The `complete_database_setup.sql` file includes:

### ✅ Tables Created
- **users** - User accounts with plan tiers and usage tracking
- **companies** - Cached company data from ANAF, PortalJust, and BPI
- **watchlist** - User-company watchlist relationships
- **alerts** - Notification history for users
- **search_history** - Track all company searches
- **litigation** - Lawsuit data from PortalJust
- **risk_scores** - Historical risk score tracking
- **risk_score_history** - Risk scores for trend analysis

### ✅ Security (RLS)
- Row Level Security enabled on all tables
- Policies configured so users can only access their own data
- Service role can manage public data (companies, litigation, etc.)

### ✅ Functions & Triggers
- Auto-create user profile on signup
- Auto-update timestamps
- Check plan limits
- Increment usage counters
- Create alerts for risk changes
- Get risk score history and trends

### ✅ Indexes
- Optimized indexes for fast queries
- GIN indexes for JSONB searches

## Important Notes

1. **Safe to Run Multiple Times**
   - The script uses `CREATE TABLE IF NOT EXISTS` and `DROP POLICY IF EXISTS`
   - You can run it multiple times without errors
   - Existing data will be preserved

2. **First Time Setup**
   - If you're setting up a fresh database, just run the complete script
   - If you already have some tables, the script will add missing ones

3. **After Running**
   - Your authentication should work immediately
   - User profiles will be auto-created on signup
   - All RLS policies are active

## Troubleshooting

### If you get permission errors:
- Make sure you're running the script as the database owner
- Check that you're in the correct Supabase project

### If tables already exist:
- The script is safe to run - it won't duplicate tables
- It will only add missing tables and update policies

### If you need to reset everything:
```sql
-- WARNING: This deletes all data!
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO public;
```
Then run the complete setup script again.

## Next Steps

After running the setup:
1. ✅ Verify your `.env.local` has correct Supabase credentials
2. ✅ Test user signup/login
3. ✅ Check that user profiles are auto-created
4. ✅ Test search functionality
5. ✅ Test watchlist features

## File Location

The complete setup file is located at:
```
marketrisk-app/supabase/complete_database_setup.sql
```

