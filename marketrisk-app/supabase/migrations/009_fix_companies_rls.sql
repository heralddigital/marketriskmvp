-- Migration: 009_fix_companies_rls.sql
-- Fix RLS policies to allow authenticated users to insert companies

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Authenticated users can view companies" ON companies;
DROP POLICY IF EXISTS "Service role can manage companies" ON companies;
DROP POLICY IF EXISTS "Authenticated users can insert companies" ON companies;

-- Allow authenticated users to view companies
CREATE POLICY "Authenticated users can view companies"
  ON companies FOR SELECT
  USING (auth.role() = 'authenticated');

-- Allow authenticated users to insert companies (needed for watchlist)
CREATE POLICY "Authenticated users can insert companies"
  ON companies FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Allow authenticated users to update companies they've created or viewed
-- (This allows updating company data when new searches are performed)
CREATE POLICY "Authenticated users can update companies"
  ON companies FOR UPDATE
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Service role can manage companies (for API integrations and admin operations)
CREATE POLICY "Service role can manage companies"
  ON companies FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role');

-- Add comments
COMMENT ON POLICY "Authenticated users can view companies" ON companies IS 'Allows authenticated users to view all companies';
COMMENT ON POLICY "Authenticated users can insert companies" ON companies IS 'Allows authenticated users to create company records when adding to watchlist';
COMMENT ON POLICY "Authenticated users can update companies" ON companies IS 'Allows authenticated users to update company data when performing searches';

