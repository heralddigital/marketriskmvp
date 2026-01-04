-- API Keys for Business tier users
-- Allows users to access MarketRisk API programmatically

-- Create api_keys table
CREATE TABLE IF NOT EXISTS api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  -- Key details
  key_hash TEXT NOT NULL UNIQUE, -- Hashed API key (never store plain text)
  key_preview TEXT NOT NULL, -- First 8 characters for display (e.g., "mr_live_abc12345...")
  name TEXT NOT NULL, -- User-friendly name for the key

  -- Permissions and limits
  scopes TEXT[] DEFAULT ARRAY['read:companies', 'read:risk-scores'], -- What the key can access
  rate_limit INTEGER DEFAULT 1000, -- Requests per hour

  -- Usage tracking
  last_used_at TIMESTAMPTZ,
  requests_count INTEGER DEFAULT 0,

  -- Status
  is_active BOOLEAN DEFAULT true,
  expires_at TIMESTAMPTZ, -- Optional expiration date

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Constraints
  CONSTRAINT api_keys_user_id_key UNIQUE (user_id, id)
);

-- Create index for faster lookups
CREATE INDEX idx_api_keys_key_hash ON api_keys(key_hash);
CREATE INDEX idx_api_keys_user_id ON api_keys(user_id);
CREATE INDEX idx_api_keys_is_active ON api_keys(is_active);

-- Create api_key_usage table for tracking requests
CREATE TABLE IF NOT EXISTS api_key_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  api_key_id UUID NOT NULL REFERENCES api_keys(id) ON DELETE CASCADE,

  -- Request details
  endpoint TEXT NOT NULL,
  method TEXT NOT NULL,
  status_code INTEGER NOT NULL,

  -- Timing
  response_time_ms INTEGER,
  timestamp TIMESTAMPTZ DEFAULT NOW(),

  -- Request metadata
  ip_address TEXT,
  user_agent TEXT,

  -- Data usage (for billing)
  companies_searched INTEGER DEFAULT 0
);

-- Create index for usage analytics
CREATE INDEX idx_api_key_usage_api_key_id ON api_key_usage(api_key_id);
CREATE INDEX idx_api_key_usage_timestamp ON api_key_usage(timestamp);
CREATE INDEX idx_api_key_usage_endpoint ON api_key_usage(endpoint);

-- Function to update api_keys updated_at
CREATE OR REPLACE FUNCTION update_api_keys_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for updating updated_at
CREATE TRIGGER set_api_keys_updated_at
  BEFORE UPDATE ON api_keys
  FOR EACH ROW
  EXECUTE FUNCTION update_api_keys_updated_at();

-- Function to increment request count
CREATE OR REPLACE FUNCTION increment_api_key_usage()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE api_keys
  SET
    requests_count = requests_count + 1,
    last_used_at = NOW()
  WHERE id = NEW.api_key_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for incrementing usage
CREATE TRIGGER increment_api_key_requests
  AFTER INSERT ON api_key_usage
  FOR EACH ROW
  EXECUTE FUNCTION increment_api_key_usage();

-- Row Level Security (RLS)
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_key_usage ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own API keys
CREATE POLICY api_keys_user_select
  ON api_keys
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can only create their own API keys
CREATE POLICY api_keys_user_insert
  ON api_keys
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can only update their own API keys
CREATE POLICY api_keys_user_update
  ON api_keys
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Policy: Users can only delete their own API keys
CREATE POLICY api_keys_user_delete
  ON api_keys
  FOR DELETE
  USING (auth.uid() = user_id);

-- Policy: Users can only see usage for their own API keys
CREATE POLICY api_key_usage_user_select
  ON api_key_usage
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM api_keys
      WHERE api_keys.id = api_key_usage.api_key_id
      AND api_keys.user_id = auth.uid()
    )
  );

-- Grant necessary permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON api_keys TO authenticated;
GRANT SELECT ON api_key_usage TO authenticated;

-- Function to get API key statistics
CREATE OR REPLACE FUNCTION get_api_key_stats(key_id UUID)
RETURNS TABLE (
  total_requests BIGINT,
  requests_last_24h BIGINT,
  requests_last_hour BIGINT,
  avg_response_time_ms NUMERIC,
  most_used_endpoint TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(*)::BIGINT as total_requests,
    COUNT(*) FILTER (WHERE timestamp > NOW() - INTERVAL '24 hours')::BIGINT as requests_last_24h,
    COUNT(*) FILTER (WHERE timestamp > NOW() - INTERVAL '1 hour')::BIGINT as requests_last_hour,
    AVG(response_time_ms)::NUMERIC as avg_response_time_ms,
    (
      SELECT endpoint
      FROM api_key_usage
      WHERE api_key_id = key_id
      GROUP BY endpoint
      ORDER BY COUNT(*) DESC
      LIMIT 1
    ) as most_used_endpoint
  FROM api_key_usage
  WHERE api_key_id = key_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Comments for documentation
COMMENT ON TABLE api_keys IS 'API keys for programmatic access to MarketRisk API (Business tier)';
COMMENT ON TABLE api_key_usage IS 'Usage tracking and analytics for API keys';
COMMENT ON COLUMN api_keys.key_hash IS 'SHA-256 hash of the API key for secure storage';
COMMENT ON COLUMN api_keys.key_preview IS 'First 8 chars of key for display (e.g., mr_live_abc12345...)';
COMMENT ON COLUMN api_keys.scopes IS 'Array of permissions (e.g., read:companies, write:watchlist)';
COMMENT ON COLUMN api_keys.rate_limit IS 'Maximum requests per hour';
COMMENT ON FUNCTION get_api_key_stats IS 'Get usage statistics for an API key';
