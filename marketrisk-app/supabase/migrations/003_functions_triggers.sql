-- MarketRisk Database Schema
-- Migration 003: Database Functions and Triggers

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
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Apply to companies table
CREATE TRIGGER update_companies_updated_at
  BEFORE UPDATE ON companies
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Apply to litigation table
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
-- INDEXES for function performance
-- =============================================
CREATE INDEX IF NOT EXISTS idx_watchlist_alert_on_change
  ON watchlist(company_id) WHERE alert_on_change = TRUE;

CREATE INDEX IF NOT EXISTS idx_companies_last_risk_calc
  ON companies(last_risk_calculation DESC);

CREATE INDEX IF NOT EXISTS idx_alerts_read_status
  ON alerts(user_id, created_at DESC) WHERE read_at IS NULL;
