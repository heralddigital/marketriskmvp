-- MarketRisk Database Schema
-- Migration 005: Risk Score History

-- =============================================
-- TABLE: risk_score_history
-- Stores historical risk scores for trend analysis
-- =============================================
CREATE TABLE IF NOT EXISTS risk_score_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  cui TEXT NOT NULL,
  company_name TEXT NOT NULL,
  risk_level TEXT NOT NULL CHECK (risk_level IN ('GREEN', 'YELLOW', 'RED')),
  risk_score INTEGER NOT NULL CHECK (risk_score >= 0 AND risk_score <= 100),

  -- Detailed risk factors breakdown
  risk_factors JSONB NOT NULL,

  -- Company snapshot data at the time of calculation
  company_snapshot JSONB NOT NULL,

  -- Timestamp
  calculated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Optional: Link to user who triggered the calculation
  triggered_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_risk_history_cui ON risk_score_history(cui);
CREATE INDEX IF NOT EXISTS idx_risk_history_calculated_at ON risk_score_history(calculated_at DESC);
CREATE INDEX IF NOT EXISTS idx_risk_history_cui_date ON risk_score_history(cui, calculated_at DESC);

-- =============================================
-- ROW LEVEL SECURITY
-- =============================================
ALTER TABLE risk_score_history ENABLE ROW LEVEL SECURITY;

-- Public read access to risk history (authenticated users only)
DROP POLICY IF EXISTS "Authenticated users can view risk history" ON risk_score_history;
CREATE POLICY "Authenticated users can view risk history"
  ON risk_score_history
  FOR SELECT
  TO authenticated
  USING (true);

-- Only system can insert (via service role or server actions)
DROP POLICY IF EXISTS "System can insert risk history" ON risk_score_history;
CREATE POLICY "System can insert risk history"
  ON risk_score_history
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = triggered_by OR triggered_by IS NULL);

-- =============================================
-- FUNCTIONS
-- =============================================

-- Function to get risk score history for a company
CREATE OR REPLACE FUNCTION get_risk_score_history(
  p_cui TEXT,
  p_limit INTEGER DEFAULT 30,
  p_days INTEGER DEFAULT 365
)
RETURNS TABLE(
  calculated_at TIMESTAMPTZ,
  risk_level TEXT,
  risk_score INTEGER,
  risk_factors JSONB
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    rsh.calculated_at,
    rsh.risk_level,
    rsh.risk_score,
    rsh.risk_factors
  FROM risk_score_history rsh
  WHERE rsh.cui = p_cui
    AND rsh.calculated_at >= NOW() - (p_days || ' days')::INTERVAL
  ORDER BY rsh.calculated_at DESC
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION get_risk_score_history IS 'Get historical risk scores for a company with optional time range and limit';

-- Function to get risk trend (improving/declining/stable)
CREATE OR REPLACE FUNCTION get_risk_trend(p_cui TEXT)
RETURNS TABLE(
  trend TEXT,
  current_score INTEGER,
  previous_score INTEGER,
  score_change INTEGER,
  days_since_last INTEGER
) AS $$
DECLARE
  v_current RECORD;
  v_previous RECORD;
BEGIN
  -- Get most recent score
  SELECT risk_score, calculated_at INTO v_current
  FROM risk_score_history
  WHERE cui = p_cui
  ORDER BY calculated_at DESC
  LIMIT 1;

  -- Get previous score (skip today's scores)
  SELECT risk_score, calculated_at INTO v_previous
  FROM risk_score_history
  WHERE cui = p_cui
    AND calculated_at < v_current.calculated_at - INTERVAL '1 hour'
  ORDER BY calculated_at DESC
  LIMIT 1;

  IF v_current IS NULL THEN
    RETURN QUERY SELECT 'NO_DATA'::TEXT, 0, 0, 0, 0;
    RETURN;
  END IF;

  IF v_previous IS NULL THEN
    RETURN QUERY SELECT 'NEW'::TEXT, v_current.risk_score, 0, 0, 0;
    RETURN;
  END IF;

  RETURN QUERY SELECT
    CASE
      WHEN v_current.risk_score < v_previous.risk_score THEN 'IMPROVING'
      WHEN v_current.risk_score > v_previous.risk_score THEN 'DECLINING'
      ELSE 'STABLE'
    END::TEXT,
    v_current.risk_score,
    v_previous.risk_score,
    v_current.risk_score - v_previous.risk_score,
    EXTRACT(DAY FROM v_current.calculated_at - v_previous.calculated_at)::INTEGER;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION get_risk_trend IS 'Determine if a company risk is improving, declining, or stable';

-- Function to clean up old history (keep last 2 years)
CREATE OR REPLACE FUNCTION cleanup_old_risk_history()
RETURNS INTEGER AS $$
DECLARE
  v_deleted INTEGER;
BEGIN
  DELETE FROM risk_score_history
  WHERE calculated_at < NOW() - INTERVAL '2 years';

  GET DIAGNOSTICS v_deleted = ROW_COUNT;
  RETURN v_deleted;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION cleanup_old_risk_history IS 'Delete risk history older than 2 years - run monthly via cron';

-- =============================================
-- COMMENTS
-- =============================================
COMMENT ON TABLE risk_score_history IS 'Historical risk scores for trend analysis and monitoring';
COMMENT ON COLUMN risk_score_history.risk_factors IS 'Full breakdown of all 24 risk factors at the time of calculation';
COMMENT ON COLUMN risk_score_history.company_snapshot IS 'Complete company data from ANAF at the time of calculation';
