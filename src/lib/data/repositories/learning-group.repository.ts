import type { LearningGroup } from '@/payload-types'
import { getPayloadWithAuth } from '../payload-client'
export class LearningGroupRepository {
  /**
   * Find all learning groups
   */
  async find(options?: {
    sort?: string
    limit?: number
  }): Promise<{ docs: LearningGroup[]; totalDocs: number }> {
    const { payload, req } = await getPayloadWithAuth()
    return payload.find({
      collection: 'learning-groups',
      ...options,
      // Standardmäßig alle Datensätze laden, wenn kein Limit angegeben ist
      limit: options?.limit ?? 0,
      req,
      overrideAccess: false,
    })
  }

  /**
   * Find all learning groups sorted by description
   */
  async findAllSorted(): Promise<LearningGroup[]> {
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
  async createBulk(descriptions: string[]): Promise<LearningGroup[]> {
    if (descriptions.length === 0) {
      return []
    }

    const { payload, req } = await getPayloadWithAuth()

    const createdLearningGroups = await Promise.all(
      descriptions.map((description) =>
        payload.create({
          collection: 'learning-groups',
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

export const learningGroupRepository = new LearningGroupRepository()
