-- Create search_history table
CREATE TABLE IF NOT EXISTS search_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  cui TEXT NOT NULL,
  company_name TEXT NOT NULL,
  risk_level TEXT NOT NULL CHECK (risk_level IN ('GREEN', 'YELLOW', 'RED')),
  risk_score INTEGER NOT NULL CHECK (risk_score >= 0 AND risk_score <= 100),
  search_data JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),

  -- Indexes for performance
  INDEX idx_search_history_user_id (user_id),
  INDEX idx_search_history_created_at (created_at DESC),
  INDEX idx_search_history_cui (cui)
);

-- Enable RLS
ALTER TABLE search_history ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own search history"
  ON search_history
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own search history"
  ON search_history
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Add searches_used and searches_limit to profiles if not exists
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS searches_used INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS searches_limit INTEGER DEFAULT 3;

-- Update existing profiles with default limits based on plan
UPDATE profiles
SET searches_limit = CASE
  WHEN subscription_plan = 'free' THEN 3
  WHEN subscription_plan = 'starter' THEN 50
  WHEN subscription_plan = 'pro' THEN 200
  WHEN subscription_plan = 'enterprise' THEN 999999
  ELSE 3
END
WHERE searches_limit IS NULL OR searches_limit = 0;

-- Function to reset monthly searches
CREATE OR REPLACE FUNCTION reset_monthly_searches()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE profiles
  SET searches_used = 0,
      updated_at = NOW();
END;
$$;

-- Comment on function
COMMENT ON FUNCTION reset_monthly_searches() IS 'Reset all users monthly search counters - run on 1st of each month';
