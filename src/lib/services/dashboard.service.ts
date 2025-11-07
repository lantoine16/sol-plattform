import { classRepository } from '../data/repositories/class.repository'
import { subjectRepository } from '../data/repositories/subject.repository'
import { taskRepository } from '../data/repositories/task.repository'
import { userRepository } from '../data/repositories/user.repository'
import { taskProgressRepository } from '../data/repositories/task-progress.repository'
import type { UserWithTasks } from '../types'
import type { Task, Class, Subject } from '@/payload-types'

export interface DashboardData {
  classes: Class[]
  subjects: Subject[]
  tasks: Task[]
  users: UserWithTasks[]
}

export interface DashboardFilters {
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
   * Get default class and subject IDs
   */
  async getDefaultFilters(): Promise<{
    defaultClassId: number | undefined
    defaultSubjectId: number | undefined
  }> {
    const { classes, subjects } = await this.getClassesAndSubjects()
    return {
      defaultClassId: classes[0]?.id,
      defaultSubjectId: subjects[0]?.id,
    }
  }

  /**
   * Get dashboard data based on filters
   */
  async getDashboardData(filters: DashboardFilters): Promise<DashboardData> {
    const { classes, subjects } = await this.getClassesAndSubjects()

    if (!filters.classId || !filters.subjectId) {
      return {
        classes,
        subjects,
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
    const taskProgressData =
      users.length > 0 && tasks.length > 0
        ? await taskProgressRepository.findByStudentsAndTasks(
            users.map((u) => u.id),
            tasks.map((t) => t.id),
            { depth: 2 },
          )
        : []

    // Transform data to UserWithTasks format
    const usersWithTasks: UserWithTasks[] = users.map((user) => {
      // Find all task-progress entries for this user
      const userTaskProgress = taskProgressData.filter((tp) => {
        const studentId = typeof tp.student === 'object' ? tp.student?.id : tp.student
        return studentId === user.id
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
      classes,
      subjects,
      tasks,
      users: usersWithTasks,
    }
  }

  /**
   * Resolve class and subject IDs from search params
   */
  resolveFilters(
    searchParams: Record<string, string | string[] | undefined>,
    classes: Class[],
    subjects: Subject[],
  ): DashboardFilters {
    const classSearchParamName = 'class'
    const subjectSearchParamName = 'subject'

    const classId =
      typeof searchParams[classSearchParamName] === 'string'
        ? Number(searchParams[classSearchParamName])
        : classes[0]?.id

    const subjectId =
      typeof searchParams[subjectSearchParamName] === 'string'
        ? Number(searchParams[subjectSearchParamName])
        : subjects[0]?.id

    return {
      classId,
      subjectId,
    }
  }
}

export const dashboardService = new DashboardService()
