-- =============================================
-- COMPANY HISTORY TABLE
-- Tracks historical changes to company data over 5 years
-- =============================================

CREATE TABLE IF NOT EXISTS company_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE NOT NULL,
  cui TEXT NOT NULL,
  
  -- Snapshot of company data at this point in time
  snapshot_data JSONB NOT NULL,
  
  -- Tracked fields for easy querying
  company_name TEXT,
  registration_number TEXT,
  status TEXT,
  company_active BOOLEAN,
  vat_active BOOLEAN,
  vat_split_regime BOOLEAN,
  
  -- Addresses (stored as JSONB for flexibility)
  fiscal_address JSONB,
  social_address JSONB,
  
  -- VAT details
  vat_registration JSONB,
  vat_incasare_details JSONB,
  split_tva_details JSONB,
  
  -- Status changes
  is_inactive BOOLEAN,
  inactive_date TIMESTAMPTZ,
  reactivation_date TIMESTAMPTZ,
  
  -- Risk data
  risk_score INTEGER,
  risk_level TEXT,
  
  -- Source of data
  data_source TEXT DEFAULT 'anaf', -- 'anaf', 'portaljust', 'bpi', 'manual'
  
  -- Timestamp
  recorded_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Metadata
  changes_detected JSONB, -- Array of field names that changed
  notes TEXT
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_company_history_company_id ON company_history(company_id, recorded_at DESC);
CREATE INDEX IF NOT EXISTS idx_company_history_cui ON company_history(cui, recorded_at DESC);
CREATE INDEX IF NOT EXISTS idx_company_history_recorded_at ON company_history(recorded_at DESC);
CREATE INDEX IF NOT EXISTS idx_company_history_status ON company_history(status, recorded_at DESC);
CREATE INDEX IF NOT EXISTS idx_company_history_risk_level ON company_history(risk_level, recorded_at DESC);

-- GIN index for JSONB searches
CREATE INDEX IF NOT EXISTS idx_company_history_snapshot ON company_history USING GIN(snapshot_data);
CREATE INDEX IF NOT EXISTS idx_company_history_fiscal_address ON company_history USING GIN(fiscal_address);
CREATE INDEX IF NOT EXISTS idx_company_history_social_address ON company_history USING GIN(social_address);

-- Function to automatically clean old history (older than 5 years)
CREATE OR REPLACE FUNCTION cleanup_old_company_history()
RETURNS void AS $$
BEGIN
  DELETE FROM company_history
  WHERE recorded_at < NOW() - INTERVAL '5 years';
END;
$$ LANGUAGE plpgsql;

-- Function to get address change history
CREATE OR REPLACE FUNCTION get_address_changes(p_cui TEXT, p_years INTEGER DEFAULT 5)
RETURNS TABLE (
  change_date TIMESTAMPTZ,
  change_type TEXT,
  old_value JSONB,
  new_value JSONB,
  field_name TEXT
) AS $$
BEGIN
  RETURN QUERY
  WITH history_ordered AS (
    SELECT 
      recorded_at,
      fiscal_address,
      social_address,
      LAG(fiscal_address) OVER (ORDER BY recorded_at) as prev_fiscal,
      LAG(social_address) OVER (ORDER BY recorded_at) as prev_social
    FROM company_history
    WHERE cui = p_cui
      AND recorded_at >= NOW() - (p_years || ' years')::INTERVAL
    ORDER BY recorded_at
  )
  SELECT 
    h.recorded_at as change_date,
    'address_change' as change_type,
    COALESCE(h.prev_fiscal, h.prev_social) as old_value,
    COALESCE(h.fiscal_address, h.social_address) as new_value,
    CASE 
      WHEN h.fiscal_address IS DISTINCT FROM h.prev_fiscal THEN 'fiscal_address'
      WHEN h.social_address IS DISTINCT FROM h.prev_social THEN 'social_address'
    END as field_name
  FROM history_ordered h
  WHERE (h.fiscal_address IS DISTINCT FROM h.prev_fiscal)
     OR (h.social_address IS DISTINCT FROM h.prev_social);
END;
$$ LANGUAGE plpgsql;

-- Function to detect changes between two snapshots
CREATE OR REPLACE FUNCTION detect_company_changes(
  p_old_snapshot JSONB,
  p_new_snapshot JSONB
)
RETURNS TEXT[] AS $$
DECLARE
  changes TEXT[] := ARRAY[]::TEXT[];
  field TEXT;
BEGIN
  -- Check common fields for changes
  FOR field IN SELECT unnest(ARRAY[
    'company_name', 'status', 'company_active', 'vat_active', 
    'vat_split_regime', 'is_inactive', 'fiscal_address', 'social_address'
  ])
  LOOP
    IF (p_old_snapshot->>field) IS DISTINCT FROM (p_new_snapshot->>field) THEN
      changes := array_append(changes, field);
    END IF;
  END LOOP;
  
  RETURN changes;
END;
$$ LANGUAGE plpgsql;

COMMENT ON TABLE company_history IS 'Historical snapshots of company data for tracking changes over time';
COMMENT ON FUNCTION get_address_changes IS 'Returns address change history for a company over specified years';
COMMENT ON FUNCTION detect_company_changes IS 'Detects which fields changed between two company snapshots';

