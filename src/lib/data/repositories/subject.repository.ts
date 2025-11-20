import { getPayloadClient } from '../payload-client'
import type { Subject } from '@/payload-types'

export class SubjectRepository {
  /**
   * Find all subjects
   */
  async find(options?: {
    sort?: string
    limit?: number
  }): Promise<{ docs: Subject[]; totalDocs: number }> {
    const payload = await getPayloadClient()
    return payload.find({
      collection: 'subjects',
      ...options,
      // Standardmäßig alle Datensätze laden, wenn kein Limit angegeben ist
      limit: options?.limit ?? 0,
    })
  }

  /**
   * Find all subjects sorted by description
   */
  async findAllSorted(): Promise<Subject[]> {
    const result = await this.find({
      sort: 'description',
      limit: 1000,
    })
    return result.docs
  }
}

export const subjectRepository = new SubjectRepository()
