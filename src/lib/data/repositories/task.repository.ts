import { getPayloadClient } from '../payload-client'
import type { Task } from '@/payload-types'

export interface TasksCreateOptions {
  description: string[]
  subject: string
  learningGroups?: string[] | null
  users?: string[] | null
}
export class TaskRepository {
  /**
   * Find all tasks with optional filters
   */
  async find(options?: {
    where?: {
      subject?: { equals: string }
      learningGroup?: { equals: string }
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
   * Find tasks by learning group and subject
   */
  async findByLearningGroupAndSubject(
    learningGroupId: string,
    subjectId: string,
    options?: { sort?: string },
  ): Promise<Task[]> {
    const result = await this.find({
      where: {
        subject: { equals: subjectId },
        learningGroup: { equals: learningGroupId },
      },
      sort: options?.sort || 'description',
    })
    return result.docs
  }

  async createTasks(tasks: TasksCreateOptions): Promise<Task[]> {
    const payload = await getPayloadClient()
    const createdTasks = await Promise.all(
      tasks.description.map((description) => {
        return payload.create({
          collection: 'tasks',
          data: {
            description,
            subject: tasks.subject,
            learningGroup: tasks.learningGroups,
            user: tasks.users,
          },
        })
      }),
    )
    return createdTasks
  }
}

export const taskRepository = new TaskRepository()
