# Watchlist Daily Monitoring

## Overview

The app now includes **automatic daily monitoring** of companies in watchlists. This ensures that risk data is kept up-to-date even if companies were added weeks or months ago.

## How It Works

### Current Flow

1. **When adding to watchlist:**
   - Risk data is saved immediately if available
   - `last_check` is set to current timestamp
   - Company is added to monitoring queue

2. **Daily Monitoring (Automated):**
   - **Cron Job:** Runs daily at 6:00 AM (UTC)
   - **Endpoint:** `/api/cron/monitor-watchlist`
   - **Process:**
     - Fetches all companies in watchlists with `alert_on_change = true`
     - Re-fetches fresh data from ANAF API for each company
     - Recalculates risk scores based on latest data
     - Updates `companies` table with new risk data
     - Saves to `risk_score_history` for trend tracking
     - Updates `watchlist.last_check` timestamp
     - Creates alerts if risk level changed (GREEN → YELLOW, YELLOW → RED, etc.)

3. **When viewing watchlist:**
   - If risk data is missing, it tries to fetch from `risk_score_history`
   - Shows "Necunoscut" (Unknown) if no risk data exists
   - Shows GREEN/YELLOW/RED with score if risk data exists

## Configuration

### Environment Variables

Add to `.env.local` or Vercel environment variables:

```env
CRON_SECRET=your-secret-key-here-change-in-production
```

### Vercel Cron Configuration

The cron job is configured in `vercel.json`:

```json
{
  "crons": [
    {
      "path": "/api/cron/monitor-watchlist",
      "schedule": "0 6 * * *"
    }
  ]
}
```

Schedule: `0 6 * * *` = Daily at 6:00 AM UTC

To change the schedule, use cron syntax:
- `0 6 * * *` - Daily at 6 AM
- `0 */6 * * *` - Every 6 hours
- `0 0 * * 1` - Every Monday at midnight
- `*/30 * * * *` - Every 30 minutes (for testing)

### Manual Testing

You can test the monitoring endpoint manually:

```bash
# Test endpoint (GET request)
curl -H "Authorization: Bearer YOUR_CRON_SECRET" \
  https://your-domain.com/api/cron/monitor-watchlist

# Trigger monitoring (POST request)
curl -X POST \
  -H "Authorization: Bearer YOUR_CRON_SECRET" \
  https://your-domain.com/api/cron/monitor-watchlist
```

## Database Functions Used

1. **`get_companies_for_monitoring()`**
   - Returns all companies being actively monitored
   - Only includes companies where `watchlist.alert_on_change = true`
   - Groups by company and counts users watching

2. **`create_risk_change_alert()`**
   - Creates alerts for all users watching a company when risk level changes
   - Determines severity based on new risk level (RED = critical, YELLOW = warning, etc.)

## What Gets Updated

For each monitored company, the system updates:

- `companies.current_risk_level` - Latest risk level (GREEN/YELLOW/RED)
- `companies.current_risk_score` - Latest risk score (0-100)
- `companies.risk_details` - Full risk calculation details
- `companies.last_anaf_check` - Last time ANAF data was fetched
- `companies.anaf_data` - Complete ANAF response data
- `companies.company_name`, `vat_active`, `vat_split_regime`, etc. - Updated company info
- `watchlist.last_check` - Last time this company was checked (for all users watching it)
- `risk_score_history` - Historical record of risk scores for trend analysis
- `alerts` - Creates alerts when risk level changes (if enabled)

## Rate Limiting

The monitoring job includes a 100ms delay between each company to avoid overwhelming the ANAF API. For large watchlists (100+ companies), the job may take several minutes to complete.

## Error Handling

- Individual company failures don't stop the entire job
- Errors are logged and included in the response
- Companies with errors are skipped and reported
- ANAF API failures are logged but don't crash the job

## Monitoring Response

The endpoint returns a JSON response:

```json
{
  "success": true,
  "message": "Monitoring completed: 25 updated, 2 errors",
  "processed": 27,
  "updated": 25,
  "errors": 2,
  "errorDetails": [
    "12345678: Not found in ANAF",
    "87654321: Failed to parse ANAF data"
  ]
}
```

## Alerts

When a risk level changes, alerts are automatically created for all users watching that company:

- **GREEN → YELLOW/RED:** Warning or Critical alert
- **YELLOW → RED:** Critical alert
- **YELLOW/RED → GREEN:** Info alert (risk improved)

Users can view alerts in the `/app/alerts` page.

## Security

- The cron endpoint requires `Authorization: Bearer <CRON_SECRET>` header
- Vercel automatically adds this header when calling cron jobs
- Manual access requires the secret key
- Never commit `CRON_SECRET` to version control

## Future Enhancements

Potential improvements:

1. **Batch Processing:** Process companies in batches to improve performance
2. **Priority Queue:** Prioritize companies that haven't been checked recently
3. **Webhook Notifications:** Send webhooks when risk levels change
4. **Email Notifications:** Send email alerts when risk changes
5. **Configurable Frequency:** Allow users to set monitoring frequency per company
6. **Selective Monitoring:** Only monitor companies that were added more than X days ago

