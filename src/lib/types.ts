/**
 * View/DTO types for application presentation layer
 * These types transform domain entities into view-optimized formats
 */
import type { TaskStatusValue } from '@/domain/constants/task-status.constants'

export interface UserWithTasks {
  userId: string
  firstname: string
  lastname: string
  tasks: UserTaskStatus[]
}

export interface UserTaskStatus {
  taskId: string
  status: TaskStatusValue
  helpNeeded?: boolean
  searchPartner?: boolean
}
