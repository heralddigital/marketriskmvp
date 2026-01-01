// Supabase Database Types
// This file should be generated using: npx supabase gen types typescript --project-id <project-id> > types/supabase.ts
// For now, we'll use a placeholder that can be replaced once Supabase is set up

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          company_name: string | null;
          plan: 'free' | 'starter' | 'pro' | 'enterprise';
          created_at: string;
          updated_at: string;
          search_limit_monthly: number;
          watchlist_limit: number;
          pdf_export_limit_monthly: number;
          team_users: number;
          searches_this_month: number;
          pdf_exports_this_month: number;
          last_reset_date: string;
          notification_email: boolean;
          notification_alerts: boolean;
          language: 'ro' | 'en';
          stripe_customer_id: string | null;
          subscription_status: string | null;
          subscription_end_date: string | null;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          company_name?: string | null;
          plan?: 'free' | 'starter' | 'pro' | 'enterprise';
          created_at?: string;
          updated_at?: string;
          search_limit_monthly?: number;
          watchlist_limit?: number;
          pdf_export_limit_monthly?: number;
          team_users?: number;
          searches_this_month?: number;
          pdf_exports_this_month?: number;
          last_reset_date?: string;
          notification_email?: boolean;
          notification_alerts?: boolean;
          language?: 'ro' | 'en';
          stripe_customer_id?: string | null;
          subscription_status?: string | null;
          subscription_end_date?: string | null;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          company_name?: string | null;
          plan?: 'free' | 'starter' | 'pro' | 'enterprise';
          created_at?: string;
          updated_at?: string;
          search_limit_monthly?: number;
          watchlist_limit?: number;
          pdf_export_limit_monthly?: number;
          team_users?: number;
          searches_this_month?: number;
          pdf_exports_this_month?: number;
          last_reset_date?: string;
          notification_email?: boolean;
          notification_alerts?: boolean;
          language?: 'ro' | 'en';
          stripe_customer_id?: string | null;
          subscription_status?: string | null;
          subscription_end_date?: string | null;
        };
      };
      companies: {
        Row: {
          id: string;
          cui: string;
          company_name: string;
          registration_number: string | null;
          anaf_data: Json;
          vat_active: boolean | null;
          vat_split_regime: boolean | null;
          company_active: boolean | null;
          state_debts: number;
          active_lawsuits: number;
          lost_cases_2y: number;
          bankruptcy_filing: boolean;
          insolvency_status: 'none' | 'active' | 'history';
          current_risk_score: number | null;
          current_risk_level: 'GREEN' | 'YELLOW' | 'RED' | null;
          risk_details: Json | null;
          last_anaf_check: string | null;
          last_portaljust_check: string | null;
          last_risk_calculation: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          cui: string;
          company_name: string;
          registration_number?: string | null;
          anaf_data: Json;
          vat_active?: boolean | null;
          vat_split_regime?: boolean | null;
          company_active?: boolean | null;
          state_debts?: number;
          active_lawsuits?: number;
          lost_cases_2y?: number;
          bankruptcy_filing?: boolean;
          insolvency_status?: 'none' | 'active' | 'history';
          current_risk_score?: number | null;
          current_risk_level?: 'GREEN' | 'YELLOW' | 'RED' | null;
          risk_details?: Json | null;
          last_anaf_check?: string | null;
          last_portaljust_check?: string | null;
          last_risk_calculation?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          cui?: string;
          company_name?: string;
          registration_number?: string | null;
          anaf_data?: Json;
          vat_active?: boolean | null;
          vat_split_regime?: boolean | null;
          company_active?: boolean | null;
          state_debts?: number;
          active_lawsuits?: number;
          lost_cases_2y?: number;
          bankruptcy_filing?: boolean;
          insolvency_status?: 'none' | 'active' | 'history';
          current_risk_score?: number | null;
          current_risk_level?: 'GREEN' | 'YELLOW' | 'RED' | null;
          risk_details?: Json | null;
          last_anaf_check?: string | null;
          last_portaljust_check?: string | null;
          last_risk_calculation?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      watchlist: {
        Row: {
          id: string;
          user_id: string;
          company_id: string;
          added_at: string;
          last_check: string | null;
          last_status: string | null;
          alert_on_change: boolean;
        };
        Insert: {
          id?: string;
          user_id: string;
          company_id: string;
          added_at?: string;
          last_check?: string | null;
          last_status?: string | null;
          alert_on_change?: boolean;
        };
        Update: {
          id?: string;
          user_id?: string;
          company_id?: string;
          added_at?: string;
          last_check?: string | null;
          last_status?: string | null;
          alert_on_change?: boolean;
        };
      };
      alerts: {
        Row: {
          id: string;
          user_id: string;
          company_id: string | null;
          alert_type: string;
          severity: string | null;
          message: string;
          details: Json | null;
          read_at: string | null;
          email_sent: boolean;
          email_sent_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          company_id?: string | null;
          alert_type: string;
          severity?: string | null;
          message: string;
          details?: Json | null;
          read_at?: string | null;
          email_sent?: boolean;
          email_sent_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          company_id?: string | null;
          alert_type?: string;
          severity?: string | null;
          message?: string;
          details?: Json | null;
          read_at?: string | null;
          email_sent?: boolean;
          email_sent_at?: string | null;
          created_at?: string;
        };
      };
      search_history: {
        Row: {
          id: string;
          user_id: string;
          cui: string;
          company_name: string | null;
          search_date: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          cui: string;
          company_name?: string | null;
          search_date?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          cui?: string;
          company_name?: string | null;
          search_date?: string;
          created_at?: string;
        };
      };
      litigation: {
        Row: {
          id: string;
          company_id: string;
          case_number: string;
          court_name: string | null;
          case_type: string | null;
          role: string | null;
          status: string | null;
          outcome: string | null;
          filing_date: string | null;
          closing_date: string | null;
          amount: number | null;
          description: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          company_id: string;
          case_number: string;
          court_name?: string | null;
          case_type?: string | null;
          role?: string | null;
          status?: string | null;
          outcome?: string | null;
          filing_date?: string | null;
          closing_date?: string | null;
          amount?: number | null;
          description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          company_id?: string;
          case_number?: string;
          court_name?: string | null;
          case_type?: string | null;
          role?: string | null;
          status?: string | null;
          outcome?: string | null;
          filing_date?: string | null;
          closing_date?: string | null;
          amount?: number | null;
          description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      risk_scores: {
        Row: {
          id: string;
          company_id: string;
          score: number;
          risk_level: 'GREEN' | 'YELLOW' | 'RED';
          details: Json | null;
          calculated_at: string;
        };
        Insert: {
          id?: string;
          company_id: string;
          score: number;
          risk_level: 'GREEN' | 'YELLOW' | 'RED';
          details?: Json | null;
          calculated_at?: string;
        };
        Update: {
          id?: string;
          company_id?: string;
          score?: number;
          risk_level?: 'GREEN' | 'YELLOW' | 'RED';
          details?: Json | null;
          calculated_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
