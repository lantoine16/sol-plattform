import { getPayloadClient } from '../payload-client'
import type { TaskProgress } from '@/payload-types'
import type { TaskStatusValue } from '@/domain/constants/task-status.constants'
import { TASK_PROGRESS_DEFAULT_STATUS_VALUE } from '@/domain/constants/task-status.constants'
export interface TasksProgressesCreateOptions {
  user: string[]
  task: string[]
}

export class TaskProgressRepository {
  /**
   * Find all task progress entries with optional filters
   */
  async find(options?: {
    where?: {
      user?: { in: string[] } | { equals: string }
      task?: { in: string[] } | { equals: string }
      and?: Array<{
        user?: { in: string[] } | { equals: string }
        task?: { in: string[] } | { equals: string }
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
   * Find task progress by users and tasks
   */
  async findByUsersAndTasks(
    userIds: string[],
    taskIds: string[],
    options?: { depth?: number },
  ): Promise<TaskProgress[]> {
    if (userIds.length === 0 || taskIds.length === 0) {
      return []
    }

    const result = await this.find({
      where: {
        and: [
          {
            user: { in: userIds },
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
   * Find task progress entries for users filtered by subject
   * Returns all tasks with their progress for the given users that belong to the specified subject
   */
  async findByUsersAndSubject(
    userIds: string[],
    subjectId: string,
    options?: { depth?: number },
  ): Promise<TaskProgress[]> {
    if (userIds.length === 0 || !subjectId) {
      return []
    }

    const payload = await getPayloadClient()

    // 1. Finde alle Tasks, die zu diesem Fach gehören
    const tasksResult = await payload.find({
      collection: 'tasks',
      where: {
        subject: {
          equals: subjectId,
        },
      },
      limit: 10000, // Ausreichend groß für alle Tasks
    })

    const taskIds = tasksResult.docs.map((task) => task.id)

    if (taskIds.length === 0) {
      return []
    }

    // 2. Finde alle TaskProgress-Einträge für diese Tasks und User
    const result = await this.find({
      where: {
        and: [
          {
            user: { in: userIds },
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
   * Find a task progress entry by user and task
   */
  async findByUserAndTask(
    userId: string,
    taskId: string,
    options?: { depth?: number },
  ): Promise<TaskProgress | null> {
    const result = await this.find({
      where: {
        and: [
          {
            user: { equals: userId },
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
   * If an entry exists for the given user and task, it will be updated.
   * Otherwise, a new entry will be created.
   */
  async createOrUpdate(data: {
    user: string
    task: string
    status: TaskStatusValue
  }): Promise<TaskProgress> {
    const existing = await this.findByUserAndTask(data.user, data.task)
    const payload = await getPayloadClient()

    if (existing) {
      return payload.update({
        collection: 'task-progress',
        id: existing.id,
        data: {
          status: data.status,
        },
      })
    }

    return payload.create({
      collection: 'task-progress',
      data: {
        user: data.user,
        task: data.task,
        status: data.status,
        helpNeeded: false,
      },
    })
  }

  async createTaskProgresses(data: TasksProgressesCreateOptions): Promise<TaskProgress[]> {
    const payload = await getPayloadClient()
    const createPromises: Promise<TaskProgress>[] = []

    data.user.forEach((userId) => {
      data.task.forEach((taskId) => {
        createPromises.push(
          payload.create({
            collection: 'task-progress',
            data: {
              user: userId,
              task: taskId,
              status: TASK_PROGRESS_DEFAULT_STATUS_VALUE,
              helpNeeded: false,
            },
          }),
        )
      })
    })

    const createdTaskProgresses = await Promise.all(createPromises)
    return createdTaskProgresses
  }
}

export const taskProgressRepository = new TaskProgressRepository()
