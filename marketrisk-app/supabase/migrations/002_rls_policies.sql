-- MarketRisk Database Schema
-- Migration 002: Row Level Security (RLS) Policies

-- =============================================
-- ENABLE RLS ON ALL TABLES
-- =============================================
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE watchlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE search_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE litigation ENABLE ROW LEVEL SECURITY;
ALTER TABLE risk_scores ENABLE ROW LEVEL SECURITY;

-- =============================================
-- USERS TABLE POLICIES
-- =============================================
-- Users can view their own profile
CREATE POLICY "Users can view own profile"
  ON users FOR SELECT
  USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  USING (auth.uid() = id);

-- Users can insert their own profile (on signup)
CREATE POLICY "Users can insert own profile"
  ON users FOR INSERT
  WITH CHECK (auth.uid() = id);

-- =============================================
-- COMPANIES TABLE POLICIES
-- =============================================
-- All authenticated users can view companies (public data)
CREATE POLICY "Authenticated users can view companies"
  ON companies FOR SELECT
  USING (auth.role() = 'authenticated');

-- Service role can insert/update companies (for API integrations)
CREATE POLICY "Service role can manage companies"
  ON companies FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role');

-- =============================================
-- WATCHLIST TABLE POLICIES
-- =============================================
-- Users can view their own watchlist
CREATE POLICY "Users can view own watchlist"
  ON watchlist FOR SELECT
  USING (auth.uid() = user_id);

-- Users can add to their own watchlist
CREATE POLICY "Users can add to own watchlist"
  ON watchlist FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own watchlist items
CREATE POLICY "Users can update own watchlist"
  ON watchlist FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete from their own watchlist
CREATE POLICY "Users can delete from own watchlist"
  ON watchlist FOR DELETE
  USING (auth.uid() = user_id);

-- =============================================
-- ALERTS TABLE POLICIES
-- =============================================
-- Users can view their own alerts
CREATE POLICY "Users can view own alerts"
  ON alerts FOR SELECT
  USING (auth.uid() = user_id);

-- Users can update their own alerts (mark as read)
CREATE POLICY "Users can update own alerts"
  ON alerts FOR UPDATE
  USING (auth.uid() = user_id);

-- Service role can create alerts
CREATE POLICY "Service role can create alerts"
  ON alerts FOR INSERT
  WITH CHECK (auth.jwt() ->> 'role' = 'service_role');

-- =============================================
-- SEARCH HISTORY TABLE POLICIES
-- =============================================
-- Users can view their own search history
CREATE POLICY "Users can view own search history"
  ON search_history FOR SELECT
  USING (auth.uid() = user_id);

-- Users can add to their own search history
CREATE POLICY "Users can add to search history"
  ON search_history FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- =============================================
-- LITIGATION TABLE POLICIES
-- =============================================
-- All authenticated users can view litigation (public data)
CREATE POLICY "Authenticated users can view litigation"
  ON litigation FOR SELECT
  USING (auth.role() = 'authenticated');

-- Service role can manage litigation data
CREATE POLICY "Service role can manage litigation"
  ON litigation FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role');

-- =============================================
-- RISK SCORES TABLE POLICIES
-- =============================================
-- All authenticated users can view risk scores
CREATE POLICY "Authenticated users can view risk scores"
  ON risk_scores FOR SELECT
  USING (auth.role() = 'authenticated');

-- Service role can manage risk scores
CREATE POLICY "Service role can manage risk scores"
  ON risk_scores FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role');

-- =============================================
-- HELPER FUNCTION: Check if user has reached limits
-- =============================================
CREATE OR REPLACE FUNCTION check_search_limit(p_user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  v_limit INTEGER;
  v_searches INTEGER;
BEGIN
  SELECT search_limit_monthly, searches_this_month
  INTO v_limit, v_searches
  FROM users
  WHERE id = p_user_id;

  -- -1 means unlimited
  IF v_limit = -1 THEN
    RETURN TRUE;
  END IF;

  RETURN v_searches < v_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION check_watchlist_limit(p_user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  v_limit INTEGER;
  v_count INTEGER;
BEGIN
  SELECT watchlist_limit
  INTO v_limit
  FROM users
  WHERE id = p_user_id;

  SELECT COUNT(*)
  INTO v_count
  FROM watchlist
  WHERE user_id = p_user_id;

  -- -1 means unlimited
  IF v_limit = -1 THEN
    RETURN TRUE;
  END IF;

  RETURN v_count < v_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION check_pdf_limit(p_user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  v_limit INTEGER;
  v_exports INTEGER;
BEGIN
  SELECT pdf_export_limit_monthly, pdf_exports_this_month
  INTO v_limit, v_exports
  FROM users
  WHERE id = p_user_id;

  -- -1 means unlimited
  IF v_limit = -1 THEN
    RETURN TRUE;
  END IF;

  RETURN v_exports < v_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
