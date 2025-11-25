import { learningGroupRepository } from '../data/repositories/learning-group.repository'
import { subjectRepository } from '../data/repositories/subject.repository'
import { taskRepository } from '../data/repositories/task.repository'
import { userRepository } from '../data/repositories/user.repository'
import { taskProgressRepository } from '../data/repositories/task-progress.repository'
import type { UserWithTasks } from '../types'
import type { Task, LearningGroup, Subject, TaskProgress } from '@/payload-types'
import type { UserGraduationValue } from '@/domain/constants/user-graduation.constants'

export interface UsersWithTasks {
  tasks: Task[]
  users: UserWithTasks[]
}

export interface UsersWithTasksFilter {
  learningGroupId?: string
  subjectId?: string
}

export interface UserWithTaskProgress {
  userId: string
  firstname: string
  lastname: string
  graduation: UserGraduationValue
  learningLocation?: string | { id: string; description?: string | null } | null
  taskProgressEntries: TaskProgress[]
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
   * Get selected values from search params for learning groups and subjects
   */
  getSubjectAndLearngingGroupsFilterValues(
    searchParams: Record<string, string | string[] | undefined>,
    learningGroupSearchParamName: string,
    subjectSearchParamName: string,
    learningGroups: LearningGroup[],
    subjects: Subject[],
  ): {
    selectedLearningGroupId: string | undefined
    selectedSubjectIds: string[]
  } {
    // Get selected learning group ID
    const learningGroupParam = searchParams[learningGroupSearchParamName]
    const selectedLearningGroupId =
      typeof learningGroupParam === 'string' && learningGroupParam !== ''
        ? learningGroupParam
        : Array.isArray(learningGroupParam) && learningGroupParam.length > 0
          ? learningGroupParam[0]
          : learningGroups[0]?.id

    // Get selected subject IDs
    const subjectParam = searchParams[subjectSearchParamName]
    let selectedSubjectIds: string[]
    if (Array.isArray(subjectParam)) {
      // Wenn ein leerer String vorhanden ist, bedeutet das, dass alle abgewählt wurden
      if (subjectParam.includes('')) {
        selectedSubjectIds = []
      } else {
        selectedSubjectIds = subjectParam.filter((id) => id !== '' && id !== '0')
      }
    } else if (typeof subjectParam === 'string') {
      if (subjectParam === '') {
        selectedSubjectIds = []
      } else {
        selectedSubjectIds = [subjectParam]
      }
    } else {
      // Wenn keine Werte vorhanden sind, sind alle ausgewählt (Standard)
      selectedSubjectIds = subjects.map((subject) => subject.id)
    }

    return {
      selectedLearningGroupId,
      selectedSubjectIds,
    }
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
