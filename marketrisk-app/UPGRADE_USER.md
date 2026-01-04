# Upgrade User Account

## Account Upgrade Script

To upgrade `andrei@aconstantin.com` to Enterprise plan (super-user), run this SQL in your Supabase SQL Editor:

```sql
-- Upgrade to enterprise plan with unlimited limits
UPDATE users
SET
  plan = 'enterprise',
  search_limit_monthly = -1,  -- unlimited
  watchlist_limit = -1,        -- unlimited
  pdf_export_limit_monthly = -1, -- unlimited
  team_users = -1,              -- unlimited
  updated_at = NOW()
WHERE email = 'andrei@aconstantin.com';

-- Verify the update
SELECT 
  email,
  plan,
  search_limit_monthly,
  watchlist_limit,
  pdf_export_limit_monthly,
  team_users,
  updated_at
FROM users
WHERE email = 'andrei@aconstantin.com';
```

## Enterprise Plan Features

- ✅ **Unlimited searches** per month
- ✅ **Unlimited watchlist** companies
- ✅ **Unlimited PDF exports** per month
- ✅ **Unlimited team members**
- ✅ Custom integrations
- ✅ Dedicated support
- ✅ SLA guarantee
- ✅ Custom reporting
- ✅ White-label options

## After Running the Script

1. The account will be upgraded to Enterprise plan
2. All limits will be set to unlimited (-1)
3. You can add unlimited companies to watchlist
4. You can perform unlimited searches
5. You can export unlimited PDFs

The upgrade takes effect immediately.

