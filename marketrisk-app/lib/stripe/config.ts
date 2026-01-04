// Stripe configuration and pricing plans
// Centralized configuration for all Stripe-related settings

export const STRIPE_CONFIG = {
  // Stripe API version
  apiVersion: '2024-11-20.acacia' as const,

  // Currency (Romanian market)
  currency: 'eur',

  // Billing intervals
  billingIntervals: {
    monthly: 'month' as const,
    yearly: 'year' as const,
  },
} as const

/**
 * Subscription plan configuration
 * These should match your Stripe Product/Price IDs
 */
export const SUBSCRIPTION_PLANS = {
  free: {
    id: 'free',
    name: 'Free',
    nameRo: 'Gratuit',
    price: 0,
    priceId: null, // No Stripe price for free tier
    interval: 'month' as const,
    limits: {
      searches: 5,
      watchlist: 3,
      alerts: false,
      apiAccess: false,
      advancedReports: false,
      prioritySupport: false,
      customReports: false,
      dedicatedManager: false,
    },
    features: {
      en: [
        '5 searches per month',
        'Basic ANAF data',
        '30-day history',
        'PDF export',
      ],
      ro: [
        '5 căutări pe lună',
        'Date ANAF de bază',
        'Istoric 30 zile',
        'Export PDF',
      ],
    },
  },
  professional: {
    id: 'professional',
    name: 'Professional',
    nameRo: 'Professional',
    price: 39,
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_PROFESSIONAL || 'price_professional', // Replace with actual price ID
    interval: 'month' as const,
    limits: {
      searches: 100,
      watchlist: 50,
      alerts: true,
      apiAccess: false,
      advancedReports: true,
      prioritySupport: true,
      customReports: false,
      dedicatedManager: false,
    },
    features: {
      en: [
        '100 searches per month',
        'Complete ANAF + BPI data',
        'PortalJust monitoring',
        'Real-time alerts',
        'Full history',
        'Advanced PDF export',
        'Priority support',
      ],
      ro: [
        '100 căutări pe lună',
        'Date complete ANAF + BPI',
        'Monitorizare PortalJust',
        'Alerte în timp real',
        'Istoric complet',
        'Export PDF avansat',
        'Suport prioritar',
      ],
    },
    popular: true,
  },
  business: {
    id: 'business',
    name: 'Business',
    nameRo: 'Business',
    price: 99,
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_BUSINESS || 'price_business', // Replace with actual price ID
    interval: 'month' as const,
    limits: {
      searches: -1, // Unlimited
      watchlist: 500,
      alerts: true,
      apiAccess: true,
      advancedReports: true,
      prioritySupport: true,
      customReports: true,
      dedicatedManager: false,
    },
    features: {
      en: [
        'Unlimited searches',
        'All Professional features',
        'API access',
        'Watchlist up to 500 companies',
        'Custom reports',
        'Dedicated integrations',
        'Account manager',
      ],
      ro: [
        'Căutări nelimitate',
        'Toate funcțiile Professional',
        'Acces API',
        'Watchlist până la 500 companii',
        'Rapoarte personalizate',
        'Integrări dedicate',
        'Account manager',
      ],
    },
  },
  enterprise: {
    id: 'enterprise',
    name: 'Enterprise',
    nameRo: 'Enterprise',
    price: null, // Custom pricing
    priceId: null, // Contact sales
    interval: 'month' as const,
    limits: {
      searches: -1,
      watchlist: -1,
      alerts: true,
      apiAccess: true,
      advancedReports: true,
      prioritySupport: true,
      customReports: true,
      dedicatedManager: true,
    },
    features: {
      en: [
        'Everything in Business',
        'Custom volume',
        'Guaranteed SLA',
        'Dedicated onboarding',
        'Team training',
        'On-premise integrations',
      ],
      ro: [
        'Totul din Business',
        'Volum personalizat',
        'SLA garantat',
        'Onboarding dedicat',
        'Training echipă',
        'Integrări on-premise',
      ],
    },
  },
} as const

export type PlanId = keyof typeof SUBSCRIPTION_PLANS
export type SubscriptionPlan = (typeof SUBSCRIPTION_PLANS)[PlanId]

/**
 * Get plan configuration by ID
 */
export function getPlanConfig(planId: PlanId): SubscriptionPlan {
  return SUBSCRIPTION_PLANS[planId]
}

/**
 * Check if user has reached plan limit for a feature
 */
export function hasReachedLimit(
  planId: PlanId,
  feature: keyof SubscriptionPlan['limits'],
  currentUsage: number
): boolean {
  const plan = getPlanConfig(planId)
  const limit = plan.limits[feature]

  // -1 means unlimited
  if (limit === -1) return false

  // Boolean limits (true/false)
  if (typeof limit === 'boolean') return !limit

  // Numeric limits
  return currentUsage >= limit
}

/**
 * Get display price for a plan
 */
export function getDisplayPrice(planId: PlanId, locale: 'ro' | 'en' = 'ro'): string {
  const plan = getPlanConfig(planId)

  if (plan.price === null || plan.price === 0) {
    return locale === 'ro' ? 'Gratuit' : 'Free'
  }

  return `€${plan.price}`
}

/**
 * Webhook event types we handle
 */
export const STRIPE_WEBHOOK_EVENTS = {
  CHECKOUT_COMPLETED: 'checkout.session.completed',
  SUBSCRIPTION_CREATED: 'customer.subscription.created',
  SUBSCRIPTION_UPDATED: 'customer.subscription.updated',
  SUBSCRIPTION_DELETED: 'customer.subscription.deleted',
  INVOICE_PAID: 'invoice.paid',
  INVOICE_PAYMENT_FAILED: 'invoice.payment_failed',
  CUSTOMER_UPDATED: 'customer.updated',
} as const

/**
 * Subscription status types
 */
export const SUBSCRIPTION_STATUS = {
  ACTIVE: 'active',
  PAST_DUE: 'past_due',
  CANCELED: 'canceled',
  INCOMPLETE: 'incomplete',
  INCOMPLETE_EXPIRED: 'incomplete_expired',
  TRIALING: 'trialing',
  UNPAID: 'unpaid',
} as const

export type SubscriptionStatus = (typeof SUBSCRIPTION_STATUS)[keyof typeof SUBSCRIPTION_STATUS]
