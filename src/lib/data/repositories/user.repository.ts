import { getPayloadClient } from '../payload-client'
import type { User } from '@/payload-types'

export class UserRepository {
  /**
   * Find all users with optional filters
   */
  async find(options?: {
    where?: {
      learningGroup?: { equals: string }
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
  async findById(id: string, options?: { depth?: number }): Promise<User | null> {
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
   * Find users by learning group ID
   */
  async findByLearningGroup(learningGroupId: string, options?: { sort?: string }): Promise<User[]> {
    const result = await this.find({
      where: {
        learningGroup: { equals: learningGroupId },
      },
      sort: options?.sort || 'lastname',
    })
    return result.docs
  }

  /**
   * Find pupils by learning group ID
   */
  async findPupilsByLearningGroup(learningGroupId: string, options?: { sort?: string }): Promise<User[]> {
    const result = await this.find({
      where: {
        learningGroup: { equals: learningGroupId },
        role: { equals: 'pupil' },
      },
      sort: options?.sort || 'lastname',
    })
    return result.docs
  }
}

export const userRepository = new UserRepository()
