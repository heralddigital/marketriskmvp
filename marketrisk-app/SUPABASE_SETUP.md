# Supabase Setup Guide

## Step 1: Apply Database Migrations

Since the Supabase CLI is not installed, you'll need to apply the migrations manually via the Supabase Dashboard.

### Instructions:

1. Go to your Supabase project: https://supabase.com/dashboard/project/lfhfqgssrcxughxrrkqi
2. Click on **SQL Editor** in the left sidebar
3. Click **+ New query**
4. Apply the migrations in order:

#### Migration 1: Initial Schema
Copy and paste the entire contents of `supabase/migrations/001_initial_schema.sql` and run it.

#### Migration 2: RLS Policies
Copy and paste the entire contents of `supabase/migrations/002_rls_policies.sql` and run it.

#### Migration 3: Functions & Triggers
Copy and paste the entire contents of `supabase/migrations/003_functions_triggers.sql` and run it.

### Verification:

After running all migrations, verify the setup:
1. Go to **Table Editor** - you should see 7 tables: users, companies, watchlist, alerts, search_history, litigation, risk_scores
2. Go to **Database** > **Policies** - verify RLS policies are enabled
3. Go to **Database** > **Functions** - verify database functions exist

## Step 2: Generate TypeScript Types (Optional for now)

We'll generate these after testing the connection. For now, we'll use the manual types already created.

## Step 3: Test the Connection

The `.env.local` file has been updated with your credentials:
- URL: https://lfhfqgssrcxughxrrkqi.supabase.co
- Keys: Configured ✅

## Next Steps

Once migrations are applied, we'll:
1. Create authentication pages (login, signup, password reset)
2. Test the auth flow
3. Build the first protected pages

---

**Note**: If you prefer to use the CLI, install it with:
```bash
npm install -g supabase
```

Then link your project:
```bash
supabase link --project-ref lfhfqgssrcxughxrrkqi
```
