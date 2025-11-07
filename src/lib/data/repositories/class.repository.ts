import { getPayloadClient } from '../payload-client'
import type { Class } from '@/payload-types'

export class ClassRepository {
  /**
   * Find all classes
   */
  async find(options?: {
    sort?: string
    limit?: number
  }): Promise<{ docs: Class[]; totalDocs: number }> {
    const payload = await getPayloadClient()
    return payload.find({
      collection: 'classes',
      ...options,
    })
  }

  /**
   * Find a class by ID
   */
  async findById(id: number): Promise<Class | null> {
    const payload = await getPayloadClient()
    try {
      return await payload.findByID({
        collection: 'classes',
        id,
      })
    } catch {
      return null
    }
  }

  /**
   * Find all classes sorted by description
   */
  async findAllSorted(): Promise<Class[]> {
    const result = await this.find({
      sort: 'description',
    })
    return result.docs
  }
}

export const classRepository = new ClassRepository()
