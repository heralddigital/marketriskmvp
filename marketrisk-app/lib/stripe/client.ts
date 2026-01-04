// Client-side Stripe utilities
// Use these in client components only

import { loadStripe, Stripe } from '@stripe/stripe-js'

/**
 * Initialize Stripe.js
 * Singleton pattern to reuse connection
 */
let stripePromise: Promise<Stripe | null> | null = null

export function getStripeJs(): Promise<Stripe | null> {
  if (!stripePromise) {
    const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY

    if (!publishableKey) {
      console.error('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is not set')
      return Promise.resolve(null)
    }

    stripePromise = loadStripe(publishableKey)
  }

  return stripePromise
}

/**
 * Redirect to Stripe Checkout
 */
export async function redirectToCheckout(sessionId: string): Promise<void> {
  const stripe = await getStripeJs()

  if (!stripe) {
    throw new Error('Stripe.js failed to load')
  }

  const { error } = await stripe.redirectToCheckout({
    sessionId,
  })

  if (error) {
    console.error('Stripe checkout error:', error)
    throw error
  }
}

/**
 * Create checkout session and redirect
 */
export async function createAndRedirectToCheckout(planId: string): Promise<void> {
  try {
    // Call your API to create checkout session
    const response = await fetch('/api/stripe/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ planId }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to create checkout session')
    }

    const { sessionId } = await response.json()

    // Redirect to Stripe Checkout
    await redirectToCheckout(sessionId)
  } catch (error) {
    console.error('Error creating checkout session:', error)
    throw error
  }
}

/**
 * Redirect to customer portal
 */
export async function redirectToPortal(): Promise<void> {
  try {
    // Call your API to create portal session
    const response = await fetch('/api/stripe/create-portal-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to create portal session')
    }

    const { url } = await response.json()

    // Redirect to Stripe Customer Portal
    window.location.href = url
  } catch (error) {
    console.error('Error creating portal session:', error)
    throw error
  }
}
