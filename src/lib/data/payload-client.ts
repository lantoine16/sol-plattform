import { headers as getHeaders } from 'next/headers.js'
import { getPayload } from 'payload'
import config from '@/payload.config'
import type { Payload } from 'payload'

/**
 * Get a Payload instance
 * Payload CMS handles instance caching internally
 */
export async function getPayloadClient(): Promise<Payload> {
  const payloadConfig = await config
  return getPayload({ config: payloadConfig })
}

/**
 * Get the current authenticated user
 */
export async function getCurrentUser() {
  const headers = await getHeaders()
  const payload = await getPayloadClient()
  const { user } = await payload.auth({ headers })
  return user
}

/**
 * Get Payload instance with authenticated user and request context
 * Use this for Local API calls that need access control
 */
export async function getPayloadWithAuth() {
  const headers = await getHeaders()
  const payload = await getPayloadClient()
  const { user } = await payload.auth({ headers })
  return { payload, user, req: { user, payload } }
}
