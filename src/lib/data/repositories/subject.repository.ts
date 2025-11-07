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
    })
  }

  /**
   * Find a subject by ID
   */
  async findById(id: number): Promise<Subject | null> {
    const payload = await getPayloadClient()
    try {
      return await payload.findByID({
        collection: 'subjects',
        id,
      })
    } catch {
      return null
    }
  }

  /**
   * Find all subjects sorted by description
   */
  async findAllSorted(): Promise<Subject[]> {
    const result = await this.find({
      sort: 'description',
    })
    return result.docs
  }
}

export const subjectRepository = new SubjectRepository()
