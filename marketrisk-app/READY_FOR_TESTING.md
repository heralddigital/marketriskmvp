# 🚀 MarketRisk - Ready for Testing!

**Date**: January 1, 2026
**Status**: Phase 5 Complete - ANAF Integration Live
**Development Server**: http://localhost:3000

---

## ✅ What's Ready to Test

### 1. Authentication System
- **Sign Up**: http://localhost:3000/signup
- **Login**: http://localhost:3000/login
- **Password Reset**: http://localhost:3000/forgot-password
- **Features**:
  - Email/password authentication
  - Google OAuth (ready for config)
  - Automatic profile creation
  - Protected routes

### 2. Company Search with Real ANAF API
- **Page**: http://localhost:3000/app/search
- **Features**:
  - Search by CUI (Romanian company identifier)
  - Real-time ANAF government API integration
  - 24-factor MarketRisk Credit Score algorithm
  - Risk levels: GREEN (75-100), YELLOW (50-74), RED (0-49)
  - Plan-based usage limits (Free: 3, Starter: 50, Pro: 200, Enterprise: unlimited)
  - Search counter with remaining searches display
  - Top 6 risk factors shown
  - Complete company details from ANAF
  - 1-hour API response caching

**Test CUIs** (use real Romanian company CUIs):
- Format: 12345678 (numeric, 2-10 digits)
- Supports "RO" prefix (e.g., RO12345678)

### 3. Dashboard Pages
- **Dashboard**: http://localhost:3000/app/dashboard
- **Watchlist**: http://localhost:3000/app/watchlist (UI complete, mock data)
- **Alerts**: http://localhost:3000/app/alerts (UI complete, mock data)
- **History**: http://localhost:3000/app/history (UI complete, mock data)
- **Settings**: http://localhost:3000/app/settings (UI complete, mock data)

---

## 🗄️ Database Setup Required

Before testing, you need to:

### 1. Apply Database Migration

Run this in your Supabase SQL Editor:

```bash
# In Supabase Dashboard → SQL Editor → New Query
# Copy and paste the content of:
supabase/migrations/004_search_history.sql
```

This migration creates:
- `search_history` table for storing all searches
- `searches_used` and `searches_limit` columns in `profiles`
- RLS policies for data security
- `reset_monthly_searches()` function

### 2. Verify Environment Variables

Ensure `.env.local` has:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

---

## 🧪 Test Scenarios

### Scenario 1: New User Journey
1. Go to http://localhost:3000/signup
2. Create account with email/password
3. Verify redirect to dashboard
4. Check profile shows "Free Plan - 3 searches/month"
5. Navigate to Search page
6. Enter a Romanian CUI (e.g., 12345678)
7. Verify search works and shows:
   - Company name and details
   - Risk score (GREEN/YELLOW/RED)
   - Top 6 risk factors
   - Remaining searches counter decrements

### Scenario 2: Search Limit Testing
1. As Free plan user, make 3 searches
2. Try 4th search - should show "Limită atinsă" error
3. Verify upgrade prompt appears

### Scenario 3: ANAF Data Validation
1. Search valid CUI → should return company data
2. Search invalid CUI (e.g., "abc") → should show validation error
3. Search non-existent CUI → should show "Companie negăsită" error
4. Search same CUI twice → should use cached data (faster response)

### Scenario 4: Risk Score Calculation
1. Search active company with VAT registration
   - Expected: GREEN score (75-100)
2. Search inactive company
   - Expected: Lower score due to negative factors
3. Verify top 6 risk factors show:
   - Factor name
   - Category
   - Impact (positive/negative/neutral)
   - Description

---

## 🔍 What to Check

### UI/UX
- [ ] All pages load without errors
- [ ] Navigation between dashboard tabs works
- [ ] Loading states display during search
- [ ] Error messages in Romanian
- [ ] Risk score colors correct (GREEN/YELLOW/RED)
- [ ] Responsive design on mobile
- [ ] Icons display correctly (lucide-react)

### ANAF Integration
- [ ] Search by CUI works
- [ ] Company data displays correctly:
  - [ ] Company name (denumire)
  - [ ] CUI
  - [ ] Registration number (nrRegCom)
  - [ ] Address
  - [ ] Status
  - [ ] Registration date
  - [ ] CAEN code
- [ ] Risk score calculation accurate
- [ ] Factor descriptions in Romanian

### Database
- [ ] Search history saves to database
- [ ] User searches_used counter increments
- [ ] Limit enforcement works
- [ ] RLS prevents viewing other users' data

### Performance
- [ ] First search takes ~1-2 seconds (ANAF API call)
- [ ] Second search of same CUI is instant (cached)
- [ ] No console errors in browser

---

## 🐛 Known Limitations

### Mock Data (To Be Implemented in Phase 6)
- **Watchlist**: Shows mock companies, not real database data
- **Alerts**: Shows mock alerts, not real notifications
- **History**: Shows mock history, not real search_history data
- **Settings**: Shows mock settings, changes don't persist

### ANAF API Limitations
- Only supports CUI-based searches (not company name)
- Rate limits unknown (assumed reasonable for testing)
- Some companies may have incomplete data in ANAF

---

## 📊 24 Risk Factors Explained

The MarketRisk Credit Score analyzes:

### 1. Status Legal (35 points)
- Status înregistrare (15 pts) - Active/Inactive/Radiated
- Vechime companie (8 pts) - Years in business
- Status inactivitate (12 pts) - Inactive flag

### 2. Status TVA (22 points)
- Înregistrare TVA (10 pts) - VAT registration
- TVA la încasare (5 pts) - Cash accounting VAT
- Split TVA (7 pts) - Split VAT regime

### 3. Infrastructură Digitală (12 points)
- E-Factura (5 pts) - e-Invoice registration
- Date de contact (3 pts) - Phone/Fax availability
- IBAN declarat (4 pts) - Bank account declared

### 4. Formă Juridică (9 points)
- Tip societate (6 pts) - SA/SRL/PFA/II
- Formă organizare (3 pts) - Organization form

### 5. Cod CAEN (4 points)
- Cod activitate principal (4 pts) - Main activity code

### 6. Sediu și Locație (5 points)
- Adresă completă (3 pts) - Complete address
- Cod poștal (2 pts) - Postal code

### 7. Autoritate Fiscală (3 points)
- Organ fiscal competent (3 pts) - Tax authority

### 8. Analiză Sintetică (10 points)
- Completitudine date ANAF (5 pts) - Data completeness
- Consistență informații (5 pts) - Data consistency

**Total**: 24 factors = 100 points maximum

---

## 🚀 Next Steps After Testing

Once testing is complete, the next phase includes:

### Phase 6 - Backend Integration
1. Connect History page to real `search_history` table
2. Implement real Watchlist with database CRUD
3. Implement real Alerts system with notifications
4. Add company detail page with full risk breakdown
5. PDF report generation
6. Dashboard analytics with real data

### Phase 7 - PortalJust Integration
1. PortalJust API client for litigation data
2. Lawsuit tracking and scoring
3. Display in company profile

---

## 💡 Tips for Testing

1. **Use Browser DevTools**: Check Network tab for ANAF API calls
2. **Check Supabase Dashboard**: Verify data in `search_history` table
3. **Test Edge Cases**: Invalid CUIs, empty inputs, special characters
4. **Test Different Plans**: Update `subscription_plan` in profiles table to test limits
5. **Monitor Console**: Look for any JavaScript errors

---

## 📞 Issues to Report

If you encounter issues, note:
- Browser and version
- Steps to reproduce
- Error messages (from browser console and UI)
- Screenshots if applicable
- Expected vs actual behavior

---

**Happy Testing!** 🎉

The ANAF integration is live and ready for real Romanian company data queries. The MarketRisk Credit Score algorithm is calculating risk based on 24 government-verified factors.
