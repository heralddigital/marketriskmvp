/**
 * MFinante Service
 * Handles database operations for financial statements
 * and calculates financial risk factors
 */

import { createClient } from '@/lib/supabase/server'
import type { FinancialStatement, FinancialRiskFactors, CompanyFinancialSummary } from './types'

/**
 * Save financial statement to database
 */
export async function saveFinancialStatement(
  statement: FinancialStatement
): Promise<{ success: boolean; id?: string; error?: string }> {
  try {
    const supabase = await createClient()
    
    const { data, error } = await supabase
      .from('financial_statements')
      .upsert({
        cui: statement.cui,
        year: statement.year,
        period_type: statement.periodType,
        period_number: statement.periodNumber || null,
        total_assets: statement.totalAssets || null,
        current_assets: statement.currentAssets || null,
        fixed_assets: statement.fixedAssets || null,
        total_liabilities: statement.totalLiabilities || null,
        current_liabilities: statement.currentLiabilities || null,
        long_term_liabilities: statement.longTermLiabilities || null,
        equity: statement.equity || null,
        share_capital: statement.shareCapital || null,
        revenue: statement.revenue || null,
        operating_expenses: statement.operatingExpenses || null,
        operating_profit: statement.operatingProfit || null,
        net_profit: statement.netProfit || null,
        net_loss: statement.netLoss || null,
        current_ratio: statement.currentRatio || null,
        debt_to_equity: statement.debtToEquity || null,
        return_on_assets: statement.returnOnAssets || null,
        return_on_equity: statement.returnOnEquity || null,
        negative_equity: statement.negativeEquity,
        filing_date: statement.filingDate || null,
        filing_deadline: statement.filingDeadline || null,
        delayed_filing: statement.delayedFiling,
        source: statement.source || 'mfinante',
        raw_data: statement.rawData || null,
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'cui,year,period_type,period_number'
      })
      .select('id')
      .single()
    
    if (error) {
      console.error('Error saving financial statement:', error)
      return { success: false, error: error.message }
    }
    
    return { success: true, id: data?.id }
    
  } catch (error) {
    console.error('Error in saveFinancialStatement:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }
  }
}

/**
 * Save multiple financial statements
 */
export async function saveFinancialStatements(
  statements: FinancialStatement[]
): Promise<{ saved: number; errors: number }> {
  let saved = 0
  let errors = 0
  
  for (const statement of statements) {
    const result = await saveFinancialStatement(statement)
    if (result.success) {
      saved++
    } else {
      errors++
      console.warn(`Failed to save statement for CUI ${statement.cui}, year ${statement.year}:`, result.error)
    }
  }
  
  return { saved, errors }
}

/**
 * Get financial statements for a company
 */
export async function getFinancialStatements(
  cui: string,
  limit?: number
): Promise<FinancialStatement[]> {
  try {
    const supabase = await createClient()
    
    let query = supabase
      .from('financial_statements')
      .select('*')
      .eq('cui', cui)
      .order('year', { ascending: false })
      .order('period_type', { ascending: false })
      .order('period_number', { ascending: false, nullsFirst: false })
    
    if (limit) {
      query = query.limit(limit)
    }
    
    const { data, error } = await query
    
    if (error) {
      console.error('Error fetching financial statements:', error)
      return []
    }
    
    return (data || []).map(mapDbToFinancialStatement)
    
  } catch (error) {
    console.error('Error in getFinancialStatements:', error)
    return []
  }
}

/**
 * Get latest financial statement for a company
 */
export async function getLatestFinancialStatement(
  cui: string
): Promise<FinancialStatement | null> {
  try {
    const supabase = await createClient()
    
    const { data, error } = await supabase
      .from('financial_statements')
      .select('*')
      .eq('cui', cui)
      .order('year', { ascending: false })
      .order('period_type', { ascending: false })
      .order('period_number', { ascending: false, nullsFirst: false })
      .limit(1)
      .single()
    
    if (error || !data) {
      return null
    }
    
    return mapDbToFinancialStatement(data)
    
  } catch (error) {
    console.error('Error in getLatestFinancialStatement:', error)
    return null
  }
}

/**
 * Calculate financial risk factors for a company
 */
export async function calculateFinancialRiskFactors(
  cui: string
): Promise<FinancialRiskFactors> {
  try {
    const supabase = await createClient()
    
    const currentYear = new Date().getFullYear()
    const lastYear = currentYear - 1
    
    // Check for missing statements (last 2 years)
    const { data: recentStatements } = await supabase
      .from('financial_statements')
      .select('year')
      .eq('cui', cui)
      .in('year', [currentYear, lastYear])
      .eq('period_type', 'annual')
    
    const missingStatements = !recentStatements || recentStatements.length === 0
    
    // Check for delayed filing
    const { data: delayedStatements } = await supabase
      .from('financial_statements')
      .select('delayed_filing')
      .eq('cui', cui)
      .gte('year', lastYear)
      .eq('delayed_filing', true)
      .limit(1)
    
    const delayedFiling = (delayedStatements?.length || 0) > 0
    
    // Check for negative equity
    const { data: negativeEquityStatements } = await supabase
      .from('financial_statements')
      .select('negative_equity')
      .eq('cui', cui)
      .gte('year', lastYear)
      .eq('negative_equity', true)
      .limit(1)
    
    const negativeEquity = (negativeEquityStatements?.length || 0) > 0
    
    // Check for revenue drop >50%
    const { data: revenueData } = await supabase
      .from('financial_statements')
      .select('year, revenue')
      .eq('cui', cui)
      .eq('period_type', 'annual')
      .in('year', [currentYear, lastYear])
      .order('year', { ascending: false })
    
    let revenueDrop50 = false
    if (revenueData && revenueData.length >= 2) {
      const currentRevenue = revenueData.find(s => s.year === currentYear)?.revenue
      const previousRevenue = revenueData.find(s => s.year === lastYear)?.revenue
      
      if (currentRevenue && previousRevenue && previousRevenue > 0) {
        revenueDrop50 = (currentRevenue / previousRevenue) < 0.5
      }
    }
    
    return {
      missingStatements,
      delayedFiling,
      negativeEquity,
      revenueDrop50,
    }
    
  } catch (error) {
    console.error('Error calculating financial risk factors:', error)
    // Return safe defaults on error
    return {
      missingStatements: true,
      delayedFiling: false,
      negativeEquity: false,
      revenueDrop50: false,
    }
  }
}

/**
 * Get comprehensive financial summary for a company
 */
export async function getCompanyFinancialSummary(
  cui: string
): Promise<CompanyFinancialSummary | null> {
  try {
    const statements = await getFinancialStatements(cui, 10)
    const latestStatement = statements[0] || null
    const riskFactors = await calculateFinancialRiskFactors(cui)
    
    // Calculate revenue trend
    let revenueTrend
    if (statements.length >= 2) {
      const current = statements[0]?.revenue || 0
      const previous = statements[1]?.revenue || 0
      
      if (previous > 0) {
        revenueTrend = {
          current,
          previous,
          change: current - previous,
          changePercent: ((current - previous) / previous) * 100,
        }
      }
    }
    
    // Calculate equity trend
    let equityTrend
    if (statements.length >= 2) {
      const current = statements[0]?.equity || 0
      const previous = statements[1]?.equity || 0
      
      equityTrend = {
        current,
        previous,
        change: current - previous,
      }
    }
    
    return {
      cui,
      latestStatement: latestStatement || undefined,
      statements,
      riskFactors,
      revenueTrend,
      equityTrend,
    }
    
  } catch (error) {
    console.error('Error in getCompanyFinancialSummary:', error)
    return null
  }
}

/**
 * Map database row to FinancialStatement type
 */
function mapDbToFinancialStatement(row: any): FinancialStatement {
  return {
    id: row.id,
    cui: row.cui,
    year: row.year,
    periodType: row.period_type,
    periodNumber: row.period_number || undefined,
    totalAssets: row.total_assets ? parseFloat(row.total_assets) : undefined,
    currentAssets: row.current_assets ? parseFloat(row.current_assets) : undefined,
    fixedAssets: row.fixed_assets ? parseFloat(row.fixed_assets) : undefined,
    totalLiabilities: row.total_liabilities ? parseFloat(row.total_liabilities) : undefined,
    currentLiabilities: row.current_liabilities ? parseFloat(row.current_liabilities) : undefined,
    longTermLiabilities: row.long_term_liabilities ? parseFloat(row.long_term_liabilities) : undefined,
    equity: row.equity ? parseFloat(row.equity) : undefined,
    shareCapital: row.share_capital ? parseFloat(row.share_capital) : undefined,
    revenue: row.revenue ? parseFloat(row.revenue) : undefined,
    operatingExpenses: row.operating_expenses ? parseFloat(row.operating_expenses) : undefined,
    operatingProfit: row.operating_profit ? parseFloat(row.operating_profit) : undefined,
    netProfit: row.net_profit ? parseFloat(row.net_profit) : undefined,
    netLoss: row.net_loss ? parseFloat(row.net_loss) : undefined,
    currentRatio: row.current_ratio ? parseFloat(row.current_ratio) : undefined,
    debtToEquity: row.debt_to_equity ? parseFloat(row.debt_to_equity) : undefined,
    returnOnAssets: row.return_on_assets ? parseFloat(row.return_on_assets) : undefined,
    returnOnEquity: row.return_on_equity ? parseFloat(row.return_on_equity) : undefined,
    negativeEquity: row.negative_equity || false,
    filingDate: row.filing_date || undefined,
    filingDeadline: row.filing_deadline || undefined,
    delayedFiling: row.delayed_filing || false,
    source: row.source || 'mfinante',
    rawData: row.raw_data || undefined,
    importedAt: row.imported_at || undefined,
    updatedAt: row.updated_at || undefined,
  }
}

