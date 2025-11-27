import { learningGroupRepository } from '../data/repositories/learning-group.repository'
import { subjectRepository } from '../data/repositories/subject.repository'
import type { Task, LearningGroup, Subject, TaskProgress } from '@/payload-types'


export interface UsersWithTasksFilter {
  learningGroupId?: string
  subjectId?: string
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
}
