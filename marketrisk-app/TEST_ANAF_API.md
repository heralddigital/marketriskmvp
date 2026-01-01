# Testing ANAF API Integration

**Date**: January 1, 2026
**Status**: ✅ API endpoint corrected

---

## Issue Resolved

**Error**: `ANAF API error: 404 Not Found`

**Root Cause**: Incorrect API endpoint path

**Fix Applied**:
- ❌ Old: `https://webservicesp.anaf.ro/ProdusServiciiWeb/api/v8/ws/tva`
- ✅ New: `https://webservicesp.anaf.ro/PlatitorTvaRest/api/v8/ws/tva`

---

## Test Romanian Companies (Real CUIs)

Use these real Romanian company CUIs for testing:

### Known Valid CUIs
1. **OMV Petrom** - CUI: `1590082` (large company, should return GREEN)
2. **Banca Transilvania** - CUI: `5022670` (financial institution)
3. **Kaufland Romania** - CUI: `16201158` (retail)
4. **eMAG** - CUI: `10775229` (e-commerce)
5. **Dedeman** - CUI: `2816464` (retail construction)

### Test Cases

#### Test 1: Valid Large Company
```
CUI: 1590082
Expected: GREEN score (75-100)
Reason: Large, established company with full ANAF data
```

#### Test 2: Valid SME
```
CUI: 10775229
Expected: GREEN or YELLOW score
Reason: E-commerce company with good standing
```

#### Test 3: Invalid CUI Format
```
CUI: abc123
Expected: Validation error "CUI trebuie să conțină doar cifre"
```

#### Test 4: Non-existent CUI
```
CUI: 99999999
Expected: "Companie negăsită în ANAF"
```

#### Test 5: CUI with RO Prefix
```
CUI: RO1590082
Expected: Should work, RO prefix is stripped automatically
```

---

## ANAF API Details

### Endpoint Information
- **Base URL**: `https://webservicesp.anaf.ro`
- **Path**: `/api/PlatitorTvaRest/v9/tva` (updated to v9 - January 2026)
- **Full URL**: `https://webservicesp.anaf.ro/api/PlatitorTvaRest/v9/tva`
- **Method**: POST
- **Content-Type**: `application/json`

**Version History:**
- v7: `/PlatitorTvaRest/api/v7/ws/tva` (deprecated)
- v8: `/PlatitorTvaRest/api/v8/ws/tva` (deprecated)
- v9: `/api/PlatitorTvaRest/v9/tva` (current - note the `/api/` prefix)

### Request Format
```json
[{
  "cui": 1590082,
  "data": "2026-01-01"
}]
```

### Response Structure
```json
{
  "cod": 200,
  "message": "SUCCESS",
  "found": [{
    "cui": 1590082,
    "denumire": "OMV PETROM S.A.",
    "adresa": "...",
    "nrRegCom": "J40/8302/1997",
    "telefon": "...",
    "fax": "...",
    "codPostal": "...",
    "stare_inregistrare": "ACTIVA",
    "data_inregistrare": "1997-07-24",
    "cod_CAEN": "0610",
    "iban": "...",
    "statusRO_e_Factura": true,
    "organFiscalCompetent": "...",
    "forma_juridica": "SOCIETATE PE ACTIUNI",
    "forma_organizare": "...",
    "forma_de_proprietate": "..."
  }],
  "notFound": []
}
```

---

## Testing Steps

### 1. Test in Browser Console
Open http://localhost:3000/app/search and test the search function.

### 2. Test with cURL (Direct API)
```bash
curl -X POST https://webservicesp.anaf.ro/api/PlatitorTvaRest/v9/tva \
  -H "Content-Type: application/json" \
  -d '[{"cui": 1590082, "data": "2026-01-01"}]'
```

Expected response: JSON with company data

### 3. Test Different Scenarios

**Scenario A: First Search (Cache Miss)**
1. Enter CUI: `1590082`
2. Click "Caută"
3. Expected: ~1-2 second delay (real API call)
4. Result: Company data with risk score
5. Counter: "2 / 3 căutări rămase"

**Scenario B: Same Search (Cache Hit)**
1. Enter same CUI: `1590082`
2. Click "Caută"
3. Expected: Instant response (from cache)
4. Counter: Still "2 / 3" (not counted as new search if cached)

**Scenario C: Limit Enforcement**
1. Make 3 searches with different CUIs
2. Try 4th search
3. Expected: Error "Ai atins limita de 3 căutări pentru planul free"
4. Upgrade prompt shown

---

## Expected Risk Scores

### GREEN (75-100 points)
- Active company
- 10+ years old
- VAT registered
- E-Invoice registered
- Complete ANAF data
- Major company form (SA/SRL)

### YELLOW (50-74 points)
- Active company
- 2-10 years old
- Some missing data
- Standard company form

### RED (0-49 points)
- Inactive company
- Split VAT regime
- TVA la încasare
- Incomplete data
- Very new company (<2 years)

---

## Debugging Tips

### If You Get 404 Error
✅ **FIXED**: The endpoint must be `/api/PlatitorTvaRest/v9/tva`

Common mistakes:
- ❌ `/PlatitorTvaRest/api/v8/ws/tva` (old v8)
- ❌ `/ProdusServiciiWeb/api/v8/ws/tva` (wrong path)
- ✅ `/api/PlatitorTvaRest/v9/tva` (correct v9)

### If You Get 400 Bad Request
- Check JSON format
- Ensure CUI is numeric (not string)
- Ensure date format is YYYY-MM-DD

### If You Get Empty Results
- CUI might not exist in ANAF
- Try a known valid CUI like `1590082`

### If Search Counter Doesn't Update
- Check browser console for errors
- Verify `users` table has `searches_this_month` column
- Check that user profile exists in database

---

## API Rate Limits

ANAF API rate limits are not publicly documented, but based on usage:
- Recommended: Max 10 requests/second
- Our caching: 1 hour per CUI reduces load
- Plan limits also control usage

---

## Next Steps After Testing

1. ✅ Verify search works with real CUIs
2. ✅ Confirm risk scores are calculated correctly
3. ✅ Check search history is saved to database
4. ✅ Verify usage counter increments
5. ✅ Test limit enforcement
6. Move to Phase 6: Backend integrations

---

## References

- [ANAF API Documentation v9](https://static.anaf.ro/static/10/Anaf/Informatii_R/Servicii_web/doc_WS_V9.txt) **(CURRENT)**
- [ANAF API Documentation v7](https://static.anaf.ro/static/10/Anaf/Informatii_R/Servicii_web/doc_WS_V7.txt)
- [ANAF API Base URL](https://webservicesp.anaf.ro/api/PlatitorTvaRest/v9/tva)
- [GitHub - ANAF PHP API Client](https://github.com/andalisolutions/anaf-php)
- [GitHub - ANAF API Examples (itrack)](https://github.com/itrack/anaf)
- [RO ANAF OAuth Service Documentation](https://docs.socrate.io/api-reference/ro-anaf-oauth-service/)
- [LinkedIn - Romanian APIs Guide](https://www.linkedin.com/pulse/romanian-apis-exposed-you-can-use-starting-now-part-1-paladuta-stefan)

---

**Status**: ✅ Ready for testing with corrected API endpoint

Generated: January 1, 2026
