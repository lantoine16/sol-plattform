import { taskProgressRepository } from '@/lib/data/repositories/task-progress.repository'
import { taskRepository } from '@/lib/data/repositories/task.repository'

export class LearningLevelService {
  /**
   * Entfernt Lernlevel aus allen Aufgaben und Aufgabenfortschritten.
   * Wird aufgerufen wenn ein oder mehrere Lernlevel gelöscht werden.
   */
  async removeLearningLevelsFromTasksAndProgress(levelIds: string[]): Promise<void> {
    await Promise.all([
      taskProgressRepository.clearLearningLevels(levelIds),
      taskRepository.removeLearningLevels(levelIds),
    ])
  }
}

export const learningLevelService = new LearningLevelService()
