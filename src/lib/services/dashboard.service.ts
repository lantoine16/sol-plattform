import { classRepository } from '../data/repositories/class.repository'
import { subjectRepository } from '../data/repositories/subject.repository'
import { taskRepository } from '../data/repositories/task.repository'
import { userRepository } from '../data/repositories/user.repository'
import { taskProgressRepository } from '../data/repositories/task-progress.repository'
import type { UserWithTasks } from '../types'
import type { Task, Class, Subject } from '@/payload-types'

export interface UsersWithTasks {
  tasks: Task[]
  users: UserWithTasks[]
}

export interface UsersWithTasksFilter {
  classId?: number
  subjectId?: number
}

export class DashboardService {
  /**
   * Get all classes and subjects for the dashboard
   */
  async getClassesAndSubjects(): Promise<{
    classes: Class[]
    subjects: Subject[]
  }> {
    const [classes, subjects] = await Promise.all([
      classRepository.findAllSorted(),
      subjectRepository.findAllSorted(),
    ])

    return { classes, subjects }
  }

  /**
   * Get dashboard data based on filters
   */
  async getUsersWithTasks(filters: UsersWithTasksFilter): Promise<UsersWithTasks> {
    if (!filters.classId || !filters.subjectId) {
      return {
        tasks: [],
        users: [],
      }
    }

    // Fetch tasks and users in parallel
    const [tasks, users] = await Promise.all([
      taskRepository.findByClassAndSubject(filters.classId, filters.subjectId),
      userRepository.findPupilsByClass(filters.classId),
    ])

    // Fetch task progress data if we have users and tasks
    // depth: 2 löst Relationships 2 Ebenen tief auf (user und task werden als Objekte zurückgegeben, nicht nur IDs)
    const taskProgressData =
      users.length > 0 && tasks.length > 0
        ? await taskProgressRepository.findByUsersAndTasks(
            users.map((u) => u.id),
            tasks.map((t) => t.id),
            { depth: 2 },
          )
        : []

    // Transform data to UserWithTasks format
    const usersWithTasks: UserWithTasks[] = users.map((user) => {
      // Find all task-progress entries for this user
      const userTaskProgress = taskProgressData.filter((tp) => {
        const taskUserId = typeof tp.user === 'object' ? tp.user?.id : tp.user
        return taskUserId === user.id
      })

      // Transform to the desired structure
      const userTasks = userTaskProgress.map((tp) => {
        return {
          task_id: typeof tp.task === 'object' ? tp.task?.id : tp.task,
          status: tp.status as UserWithTasks['tasks'][0]['status'],
        }
      })

      return {
        user_id: user.id,
        firstname: user.firstname,
        lastname: user.lastname,
        tasks: userTasks,
      }
    })

    return {
      tasks,
      users: usersWithTasks,
    }
  }
}

export const dashboardService = new DashboardService()
