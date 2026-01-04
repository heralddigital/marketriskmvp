-- Migration: 008_upgrade_user.sql
-- Upgrade user andrei@aconstantin.com to enterprise plan (super-user)

-- Update user to enterprise plan with unlimited limits
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

