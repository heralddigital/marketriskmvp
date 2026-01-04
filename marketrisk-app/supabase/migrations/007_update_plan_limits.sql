-- Migration: 007_update_plan_limits.sql
-- Update user plan limits based on their plan tier
-- This fixes users who have 0 limits when they should have limits based on their plan

-- Function to get plan limits
CREATE OR REPLACE FUNCTION get_plan_limits(p_plan TEXT)
RETURNS TABLE(
  search_limit INTEGER,
  watchlist_limit INTEGER,
  pdf_limit INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    CASE p_plan
      WHEN 'free' THEN 3
      WHEN 'starter' THEN 20
      WHEN 'pro' THEN -1
      WHEN 'enterprise' THEN -1
      ELSE 3
    END as search_limit,
    CASE p_plan
      WHEN 'free' THEN 0
      WHEN 'starter' THEN 10
      WHEN 'pro' THEN 250
      WHEN 'enterprise' THEN -1
      ELSE 0
    END as watchlist_limit,
    CASE p_plan
      WHEN 'free' THEN 0
      WHEN 'starter' THEN 5
      WHEN 'pro' THEN -1
      WHEN 'enterprise' THEN -1
      ELSE 0
    END as pdf_limit;
END;
$$ LANGUAGE plpgsql;

-- Update all users with 0 limits to have limits based on their plan
UPDATE users
SET
  search_limit_monthly = (SELECT search_limit FROM get_plan_limits(plan)),
  watchlist_limit = (SELECT watchlist_limit FROM get_plan_limits(plan)),
  pdf_export_limit_monthly = (SELECT pdf_limit FROM get_plan_limits(plan)),
  updated_at = NOW()
WHERE
  watchlist_limit = 0
  OR search_limit_monthly = 0
  OR pdf_export_limit_monthly = 0;

-- Update the handle_new_user function to set limits based on plan
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  v_plan TEXT := COALESCE(NEW.raw_user_meta_data->>'plan', 'free');
  v_search_limit INTEGER;
  v_watchlist_limit INTEGER;
  v_pdf_limit INTEGER;
BEGIN
  -- Get limits based on plan
  SELECT search_limit, watchlist_limit, pdf_limit
  INTO v_search_limit, v_watchlist_limit, v_pdf_limit
  FROM get_plan_limits(v_plan);

  INSERT INTO public.users (
    id,
    email,
    full_name,
    plan,
    search_limit_monthly,
    watchlist_limit,
    pdf_export_limit_monthly
  ) VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    v_plan,
    v_search_limit,
    v_watchlist_limit,
    v_pdf_limit
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add comment
COMMENT ON FUNCTION get_plan_limits IS 'Returns the limits for a given plan tier';
COMMENT ON FUNCTION handle_new_user IS 'Creates user profile with plan-appropriate limits on signup';

