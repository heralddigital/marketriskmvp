// API endpoint for managing API keys
// Allows Business tier users to create, list, and delete API keys

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import {
  createApiKey,
  getUserApiKeys,
  deleteApiKey,
} from '@/lib/api-keys/server'

/**
 * GET /api/api-keys
 * List all API keys for the authenticated user
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user has Business plan
    const { data: userProfile } = await supabase
      .from('users')
      .select('subscription_plan')
      .eq('id', user.id)
      .single()

    if (!userProfile || !['business', 'enterprise'].includes(userProfile.subscription_plan)) {
      return NextResponse.json(
        { error: 'API keys are only available for Business and Enterprise plans' },
        { status: 403 }
      )
    }

    // Get user's API keys
    const keys = await getUserApiKeys(user.id)

    return NextResponse.json({ keys })
  } catch (error) {
    console.error('Error getting API keys:', error)
    return NextResponse.json({ error: 'Failed to get API keys' }, { status: 500 })
  }
}

/**
 * POST /api/api-keys
 * Create a new API key for the authenticated user
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user has Business plan
    const { data: userProfile } = await supabase
      .from('users')
      .select('subscription_plan')
      .eq('id', user.id)
      .single()

    if (!userProfile || !['business', 'enterprise'].includes(userProfile.subscription_plan)) {
      return NextResponse.json(
        { error: 'API keys are only available for Business and Enterprise plans' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { name, scopes, rateLimit, expiresAt } = body

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 })
    }

    // Create the API key
    const { key, record } = await createApiKey({
      userId: user.id,
      name: name.trim(),
      scopes,
      rateLimit,
      expiresAt: expiresAt ? new Date(expiresAt) : undefined,
    })

    return NextResponse.json({
      key, // Plain text key (only shown once)
      record, // Database record
    })
  } catch (error) {
    console.error('Error creating API key:', error)
    return NextResponse.json({ error: 'Failed to create API key' }, { status: 500 })
  }
}

/**
 * DELETE /api/api-keys?id=<key_id>
 * Delete an API key
 */
export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const keyId = searchParams.get('id')

    if (!keyId) {
      return NextResponse.json({ error: 'Key ID is required' }, { status: 400 })
    }

    // Delete the API key
    await deleteApiKey(keyId, user.id)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting API key:', error)
    return NextResponse.json({ error: 'Failed to delete API key' }, { status: 500 })
  }
}
