import { getPayloadWithAuth } from '../payload-client'
import type { Subject } from '@/payload-types'

export class SubjectRepository {
  /**
   * Find all subjects
   */
  async find(options?: {
    sort?: string
    limit?: number
  }): Promise<{ docs: Subject[]; totalDocs: number }> {
    const { payload, req } = await getPayloadWithAuth()
    return payload.find({
      collection: 'subjects',
      ...options,
      // Standardmäßig alle Datensätze laden, wenn kein Limit angegeben ist
      limit: options?.limit ?? 0,
      req,
      overrideAccess: false,
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

  /**
   * Create multiple subjects in bulk
   * @param descriptions - Array of subject descriptions
   * @returns Array of created subjects
   */
  async createBulk(descriptions: string[]): Promise<Subject[]> {
    if (descriptions.length === 0) {
      return []
    }

    const { payload, req } = await getPayloadWithAuth()

    const createdSubjects = await Promise.all(
      descriptions.map((description) =>
        payload.create({
          collection: 'subjects',
          data: {
            description,
          },
          req,
          overrideAccess: false,
        }),
      ),
    )

    return createdSubjects
  }
}

export const subjectRepository = new SubjectRepository()
