// Server-side API key management
// For Business tier users to access MarketRisk API programmatically

import { createClient } from '@/lib/supabase/server'
import crypto from 'crypto'

export type ApiKeyScope =
  | 'read:companies'
  | 'read:risk-scores'
  | 'read:watchlist'
  | 'write:watchlist'
  | 'read:alerts'
  | 'write:alerts'

export interface ApiKey {
  id: string
  user_id: string
  key_hash: string
  key_preview: string
  name: string
  scopes: ApiKeyScope[]
  rate_limit: number
  last_used_at: string | null
  requests_count: number
  is_active: boolean
  expires_at: string | null
  created_at: string
  updated_at: string
}

export interface CreateApiKeyParams {
  userId: string
  name: string
  scopes?: ApiKeyScope[]
  rateLimit?: number
  expiresAt?: Date
}

export interface ValidateApiKeyResult {
  valid: boolean
  key?: ApiKey
  error?: string
}

/**
 * Generate a secure random API key
 * Format: mr_live_[32 random characters]
 */
export function generateApiKey(): string {
  const randomBytes = crypto.randomBytes(24)
  const randomString = randomBytes.toString('base64url')
  return `mr_live_${randomString}`
}

/**
 * Hash an API key using SHA-256
 * We never store the plain text key, only the hash
 */
export function hashApiKey(apiKey: string): string {
  return crypto.createHash('sha256').update(apiKey).digest('hex')
}

/**
 * Get the preview of an API key (first 16 characters)
 * Used for displaying in UI without exposing the full key
 */
export function getKeyPreview(apiKey: string): string {
  return apiKey.substring(0, 16) + '...'
}

/**
 * Create a new API key for a user
 * Returns the plain text key (only shown once) and the database record
 */
export async function createApiKey(
  params: CreateApiKeyParams
): Promise<{ key: string; record: ApiKey }> {
  const {
    userId,
    name,
    scopes = ['read:companies', 'read:risk-scores'],
    rateLimit = 1000,
    expiresAt,
  } = params

  // Generate the key
  const plainKey = generateApiKey()
  const keyHash = hashApiKey(plainKey)
  const keyPreview = getKeyPreview(plainKey)

  // Save to database
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('api_keys')
    .insert({
      user_id: userId,
      key_hash: keyHash,
      key_preview: keyPreview,
      name,
      scopes,
      rate_limit: rateLimit,
      expires_at: expiresAt?.toISOString(),
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating API key:', error)
    throw new Error('Failed to create API key')
  }

  return {
    key: plainKey,
    record: data as ApiKey,
  }
}

/**
 * Validate an API key
 * Checks if the key exists, is active, and hasn't expired
 */
export async function validateApiKey(
  apiKey: string
): Promise<ValidateApiKeyResult> {
  const keyHash = hashApiKey(apiKey)

  const supabase = await createClient()
  const { data, error } = await supabase
    .from('api_keys')
    .select('*')
    .eq('key_hash', keyHash)
    .single()

  if (error || !data) {
    return { valid: false, error: 'Invalid API key' }
  }

  const key = data as ApiKey

  // Check if key is active
  if (!key.is_active) {
    return { valid: false, error: 'API key is inactive' }
  }

  // Check if key has expired
  if (key.expires_at && new Date(key.expires_at) < new Date()) {
    return { valid: false, error: 'API key has expired' }
  }

  return { valid: true, key }
}

/**
 * Check if API key has exceeded rate limit
 * Returns true if rate limit exceeded, false otherwise
 */
export async function checkRateLimit(keyId: string, limit: number): Promise<boolean> {
  const supabase = await createClient()

  // Count requests in the last hour
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString()

  const { count, error } = await supabase
    .from('api_key_usage')
    .select('*', { count: 'exact', head: true })
    .eq('api_key_id', keyId)
    .gte('timestamp', oneHourAgo)

  if (error) {
    console.error('Error checking rate limit:', error)
    return false // Allow request if we can't check (fail open)
  }

  return (count || 0) >= limit
}

/**
 * Log API key usage
 * Records each request for analytics and billing
 */
export async function logApiKeyUsage(params: {
  keyId: string
  endpoint: string
  method: string
  statusCode: number
  responseTimeMs: number
  ipAddress?: string
  userAgent?: string
  companiesSearched?: number
}): Promise<void> {
  const {
    keyId,
    endpoint,
    method,
    statusCode,
    responseTimeMs,
    ipAddress,
    userAgent,
    companiesSearched = 0,
  } = params

  const supabase = await createClient()

  const { error } = await supabase.from('api_key_usage').insert({
    api_key_id: keyId,
    endpoint,
    method,
    status_code: statusCode,
    response_time_ms: responseTimeMs,
    ip_address: ipAddress,
    user_agent: userAgent,
    companies_searched: companiesSearched,
  })

  if (error) {
    console.error('Error logging API key usage:', error)
    // Don't throw - logging failure shouldn't break the request
  }
}

/**
 * Get all API keys for a user
 */
export async function getUserApiKeys(userId: string): Promise<ApiKey[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('api_keys')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error getting user API keys:', error)
    throw new Error('Failed to get API keys')
  }

  return data as ApiKey[]
}

/**
 * Revoke (deactivate) an API key
 */
export async function revokeApiKey(keyId: string, userId: string): Promise<void> {
  const supabase = await createClient()

  const { error } = await supabase
    .from('api_keys')
    .update({ is_active: false })
    .eq('id', keyId)
    .eq('user_id', userId) // Ensure user owns the key

  if (error) {
    console.error('Error revoking API key:', error)
    throw new Error('Failed to revoke API key')
  }
}

/**
 * Delete an API key permanently
 */
export async function deleteApiKey(keyId: string, userId: string): Promise<void> {
  const supabase = await createClient()

  const { error } = await supabase
    .from('api_keys')
    .delete()
    .eq('id', keyId)
    .eq('user_id', userId) // Ensure user owns the key

  if (error) {
    console.error('Error deleting API key:', error)
    throw new Error('Failed to delete API key')
  }
}

/**
 * Get API key statistics
 */
export async function getApiKeyStats(keyId: string): Promise<{
  totalRequests: number
  requestsLast24h: number
  requestsLastHour: number
  avgResponseTimeMs: number
  mostUsedEndpoint: string | null
}> {
  const supabase = await createClient()

  const { data, error } = await supabase.rpc('get_api_key_stats', {
    key_id: keyId,
  })

  if (error) {
    console.error('Error getting API key stats:', error)
    return {
      totalRequests: 0,
      requestsLast24h: 0,
      requestsLastHour: 0,
      avgResponseTimeMs: 0,
      mostUsedEndpoint: null,
    }
  }

  const stats = data[0] || {}
  return {
    totalRequests: stats.total_requests || 0,
    requestsLast24h: stats.requests_last_24h || 0,
    requestsLastHour: stats.requests_last_hour || 0,
    avgResponseTimeMs: stats.avg_response_time_ms || 0,
    mostUsedEndpoint: stats.most_used_endpoint || null,
  }
}

/**
 * Update API key name
 */
export async function updateApiKeyName(
  keyId: string,
  userId: string,
  name: string
): Promise<void> {
  const supabase = await createClient()

  const { error } = await supabase
    .from('api_keys')
    .update({ name })
    .eq('id', keyId)
    .eq('user_id', userId)

  if (error) {
    console.error('Error updating API key name:', error)
    throw new Error('Failed to update API key name')
  }
}
