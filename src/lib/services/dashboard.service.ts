import { learningGroupRepository } from '../data/repositories/learning-group.repository'
import { subjectRepository } from '../data/repositories/subject.repository'
import { taskRepository } from '../data/repositories/task.repository'
import { userRepository } from '../data/repositories/user.repository'
import { taskProgressRepository } from '../data/repositories/task-progress.repository'
import type { UserWithTasks } from '../types'
import type { Task, LearningGroup, Subject } from '@/payload-types'

export interface UsersWithTasks {
  tasks: Task[]
  users: UserWithTasks[]
}

export interface UsersWithTasksFilter {
  learningGroupId?: string
  subjectId?: string
}

export class DashboardService {
  /**
   * Get all learning groups and subjects for the dashboard
   */
  async getLearningGroupsAndSubjects(): Promise<{
    learningGroups: LearningGroup[]
    subjects: Subject[]
  }> {
    const [learningGroups, subjects] = await Promise.all([
      learningGroupRepository.findAllSorted(),
      subjectRepository.findAllSorted(),
    ])

    return { learningGroups, subjects }
  }

  /**
   * Get dashboard data based on filters
   */
  async getUsersWithTasks(filters: UsersWithTasksFilter): Promise<UsersWithTasks> {
    if (!filters.learningGroupId || !filters.subjectId) {
      return {
        tasks: [],
        users: [],
      }
    }

    // Fetch tasks and users in parallel
    const [tasks, users] = await Promise.all([
      taskRepository.findByLearningGroupAndSubject(filters.learningGroupId, filters.subjectId),
      userRepository.findPupilsByLearningGroup(filters.learningGroupId),
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
          taskId: typeof tp.task === 'object' ? tp.task?.id : tp.task,
          status: tp.status as UserWithTasks['tasks'][0]['status'],
          helpNeeded: tp.helpNeeded ?? false,
          searchPartner: tp.searchPartner ?? false,
        }
      })

      return {
        userId: user.id,
        firstname: user.firstname || '',
        lastname: user.lastname || '',
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
