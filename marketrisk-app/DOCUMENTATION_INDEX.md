# MarketRisk Documentation Index

**Last Updated**: January 2026  
**Purpose**: Master index of all documentation for easy reference

---

## 📚 Core Documentation

### Getting Started
1. **[README.md](./README.md)** - Main project overview, features, tech stack
2. **[QUICK_START.md](./QUICK_START.md)** - Setup guide (15 minutes)
3. **[QUICK_REFERENCE.md](./QUICK_REFERENCE.md)** - Quick reference card

### Architecture & Design
4. **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Complete system architecture
5. **[API_INTEGRATIONS.md](./API_INTEGRATIONS.md)** - All API integrations
6. **[INTEGRATION_STATUS.md](./INTEGRATION_STATUS.md)** - Integration status overview

### Feature Documentation
7. **[PORTALJUST_INTEGRATION.md](./PORTALJUST_INTEGRATION.md)** - PortalJust complete guide
8. **[DASHBOARD_COMPLETE.md](./DASHBOARD_COMPLETE.md)** - Dashboard features
9. **[WATCHLIST_MONITORING.md](./WATCHLIST_MONITORING.md)** - Watchlist system
10. **[COMPANY_HISTORY.md](./COMPANY_HISTORY.md)** - Company history tracking

### Phase Documentation
11. **[PHASE_4_COMPLETE.md](./PHASE_4_COMPLETE.md)** - Authentication phase
12. **[PHASE_5_COMPLETE.md](./PHASE_5_COMPLETE.md)** - ANAF + PortalJust integration
13. **[MIGRATION_COMPLETE.md](./MIGRATION_COMPLETE.md)** - Migration from creator-dashboard

### Setup & Configuration
14. **[SUPABASE_SETUP.md](./SUPABASE_SETUP.md)** - Supabase configuration
15. **[AUTHENTICATION_READY.md](./AUTHENTICATION_READY.md)** - Auth setup
16. **[TEST_ANAF_API.md](./TEST_ANAF_API.md)** - ANAF testing guide

### Bug Fixes & Updates
17. **[BUGFIX_PROFILES_TABLE.md](./BUGFIX_PROFILES_TABLE.md)** - Users table fixes
18. **[FIX_WATCHLIST_LIMITS.md](./FIX_WATCHLIST_LIMITS.md)** - Watchlist limit fixes
19. **[UPGRADE_USER.md](./UPGRADE_USER.md)** - User upgrade functionality
20. **[HOMEPAGE_FIXED.md](./HOMEPAGE_FIXED.md)** - Homepage fixes

---

## 🔍 Quick Lookup Guide

### "How do I..."

**...understand the risk scoring algorithm?**
→ See `README.md` → Risk Scoring Algorithm section  
→ See `ARCHITECTURE.md` → Risk Scoring Algorithm section  
→ See `lib/risk-algorithm/factors.ts` (code)

**...integrate a new API?**
→ See `API_INTEGRATIONS.md` for patterns  
→ See `PORTALJUST_INTEGRATION.md` for SOAP example  
→ See `lib/portaljust/client.ts` for implementation

**...understand PortalJust integration?**
→ See `PORTALJUST_INTEGRATION.md` (complete guide)  
→ See `API_INTEGRATIONS.md` → PortalJust section  
→ See `lib/portaljust/client.ts` (code)

**...see how litigation affects risk scoring?**
→ See `lib/risk-algorithm/factors.ts` → `calculateLitigationPoints()`  
→ See `PORTALJUST_INTEGRATION.md` → Risk Scoring Integration  
→ See `lib/risk-algorithm/litigation-transformer.ts`

**...set up the development environment?**
→ See `QUICK_START.md` (step-by-step)  
→ See `SUPABASE_SETUP.md` (database setup)

**...understand the database schema?**
→ See `README.md` → Database Schema  
→ See `supabase/complete_database_setup.sql`  
→ See `ARCHITECTURE.md` → Database Schema

**...see what features are implemented?**
→ See `README.md` → Features section  
→ See `INTEGRATION_STATUS.md` → Completed Integrations  
→ See `DASHBOARD_COMPLETE.md` for UI features

**...understand the authentication flow?**
→ See `AUTHENTICATION_READY.md`  
→ See `ARCHITECTURE.md` → Authentication & Authorization  
→ See `middleware.ts` (code)

**...add a new risk factor?**
→ See `lib/risk-algorithm/factors.ts`  
→ See `ARCHITECTURE.md` → Risk Scoring Algorithm  
→ Follow existing factor patterns

**...test the PortalJust API?**
→ See `PORTALJUST_INTEGRATION.md` → Testing section  
→ See `lib/portaljust/client.ts` → `fetchPortalJustData()`

---

## 📁 Code Locations

### Risk Algorithm
- **Main Calculator**: `lib/risk-algorithm/calculator.ts`
- **Factor Definitions**: `lib/risk-algorithm/factors.ts`
- **Litigation Transformer**: `lib/risk-algorithm/litigation-transformer.ts`

### API Clients
- **ANAF**: `lib/anaf/client.ts`
- **PortalJust**: `lib/portaljust/client.ts`
- **BPI**: `lib/bpi/client.ts` (structure ready)

### Components
- **LitigationCard**: `components/app/LitigationCard.tsx`
- **FinancialDataCard**: `components/app/FinancialDataCard.tsx`
- **Dashboard**: `app/[locale]/app/dashboard/page.tsx`

### Server Actions
- **Search**: `app/[locale]/app/search/actions.ts`
- **Watchlist**: `app/[locale]/app/watchlist/actions.ts`
- **Dashboard**: `app/[locale]/app/dashboard/actions.ts`

---

## 🎯 Key Features Status

| Feature | Status | Documentation |
|---------|--------|----------------|
| ANAF Integration | ✅ Complete | `API_INTEGRATIONS.md` |
| PortalJust Integration | ✅ Complete | `PORTALJUST_INTEGRATION.md` |
| Risk Calculation | ✅ Complete | `ARCHITECTURE.md` |
| Litigation Scoring | ✅ Complete | `PORTALJUST_INTEGRATION.md` |
| Dashboard Widgets | ✅ Complete | `DASHBOARD_COMPLETE.md` |
| Watchlist | ✅ Complete | `WATCHLIST_MONITORING.md` |
| Company History | ✅ Complete | `COMPANY_HISTORY.md` |
| BPI Integration | 🚧 Ready | `API_INTEGRATIONS.md` |
| Email Notifications | 🚧 Planned | - |
| PDF Export | 🚧 Planned | - |

---

## 🔄 Recent Updates (January 2026)

### PortalJust Integration
- ✅ SOAP client implementation
- ✅ Risk calculation integration
- ✅ LitigationCard component
- ✅ Dashboard latest cases widget
- ✅ Plaintiff/defendant differentiation

### Risk Algorithm Enhancement
- ✅ Real PortalJust data in scoring
- ✅ Role-based weighting (defendant vs plaintiff)
- ✅ Financial viability impact assessment
- ✅ Enhanced litigation factors

### Documentation
- ✅ Created `PORTALJUST_INTEGRATION.md`
- ✅ Created `ARCHITECTURE.md`
- ✅ Created `INTEGRATION_STATUS.md`
- ✅ Updated all existing docs

---

## 📖 Documentation Standards

### When Adding New Features

1. **Update README.md**
   - Add to Features section
   - Update Roadmap
   - Add to Tech Stack if new technology

2. **Update API_INTEGRATIONS.md**
   - If new API integration
   - Add configuration details
   - Add usage examples

3. **Update ARCHITECTURE.md**
   - Add to relevant section
   - Update data flow diagrams
   - Document design decisions

4. **Create Feature-Specific Doc** (if complex)
   - Follow `PORTALJUST_INTEGRATION.md` format
   - Include implementation details
   - Include testing guide

5. **Update This Index**
   - Add new doc to appropriate section
   - Update status tables

---

## 🗺️ Navigation Map

```
Start Here
    ↓
README.md (Overview)
    ↓
    ├─→ QUICK_START.md (Setup)
    ├─→ ARCHITECTURE.md (System Design)
    ├─→ API_INTEGRATIONS.md (APIs)
    │       └─→ PORTALJUST_INTEGRATION.md (Detailed)
    ├─→ DASHBOARD_COMPLETE.md (UI Features)
    └─→ INTEGRATION_STATUS.md (Status)
```

---

## 📝 Notes for Future Agents

1. **Always check this index first** before asking questions
2. **Code is the source of truth** - docs may lag behind
3. **Update docs when making changes** - keep them current
4. **Follow existing patterns** - consistency is key
5. **Test before documenting** - ensure accuracy

---

**Maintained By**: MarketRisk Development Team  
**Last Updated**: January 2026

