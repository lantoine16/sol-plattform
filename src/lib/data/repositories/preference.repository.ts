import { getPayloadWithAuth } from '../payload-client'
import type { PayloadPreference } from '@/payload-types'

/**
 * Find a preference by key using Payload Local API
 * @param key - The preference key
 * @returns The preference value or null if not found
 */
export async function findByKey<T = unknown>(key: string): Promise<T | null> {
  try {
    const { payload, req } = await getPayloadWithAuth()

    const preferences = await payload.find({
      collection: 'payload-preferences',
      where: {
        key: {
          equals: key,
        },
      },
      limit: 1,
      req,
      overrideAccess: false,
    })

    if (preferences.docs.length === 0) {
      return null
    }

    const preference = preferences.docs[0] as PayloadPreference
    return (preference.value as unknown as T) || null
  } catch (_err) {
    return null
  }
}

/**
 * Set a preference by key using Payload Local API
 * Creates a new preference if it doesn't exist, or updates it if it does
 * The user is automatically determined from the session
 * @param key - The preference key
 * @param value - The preference value to set
 * @returns The created or updated preference
 */
export async function setByKey<T = unknown>(key: string, value: T): Promise<PayloadPreference> {
  try {
    const { payload, req } = await getPayloadWithAuth()

    if (!req.user) {
      throw new Error('User must be authenticated to set preferences')
    }

    // Check if preference already exists for this user and key
    const existingPreferences = await payload.find({
      collection: 'payload-preferences',
      where: {
        key: {
          equals: key,
        },
      },
      limit: 1,
      req,
      overrideAccess: false,
    })

    if (existingPreferences.docs.length > 0) {
      // Update existing preference
      const existingPreference = existingPreferences.docs[0] as PayloadPreference
      return payload.update({
        collection: 'payload-preferences',
        id: existingPreference.id,
        data: {
          value: value as unknown as
            | Record<string, unknown>
            | unknown[]
            | string
            | number
            | boolean
            | null,
        },
        req,
        overrideAccess: false,
      })
    }

    // Create new preference
    return payload.create({
      collection: 'payload-preferences',
      data: {
        key,
        value: value as unknown as
          | Record<string, unknown>
          | unknown[]
          | string
          | number
          | boolean
          | null,
        user: String(req.user.id) as any, // Payload converts string ID to relation format internally
      },
      req,
      overrideAccess: false,
    })
  } catch (err) {
    console.error('Error setting preference:', err)
    throw err
  }
}
