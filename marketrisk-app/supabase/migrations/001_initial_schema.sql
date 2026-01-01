-- MarketRisk Database Schema
-- Migration 001: Initial Schema

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- USERS TABLE
-- =============================================
CREATE TABLE users (
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
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_plan ON users(plan);

-- =============================================
-- COMPANIES TABLE (ANAF Cache)
-- =============================================
CREATE TABLE companies (
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
CREATE INDEX idx_companies_cui ON companies(cui);
CREATE INDEX idx_companies_risk_level ON companies(current_risk_level);
CREATE INDEX idx_companies_last_check ON companies(last_anaf_check);
CREATE INDEX idx_companies_company_name ON companies(company_name);

-- GIN index for JSONB searches
CREATE INDEX idx_companies_anaf_data ON companies USING GIN(anaf_data);

-- =============================================
-- WATCHLIST TABLE
-- =============================================
CREATE TABLE watchlist (
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

CREATE INDEX idx_watchlist_user ON watchlist(user_id);
CREATE INDEX idx_watchlist_company ON watchlist(company_id);
CREATE INDEX idx_watchlist_user_added ON watchlist(user_id, added_at DESC);

-- =============================================
-- ALERTS TABLE
-- =============================================
CREATE TABLE alerts (
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

CREATE INDEX idx_alerts_user ON alerts(user_id, created_at DESC);
CREATE INDEX idx_alerts_unread ON alerts(user_id, read_at) WHERE read_at IS NULL;
CREATE INDEX idx_alerts_company ON alerts(company_id);

-- =============================================
-- SEARCH HISTORY TABLE
-- =============================================
CREATE TABLE search_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  cui TEXT NOT NULL,
  company_name TEXT,

  search_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_search_history_user_month ON search_history(user_id, search_date);
CREATE INDEX idx_search_history_cui ON search_history(cui);

-- =============================================
-- LITIGATION TABLE (PortalJust)
-- =============================================
CREATE TABLE litigation (
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

CREATE INDEX idx_litigation_company ON litigation(company_id);
CREATE INDEX idx_litigation_status ON litigation(status);
CREATE INDEX idx_litigation_case_number ON litigation(case_number);

-- =============================================
-- RISK SCORES HISTORY TABLE
-- =============================================
CREATE TABLE risk_scores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE NOT NULL,

  score INTEGER NOT NULL,
  risk_level TEXT NOT NULL CHECK (risk_level IN ('GREEN', 'YELLOW', 'RED')),
  details JSONB,

  calculated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_risk_scores_company_date ON risk_scores(company_id, calculated_at DESC);
CREATE INDEX idx_risk_scores_level ON risk_scores(risk_level);

COMMENT ON TABLE users IS 'User accounts with plan tiers and usage tracking';
COMMENT ON TABLE companies IS 'Cached company data from ANAF, PortalJust, and BPI';
COMMENT ON TABLE watchlist IS 'User-company watchlist relationships';
COMMENT ON TABLE alerts IS 'Notification history for users';
COMMENT ON TABLE search_history IS 'Track search usage for plan limits';
COMMENT ON TABLE litigation IS 'Lawsuit data from PortalJust';
COMMENT ON TABLE risk_scores IS 'Historical risk score tracking';
