import { learningGroupRepository } from '../data/repositories/learning-group.repository'
import { subjectRepository } from '../data/repositories/subject.repository'
import { taskRepository } from '../data/repositories/task.repository'
import { SetLearningLocationsOptions, userRepository } from '../data/repositories/user.repository'
import { taskProgressRepository } from '../data/repositories/task-progress.repository'
import type { LearningGroup, Subject, Task, Graduation, TaskProgress } from '@/payload-types'
import type { User } from '@/payload-types'
export interface UserWithTaskProgressInformation {
  user: User
  taskProgresses: TaskProgress[]
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
  getLearngingGroupsFilterValues(
    searchParams: Record<string, string | string[] | undefined>,
    learningGroupSearchParamName: string,
    learningGroups: LearningGroup[],
  ): string | undefined {
    // Get selected learning group ID
    const learningGroupParam = searchParams[learningGroupSearchParamName]
    const selectedLearningGroupId =
      typeof learningGroupParam === 'string' && learningGroupParam !== ''
        ? learningGroupParam
        : Array.isArray(learningGroupParam) && learningGroupParam.length > 0
          ? learningGroupParam[0]
          : learningGroups[0]?.id

    return selectedLearningGroupId
  }

  getSubjectFilterValues(
    searchParams: Record<string, string | string[] | undefined>,
    subjectSearchParamName: string,
    subjects: Subject[],
  ): string[] {
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
    return selectedSubjectIds
  }
  /**
   * Get users with processed task progress data for the learning group dashboard
   * Users are fetched with depth 2 to resolve TaskProgress and graduation relationships
   */
  async getUsersWithTaskProgress(
    learningGroupId: string | undefined,
    subjectIds: string[],
  ): Promise<{
    users: UserWithTaskProgressInformation[]
    taskProgressIds: string[]
    userDefaultLearningLocationIds: SetLearningLocationsOptions[]
  }> {
    if (!learningGroupId) {
      return { users: [], taskProgressIds: [], userDefaultLearningLocationIds: [] }
    }

    // Fetch users with depth 2 to resolve TaskProgress and graduation relationships
    const users = await userRepository.findPupilsByLearningGroup(learningGroupId, { depth: 2 })

    // Get task progress entries for users and subjects with depth 2
    // Bei depth: 2 ist task immer ein Task-Objekt, nicht nur eine ID
    const taskProgressEntries = await taskProgressRepository.findByUsersAndSubject(
      users.map((u) => u.id),
      subjectIds,
      { depth: 2 },
    )

    const taskProgress = new Set<string>()
    let userDefaultLearningLocationIds: SetLearningLocationsOptions[] = []

    // Process each user
    const usersWithTaskProgressInformation: UserWithTaskProgressInformation[] = users.map(
      (user) => {
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
          taskProgress.add(tp.id)
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
            if (task.title) {
              taskStatuses.inProgress.push(task.title)
            }
          } else if (status === 'finished') {
            taskStatuses.finished++
          }

          if (tp.helpNeeded && task.title) {
            taskStatuses.needHelp.push(task.title)
          }

          if (tp.searchPartner && task.title) {
            taskStatuses.searchPartner.push(task.title)
          }
        })

        // Get learning location description
        let learningLocationDescription: string | null = null
        if (user.currentLearningLocation) {
          if (
            typeof user.currentLearningLocation === 'object' &&
            user.currentLearningLocation !== null
          ) {
            learningLocationDescription = user.currentLearningLocation.description || null
          }
        }

        // Get graduation number
        let graduationNumber = 1
        let graduationId = ''
        if (user.graduation) {
          if (typeof user.graduation === 'object' && user.graduation !== null) {
            const graduation = user.graduation as Graduation
            graduationId = graduation.id
            graduationNumber = graduation.number || 1
          } else if (typeof user.graduation === 'string') {
            graduationId = user.graduation
          }
        }

        userDefaultLearningLocationIds.push({
          userId: user.id,
          learningLocationId:
            typeof user.defaultLearningLocation === 'object'
              ? user.defaultLearningLocation?.id || ''
              : '',
        })

        return {
          user: user,
          amountOfNotStartedTasks: taskStatuses.notStarted,
          amountOfFinishedTasks: taskStatuses.finished,
          progressTasksNames: taskStatuses.inProgress,
          needHelpTasksNames: taskStatuses.needHelp,
          searchPartnerTasksNames: taskStatuses.searchPartner,
          taskProgresses: userTaskProgress,
        }
      },
    )

    return {
      users: usersWithTaskProgressInformation,
      taskProgressIds: Array.from(taskProgress),
      userDefaultLearningLocationIds: userDefaultLearningLocationIds,
    }
  }
}

export const learningGroupDashboardService = new LearningGroupDashboardService()
