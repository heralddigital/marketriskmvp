// Stripe webhook handler
// Processes subscription events from Stripe

import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import Stripe from 'stripe'
import { constructWebhookEvent } from '@/lib/stripe/server'
import { STRIPE_WEBHOOK_EVENTS, type PlanId } from '@/lib/stripe/config'
import { createClient } from '@/lib/supabase/server'
import {
  sendSubscriptionConfirmationEmail,
  sendPaymentFailedEmail,
  sendInvoiceReceiptEmail,
  sendSubscriptionCanceledEmail,
} from '@/lib/email/notifications'

/**
 * Disable Next.js body parsing for webhooks
 * Stripe needs the raw body to verify signatures
 */
export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  const body = await request.text()
  const headersList = await headers()
  const signature = headersList.get('stripe-signature')

  if (!signature) {
    return NextResponse.json({ error: 'No signature found' }, { status: 400 })
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  if (!webhookSecret) {
    console.error('STRIPE_WEBHOOK_SECRET is not set')
    return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 })
  }

  let event: Stripe.Event

  try {
    // Verify webhook signature
    event = constructWebhookEvent(body, signature, webhookSecret)
  } catch (error) {
    console.error('Webhook signature verification failed:', error)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  try {
    // Handle the event
    await handleWebhookEvent(event)

    return NextResponse.json({ received: true }, { status: 200 })
  } catch (error) {
    console.error('Error processing webhook:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}

/**
 * Handle different webhook event types
 */
async function handleWebhookEvent(event: Stripe.Event): Promise<void> {
  console.log(`Processing webhook event: ${event.type}`)

  switch (event.type) {
    case STRIPE_WEBHOOK_EVENTS.CHECKOUT_COMPLETED:
      await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session)
      break

    case STRIPE_WEBHOOK_EVENTS.SUBSCRIPTION_CREATED:
    case STRIPE_WEBHOOK_EVENTS.SUBSCRIPTION_UPDATED:
      await handleSubscriptionUpdated(event.data.object as Stripe.Subscription)
      break

    case STRIPE_WEBHOOK_EVENTS.SUBSCRIPTION_DELETED:
      await handleSubscriptionDeleted(event.data.object as Stripe.Subscription)
      break

    case STRIPE_WEBHOOK_EVENTS.INVOICE_PAID:
      await handleInvoicePaid(event.data.object as Stripe.Invoice)
      break

    case STRIPE_WEBHOOK_EVENTS.INVOICE_PAYMENT_FAILED:
      await handleInvoicePaymentFailed(event.data.object as Stripe.Invoice)
      break

    case STRIPE_WEBHOOK_EVENTS.CUSTOMER_UPDATED:
      await handleCustomerUpdated(event.data.object as Stripe.Customer)
      break

    default:
      console.log(`Unhandled event type: ${event.type}`)
  }
}

/**
 * Handle checkout session completed
 * Create or update user subscription in database
 */
async function handleCheckoutCompleted(
  session: Stripe.Checkout.Session
): Promise<void> {
  console.log('Checkout completed:', session.id)

  const supabase = await createClient()

  const customerId = session.customer as string
  const subscriptionId = session.subscription as string
  const userId = session.metadata?.userId

  if (!userId) {
    console.error('No userId in session metadata')
    return
  }

  // Update user with Stripe customer ID and subscription ID
  const { error } = await supabase
    .from('users')
    .update({
      stripe_customer_id: customerId,
      stripe_subscription_id: subscriptionId,
      updated_at: new Date().toISOString(),
    })
    .eq('id', userId)

  if (error) {
    console.error('Error updating user after checkout:', error)
    throw error
  }

  console.log(`User ${userId} updated with subscription ${subscriptionId}`)

  // Send subscription confirmation email
  try {
    const { data: user } = await supabase
      .from('users')
      .select('email, name, locale, subscription_plan, subscription_period_end')
      .eq('id', userId)
      .single()

    if (user?.email && user?.subscription_plan !== 'free') {
      const nextBillingDate = user.subscription_period_end
        ? new Date(user.subscription_period_end)
        : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // Default to 30 days

      await sendSubscriptionConfirmationEmail({
        to: user.email,
        name: user.name || 'Customer',
        planId: user.subscription_plan as PlanId,
        nextBillingDate,
        locale: (user.locale || 'ro') as 'ro' | 'en',
      })

      console.log(`Subscription confirmation email sent to ${user.email}`)
    }
  } catch (emailError) {
    console.error('Error sending subscription confirmation email:', emailError)
    // Don't throw - email failure shouldn't fail the webhook
  }
}

/**
 * Handle subscription created or updated
 * Sync subscription status and plan to database
 */
async function handleSubscriptionUpdated(subscription: Stripe.Subscription): Promise<void> {
  console.log('Subscription updated:', subscription.id)

  const supabase = await createClient()

  const customerId = subscription.customer as string
  const subscriptionId = subscription.id
  const status = subscription.status
  const currentPeriodEnd = new Date(subscription.current_period_end * 1000).toISOString()

  // Get plan ID from price metadata or product
  const priceId = subscription.items.data[0].price.id
  let planId = 'free' // Default fallback

  // Map price ID to plan ID (you'll need to customize this based on your Stripe setup)
  if (priceId === process.env.NEXT_PUBLIC_STRIPE_PRICE_PROFESSIONAL) {
    planId = 'professional'
  } else if (priceId === process.env.NEXT_PUBLIC_STRIPE_PRICE_BUSINESS) {
    planId = 'business'
  }

  // Update user subscription
  const { error } = await supabase
    .from('users')
    .update({
      stripe_subscription_id: subscriptionId,
      subscription_status: status,
      subscription_plan: planId,
      subscription_period_end: currentPeriodEnd,
      updated_at: new Date().toISOString(),
    })
    .eq('stripe_customer_id', customerId)

  if (error) {
    console.error('Error updating subscription:', error)
    throw error
  }

  console.log(`Subscription ${subscriptionId} updated for customer ${customerId}`)
}

/**
 * Handle subscription deleted (canceled)
 * Downgrade user to free plan
 */
async function handleSubscriptionDeleted(subscription: Stripe.Subscription): Promise<void> {
  console.log('Subscription deleted:', subscription.id)

  const supabase = await createClient()

  const customerId = subscription.customer as string
  const endDate = new Date(subscription.current_period_end * 1000)

  // Get user info before update for email
  const { data: userBefore } = await supabase
    .from('users')
    .select('email, name, locale, subscription_plan')
    .eq('stripe_customer_id', customerId)
    .single()

  // Downgrade user to free plan
  const { error } = await supabase
    .from('users')
    .update({
      subscription_status: 'canceled',
      subscription_plan: 'free',
      stripe_subscription_id: null,
      updated_at: new Date().toISOString(),
    })
    .eq('stripe_customer_id', customerId)

  if (error) {
    console.error('Error handling subscription deletion:', error)
    throw error
  }

  console.log(`User downgraded to free plan after subscription cancellation`)

  // Send cancellation email
  try {
    if (userBefore?.email && userBefore?.subscription_plan !== 'free') {
      await sendSubscriptionCanceledEmail({
        to: userBefore.email,
        name: userBefore.name || 'Customer',
        planId: userBefore.subscription_plan as PlanId,
        endDate,
        locale: (userBefore.locale || 'ro') as 'ro' | 'en',
      })

      console.log(`Subscription canceled email sent to ${userBefore.email}`)
    }
  } catch (emailError) {
    console.error('Error sending subscription canceled email:', emailError)
    // Don't throw - email failure shouldn't fail the webhook
  }
}

/**
 * Handle invoice paid
 * Update subscription status and send receipt email
 */
async function handleInvoicePaid(invoice: Stripe.Invoice): Promise<void> {
  console.log('Invoice paid:', invoice.id)

  const supabase = await createClient()

  const customerId = invoice.customer as string
  const subscriptionId = invoice.subscription as string

  if (!subscriptionId) {
    return // Not a subscription invoice
  }

  // Update last payment date
  const { error } = await supabase
    .from('users')
    .update({
      last_payment_date: new Date().toISOString(),
      subscription_status: 'active',
      updated_at: new Date().toISOString(),
    })
    .eq('stripe_customer_id', customerId)

  if (error) {
    console.error('Error updating last payment date:', error)
    throw error
  }

  console.log(`Invoice ${invoice.id} paid for customer ${customerId}`)

  // Send receipt email
  try {
    const { data: user } = await supabase
      .from('users')
      .select('email, name, locale')
      .eq('stripe_customer_id', customerId)
      .single()

    if (user?.email && invoice.hosted_invoice_url) {
      const amount = invoice.amount_paid
        ? `€${(invoice.amount_paid / 100).toFixed(2)}`
        : '€0.00'

      await sendInvoiceReceiptEmail({
        to: user.email,
        name: user.name || 'Customer',
        amount,
        invoiceUrl: invoice.hosted_invoice_url,
        locale: (user.locale || 'ro') as 'ro' | 'en',
      })

      console.log(`Invoice receipt sent to ${user.email}`)
    }
  } catch (emailError) {
    console.error('Error sending invoice receipt email:', emailError)
    // Don't throw - email failure shouldn't fail the webhook
  }
}

/**
 * Handle invoice payment failed
 * Update subscription status and send notification
 */
async function handleInvoicePaymentFailed(invoice: Stripe.Invoice): Promise<void> {
  console.log('Invoice payment failed:', invoice.id)

  const supabase = await createClient()

  const customerId = invoice.customer as string

  // Update subscription status
  const { error } = await supabase
    .from('users')
    .update({
      subscription_status: 'past_due',
      updated_at: new Date().toISOString(),
    })
    .eq('stripe_customer_id', customerId)

  if (error) {
    console.error('Error updating payment failed status:', error)
    throw error
  }

  console.log(`Payment failed for customer ${customerId}`)

  // Send payment failed email notification
  try {
    const { data: user } = await supabase
      .from('users')
      .select('email, name, locale, subscription_plan')
      .eq('stripe_customer_id', customerId)
      .single()

    if (user?.email && user?.subscription_plan !== 'free') {
      const attemptDate = new Date()
      const nextAttemptDate = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) // 3 days later

      await sendPaymentFailedEmail({
        to: user.email,
        name: user.name || 'Customer',
        planId: user.subscription_plan as PlanId,
        attemptDate,
        nextAttemptDate,
        locale: (user.locale || 'ro') as 'ro' | 'en',
      })

      console.log(`Payment failed email sent to ${user.email}`)
    }
  } catch (emailError) {
    console.error('Error sending payment failed email:', emailError)
    // Don't throw - email failure shouldn't fail the webhook
  }
}

/**
 * Handle customer updated
 * Sync customer details to database
 */
async function handleCustomerUpdated(customer: Stripe.Customer): Promise<void> {
  console.log('Customer updated:', customer.id)

  const supabase = await createClient()

  // Update customer email if changed
  const { error } = await supabase
    .from('users')
    .update({
      email: customer.email,
      updated_at: new Date().toISOString(),
    })
    .eq('stripe_customer_id', customer.id)

  if (error) {
    console.error('Error updating customer:', error)
    throw error
  }

  console.log(`Customer ${customer.id} updated`)
}
