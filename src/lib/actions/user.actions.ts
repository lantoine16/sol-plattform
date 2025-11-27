'use server'

import { userRepository } from '@/lib/data/repositories/user.repository'

/**
 * Update the current learning location for a user
 * @param userId - The user ID
 * @param learningLocationId - The learning location ID (can be null to remove)
 * @returns Success status and error message if any
 */
export async function updateUserLearningLocation(
  userId: string,
  learningLocationId: string | null,
): Promise<{ success: boolean; error?: string }> {
  try {
    await userRepository.updateCurrentLearningLocation(userId, learningLocationId)

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

