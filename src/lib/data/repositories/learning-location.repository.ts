import { getPayloadClient } from '../payload-client'
import type { LearningLocation } from '@/payload-types'

export class LearningLocationRepository {
  /**
   * Find all learning locations
   */
  async find(options?: {
    sort?: string
    limit?: number
  }): Promise<{ docs: LearningLocation[]; totalDocs: number }> {
    const payload = await getPayloadClient()
    return payload.find({
      collection: 'learning-location',
      ...options,
      // Standardmäßig alle Datensätze laden, wenn kein Limit angegeben ist
      limit: options?.limit ?? 0,
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
}

export const learningLocationRepository = new LearningLocationRepository()
