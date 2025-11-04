import { TaskProgress } from '@/payload-types'

// Interface für einen einzelnen Task-Status innerhalb eines Users
export interface UserTaskStatus {
  task_id: number
  status: TaskProgress['status']
}

// Interface für einen User mit seinen Tasks
export interface UserWithTasks {
  user_id: number
  firstname: string
  lastname: string
  tasks: UserTaskStatus[]
}
