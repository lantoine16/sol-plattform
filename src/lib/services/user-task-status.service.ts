import type { Task } from '@/payload-types'
import type { TaskProgress } from '@/payload-types'
export class UserTaskStatusService {
  /**
   * Groups tasks by their status from userTaskStatuses
   * @param tasks - Array of all tasks
   * @param userTaskStatuses - Array of task statuses for a specific user
   * @returns Object with three arrays:
   *   - notStartedTasks: Tasks with status "not-started"
   *   - inProgressTasks: Tasks with status "in-progress"
   *   - finishedTasks: Tasks with status "finished"
   */
  static groupTasksByStatus(
    userTaskStatuses: TaskProgress[],
  ): {
    notStartedTasks: Task[]
    inProgressTasks: Task[]
    finishedTasks: Task[]
  } {

    const notStartedTasks: Task[] = []
    const inProgressTasks: Task[] = []
    const finishedTasks: Task[] = []

    userTaskStatuses.forEach((userTaskStatus) => {
      const task = userTaskStatus.task as Task
      const status = userTaskStatus.status as 'not-started' | 'in-progress' | 'finished'
      if (status === 'in-progress') {
        inProgressTasks.push(task)
      } else if (status === 'finished') {
        finishedTasks.push(task)
      } else if (status === 'not-started') {
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
