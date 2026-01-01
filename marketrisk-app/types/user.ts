// User and Authentication Types

export type PlanTier = 'free' | 'starter' | 'pro' | 'enterprise';

export interface User {
  id: string;
  email: string;
  full_name: string | null;
  company_name: string | null;
  plan: PlanTier;
  created_at: string;
  updated_at: string;

  // Plan limits
  search_limit_monthly: number;
  watchlist_limit: number;
  pdf_export_limit_monthly: number;
  team_users: number;

  // Usage tracking
  searches_this_month: number;
  pdf_exports_this_month: number;
  last_reset_date: string;

  // Preferences
  notification_email: boolean;
  notification_alerts: boolean;
  language: 'ro' | 'en';

  // Billing
  stripe_customer_id: string | null;
  subscription_status: string | null;
  subscription_end_date: string | null;
}

export interface PlanLimits {
  searchLimit: number; // -1 for unlimited
  watchlistLimit: number; // -1 for unlimited
  pdfExportLimit: number; // -1 for unlimited
  teamUsers: number;
  features: string[];
}

export const PLAN_LIMITS: Record<PlanTier, PlanLimits> = {
  free: {
    searchLimit: 3,
    watchlistLimit: 0,
    pdfExportLimit: 0,
    teamUsers: 1,
    features: ['3 searches/month', 'Basic company info', 'Risk score view'],
  },
  starter: {
    searchLimit: 20,
    watchlistLimit: 10,
    pdfExportLimit: 5,
    teamUsers: 1,
    features: [
      '20 searches/month',
      '10 companies watchlist',
      '5 PDF exports/month',
      'Email alerts',
      'Daily monitoring',
    ],
  },
  pro: {
    searchLimit: -1, // unlimited
    watchlistLimit: 250,
    pdfExportLimit: -1, // unlimited
    teamUsers: 5,
    features: [
      'Unlimited searches',
      '250 companies watchlist',
      'Unlimited PDF exports',
      'Priority email alerts',
      'Daily monitoring',
      'API access',
      '5 team members',
    ],
  },
  enterprise: {
    searchLimit: -1, // unlimited
    watchlistLimit: -1, // unlimited
    pdfExportLimit: -1, // unlimited
    teamUsers: -1, // unlimited
    features: [
      'Unlimited everything',
      'Unlimited team members',
      'Custom integrations',
      'Dedicated support',
      'SLA guarantee',
      'Custom reporting',
      'White-label options',
    ],
  },
};

export interface Watchlist {
  id: string;
  user_id: string;
  company_id: string;
  added_at: string;
  last_check: string | null;
  last_status: string | null;
  alert_on_change: boolean;
}

export interface WatchlistWithCompany extends Watchlist {
  company: {
    cui: string;
    company_name: string;
    current_risk_level: string | null;
    current_risk_score: number | null;
  };
}
