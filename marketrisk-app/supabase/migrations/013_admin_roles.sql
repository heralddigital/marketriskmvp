-- Admin roles and permissions
-- Allows certain users to access admin panel

-- Add role column to users table
ALTER TABLE users
ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin', 'super_admin'));

-- Create index for role lookups
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- Create admin_actions table for audit logging
CREATE TABLE IF NOT EXISTS admin_actions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID NOT NULL REFERENCES users(id),
  action_type TEXT NOT NULL,
  target_user_id UUID REFERENCES users(id),
  details JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for admin actions
CREATE INDEX idx_admin_actions_admin_id ON admin_actions(admin_id);
CREATE INDEX idx_admin_actions_created_at ON admin_actions(created_at);
CREATE INDEX idx_admin_actions_action_type ON admin_actions(action_type);

-- Create system_stats table for dashboard metrics
CREATE TABLE IF NOT EXISTS system_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  metric_name TEXT NOT NULL,
  metric_value NUMERIC NOT NULL,
  metric_metadata JSONB,
  recorded_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for system stats
CREATE INDEX idx_system_stats_metric_name ON system_stats(metric_name);
CREATE INDEX idx_system_stats_recorded_at ON system_stats(recorded_at);

-- Function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM users
    WHERE id = user_id
    AND role IN ('admin', 'super_admin')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to log admin actions
CREATE OR REPLACE FUNCTION log_admin_action(
  p_admin_id UUID,
  p_action_type TEXT,
  p_target_user_id UUID DEFAULT NULL,
  p_details JSONB DEFAULT NULL
)
RETURNS VOID AS $$
BEGIN
  INSERT INTO admin_actions (admin_id, action_type, target_user_id, details)
  VALUES (p_admin_id, p_action_type, p_target_user_id, p_details);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get system statistics
CREATE OR REPLACE FUNCTION get_system_stats()
RETURNS TABLE (
  total_users BIGINT,
  active_subscriptions BIGINT,
  monthly_revenue NUMERIC,
  total_searches BIGINT,
  api_requests_today BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    (SELECT COUNT(*) FROM users)::BIGINT as total_users,
    (SELECT COUNT(*) FROM users WHERE subscription_status = 'active')::BIGINT as active_subscriptions,
    (SELECT SUM(
      CASE
        WHEN subscription_plan = 'professional' THEN 39
        WHEN subscription_plan = 'business' THEN 99
        ELSE 0
      END
    ) FROM users WHERE subscription_status = 'active')::NUMERIC as monthly_revenue,
    (SELECT COUNT(*) FROM companies)::BIGINT as total_searches,
    (SELECT COUNT(*) FROM api_key_usage WHERE timestamp > NOW() - INTERVAL '24 hours')::BIGINT as api_requests_today;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user subscription breakdown
CREATE OR REPLACE FUNCTION get_subscription_breakdown()
RETURNS TABLE (
  plan TEXT,
  user_count BIGINT,
  revenue NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    subscription_plan as plan,
    COUNT(*)::BIGINT as user_count,
    (CASE
      WHEN subscription_plan = 'professional' THEN COUNT(*) * 39
      WHEN subscription_plan = 'business' THEN COUNT(*) * 99
      ELSE 0
    END)::NUMERIC as revenue
  FROM users
  WHERE subscription_status = 'active'
  GROUP BY subscription_plan
  ORDER BY revenue DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Row Level Security for admin tables
ALTER TABLE admin_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_stats ENABLE ROW LEVEL SECURITY;

-- Policy: Only admins can view admin_actions
CREATE POLICY admin_actions_admin_only
  ON admin_actions
  FOR SELECT
  USING (is_admin(auth.uid()));

-- Policy: Only admins can view system_stats
CREATE POLICY system_stats_admin_only
  ON system_stats
  FOR SELECT
  USING (is_admin(auth.uid()));

-- Grant permissions
GRANT SELECT ON admin_actions TO authenticated;
GRANT SELECT ON system_stats TO authenticated;

-- Comments
COMMENT ON TABLE admin_actions IS 'Audit log of all admin actions';
COMMENT ON TABLE system_stats IS 'System-wide metrics for admin dashboard';
COMMENT ON COLUMN users.role IS 'User role: user, admin, or super_admin';
COMMENT ON FUNCTION is_admin IS 'Check if a user has admin privileges';
COMMENT ON FUNCTION log_admin_action IS 'Log an admin action for audit trail';
COMMENT ON FUNCTION get_system_stats IS 'Get high-level system statistics';
COMMENT ON FUNCTION get_subscription_breakdown IS 'Get subscription plan breakdown with revenue';
