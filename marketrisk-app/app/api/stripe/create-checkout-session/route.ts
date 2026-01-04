// Create Stripe checkout session API
// Handles subscription checkout for different plans

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createCheckoutSession, getOrCreateCustomer } from '@/lib/stripe/server'
import { getPlanConfig, type PlanId } from '@/lib/stripe/config'

export async function POST(request: NextRequest) {
  try {
    // Get authenticated user
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get request body
    const body = await request.json()
    const { planId } = body as { planId: PlanId }

    if (!planId) {
      return NextResponse.json({ error: 'Plan ID is required' }, { status: 400 })
    }

    // Get plan configuration
    const plan = getPlanConfig(planId)

    if (!plan.priceId) {
      return NextResponse.json(
        { error: 'This plan does not support online checkout' },
        { status: 400 }
      )
    }

    // Get user details from database
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('email, stripe_customer_id, name')
      .eq('id', user.id)
      .single()

    if (userError || !userData) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Get or create Stripe customer
    let customerId = userData.stripe_customer_id

    if (!customerId) {
      const customer = await getOrCreateCustomer({
        email: userData.email,
        userId: user.id,
        name: userData.name || undefined,
      })

      customerId = customer.id

      // Update user with customer ID
      await supabase
        .from('users')
        .update({ stripe_customer_id: customerId })
        .eq('id', user.id)
    }

    // Construct URLs
    const baseUrl = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'
    const successUrl = `${baseUrl}/ro/app/settings?success=true&session_id={CHECKOUT_SESSION_ID}`
    const cancelUrl = `${baseUrl}/ro/pricing?canceled=true`

    // Create checkout session
    const session = await createCheckoutSession({
      priceId: plan.priceId,
      customerId,
      successUrl,
      cancelUrl,
      metadata: {
        userId: user.id,
        planId: plan.id,
      },
    })

    return NextResponse.json({ sessionId: session.id }, { status: 200 })
  } catch (error) {
    console.error('Error creating checkout session:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}
