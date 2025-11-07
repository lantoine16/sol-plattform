import { getPayloadClient } from '../payload-client'
import type { TaskProgress } from '@/payload-types'
import type { TaskStatusValue } from '@/domain/constants/task-status.constants'

export class TaskProgressRepository {
  /**
   * Find all task progress entries with optional filters
   */
  async find(options?: {
    where?: {
      student?: { in: number[] } | { equals: number }
      task?: { in: number[] } | { equals: number }
      and?: Array<{
        student?: { in: number[] } | { equals: number }
        task?: { in: number[] } | { equals: number }
      }>
    }
    sort?: string
    limit?: number
    depth?: number
  }): Promise<{ docs: TaskProgress[]; totalDocs: number }> {
    const payload = await getPayloadClient()
    return payload.find({
      collection: 'task-progress',
      ...options,
    })
  }

  /**
   * Find a task progress by ID
   */
  async findById(id: number, options?: { depth?: number }): Promise<TaskProgress | null> {
    const payload = await getPayloadClient()
    try {
      return await payload.findByID({
        collection: 'task-progress',
        id,
        ...options,
      })
    } catch {
      return null
    }
  }

  /**
   * Find task progress by students and tasks
   */
  async findByStudentsAndTasks(
    studentIds: number[],
    taskIds: number[],
    options?: { depth?: number },
  ): Promise<TaskProgress[]> {
    if (studentIds.length === 0 || taskIds.length === 0) {
      return []
    }

    const result = await this.find({
      where: {
        and: [
          {
            student: { in: studentIds },
          },
          {
            task: { in: taskIds },
          },
        ],
      },
      depth: options?.depth || 2,
    })
    return result.docs
  }

  /**
   * Create a new task progress entry
   */
  async create(data: {
    student: number
    task: number
    status: TaskStatusValue
    note?: string | null
  }): Promise<TaskProgress> {
    const payload = await getPayloadClient()
    return payload.create({
      collection: 'task-progress',
      data,
    })
  }

  /**
   * Update a task progress entry
   */
  async update(
    id: number,
    data: {
      status?: TaskStatusValue
      note?: string | null
    },
  ): Promise<TaskProgress> {
    const payload = await getPayloadClient()
    return payload.update({
      collection: 'task-progress',
      id,
      data,
    })
  }

  /**
   * Delete a task progress entry
   */
  async delete(id: number): Promise<TaskProgress> {
    const payload = await getPayloadClient()
    return payload.delete({
      collection: 'task-progress',
      id,
    })
  }

  /**
   * Find a task progress entry by student and task
   */
  async findByStudentAndTask(
    studentId: number,
    taskId: number,
    options?: { depth?: number },
  ): Promise<TaskProgress | null> {
    const result = await this.find({
      where: {
        and: [
          {
            student: { equals: studentId },
          },
          {
            task: { equals: taskId },
          },
        ],
      },
      limit: 1,
      depth: options?.depth || 0,
    })

    return result.docs[0] || null
  }

  /**
   * Create or update a task progress entry
   * If an entry exists for the given student and task, it will be updated.
   * Otherwise, a new entry will be created.
   */
  async createOrUpdate(data: {
    student: number
    task: number
    status: TaskStatusValue
    note?: string | null
  }): Promise<TaskProgress> {
    const existing = await this.findByStudentAndTask(data.student, data.task)

    if (existing) {
      return this.update(existing.id, {
        status: data.status,
        note: data.note,
      })
    }

    return this.create(data)
  }
}

export const taskProgressRepository = new TaskProgressRepository()
