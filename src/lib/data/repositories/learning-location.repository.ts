import { getPayloadWithAuth } from '../payload-client'
import type { LearningLocation } from '@/payload-types'

export class LearningLocationRepository {
  /**
   * Find all learning locations
   */
  async find(options?: {
    sort?: string
    limit?: number
  }): Promise<{ docs: LearningLocation[]; totalDocs: number }> {
    const { payload, req } = await getPayloadWithAuth()
    return payload.find({
      collection: 'learning-location',
      ...options,
      // Standardmäßig alle Datensätze laden, wenn kein Limit angegeben ist
      limit: options?.limit ?? 0,
      req,
      overrideAccess: false,
    })
  }

  /**
   * Find all learning locations sorted by description
   */
  async findAll(): Promise<LearningLocation[]> {
    const result = await this.find({
      sort: 'description',
      limit: 1000,
    })
    return result.docs
  }

  /**
   * Create multiple learning groups in bulk
   * @param descriptions - Array of learning group descriptions
   * @returns Array of created learning groups
   */
  async createBulk(descriptions: string[]): Promise<LearningLocation[]> {
    if (descriptions.length === 0) {
      return []
    }

    const { payload, req } = await getPayloadWithAuth()

    const createdLearningGroups = await Promise.all(
      descriptions.map((description) =>
        payload.create({
          collection: 'learning-location',
          data: {
            description,
          },
          req,
          overrideAccess: false,
        }),
      ),
    )

    return createdLearningGroups
  }
}

export const learningLocationRepository = new LearningLocationRepository()
