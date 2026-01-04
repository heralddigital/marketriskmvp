// Server-side Stripe utilities
// Use these in API routes and server components only

import Stripe from 'stripe'
import { STRIPE_CONFIG } from './config'

/**
 * Initialize Stripe server client
 * Singleton pattern to reuse connection
 */
let stripeInstance: Stripe | null = null

export function getStripe(): Stripe {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY is not set in environment variables')
  }

  if (!stripeInstance) {
    stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: STRIPE_CONFIG.apiVersion,
      typescript: true,
      appInfo: {
        name: 'MarketRisk',
        version: '1.0.0',
      },
    })
  }

  return stripeInstance
}

/**
 * Create a checkout session for subscription
 */
export async function createCheckoutSession({
  priceId,
  customerId,
  customerEmail,
  successUrl,
  cancelUrl,
  metadata = {},
}: {
  priceId: string
  customerId?: string
  customerEmail?: string
  successUrl: string
  cancelUrl: string
  metadata?: Record<string, string>
}): Promise<Stripe.Checkout.Session> {
  const stripe = getStripe()

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    customer: customerId,
    customer_email: !customerId ? customerEmail : undefined,
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata,
    allow_promotion_codes: true,
    billing_address_collection: 'required',
    automatic_tax: {
      enabled: true, // Enable Stripe Tax if configured
    },
    subscription_data: {
      metadata,
    },
  })

  return session
}

/**
 * Create a customer portal session
 * Allows customers to manage their subscription
 */
export async function createPortalSession({
  customerId,
  returnUrl,
}: {
  customerId: string
  returnUrl: string
}): Promise<Stripe.BillingPortal.Session> {
  const stripe = getStripe()

  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  })

  return session
}

/**
 * Get or create a Stripe customer
 */
export async function getOrCreateCustomer({
  email,
  userId,
  name,
}: {
  email: string
  userId: string
  name?: string
}): Promise<Stripe.Customer> {
  const stripe = getStripe()

  // Search for existing customer by email
  const existingCustomers = await stripe.customers.list({
    email,
    limit: 1,
  })

  if (existingCustomers.data.length > 0) {
    return existingCustomers.data[0]
  }

  // Create new customer
  const customer = await stripe.customers.create({
    email,
    name,
    metadata: {
      userId,
    },
  })

  return customer
}

/**
 * Get subscription by ID
 */
export async function getSubscription(
  subscriptionId: string
): Promise<Stripe.Subscription | null> {
  const stripe = getStripe()

  try {
    const subscription = await stripe.subscriptions.retrieve(subscriptionId)
    return subscription
  } catch (error) {
    console.error('Error retrieving subscription:', error)
    return null
  }
}

/**
 * Cancel subscription
 */
export async function cancelSubscription(
  subscriptionId: string,
  cancelAtPeriodEnd: boolean = true
): Promise<Stripe.Subscription> {
  const stripe = getStripe()

  const subscription = await stripe.subscriptions.update(subscriptionId, {
    cancel_at_period_end: cancelAtPeriodEnd,
  })

  return subscription
}

/**
 * Update subscription (upgrade/downgrade)
 */
export async function updateSubscription({
  subscriptionId,
  newPriceId,
}: {
  subscriptionId: string
  newPriceId: string
}): Promise<Stripe.Subscription> {
  const stripe = getStripe()

  const subscription = await stripe.subscriptions.retrieve(subscriptionId)

  const updatedSubscription = await stripe.subscriptions.update(subscriptionId, {
    items: [
      {
        id: subscription.items.data[0].id,
        price: newPriceId,
      },
    ],
    proration_behavior: 'create_prorations', // Charge/credit difference immediately
  })

  return updatedSubscription
}

/**
 * Get customer's active subscriptions
 */
export async function getCustomerSubscriptions(
  customerId: string
): Promise<Stripe.Subscription[]> {
  const stripe = getStripe()

  const subscriptions = await stripe.subscriptions.list({
    customer: customerId,
    status: 'active',
    limit: 10,
  })

  return subscriptions.data
}

/**
 * Verify webhook signature
 */
export function constructWebhookEvent(
  payload: string | Buffer,
  signature: string,
  secret: string
): Stripe.Event {
  const stripe = getStripe()

  const event = stripe.webhooks.constructEvent(payload, signature, secret)

  return event
}

/**
 * Get invoice by ID
 */
export async function getInvoice(invoiceId: string): Promise<Stripe.Invoice | null> {
  const stripe = getStripe()

  try {
    const invoice = await stripe.invoices.retrieve(invoiceId)
    return invoice
  } catch (error) {
    console.error('Error retrieving invoice:', error)
    return null
  }
}

/**
 * Create a usage record for metered billing (if needed in future)
 */
export async function createUsageRecord({
  subscriptionItemId,
  quantity,
  timestamp,
}: {
  subscriptionItemId: string
  quantity: number
  timestamp?: number
}): Promise<Stripe.UsageRecord> {
  const stripe = getStripe()

  const usageRecord = await stripe.subscriptionItems.createUsageRecord(
    subscriptionItemId,
    {
      quantity,
      timestamp: timestamp || Math.floor(Date.now() / 1000),
      action: 'increment',
    }
  )

  return usageRecord
}
