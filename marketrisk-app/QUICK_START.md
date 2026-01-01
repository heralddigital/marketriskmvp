# MarketRisk - Quick Start Guide

Get your MarketRisk development environment up and running in 15 minutes.

---

## Prerequisites Checklist

- [ ] Node.js 18+ installed (`node --version`)
- [ ] npm installed (`npm --version`)
- [ ] Git installed
- [ ] Text editor (VS Code recommended)
- [ ] Supabase account (free tier is fine)

---

## Step 1: Initial Setup (5 minutes)

### 1.1 Verify Installation
```bash
cd marketrisk-app
npm install
```

Expected output: `added 382 packages`

### 1.2 Create Environment File
```bash
cp .env.local.example .env.local
```

---

## Step 2: Set Up Supabase (10 minutes)

### 2.1 Create Supabase Project
1. Go to [https://supabase.com](https://supabase.com)
2. Click "New Project"
3. Fill in:
   - **Name**: MarketRisk Dev
   - **Database Password**: (save this securely!)
   - **Region**: Choose closest to Romania (e.g., eu-central-1)
4. Click "Create new project"
5. Wait 2-3 minutes for provisioning

### 2.2 Get Your Credentials
1. In Supabase Dashboard, go to **Settings** → **API**
2. Copy these values:
   - **Project URL** (looks like: `https://xxx.supabase.co`)
   - **anon public** key (long string starting with `eyJ...`)
   - **service_role** key (another long string)

### 2.3 Update .env.local
Open `.env.local` and replace:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-actual-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...your-actual-anon-key
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...your-actual-service-role-key
```

### 2.4 Run Database Migrations

**Option A: Using Supabase Dashboard (Easiest)**
1. Go to **SQL Editor** in Supabase Dashboard
2. Create new query
3. Copy entire content of `supabase/migrations/001_initial_schema.sql`
4. Paste and click "Run"
5. Repeat for `002_rls_policies.sql`
6. Repeat for `003_functions_triggers.sql`

**Option B: Using Supabase CLI**
```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref your-project-id

# Run all migrations
supabase db push
```

### 2.5 Verify Database Setup
In Supabase Dashboard:
1. Go to **Table Editor**
2. You should see 7 tables:
   - users
   - companies
   - watchlist
   - alerts
   - search_history
   - litigation
   - risk_scores

If you see these tables ✅ your database is ready!

---

## Step 3: Start Development Server (1 minute)

```bash
npm run dev
```

Expected output:
```
  ▲ Next.js 15.x.x
  - Local:        http://localhost:3000
  - Ready in 2.3s
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Step 4: Verify Everything Works

### 4.1 Check Homepage
- Should see default Next.js page (we'll replace this later)
- No errors in browser console

### 4.2 Check Supabase Connection
Open browser dev tools console and run:
```javascript
// This will be available once we add auth pages
console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
```

### 4.3 Test TypeScript
All files should show no TypeScript errors in your editor.

---

## Troubleshooting

### Problem: `npm install` fails
**Solution**:
```bash
rm -rf node_modules package-lock.json
npm install
```

### Problem: Port 3000 already in use
**Solution**:
```bash
# Use different port
npm run dev -- -p 3001
```

### Problem: Supabase connection error
**Solution**:
1. Double-check `.env.local` has correct URL and keys
2. Verify project is not paused in Supabase dashboard
3. Check internet connection

### Problem: TypeScript errors
**Solution**:
```bash
# Restart TypeScript server in VS Code
# Cmd/Ctrl + Shift + P → "TypeScript: Restart TS Server"
```

### Problem: Migrations fail
**Solution**:
1. Check database is not paused
2. Run migrations one at a time in SQL Editor
3. Check for error messages in Supabase logs

---

## Next Steps

Now that your environment is set up, you can:

1. **Read the Documentation**
   - `README.md` - Full project overview
   - `IMPLEMENTATION_PROGRESS.md` - What's done and what's next

2. **Start Building**
   - Phase 4: Create authentication pages
   - Phase 5: Integrate ANAF API
   - Phase 6: Build core features

3. **Test the Risk Algorithm**
   ```typescript
   import { calculateMarketRiskScore } from '@/lib/risk-algorithm/calculator';

   const testData = {
     anaf: {
       stare_firma: 'ACTIVA',
       vat_deregistered: false,
       split_vat_regime: false,
       state_debts_eur: 0,
       company_age_months: 60,
       address_changes_2y: 0,
       employees: 10,
     },
     bpi: {
       active_insolvency: false,
       insolvency_history_3y: false,
     },
     portaljust: {
       active_lawsuits: 0,
       lost_cases_2y: 0,
       bankruptcy_filing: false,
       execution_proceedings: false,
       labor_disputes: 0,
     },
   };

   const score = calculateMarketRiskScore(testData);
   console.log(score);
   // Should output: { score: 0, riskLevel: 'GREEN', ... }
   ```

---

## Useful Commands

```bash
# Development
npm run dev          # Start dev server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

# Supabase (if CLI installed)
supabase status      # Check project status
supabase db reset    # Reset database (careful!)
supabase db diff     # Show schema changes
```

---

## Common Development Workflow

1. **Making Changes**
   ```bash
   git status                    # Check what changed
   git add .                     # Stage changes
   git commit -m "message"       # Commit
   ```

2. **Testing Features**
   - Make code changes
   - Browser auto-refreshes
   - Check browser console for errors
   - Test in database using Supabase dashboard

3. **Database Changes**
   - Never edit migrations directly
   - Create new migration file with timestamp
   - Test in Supabase SQL Editor first
   - Then add to migrations folder

---

## Support Resources

- **Next.js Docs**: https://nextjs.org/docs
- **Supabase Docs**: https://supabase.com/docs
- **Tailwind CSS**: https://tailwindcss.com/docs
- **TypeScript**: https://www.typescriptlang.org/docs

---

## You're All Set! 🎉

Your MarketRisk development environment is ready. Happy coding!

Next recommended reading: `IMPLEMENTATION_PROGRESS.md` to see what's been built and what's next.

---

**Last Updated**: December 31, 2025
