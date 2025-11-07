import { getPayloadClient } from '../payload-client'
import type { Task } from '@/payload-types'

export class TaskRepository {
  /**
   * Find all tasks with optional filters
   */
  async find(options?: {
    where?: {
      subject?: { equals: number }
      class?: { equals: number }
    }
    sort?: string
    limit?: number
    depth?: number
  }): Promise<{ docs: Task[]; totalDocs: number }> {
    const payload = await getPayloadClient()
    return payload.find({
      collection: 'tasks',
      ...options,
    })
  }

  /**
   * Find a task by ID
   */
  async findById(id: number, options?: { depth?: number }): Promise<Task | null> {
    const payload = await getPayloadClient()
    try {
      return await payload.findByID({
        collection: 'tasks',
        id,
        ...options,
      })
    } catch {
      return null
    }
  }

  /**
   * Find tasks by class and subject
   */
  async findByClassAndSubject(
    classId: number,
    subjectId: number,
    options?: { sort?: string }
  ): Promise<Task[]> {
    const result = await this.find({
      where: {
        subject: { equals: subjectId },
        class: { equals: classId },
      },
      sort: options?.sort || 'description',
    })
    return result.docs
  }
}

export const taskRepository = new TaskRepository()

