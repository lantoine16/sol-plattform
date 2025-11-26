'use server'

import { taskProgressRepository } from '@/lib/data/repositories/task-progress.repository'
import {
  userRepository,
  type SetLearningLocationsOptions,
} from '@/lib/data/repositories/user.repository'

/**
 * Reset user statuses (helpNeeded and searchPartner) and update learning locations
 * @param taskProgressIds - Array of task progress IDs to reset
 * @param userDefaultLearningLocationIds - Array of user learning location updates
 * @returns Success status and error message if any
 */
export async function resetUserStatuses(
  taskProgressIds: string[],
  userDefaultLearningLocationIds: SetLearningLocationsOptions[],
): Promise<{ success: boolean; error?: string }> {
  try {
    await taskProgressRepository.resetStatuses(taskProgressIds)
    await userRepository.setLearningLocations(userDefaultLearningLocationIds)

    return {
      success: true,
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    }
  }
}
