import { getPayloadClient } from '../payload-client'
import type { User } from '@/payload-types'
import type { UserRoleValue } from '@/domain/constants/user-role.constants'
import { USER_ROLE_DEFAULT_VALUE } from '@/domain/constants/user-role.constants'

export class UserRepository {
  /**
   * Find all users with optional filters
   */
  async find(options?: {
    where?: {
      learningGroup?: { equals: string } | { in: string[] }
      role?: { equals: UserRoleValue }
    }
    sort?: string
    limit?: number
    depth?: number
  }): Promise<{ docs: User[]; totalDocs: number }> {
    const payload = await getPayloadClient()
    return payload.find({
      collection: 'users',
      ...options,
      // Standardmäßig alle Datensätze laden, wenn kein Limit angegeben ist
      limit: options?.limit ?? 0,
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
    options?: { sort?: string; depth?: number },
  ): Promise<User[]> {
    const result = await this.find({
      where: {
        learningGroup: { equals: learningGroupId },
        role: { equals: USER_ROLE_DEFAULT_VALUE },
      },
      sort: options?.sort || 'lastname',
      depth: options?.depth,
    })
    return result.docs
  }

  /**
   * Create a new user with all necessary data
   */
  async create(data: {
    firstname: string
    lastname: string
    password: string
    username: string
    role: UserRoleValue
    graduation?: string
    email?: string | null
    learningGroup?: string[] | null
    currentLearningLocation?: string | null
    standardLearningLocation?: string | null
  }): Promise<User> {
    const payload = await getPayloadClient()
    const userData: any = {
      firstname: data.firstname,
      lastname: data.lastname,
      username: data.username,
      role: data.role,
      password: data.password,
      graduation: data.graduation,
    }

    if (data.email) {
      userData.email = data.email
    }

    if (data.learningGroup && data.learningGroup.length > 0) {
      userData.learningGroup = data.learningGroup
    }

    if (data.currentLearningLocation) {
      userData.currentLearningLocation = data.currentLearningLocation
    }

    if (data.standardLearningLocation) {
      userData.standardLearningLocation = data.standardLearningLocation
    }

    return payload.create({
      collection: 'users',
      data: userData,
    })
  }

  /**
   * Get all usernames of all users
   */
  async getAllUsernamesAndEmails(): Promise<{ emails: string[]; usernames: string[] }> {
    const result = await this.find()
    const emails: string[] = []
    const usernames: string[] = []
    result.docs.forEach((user) => {
      if (user.email) {
        emails.push(user.email)
      }
      if (user.username) {
        usernames.push(user.username)
      }
    })
    return { emails, usernames }
  }
}

export const userRepository = new UserRepository()
