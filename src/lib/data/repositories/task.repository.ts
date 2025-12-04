import { getPayloadWithAuth } from '../payload-client'
import type { Task } from '@/payload-types'

export interface TaskCreateData {
  title: string
  description?: string | null
}

export interface TasksCreateOptions {
  tasks: TaskCreateData[]
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
      learningGroup?: { equals: string } | { in: string[] }
      user?: { equals: string } | { in: string[] }
      or?: Array<{
        learningGroup?: { equals: string } | { in: string[] }
        user?: { equals: string } | { in: string[] }
      }>
    }
    sort?: string
    limit?: number
    depth?: number
  }): Promise<{ docs: Task[]; totalDocs: number }> {
    const { payload, req } = await getPayloadWithAuth()
    return payload.find({
      collection: 'tasks',
      ...options,
      // Standardmäßig alle Datensätze laden, wenn kein Limit angegeben ist
      limit: options?.limit ?? 0,
      req,
      overrideAccess: false,
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
      sort: options?.sort || 'title',
    })
    return result.docs
  }

  /**
   * Get all tasks from the given learning groups and/or users
   * Returns tasks that belong to the specified learning groups OR are assigned to the specified users
   */
  async getTasksFromLearningGroupsAndUsers(
    learningGroupIds: string[],
    userIds: string[],
    options?: { sort?: string },
  ): Promise<Task[]> {
    const conditions: Array<{
      learningGroup?: { in: string[] }
      user?: { in: string[] }
    }> = []

    // Füge Bedingung für Lerngruppen hinzu, wenn welche angegeben sind
    if (learningGroupIds && learningGroupIds.length > 0) {
      conditions.push({
        learningGroup: { in: learningGroupIds },
      })
    }

    // Füge Bedingung für Benutzer hinzu, wenn welche angegeben sind
    if (userIds && userIds.length > 0) {
      conditions.push({
        user: { in: userIds },
      })
    }

    // Wenn keine Bedingungen vorhanden sind, gib leeres Array zurück
    if (conditions.length === 0) {
      return []
    }

    // Wenn mehrere Bedingungen vorhanden sind, verwende OR
    const result = await this.find({
      where: {
        or: conditions,
      },
      sort: options?.sort || 'title',
    })
    return result.docs
  }

  /**
   * @deprecated Use getTasksFromLearningGroupsAndUsers instead
   * Get all tasks from the given learning groups
   */
  async getTasksFromLearningGroups(
    learningGroupIds: string[],
    options?: { sort?: string },
  ): Promise<Task[]> {
    return this.getTasksFromLearningGroupsAndUsers(learningGroupIds, [], options)
  }

  async createTasks(tasks: TasksCreateOptions): Promise<Task[]> {
    console.log(tasks)
    const { payload, req } = await getPayloadWithAuth()
    const createdTasks = await Promise.all(
      tasks.tasks.map((taskData) => {
        // Validate that title is not empty
        if (!taskData.title || taskData.title.trim() === '') {
          throw new Error('Titel darf nicht leer sein')
        }

        // Create data object without taskBlocks field
        const createData: any = {
          title: taskData.title.trim(),
          description: taskData.description?.trim() || null,
          subject: tasks.subject,
          learningGroup: tasks.learningGroups || null,
          user: tasks.users || null,
          taskBlocks: [],
        }
        // Don't include taskBlocks at all - we're creating tasks directly, not via blocks

        return payload.create({
          collection: 'tasks',
          data: createData,
          req,
          overrideAccess: false,
        })
      }),
    )
    return createdTasks as Task[]
  }
}

export const taskRepository = new TaskRepository()
