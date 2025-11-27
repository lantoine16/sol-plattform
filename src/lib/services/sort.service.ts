import type { Task } from '@/payload-types'

export class SortService {
  /**
   * Sortiert Tasks zuerst nach Fachname (alphabetisch), dann nach Updatedatum (aufsteigend)
   * @param tasks - Array von Tasks, die sortiert werden sollen
   * @returns Sortiertes Array von Tasks
   */
  static sortTasksBySubjectAndDate(tasks: Task[]): Task[] {
    return [...tasks].sort((a, b) => {
      // 1. Sortiere nach Fachname (alphabetisch)
      const subjectA = typeof a.subject === 'object' ? a.subject?.description || '' : ''
      const subjectB = typeof b.subject === 'object' ? b.subject?.description || '' : ''

      const subjectComparison = subjectA.localeCompare(subjectB, 'de', {
        sensitivity: 'base',
      })

      // Wenn die Fächer unterschiedlich sind, sortiere nach Fachname
      if (subjectComparison !== 0) {
        return subjectComparison
      }

      return a.description?.localeCompare(b.description || '', 'de', {
        sensitivity: 'base',
      }) || 0
    })
  }
}
