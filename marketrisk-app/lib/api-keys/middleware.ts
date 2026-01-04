// API authentication middleware
// Validates API keys for protected endpoints

import { NextRequest, NextResponse } from 'next/server'
import {
  validateApiKey,
  checkRateLimit,
  logApiKeyUsage,
  type ApiKey,
} from './server'

export interface ApiAuthResult {
  authenticated: boolean
  key?: ApiKey
  error?: string
  userId?: string
}

/**
 * Extract API key from request headers
 * Supports both Authorization header and x-api-key header
 */
export function extractApiKey(request: NextRequest): string | null {
  // Check Authorization header (Bearer token)
  const authHeader = request.headers.get('authorization')
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7)
  }

  // Check x-api-key header
  const apiKeyHeader = request.headers.get('x-api-key')
  if (apiKeyHeader) {
    return apiKeyHeader
  }

  return null
}

/**
 * Authenticate API request
 * Validates API key and checks rate limits
 */
export async function authenticateApiRequest(
  request: NextRequest
): Promise<ApiAuthResult> {
  // Extract API key from headers
  const apiKey = extractApiKey(request)

  if (!apiKey) {
    return {
      authenticated: false,
      error: 'Missing API key. Provide key in Authorization header (Bearer) or x-api-key header.',
    }
  }

  // Validate the API key
  const validation = await validateApiKey(apiKey)

  if (!validation.valid || !validation.key) {
    return {
      authenticated: false,
      error: validation.error || 'Invalid API key',
    }
  }

  const key = validation.key

  // Check rate limit
  const rateLimitExceeded = await checkRateLimit(key.id, key.rate_limit)

  if (rateLimitExceeded) {
    return {
      authenticated: false,
      error: `Rate limit exceeded. Maximum ${key.rate_limit} requests per hour.`,
    }
  }

  return {
    authenticated: true,
    key,
    userId: key.user_id,
  }
}

/**
 * API middleware wrapper
 * Authenticates request and logs usage
 */
export function withApiAuth<T = any>(
  handler: (
    request: NextRequest,
    context: { key: ApiKey; userId: string }
  ) => Promise<NextResponse<T>>
) {
  return async (request: NextRequest): Promise<NextResponse> => {
    const startTime = Date.now()

    // Authenticate request
    const auth = await authenticateApiRequest(request)

    if (!auth.authenticated || !auth.key || !auth.userId) {
      return NextResponse.json(
        { error: auth.error || 'Authentication failed' },
        { status: 401 }
      )
    }

    try {
      // Execute the handler
      const response = await handler(request, {
        key: auth.key,
        userId: auth.userId,
      })

      // Log usage
      const responseTime = Date.now() - startTime
      const url = new URL(request.url)

      await logApiKeyUsage({
        keyId: auth.key.id,
        endpoint: url.pathname,
        method: request.method,
        statusCode: response.status,
        responseTimeMs: responseTime,
        ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || undefined,
        userAgent: request.headers.get('user-agent') || undefined,
      })

      // Add rate limit headers
      response.headers.set('X-RateLimit-Limit', auth.key.rate_limit.toString())
      response.headers.set('X-RateLimit-Remaining', '...') // TODO: Calculate remaining
      response.headers.set('X-RateLimit-Reset', '...') // TODO: Calculate reset time

      return response
    } catch (error) {
      console.error('API handler error:', error)

      // Log failed request
      const responseTime = Date.now() - startTime
      const url = new URL(request.url)

      await logApiKeyUsage({
        keyId: auth.key.id,
        endpoint: url.pathname,
        method: request.method,
        statusCode: 500,
        responseTimeMs: responseTime,
      })

      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      )
    }
  }
}

/**
 * Check if user has access to specific scope
 */
export function hasScope(key: ApiKey, scope: string): boolean {
  return key.scopes.includes(scope as any)
}

/**
 * Require specific scope(s)
 * Returns 403 if scope not granted
 */
export function requireScope(key: ApiKey, scopes: string[]): boolean {
  for (const scope of scopes) {
    if (!hasScope(key, scope)) {
      return false
    }
  }
  return true
}
