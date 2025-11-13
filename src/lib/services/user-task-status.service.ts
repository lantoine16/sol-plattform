import type { Task } from '@/payload-types'
import type { UserTaskStatus } from '@/lib/types'

export class UserTaskStatusService {
  /**
   * Groups tasks by their status from userTaskStatuses
   * @param tasks - Array of all tasks
   * @param userTaskStatuses - Array of task statuses for a specific user
   * @returns Object with three arrays:
   *   - otherTasks: Tasks with status "not-started" or "need-help"
   *   - inProgressTasks: Tasks with status "in-progress"
   *   - finishedTasks: Tasks with status "finished"
   */
  static groupTasksByStatus(
    tasks: Task[],
    userTaskStatuses: UserTaskStatus[],
  ): {
    notStartedTasks: Task[]
    inProgressTasks: Task[]
    finishedTasks: Task[]
  } {
    // Create a map of taskId -> status for quick lookup
    const statusMap = new Map<string, UserTaskStatus['status']>()
    userTaskStatuses.forEach((userTaskStatus) => {
      statusMap.set(userTaskStatus.taskId, userTaskStatus.status)
    })

    const notStartedTasks: Task[] = []
    const inProgressTasks: Task[] = []
    const finishedTasks: Task[] = []

    tasks.forEach((task) => {
      const status = statusMap.get(task.id)

      if (status === 'in-progress') {
        inProgressTasks.push(task)
      } else if (status === 'finished') {
        finishedTasks.push(task)
      } else {
        // Includes "not-started", "need-help", and tasks without a status
        notStartedTasks.push(task)
      }
    })

    return {
      notStartedTasks,
      inProgressTasks,
      finishedTasks,
    }
  }
}
