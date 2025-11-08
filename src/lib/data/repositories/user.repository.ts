import { getPayloadClient } from '../payload-client'
import type { User } from '@/payload-types'

export class UserRepository {
  /**
   * Find all users with optional filters
   */
  async find(options?: {
    where?: {
      class?: { equals: number }
      role?: { equals: 'pupil' | 'admin' | 'teacher' }
    }
    sort?: string
    limit?: number
    depth?: number
  }): Promise<{ docs: User[]; totalDocs: number }> {
    const payload = await getPayloadClient()
    return payload.find({
      collection: 'users',
      ...options,
    })
  }

  /**
   * Find a user by ID
   */
  async findById(id: number, options?: { depth?: number }): Promise<User | null> {
    const payload = await getPayloadClient()
    try {
      return await payload.findByID({
        collection: 'users',
        id,
        ...options,
      })
    } catch {
      return null
    }
  }

  /**
   * Find users by class ID
   */
  async findByClass(classId: number, options?: { sort?: string }): Promise<User[]> {
    const result = await this.find({
      where: {
        class: { equals: classId },
      },
      sort: options?.sort || 'lastname',
    })
    return result.docs
  }

  /**
   * Find pupils by class ID
   */
  async findPupilsByClass(classId: number, options?: { sort?: string }): Promise<User[]> {
    const result = await this.find({
      where: {
        class: { equals: classId },
        role: { equals: 'pupil' },
      },
      sort: options?.sort || 'lastname',
    })
    return result.docs
  }
}

export const userRepository = new UserRepository()
