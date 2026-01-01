-- MarketRisk Database Schema
-- Migration 004: Search History Table

-- =============================================
-- TABLE: search_history
-- =============================================
CREATE TABLE IF NOT EXISTS search_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  cui TEXT NOT NULL,
  company_name TEXT NOT NULL,
  risk_level TEXT NOT NULL CHECK (risk_level IN ('GREEN', 'YELLOW', 'RED')),
  risk_score INTEGER NOT NULL CHECK (risk_score >= 0 AND risk_score <= 100),
  search_data JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_search_history_user_id ON search_history(user_id);
CREATE INDEX IF NOT EXISTS idx_search_history_created_at ON search_history(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_search_history_cui ON search_history(cui);

-- =============================================
-- ROW LEVEL SECURITY
-- =============================================
ALTER TABLE search_history ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own search history" ON search_history;
DROP POLICY IF EXISTS "Users can insert own search history" ON search_history;

-- RLS Policies
CREATE POLICY "Users can view own search history"
  ON search_history
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own search history"
  ON search_history
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- =============================================
-- COMMENT
-- =============================================
COMMENT ON TABLE search_history IS 'Stores all company searches performed by users with full ANAF data and risk scores';
COMMENT ON COLUMN search_history.search_data IS 'Full CompanySearchResult as JSONB including company data and risk score breakdown';
