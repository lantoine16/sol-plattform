/**
 * View/DTO types for application presentation layer
 * These types transform domain entities into view-optimized formats
 */
import type { TaskStatusValue } from '@/domain/constants/task-status.constants'

export interface UserWithTasks {
  user_id: number
  firstname: string
  lastname: string
  tasks: UserTaskStatus[]
}

export interface UserTaskStatus {
  task_id: number
  status: TaskStatusValue
}
