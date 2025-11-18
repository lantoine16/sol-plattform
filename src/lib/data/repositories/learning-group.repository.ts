import { getPayloadClient } from '../payload-client'
import type { LearningGroup } from '@/payload-types'

export class LearningGroupRepository {
  /**
   * Find all learning groups
   */
  async find(options?: {
    sort?: string
    limit?: number
  }): Promise<{ docs: LearningGroup[]; totalDocs: number }> {
    const payload = await getPayloadClient()
    return payload.find({
      collection: 'learning-groups',
      ...options,
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
}

export const learningGroupRepository = new LearningGroupRepository()
