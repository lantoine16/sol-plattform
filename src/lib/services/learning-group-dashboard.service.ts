import { learningGroupRepository } from '../data/repositories/learning-group.repository'
import { subjectRepository } from '../data/repositories/subject.repository'
import { taskRepository } from '../data/repositories/task.repository'
import { userRepository } from '../data/repositories/user.repository'
import { taskProgressRepository } from '../data/repositories/task-progress.repository'
import type { UserGraduationValue } from '@/domain/constants/user-graduation.constants'
import type { LearningGroup, Subject, TaskProgress, Task } from '@/payload-types'

export interface UserWithTaskProgressInformation {
  userId: string
  firstname: string
  lastname: string
  graduation: UserGraduationValue
  learningLocationDescription?: string | null
  amountOfNotStartedTasks: number
  amountOfFinishedTasks: number
  progressTasksNames: string[]
  needHelpTasksNames: string[]
  searchPartnerTasksNames: string[]
}

// Type Guard: Prüft ob task ein Task-Objekt ist
function isTaskObject(task: string | Task): task is Task {
  return typeof task === 'object' && task !== null && 'id' in task
}

export class LearningGroupDashboardService {
  /**
   * Get all learning groups and subjects for the learning group dashboard
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
   * Get users with processed task progress data for the learning group dashboard
   * Users are fetched with depth 2 to resolve TaskProgress relationships
   */
  async getUsersWithTaskProgress(
    learningGroupId: string | undefined,
    subjectIds: string[],
  ): Promise<UserWithTaskProgressInformation[]> {
    if (!learningGroupId) {
      return []
    }

    // Fetch users with depth 2 to resolve TaskProgress relationships
    const users = await userRepository.findPupilsByLearningGroup(learningGroupId, { depth: 1 })

    // Get task progress entries for users and subjects with depth 2
    // Bei depth: 2 ist task immer ein Task-Objekt, nicht nur eine ID
    const taskProgressEntries = await taskProgressRepository.findByUsersAndSubject(
      users.map((u) => u.id),
      subjectIds,
      { depth: 2 },
    )

    // Process each user
    return users.map((user) => {
      // Find all task progress entries for this user
      const userTaskProgress = taskProgressEntries.filter((tp) => {
        const taskUserId = typeof tp.user === 'object' ? tp.user?.id : tp.user
        return taskUserId === user.id
      })

      // Process task statuses
      const taskStatuses = {
        notStarted: 0,
        inProgress: [] as string[],
        finished: 0,
        needHelp: [] as string[],
        searchPartner: [] as string[],
      }

      userTaskProgress.forEach((tp) => {
        const status = tp.status as 'not-started' | 'in-progress' | 'finished'

        // Bei depth: 2 ist tp.task immer ein Task-Objekt
        if (!isTaskObject(tp.task)) {
          // Fallback falls doch nur eine ID zurückkommt (sollte nicht passieren)
          return
        }

        const task = tp.task as Task

        if (status === 'not-started') {
          taskStatuses.notStarted++
        } else if (status === 'in-progress') {
          if (task.description) {
            taskStatuses.inProgress.push(task.description)
          }
        } else if (status === 'finished') {
          taskStatuses.finished++
        }

        if (tp.helpNeeded && task.description) {
          taskStatuses.needHelp.push(task.description)
        }

        if (tp.searchPartner && task.description) {
          taskStatuses.searchPartner.push(task.description)
        }
      })

      // Get learning location description
      let learningLocationDescription: string | null = null
      if (user.learningLocation) {
        if (typeof user.learningLocation === 'object' && user.learningLocation !== null) {
          learningLocationDescription = user.learningLocation.description || null
        }
      }

      return {
        userId: user.id,
        firstname: user.firstname || '',
        lastname: user.lastname || '',
        graduation: user.graduation as UserGraduationValue,
        learningLocationDescription,
        amountOfNotStartedTasks: taskStatuses.notStarted,
        amountOfFinishedTasks: taskStatuses.finished,
        progressTasksNames: taskStatuses.inProgress,
        needHelpTasksNames: taskStatuses.needHelp,
        searchPartnerTasksNames: taskStatuses.searchPartner,
      }
    })
  }
}

export const learningGroupDashboardService = new LearningGroupDashboardService()
