'use server'

import { taskProgressRepository } from '@/lib/data/repositories/task-progress.repository'
import { getCurrentUser } from '@/lib/data/payload-client'
import type { TaskStatusValue } from '@/domain/constants/task-status.constants'

/**
 * Update task progress status for the current user
 * @param taskId - The task ID
 * @param status - The new status to set
 * @returns Success status and error message if any
 */
export async function updateTaskProgress(
  taskId: number,
  userId: number,
  status: TaskStatusValue,
): Promise<{ success: boolean; error?: string }> {
  try {
    await taskProgressRepository.createOrUpdate({
      user: userId,
      task: taskId,
      status,
    })

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
