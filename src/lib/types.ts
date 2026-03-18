/**
 * View/DTO types for application presentation layer
 * These types transform domain entities into view-optimized formats
 */
import type { TaskProgress, User } from '@/payload-types'

export interface UserWithTaskProgress {
  user: User
  taskProgresses: TaskProgress[]
}

export interface CreateTaskBlock {
  title: string
  description?: string
  learningLevels?: string[]
}

export interface CreateTaskData {
  blocks: Array<CreateTaskBlock>
  subject: string
  learningGroups?: string[] | null
  users?: string[] | null
}
