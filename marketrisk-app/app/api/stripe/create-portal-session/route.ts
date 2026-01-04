// Create Stripe customer portal session API
// Allows customers to manage their subscription, payment methods, and invoices

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createPortalSession, getOrCreateCustomer } from '@/lib/stripe/server'

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

    // Construct return URL
    const baseUrl = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'
    const returnUrl = `${baseUrl}/ro/app/settings`

    // Create portal session
    const session = await createPortalSession({
      customerId,
      returnUrl,
    })

    return NextResponse.json({ url: session.url }, { status: 200 })
  } catch (error) {
    console.error('Error creating portal session:', error)
    return NextResponse.json(
      { error: 'Failed to create portal session' },
      { status: 500 }
    )
  }
}
