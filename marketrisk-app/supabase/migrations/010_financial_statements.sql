-- Migration 010: Financial Statements Table
-- Stores financial data from Ministerul de Finanțe (data.gov.ro)

-- =============================================
-- FINANCIAL STATEMENTS TABLE
-- =============================================
CREATE TABLE financial_statements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  cui TEXT NOT NULL,
  
  -- Statement period
  year INTEGER NOT NULL,
  period_type TEXT NOT NULL CHECK (period_type IN ('annual', 'semiannual', 'quarterly')),
  period_number INTEGER, -- 1-4 for quarterly, 1-2 for semiannual, NULL for annual
  
  -- Balance Sheet Data (Bilanț)
  total_assets NUMERIC(15,2), -- Total active
  current_assets NUMERIC(15,2), -- Active circulante
  fixed_assets NUMERIC(15,2), -- Active imobilizate
  total_liabilities NUMERIC(15,2), -- Total datorii
  current_liabilities NUMERIC(15,2), -- Datorii curente
  long_term_liabilities NUMERIC(15,2), -- Datorii pe termen lung
  equity NUMERIC(15,2), -- Capital propriu
  share_capital NUMERIC(15,2), -- Capital social
  
  -- Profit & Loss Data (Cont de profit și pierdere)
  revenue NUMERIC(15,2), -- Cifra de afaceri / Venituri
  operating_expenses NUMERIC(15,2), -- Cheltuieli de exploatare
  operating_profit NUMERIC(15,2), -- Profit din exploatare
  net_profit NUMERIC(15,2), -- Profit net
  net_loss NUMERIC(15,2), -- Pierdere netă
  
  -- Financial Ratios (calculated)
  current_ratio NUMERIC(10,4), -- Current assets / Current liabilities
  debt_to_equity NUMERIC(10,4), -- Total liabilities / Equity
  return_on_assets NUMERIC(10,4), -- Net profit / Total assets
  return_on_equity NUMERIC(10,4), -- Net profit / Equity
  
  -- Risk Indicators
  negative_equity BOOLEAN DEFAULT FALSE, -- Capital propriu negativ
  filing_date DATE, -- Data depunerii
  filing_deadline DATE, -- Termen limită de depunere
  delayed_filing BOOLEAN DEFAULT FALSE, -- Depunere întârziată
  
  -- Metadata
  source TEXT DEFAULT 'mfinante', -- Source of data
  raw_data JSONB, -- Store raw data from data.gov.ro for reference
  imported_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Unique constraint: one statement per company per period
  UNIQUE(cui, year, period_type, period_number)
);

-- Create indexes for performance
CREATE INDEX idx_financial_statements_cui ON financial_statements(cui);
CREATE INDEX idx_financial_statements_year ON financial_statements(year DESC);
CREATE INDEX idx_financial_statements_cui_year ON financial_statements(cui, year DESC);
CREATE INDEX idx_financial_statements_negative_equity ON financial_statements(negative_equity) WHERE negative_equity = TRUE;
CREATE INDEX idx_financial_statements_delayed ON financial_statements(delayed_filing) WHERE delayed_filing = TRUE;

-- GIN index for JSONB searches
CREATE INDEX idx_financial_statements_raw_data ON financial_statements USING GIN(raw_data);

-- =============================================
-- FINANCIAL STATEMENTS SUMMARY VIEW
-- =============================================
-- View to quickly get latest financial data per company
CREATE OR REPLACE VIEW financial_statements_latest AS
SELECT DISTINCT ON (cui)
  id,
  cui,
  year,
  period_type,
  period_number,
  total_assets,
  equity,
  revenue,
  net_profit,
  net_loss,
  negative_equity,
  filing_date,
  delayed_filing,
  current_ratio,
  debt_to_equity,
  return_on_assets,
  return_on_equity,
  imported_at
FROM financial_statements
ORDER BY cui, year DESC, period_type DESC, period_number DESC NULLS LAST;

-- =============================================
-- HELPER FUNCTIONS
-- =============================================

-- Function to check if company has missing statements (last 2 years)
CREATE OR REPLACE FUNCTION has_missing_statements(p_cui TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  current_year INTEGER;
  last_year INTEGER;
  has_current BOOLEAN;
  has_last BOOLEAN;
BEGIN
  current_year := EXTRACT(YEAR FROM CURRENT_DATE);
  last_year := current_year - 1;
  
  -- Check if company has annual statement for current year or last year
  SELECT EXISTS(
    SELECT 1 FROM financial_statements 
    WHERE cui = p_cui 
    AND year IN (current_year, last_year)
    AND period_type = 'annual'
  ) INTO has_current;
  
  -- If no statements in last 2 years, consider missing
  RETURN NOT has_current;
END;
$$ LANGUAGE plpgsql;

-- Function to check if company has delayed filing
CREATE OR REPLACE FUNCTION has_delayed_filing(p_cui TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS(
    SELECT 1 FROM financial_statements 
    WHERE cui = p_cui 
    AND delayed_filing = TRUE
    AND year >= EXTRACT(YEAR FROM CURRENT_DATE) - 2
  );
END;
$$ LANGUAGE plpgsql;

-- Function to check if company has negative equity
CREATE OR REPLACE FUNCTION has_negative_equity(p_cui TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS(
    SELECT 1 FROM financial_statements 
    WHERE cui = p_cui 
    AND negative_equity = TRUE
    AND year >= EXTRACT(YEAR FROM CURRENT_DATE) - 2
  );
END;
$$ LANGUAGE plpgsql;

-- Function to check if revenue dropped >50% year-over-year
CREATE OR REPLACE FUNCTION has_revenue_drop_50(p_cui TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  current_year INTEGER;
  last_year INTEGER;
  current_revenue NUMERIC;
  last_revenue NUMERIC;
BEGIN
  current_year := EXTRACT(YEAR FROM CURRENT_DATE);
  last_year := current_year - 1;
  
  -- Get revenue for current year (or most recent available)
  SELECT revenue INTO current_revenue
  FROM financial_statements
  WHERE cui = p_cui
  AND period_type = 'annual'
  AND year = current_year
  ORDER BY year DESC, period_number DESC NULLS LAST
  LIMIT 1;
  
  -- Get revenue for previous year
  SELECT revenue INTO last_revenue
  FROM financial_statements
  WHERE cui = p_cui
  AND period_type = 'annual'
  AND year = last_year
  ORDER BY year DESC, period_number DESC NULLS LAST
  LIMIT 1;
  
  -- If we have both and current is less than 50% of last, return true
  IF current_revenue IS NOT NULL AND last_revenue IS NOT NULL AND last_revenue > 0 THEN
    RETURN (current_revenue / last_revenue) < 0.5;
  END IF;
  
  RETURN FALSE;
END;
$$ LANGUAGE plpgsql;

COMMENT ON TABLE financial_statements IS 'Financial statements from Ministerul de Finanțe (data.gov.ro)';
COMMENT ON VIEW financial_statements_latest IS 'Latest financial statement per company';
COMMENT ON FUNCTION has_missing_statements IS 'Check if company has missing financial statements for last 2 years';
COMMENT ON FUNCTION has_delayed_filing IS 'Check if company has delayed filing in last 2 years';
COMMENT ON FUNCTION has_negative_equity IS 'Check if company has negative equity in last 2 years';
COMMENT ON FUNCTION has_revenue_drop_50 IS 'Check if company revenue dropped >50% year-over-year';

