# Quick Test Guide - MarketRisk Authentication

## 🚀 Test in 5 Minutes

### Step 1: Apply Database Migrations (2 minutes)
1. Go to: https://supabase.com/dashboard/project/lfhfqgssrcxughxrrkqi/sql/new
2. Copy entire content from: `supabase/migrations/001_initial_schema.sql`
3. Paste and click **RUN**
4. Repeat for: `002_rls_policies.sql`
5. Repeat for: `003_functions_triggers.sql`

### Step 2: Test Authentication (3 minutes)

**Development server is already running at: http://localhost:3000**

#### Test Signup:
```
URL: http://localhost:3000/signup
Name: Test User
Email: test@example.com
Password: password123
✓ Check terms box
→ Click "Creează cont"
✓ Should see success screen
```

#### Test Login:
```
URL: http://localhost:3000/login
Email: test@example.com
Password: password123
→ Click "Intră în cont"
✓ Should redirect to dashboard at /app/dashboard
```

#### Test Dashboard:
```
URL: http://localhost:3000/app/dashboard
✓ Should see your name
✓ Should see plan: "free"
✓ Should see 3 search limit
✓ MarketRisk branding (green colors)
```

#### Test Logout:
```
Click "Ieșire" button
✓ Should redirect to /login
Try /app/dashboard again
✓ Should redirect back to /login
```

---

## ✅ What to Verify

After testing, you should have:
- [x] Created a user account
- [x] Logged in successfully
- [x] Viewed the dashboard
- [x] Seen your user profile data
- [x] Logged out successfully
- [x] Verified route protection works

---

## 🎯 Success!

If all tests pass, Phase 4 is complete and you're ready for Phase 5 (ANAF API Integration).

---

## 🐛 Quick Fixes

**"Error creating account"**
→ Check Supabase logs: https://supabase.com/dashboard/project/lfhfqgssrcxughxrrkqi/logs/explorer

**"Cannot read properties"**
→ Apply database migrations (Step 1)

**Server not running**
```bash
cd marketrisk-app
npm run dev
```

---

**Questions?** Check `AUTHENTICATION_READY.md` for full documentation.
