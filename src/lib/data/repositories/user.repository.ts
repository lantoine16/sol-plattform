import { getPayloadClient } from '../payload-client'
import type { User } from '@/payload-types'

export class UserRepository {
  /**
   * Find all users with optional filters
   */
  async find(options?: {
    where?: {
      learningGroup?: { equals: string } | { in: string[] }
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
   * Find users by multiple learning group IDs
   */
  async findByLearningGroups(
    learningGroupIds: string[] | string,
    options?: { sort?: string },
  ): Promise<User[]> {
    const learningGroupIdsArray = Array.isArray(learningGroupIds)
      ? learningGroupIds
      : [learningGroupIds]
    if (!learningGroupIdsArray || learningGroupIdsArray.length === 0) {
      return []
    }

    const result = await this.find({
      where: {
        learningGroup: { in: learningGroupIdsArray },
      },
      sort: options?.sort || 'lastname',
    })

    return result.docs
  }

  /**
   * Find pupils by learning group ID
   */
  async findPupilsByLearningGroup(
    learningGroupId: string,
    options?: { sort?: string },
  ): Promise<User[]> {
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
