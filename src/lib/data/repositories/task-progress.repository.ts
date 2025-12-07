import { getPayloadWithAuth } from '../payload-client'
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
    const { payload, req } = await getPayloadWithAuth()
    return payload.find({
      collection: 'task-progress',
      ...options,
      // Standardmäßig alle Datensätze laden, wenn kein Limit angegeben ist
      limit: options?.limit ?? 0,
      req,
      overrideAccess: false,
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
    subjectIds: string[],
    options?: { depth?: number },
  ): Promise<TaskProgress[]> {
    if (userIds.length === 0 || subjectIds.length === 0) {
      return []
    }

    const { payload, req } = await getPayloadWithAuth()
    // 1. Finde alle Tasks, die zu diesem Fach gehören
    const tasksResult = await payload.find({
      collection: 'tasks',
      where: {
        subject: {
          in: subjectIds,
        },
      },
      limit: 10000, // Ausreichend groß für alle Tasks
      req,
      overrideAccess: false,
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
    taskId?: null | string[],
    userId?: null | string[],
    options?: { depth?: number },
  ): Promise<TaskProgress[] | null> {
    // Baue die where-Bedingungen auf
    const whereConditions: Array<{
      user?: { in: string[] } | { equals: string }
      task?: { in: string[] } | { equals: string }
    }> = []

    // Füge userId-Bedingung hinzu, wenn vorhanden
    if (userId !== null && userId !== undefined && userId.length > 0) {
      whereConditions.push({
        user: userId.length === 1 ? { equals: userId[0] } : { in: userId },
      })
    }

    // Füge taskId-Bedingung hinzu, wenn vorhanden
    if (taskId !== null && taskId !== undefined && taskId.length > 0) {
      whereConditions.push({
        task: taskId.length === 1 ? { equals: taskId[0] } : { in: taskId },
      })
    }

    // Wenn keine Bedingungen vorhanden sind, gib null zurück
    if (whereConditions.length === 0) {
      return null
    }

    // Baue die where-Klausel
    const where =
      whereConditions.length === 1
        ? whereConditions[0]
        : {
            and: whereConditions,
          }

    // Rufe find einmal auf
    const result = await this.find({
      where,
      depth: options?.depth || 0,
    })

    return result.docs || null
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
    const existing = await this.findByUserAndTask([data.task], [data.user])
    const { payload, req } = await getPayloadWithAuth()

    if (existing) {
      return payload.update({
        collection: 'task-progress',
        id: existing[0].id,
        data: {
          status: data.status,
        },
        req,
        overrideAccess: false,
      })
    }

    return payload.create({
      collection: 'task-progress',
      data: {
        user: data.user,
        task: data.task,
        status: data.status,
        helpNeeded: false,
        searchPartner: false,
      },
      req,
      overrideAccess: false,
    })
  }

  async createTaskProgresses(data: TasksProgressesCreateOptions): Promise<TaskProgress[]> {
    const { payload, req } = await getPayloadWithAuth()
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
              searchPartner: false,
            },
            req,
            overrideAccess: false,
          }),
        )
      })
    })

    const createdTaskProgresses = await Promise.all(createPromises)
    return createdTaskProgresses
  }

  async deleteTaskProgresses(users: string[], tasks: string[]): Promise<void> {
    const { payload, req } = await getPayloadWithAuth()
    await payload.delete({
      collection: 'task-progress',
      where: {
        and: [{ user: { in: users } }, { task: { in: tasks } }],
      },
      req,
      overrideAccess: false,
    })
  }

  async deleteTaskProgressesByTask(taskId: string): Promise<void> {
    const { payload, req } = await getPayloadWithAuth()
    await payload.delete({
      collection: 'task-progress',
      where: { task: { equals: taskId } },
      req,
      overrideAccess: false,
    })
  }

  async deleteTaskProgressesByUser(userId: string): Promise<void> {
    const { payload, req } = await getPayloadWithAuth()
    await payload.delete({
      collection: 'task-progress',
      where: { user: { equals: userId } },
      req,
      overrideAccess: false,
    })
  }

  /**
   * Reset helpNeeded and searchPartner flags to false for all task progress entries of given user IDs
   * @param userIds - Array of user IDs
   */
  async resetStatuses(ids: string[]): Promise<TaskProgress[]> {
    if (ids.length === 0) {
      return []
    }

    const { payload, req } = await getPayloadWithAuth()

    // Update all entries to set helpNeeded and searchPartner to false
    const updatePromises = ids.map((id) =>
      payload.update({
        collection: 'task-progress',
        id: id,
        data: {
          helpNeeded: false,
          searchPartner: false,
        },
        req,
        overrideAccess: false,
      }),
    )

    const result = await Promise.all(updatePromises)
    return result
  }

  /**
   * Update helpNeeded flag for a task progress entry
   * Creates a new entry if it doesn't exist
   */
  async updateHelpNeeded(
    taskId: string,
    userId: string,
    helpNeeded: boolean,
  ): Promise<TaskProgress> {
    const existing = await this.findByUserAndTask([taskId], [userId])

    if (existing && existing.length > 0) {
      const { payload, req } = await getPayloadWithAuth()
      return payload.update({
        collection: 'task-progress',
        id: existing[0].id,
        data: {
          helpNeeded,
        },
        req,
        overrideAccess: false,
      })
    } else {
      // Create new entry if it doesn't exist
      await this.createOrUpdate({
        user: userId,
        task: taskId,
        status: 'not-started',
      })
      // Update again with helpNeeded
      const created = await this.findByUserAndTask([taskId], [userId])
      if (created && created.length > 0) {
        const { payload, req } = await getPayloadWithAuth()
        return payload.update({
          collection: 'task-progress',
          id: created[0].id,
          data: {
            helpNeeded,
          },
          req,
          overrideAccess: false,
        })
      }
      throw new Error('Failed to create or update task progress for helpNeeded')
    }
  }

  /**
   * Update searchPartner flag for a task progress entry
   * Creates a new entry if it doesn't exist
   */
  async updateSearchPartner(
    taskId: string,
    userId: string,
    searchPartner: boolean,
  ): Promise<TaskProgress> {
    const existing = await this.findByUserAndTask([taskId], [userId])

    if (existing && existing.length > 0) {
      const { payload, req } = await getPayloadWithAuth()
      return payload.update({
        collection: 'task-progress',
        id: existing[0].id,
        data: {
          searchPartner,
        },
        req,
        overrideAccess: false,
      })
    } else {
      // Create new entry if it doesn't exist
      await this.createOrUpdate({
        user: userId,
        task: taskId,
        status: 'not-started',
      })
      // Update again with searchPartner
      const created = await this.findByUserAndTask([taskId], [userId])
      if (created && created.length > 0) {
        const { payload, req } = await getPayloadWithAuth()
        return payload.update({
          collection: 'task-progress',
          id: created[0].id,
          data: {
            searchPartner,
          },
          req,
          overrideAccess: false,
        })
      }
      throw new Error('Failed to create or update task progress for searchPartner')
    }
  }
}

export const taskProgressRepository = new TaskProgressRepository()
