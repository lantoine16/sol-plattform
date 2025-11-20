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
    const payload = await getPayloadClient()
    return payload.find({
      collection: 'tasks',
      ...options,
      // Standardmäßig alle Datensätze laden, wenn kein Limit angegeben ist
      limit: options?.limit ?? 0,
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
      sort: options?.sort || 'description',
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
