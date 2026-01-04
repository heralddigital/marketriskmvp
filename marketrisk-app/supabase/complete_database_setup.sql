-- =============================================
-- MarketRisk Complete Database Setup
-- =============================================
-- This file contains all migrations in order
-- Run this in your Supabase SQL Editor to set up the complete database
-- =============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- MIGRATION 001: INITIAL SCHEMA
-- =============================================

-- =============================================
-- USERS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  company_name TEXT,
  plan TEXT DEFAULT 'free' CHECK (plan IN ('free', 'starter', 'pro', 'enterprise')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Plan limits
  search_limit_monthly INTEGER DEFAULT 3,
  watchlist_limit INTEGER DEFAULT 0,
  pdf_export_limit_monthly INTEGER DEFAULT 0,
  team_users INTEGER DEFAULT 1,

  -- Usage tracking
  searches_this_month INTEGER DEFAULT 0,
  pdf_exports_this_month INTEGER DEFAULT 0,
  last_reset_date DATE DEFAULT CURRENT_DATE,

  -- Preferences
  notification_email BOOLEAN DEFAULT TRUE,
  notification_alerts BOOLEAN DEFAULT TRUE,
  language TEXT DEFAULT 'ro' CHECK (language IN ('ro', 'en')),

  -- Billing
  stripe_customer_id TEXT,
  subscription_status TEXT,
  subscription_end_date TIMESTAMPTZ
);

-- Create index on email
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_plan ON users(plan);

-- =============================================
-- COMPANIES TABLE (ANAF Cache)
-- =============================================
CREATE TABLE IF NOT EXISTS companies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  cui TEXT UNIQUE NOT NULL,

  -- Basic info
  company_name TEXT NOT NULL,
  registration_number TEXT,

  -- ANAF data (cached as JSONB)
  anaf_data JSONB NOT NULL,
  vat_active BOOLEAN,
  vat_split_regime BOOLEAN,
  company_active BOOLEAN,
  state_debts NUMERIC(12,2) DEFAULT 0,

  -- PortalJust data
  active_lawsuits INTEGER DEFAULT 0,
  lost_cases_2y INTEGER DEFAULT 0,
  bankruptcy_filing BOOLEAN DEFAULT FALSE,

  -- BPI insolvency
  insolvency_status TEXT DEFAULT 'none' CHECK (insolvency_status IN ('none', 'active', 'history')),

  -- Risk score
  current_risk_score INTEGER,
  current_risk_level TEXT CHECK (current_risk_level IN ('GREEN', 'YELLOW', 'RED')),
  risk_details JSONB,

  -- Cache management
  last_anaf_check TIMESTAMPTZ,
  last_portaljust_check TIMESTAMPTZ,
  last_risk_calculation TIMESTAMPTZ,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_companies_cui ON companies(cui);
CREATE INDEX IF NOT EXISTS idx_companies_risk_level ON companies(current_risk_level);
CREATE INDEX IF NOT EXISTS idx_companies_last_check ON companies(last_anaf_check);
CREATE INDEX IF NOT EXISTS idx_companies_company_name ON companies(company_name);
CREATE INDEX IF NOT EXISTS idx_companies_last_risk_calc ON companies(last_risk_calculation DESC);

-- GIN index for JSONB searches
CREATE INDEX IF NOT EXISTS idx_companies_anaf_data ON companies USING GIN(anaf_data);

-- =============================================
-- WATCHLIST TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS watchlist (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE NOT NULL,

  -- Tracking
  added_at TIMESTAMPTZ DEFAULT NOW(),
  last_check TIMESTAMPTZ,
  last_status TEXT,

  -- Alerts
  alert_on_change BOOLEAN DEFAULT TRUE,

  UNIQUE(user_id, company_id)
);

CREATE INDEX IF NOT EXISTS idx_watchlist_user ON watchlist(user_id);
CREATE INDEX IF NOT EXISTS idx_watchlist_company ON watchlist(company_id);
CREATE INDEX IF NOT EXISTS idx_watchlist_user_added ON watchlist(user_id, added_at DESC);
CREATE INDEX IF NOT EXISTS idx_watchlist_alert_on_change ON watchlist(company_id) WHERE alert_on_change = TRUE;

-- =============================================
-- ALERTS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS alerts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  company_id UUID REFERENCES companies(id) ON DELETE SET NULL,

  alert_type TEXT NOT NULL CHECK (alert_type IN ('risk_change', 'lawsuit', 'insolvency', 'debt', 'vat_change', 'status_change')),
  severity TEXT CHECK (severity IN ('info', 'warning', 'critical')),

  message TEXT NOT NULL,
  details JSONB,

  -- Status
  read_at TIMESTAMPTZ,
  email_sent BOOLEAN DEFAULT FALSE,
  email_sent_at TIMESTAMPTZ,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_alerts_user ON alerts(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_alerts_unread ON alerts(user_id, read_at) WHERE read_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_alerts_company ON alerts(company_id);
CREATE INDEX IF NOT EXISTS idx_alerts_read_status ON alerts(user_id, created_at DESC) WHERE read_at IS NULL;

-- =============================================
-- SEARCH HISTORY TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS search_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  cui TEXT NOT NULL,
  company_name TEXT NOT NULL,
  risk_level TEXT NOT NULL CHECK (risk_level IN ('GREEN', 'YELLOW', 'RED')),
  risk_score INTEGER NOT NULL CHECK (risk_score >= 0 AND risk_score <= 100),
  search_data JSONB NOT NULL,
  search_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_search_history_user_id ON search_history(user_id);
CREATE INDEX IF NOT EXISTS idx_search_history_created_at ON search_history(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_search_history_cui ON search_history(cui);
CREATE INDEX IF NOT EXISTS idx_search_history_user_month ON search_history(user_id, search_date);

-- =============================================
-- LITIGATION TABLE (PortalJust)
-- =============================================
CREATE TABLE IF NOT EXISTS litigation (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE NOT NULL,

  case_number TEXT NOT NULL,
  court_name TEXT,
  case_type TEXT CHECK (case_type IN ('civil', 'commercial', 'insolvency', 'labor')),

  role TEXT CHECK (role IN ('plaintiff', 'defendant')),
  status TEXT CHECK (status IN ('active', 'closed', 'appeal')),
  outcome TEXT CHECK (outcome IN ('won', 'lost', 'settled', 'pending')),

  filing_date DATE,
  closing_date DATE,

  amount NUMERIC(12,2),
  description TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(company_id, case_number)
);

CREATE INDEX IF NOT EXISTS idx_litigation_company ON litigation(company_id);
CREATE INDEX IF NOT EXISTS idx_litigation_status ON litigation(status);
CREATE INDEX IF NOT EXISTS idx_litigation_case_number ON litigation(case_number);

-- =============================================
-- RISK SCORES HISTORY TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS risk_scores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE NOT NULL,

  score INTEGER NOT NULL,
  risk_level TEXT NOT NULL CHECK (risk_level IN ('GREEN', 'YELLOW', 'RED')),
  details JSONB,

  calculated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_risk_scores_company_date ON risk_scores(company_id, calculated_at DESC);
CREATE INDEX IF NOT EXISTS idx_risk_scores_level ON risk_scores(risk_level);

-- =============================================
-- RISK SCORE HISTORY TABLE (for trend analysis)
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

CREATE INDEX IF NOT EXISTS idx_risk_history_cui ON risk_score_history(cui);
CREATE INDEX IF NOT EXISTS idx_risk_history_calculated_at ON risk_score_history(calculated_at DESC);
CREATE INDEX IF NOT EXISTS idx_risk_history_cui_date ON risk_score_history(cui, calculated_at DESC);

-- =============================================
-- COMMENTS
-- =============================================
COMMENT ON TABLE users IS 'User accounts with plan tiers and usage tracking';
COMMENT ON TABLE companies IS 'Cached company data from ANAF, PortalJust, and BPI';
COMMENT ON TABLE watchlist IS 'User-company watchlist relationships';
COMMENT ON TABLE alerts IS 'Notification history for users';
COMMENT ON TABLE search_history IS 'Stores all company searches performed by users with full ANAF data and risk scores';
COMMENT ON TABLE litigation IS 'Lawsuit data from PortalJust';
COMMENT ON TABLE risk_scores IS 'Historical risk score tracking';
COMMENT ON TABLE risk_score_history IS 'Historical risk scores for trend analysis and monitoring';

-- =============================================
-- MIGRATION 002: ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE watchlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE search_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE litigation ENABLE ROW LEVEL SECURITY;
ALTER TABLE risk_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE risk_score_history ENABLE ROW LEVEL SECURITY;

-- =============================================
-- USERS TABLE POLICIES
-- =============================================
DROP POLICY IF EXISTS "Users can view own profile" ON users;
CREATE POLICY "Users can view own profile"
  ON users FOR SELECT
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON users;
CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON users;
CREATE POLICY "Users can insert own profile"
  ON users FOR INSERT
  WITH CHECK (auth.uid() = id);

-- =============================================
-- COMPANIES TABLE POLICIES
-- =============================================
DROP POLICY IF EXISTS "Authenticated users can view companies" ON companies;
CREATE POLICY "Authenticated users can view companies"
  ON companies FOR SELECT
  USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Service role can manage companies" ON companies;
CREATE POLICY "Service role can manage companies"
  ON companies FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role');

-- =============================================
-- WATCHLIST TABLE POLICIES
-- =============================================
DROP POLICY IF EXISTS "Users can view own watchlist" ON watchlist;
CREATE POLICY "Users can view own watchlist"
  ON watchlist FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can add to own watchlist" ON watchlist;
CREATE POLICY "Users can add to own watchlist"
  ON watchlist FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own watchlist" ON watchlist;
CREATE POLICY "Users can update own watchlist"
  ON watchlist FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete from own watchlist" ON watchlist;
CREATE POLICY "Users can delete from own watchlist"
  ON watchlist FOR DELETE
  USING (auth.uid() = user_id);

-- =============================================
-- ALERTS TABLE POLICIES
-- =============================================
DROP POLICY IF EXISTS "Users can view own alerts" ON alerts;
CREATE POLICY "Users can view own alerts"
  ON alerts FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own alerts" ON alerts;
CREATE POLICY "Users can update own alerts"
  ON alerts FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Service role can create alerts" ON alerts;
CREATE POLICY "Service role can create alerts"
  ON alerts FOR INSERT
  WITH CHECK (auth.jwt() ->> 'role' = 'service_role');

-- =============================================
-- SEARCH HISTORY TABLE POLICIES
-- =============================================
DROP POLICY IF EXISTS "Users can view own search history" ON search_history;
CREATE POLICY "Users can view own search history"
  ON search_history FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own search history" ON search_history;
CREATE POLICY "Users can insert own search history"
  ON search_history FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- =============================================
-- LITIGATION TABLE POLICIES
-- =============================================
DROP POLICY IF EXISTS "Authenticated users can view litigation" ON litigation;
CREATE POLICY "Authenticated users can view litigation"
  ON litigation FOR SELECT
  USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Service role can manage litigation" ON litigation;
CREATE POLICY "Service role can manage litigation"
  ON litigation FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role');

-- =============================================
-- RISK SCORES TABLE POLICIES
-- =============================================
DROP POLICY IF EXISTS "Authenticated users can view risk scores" ON risk_scores;
CREATE POLICY "Authenticated users can view risk scores"
  ON risk_scores FOR SELECT
  USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Service role can manage risk scores" ON risk_scores;
CREATE POLICY "Service role can manage risk scores"
  ON risk_scores FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role');

-- =============================================
-- RISK SCORE HISTORY TABLE POLICIES
-- =============================================
DROP POLICY IF EXISTS "Authenticated users can view risk history" ON risk_score_history;
CREATE POLICY "Authenticated users can view risk history"
  ON risk_score_history
  FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "System can insert risk history" ON risk_score_history;
CREATE POLICY "System can insert risk history"
  ON risk_score_history
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = triggered_by OR triggered_by IS NULL);

-- =============================================
-- MIGRATION 003: FUNCTIONS AND TRIGGERS
-- =============================================

-- =============================================
-- TRIGGER FUNCTION: Auto-update timestamps
-- =============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to users table
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Apply to companies table
DROP TRIGGER IF EXISTS update_companies_updated_at ON companies;
CREATE TRIGGER update_companies_updated_at
  BEFORE UPDATE ON companies
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Apply to litigation table
DROP TRIGGER IF EXISTS update_litigation_updated_at ON litigation;
CREATE TRIGGER update_litigation_updated_at
  BEFORE UPDATE ON litigation
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- FUNCTION: Reset monthly usage counters
-- =============================================
CREATE OR REPLACE FUNCTION reset_monthly_limits()
RETURNS void AS $$
BEGIN
  UPDATE users
  SET
    searches_this_month = 0,
    pdf_exports_this_month = 0,
    last_reset_date = CURRENT_DATE
  WHERE
    last_reset_date < DATE_TRUNC('month', CURRENT_DATE);
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION reset_monthly_limits() IS 'Reset monthly usage counters for all users. Run via pg_cron or Vercel Cron on 1st of each month.';

-- =============================================
-- FUNCTION: Increment search counter
-- =============================================
CREATE OR REPLACE FUNCTION increment_search_counter(p_user_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE users
  SET searches_this_month = searches_this_month + 1
  WHERE id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- FUNCTION: Increment PDF export counter
-- =============================================
CREATE OR REPLACE FUNCTION increment_pdf_counter(p_user_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE users
  SET pdf_exports_this_month = pdf_exports_this_month + 1
  WHERE id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- FUNCTION: Check if user has reached limits
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

-- =============================================
-- FUNCTION: Get user plan details
-- =============================================
CREATE OR REPLACE FUNCTION get_user_plan_details(p_user_id UUID)
RETURNS TABLE(
  plan TEXT,
  search_limit INTEGER,
  watchlist_limit INTEGER,
  pdf_limit INTEGER,
  searches_used INTEGER,
  pdf_used INTEGER,
  watchlist_used BIGINT,
  can_search BOOLEAN,
  can_add_watchlist BOOLEAN,
  can_export_pdf BOOLEAN
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    u.plan,
    u.search_limit_monthly,
    u.watchlist_limit,
    u.pdf_export_limit_monthly,
    u.searches_this_month,
    u.pdf_exports_this_month,
    (SELECT COUNT(*) FROM watchlist WHERE user_id = p_user_id),
    check_search_limit(p_user_id),
    check_watchlist_limit(p_user_id),
    check_pdf_limit(p_user_id)
  FROM users u
  WHERE u.id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- FUNCTION: Create user profile on signup
-- =============================================
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
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
    'free',
    3,
    0,
    0
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for auto-creating user profile
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- =============================================
-- FUNCTION: Check if company data needs refresh
-- =============================================
CREATE OR REPLACE FUNCTION needs_anaf_refresh(p_company_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  v_last_check TIMESTAMPTZ;
BEGIN
  SELECT last_anaf_check INTO v_last_check
  FROM companies
  WHERE id = p_company_id;

  -- Refresh if never checked or older than 24 hours
  RETURN v_last_check IS NULL OR v_last_check < NOW() - INTERVAL '24 hours';
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- FUNCTION: Get companies needing daily monitoring
-- =============================================
CREATE OR REPLACE FUNCTION get_companies_for_monitoring()
RETURNS TABLE(
  company_id UUID,
  cui TEXT,
  company_name TEXT,
  current_risk_level TEXT,
  users_watching BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    c.id,
    c.cui,
    c.company_name,
    c.current_risk_level,
    COUNT(DISTINCT w.user_id) as users_watching
  FROM companies c
  INNER JOIN watchlist w ON w.company_id = c.id
  WHERE w.alert_on_change = TRUE
  GROUP BY c.id, c.cui, c.company_name, c.current_risk_level
  ORDER BY users_watching DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION get_companies_for_monitoring() IS 'Returns all companies being actively monitored by users. Run this daily at 6 AM.';

-- =============================================
-- FUNCTION: Create alert for risk change
-- =============================================
CREATE OR REPLACE FUNCTION create_risk_change_alert(
  p_company_id UUID,
  p_old_level TEXT,
  p_new_level TEXT,
  p_old_score INTEGER,
  p_new_score INTEGER
)
RETURNS void AS $$
DECLARE
  v_user_id UUID;
  v_severity TEXT;
  v_message TEXT;
  v_company_name TEXT;
BEGIN
  -- Get company name
  SELECT company_name INTO v_company_name
  FROM companies
  WHERE id = p_company_id;

  -- Determine severity
  IF p_new_level = 'RED' THEN
    v_severity := 'critical';
  ELSIF p_new_level = 'YELLOW' THEN
    v_severity := 'warning';
  ELSE
    v_severity := 'info';
  END IF;

  -- Create message
  v_message := format(
    'Risk level changed for %s: %s → %s (Score: %s → %s)',
    v_company_name,
    p_old_level,
    p_new_level,
    p_old_score,
    p_new_score
  );

  -- Create alerts for all users watching this company
  FOR v_user_id IN
    SELECT user_id
    FROM watchlist
    WHERE company_id = p_company_id AND alert_on_change = TRUE
  LOOP
    INSERT INTO alerts (
      user_id,
      company_id,
      alert_type,
      severity,
      message,
      details
    ) VALUES (
      v_user_id,
      p_company_id,
      'risk_change',
      v_severity,
      v_message,
      jsonb_build_object(
        'previousRiskLevel', p_old_level,
        'newRiskLevel', p_new_level,
        'previousScore', p_old_score,
        'newScore', p_new_score,
        'scoreChange', p_new_score - p_old_score
      )
    );
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- FUNCTION: Get unread alerts count
-- =============================================
CREATE OR REPLACE FUNCTION get_unread_alerts_count(p_user_id UUID)
RETURNS INTEGER AS $$
DECLARE
  v_count INTEGER;
BEGIN
  SELECT COUNT(*)
  INTO v_count
  FROM alerts
  WHERE user_id = p_user_id AND read_at IS NULL;

  RETURN v_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- FUNCTION: Mark alerts as read
-- =============================================
CREATE OR REPLACE FUNCTION mark_alerts_read(p_user_id UUID, p_alert_ids UUID[])
RETURNS void AS $$
BEGIN
  UPDATE alerts
  SET read_at = NOW()
  WHERE user_id = p_user_id
    AND id = ANY(p_alert_ids)
    AND read_at IS NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- FUNCTION: Get watchlist summary with stats
-- =============================================
CREATE OR REPLACE FUNCTION get_watchlist_summary(p_user_id UUID)
RETURNS TABLE(
  total_companies INTEGER,
  red_risk INTEGER,
  yellow_risk INTEGER,
  green_risk INTEGER,
  recent_changes INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(*)::INTEGER as total_companies,
    COUNT(*) FILTER (WHERE c.current_risk_level = 'RED')::INTEGER as red_risk,
    COUNT(*) FILTER (WHERE c.current_risk_level = 'YELLOW')::INTEGER as yellow_risk,
    COUNT(*) FILTER (WHERE c.current_risk_level = 'GREEN')::INTEGER as green_risk,
    COUNT(*) FILTER (
      WHERE c.last_risk_calculation > NOW() - INTERVAL '7 days'
        AND w.last_status IS NOT NULL
        AND w.last_status != c.current_risk_level
    )::INTEGER as recent_changes
  FROM watchlist w
  INNER JOIN companies c ON c.id = w.company_id
  WHERE w.user_id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- RISK SCORE HISTORY FUNCTIONS
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
-- COMPLETE SETUP FINISHED
-- =============================================
-- Your database is now fully set up!
-- All tables, indexes, RLS policies, functions, and triggers are in place.
-- =============================================

