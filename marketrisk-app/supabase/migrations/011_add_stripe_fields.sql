-- Add Stripe subscription fields to users table
-- Migration: 011_add_stripe_fields
-- Date: 2026-01-04

-- Add Stripe-related columns to users table
ALTER TABLE users
ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS stripe_subscription_id TEXT,
ADD COLUMN IF NOT EXISTS subscription_status TEXT DEFAULT 'free',
ADD COLUMN IF NOT EXISTS subscription_plan TEXT DEFAULT 'free',
ADD COLUMN IF NOT EXISTS subscription_period_end TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS last_payment_date TIMESTAMPTZ;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_stripe_customer_id ON users(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_users_stripe_subscription_id ON users(stripe_subscription_id);
CREATE INDEX IF NOT EXISTS idx_users_subscription_status ON users(subscription_status);
CREATE INDEX IF NOT EXISTS idx_users_subscription_plan ON users(subscription_plan);

-- Add comment explaining the fields
COMMENT ON COLUMN users.stripe_customer_id IS 'Stripe customer ID for billing';
COMMENT ON COLUMN users.stripe_subscription_id IS 'Stripe subscription ID (current active subscription)';
COMMENT ON COLUMN users.subscription_status IS 'Subscription status: free, active, past_due, canceled, incomplete, trialing, unpaid';
COMMENT ON COLUMN users.subscription_plan IS 'Current subscription plan: free, professional, business, enterprise';
COMMENT ON COLUMN users.subscription_period_end IS 'Current billing period end date';
COMMENT ON COLUMN users.last_payment_date IS 'Date of last successful payment';

-- Create subscription_history table to track all subscription changes
CREATE TABLE IF NOT EXISTS subscription_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL, -- 'created', 'updated', 'canceled', 'payment_failed', etc.
  plan_id TEXT NOT NULL,
  status TEXT NOT NULL,
  stripe_event_id TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for subscription history
CREATE INDEX IF NOT EXISTS idx_subscription_history_user_id ON subscription_history(user_id);
CREATE INDEX IF NOT EXISTS idx_subscription_history_created_at ON subscription_history(created_at DESC);

-- Add RLS policies for subscription_history
ALTER TABLE subscription_history ENABLE ROW LEVEL SECURITY;

-- Users can view their own subscription history
CREATE POLICY "Users can view own subscription history"
  ON subscription_history
  FOR SELECT
  USING (auth.uid() = user_id);

-- Only system can insert subscription history (via service role)
CREATE POLICY "System can insert subscription history"
  ON subscription_history
  FOR INSERT
  WITH CHECK (true);

-- Create function to log subscription changes
CREATE OR REPLACE FUNCTION log_subscription_change()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO subscription_history (user_id, event_type, plan_id, status, metadata)
  VALUES (
    NEW.id,
    CASE
      WHEN TG_OP = 'INSERT' THEN 'created'
      WHEN OLD.subscription_plan != NEW.subscription_plan THEN 'plan_changed'
      WHEN OLD.subscription_status != NEW.subscription_status THEN 'status_changed'
      ELSE 'updated'
    END,
    NEW.subscription_plan,
    NEW.subscription_status,
    jsonb_build_object(
      'old_plan', OLD.subscription_plan,
      'new_plan', NEW.subscription_plan,
      'old_status', OLD.subscription_status,
      'new_status', NEW.subscription_status
    )
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically log subscription changes
DROP TRIGGER IF EXISTS log_subscription_change_trigger ON users;
CREATE TRIGGER log_subscription_change_trigger
AFTER UPDATE OF subscription_plan, subscription_status ON users
FOR EACH ROW
WHEN (
  OLD.subscription_plan IS DISTINCT FROM NEW.subscription_plan OR
  OLD.subscription_status IS DISTINCT FROM NEW.subscription_status
)
EXECUTE FUNCTION log_subscription_change();

-- Create view for active subscriptions
CREATE OR REPLACE VIEW active_subscriptions AS
SELECT
  u.id AS user_id,
  u.email,
  u.subscription_plan,
  u.subscription_status,
  u.subscription_period_end,
  u.stripe_customer_id,
  u.stripe_subscription_id,
  u.last_payment_date,
  u.created_at AS user_created_at
FROM users u
WHERE u.subscription_status IN ('active', 'trialing')
  AND u.subscription_plan != 'free';

-- Grant access to view
GRANT SELECT ON active_subscriptions TO authenticated;

-- Add comment
COMMENT ON VIEW active_subscriptions IS 'View of users with active paid subscriptions';
