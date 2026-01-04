# MarketRisk Integration Status

**Last Updated**: January 2026

---

## ✅ Completed Integrations

### 1. ANAF (Romanian Tax Authority)
**Status**: ✅ Fully Integrated  
**Type**: REST API  
**Endpoint**: `https://webservicesp.anaf.ro/api/PlatitorTvaRest/v9/tva`

**Features**:
- Company registration data
- VAT status and periods
- Company status (active/inactive)
- Addresses (fiscal, social)
- Legal form, CAEN codes
- IBAN, e-Invoice status

**Integration Points**:
- Company search (`app/[locale]/app/search/actions.ts`)
- Risk calculation (`lib/risk-algorithm/`)
- Company detail pages
- Dashboard widgets

**Documentation**: See `API_INTEGRATIONS.md`

---

### 2. PortalJust (Romanian Ministry of Justice)
**Status**: ✅ Fully Integrated  
**Type**: SOAP 1.2 API  
**Endpoint**: `http://portalquery.just.ro/query.asmx`

**Features**:
- Court case data (all Romanian courts)
- Case details (numbers, courts, parties, dates)
- Party role detection (plaintiff/defendant)
- Case status tracking
- Bankruptcy and execution proceedings
- **Integrated into risk scoring algorithm**

**Integration Points**:
- Company search (automatic fetch)
- Risk calculation (real litigation data)
- Search results page (LitigationCard)
- Company detail page
- Dashboard (latest cases widget)

**Risk Scoring Impact**:
- Defendant cases: +10 points each (higher risk)
- Plaintiff cases: +3 points each (lower risk)
- Lost cases: +15 points each (financial liability)
- Bankruptcy: +40 points (critical)
- Execution: +30 points (critical)

**Documentation**: See `PORTALJUST_INTEGRATION.md`

---

## 🚧 Planned Integrations

### 3. BPI (Biroul de Publicitate a Insolvenței)
**Status**: 🚧 Structure Ready  
**Type**: TBD (API or web scraping)

**Planned Features**:
- Insolvency notices
- Reorganization proceedings
- Liquidation notices
- Bankruptcy filings

**Current State**:
- Client structure created (`lib/bpi/client.ts`)
- Types defined
- Ready for API implementation

---

## 📊 Integration Architecture

### Data Flow

```
User Search (CUI)
    ↓
┌─────────────────┐
│  ANAF API       │ → Company Name, Status, VAT, etc.
└─────────────────┘
    ↓
┌─────────────────┐
│  PortalJust API │ → Court Cases (using company name)
└─────────────────┘
    ↓
┌─────────────────┐
│  Data Transform │ → Risk Calculation Format
└─────────────────┘
    ↓
┌─────────────────┐
│  Risk Algorithm │ → Comprehensive Score
│  (ANAF + Portal)│   (with litigation impact)
└─────────────────┘
    ↓
┌─────────────────┐
│  Database Save  │ → Companies, History, Risk Scores
└─────────────────┘
    ↓
┌─────────────────┐
│  UI Display     │ → Search Results + LitigationCard
└─────────────────┘
```

### Risk Calculation Integration

**Main Algorithm**: `lib/risk-algorithm/calculator.ts`

**Data Sources**:
1. **ANAF** → Legal & Regulatory factors
2. **PortalJust** → Litigation factors (enhanced)
3. **BPI** → Insolvency factors (when available)
4. **MFinante** → Financial factors (future)

**Litigation Impact**:
- Real court cases affect risk score
- Role-based weighting (defendant vs plaintiff)
- Financial viability assessment
- Case type categorization

---

## 🔧 Configuration

### Environment Variables

```env
# Supabase (Required)
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# ANAF (No key needed)
ANAF_CACHE_HOURS=1

# PortalJust (No key needed)
# Uses public SOAP service

# BPI (When available)
BPI_API_URL=
BPI_API_KEY=
```

### Caching Strategy

- **ANAF**: 1 hour (configurable)
- **PortalJust**: 24 hours (configurable)
- **Database**: Supabase connection pooling

---

## 📈 Usage Statistics

### API Calls
- **ANAF**: ~1 call per search (cached 1h)
- **PortalJust**: ~1 call per search (cached 24h)
- **Total per search**: 2 API calls

### Performance
- Average search time: 2-5 seconds
- PortalJust SOAP: 1-3 seconds
- ANAF REST: 0.5-1 second
- Risk calculation: <100ms

---

## 🐛 Known Issues & Limitations

### PortalJust
1. **Name Matching**: Requires exact company name match
   - Solution: Use ANAF company name
   - Future: Fuzzy matching

2. **SOAP Parsing**: Regex-based (not ideal but works)
   - Future: Use proper XML parser library

3. **Rate Limiting**: No official rate limits known
   - Current: 24h caching reduces calls
   - Future: Database caching

### ANAF
1. **State Debts**: Not available in current endpoint
   - Future: Additional endpoint or integration

2. **Financial Statements**: Not available
   - Future: ONRC integration

---

## 🚀 Future Enhancements

### Short Term
- [ ] Database caching for PortalJust data
- [ ] Incremental updates (only new cases)
- [ ] Better error messages for API failures

### Medium Term
- [ ] BPI integration (insolvency data)
- [ ] Email notifications for new cases
- [ ] PDF reports with litigation data

### Long Term
- [ ] Financial statements integration (ONRC)
- [ ] Payment history tracking
- [ ] Credit bureau data
- [ ] Advanced analytics dashboard

---

## 📚 Related Documentation

- [API_INTEGRATIONS.md](./API_INTEGRATIONS.md) - Detailed API docs
- [PORTALJUST_INTEGRATION.md](./PORTALJUST_INTEGRATION.md) - PortalJust guide
- [ARCHITECTURE.md](./ARCHITECTURE.md) - System architecture
- [README.md](./README.md) - Project overview

---

**Status**: All active integrations documented and up-to-date  
**Maintained By**: MarketRisk Development Team

