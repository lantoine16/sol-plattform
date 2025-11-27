'use server'

import { taskProgressRepository } from '@/lib/data/repositories/task-progress.repository'
import type { TaskStatusValue } from '@/domain/constants/task-status.constants'
import { getPayloadClient } from '@/lib/data/payload-client'
import type { TaskProgress } from '@/payload-types'

/**
 * Update task progress status for the current user
 * @param taskId - The task ID
 * @param status - The new status to set
 * @returns Success status and error message if any
 */
export async function updateTaskProgress(
  taskId: string,
  userId: string,
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

/**
 * Update helpNeeded flag for a task progress entry
 * @param taskId - The task ID
 * @param userId - The user ID
 * @param helpNeeded - The new helpNeeded value
 * @returns Success status and error message if any
 */
export async function updateTaskHelpNeeded(
  taskId: string,
  userId: string,
  helpNeeded: boolean,
): Promise<{ success: boolean; error?: string }> {
  try {
    const payload = await getPayloadClient()
    const existing = await taskProgressRepository.findByUserAndTask([taskId], [userId])

    if (existing && existing.length > 0) {
      await payload.update({
        collection: 'task-progress',
        id: existing[0].id,
        data: {
          helpNeeded,
        },
      })
    } else {
      // Create new entry if it doesn't exist
      await taskProgressRepository.createOrUpdate({
        user: userId,
        task: taskId,
        status: 'not-started',
      })
      // Update again with helpNeeded
      const created = await taskProgressRepository.findByUserAndTask([taskId], [userId])
      if (created && created.length > 0) {
        await payload.update({
          collection: 'task-progress',
          id: created[0].id,
          data: {
            helpNeeded,
          },
        })
      }
    }

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

/**
 * Update searchPartner flag for a task progress entry
 * @param taskId - The task ID
 * @param userId - The user ID
 * @param searchPartner - The new searchPartner value
 * @returns Success status and error message if any
 */
export async function updateTaskSearchPartner(
  taskId: string,
  userId: string,
  searchPartner: boolean,
): Promise<{ success: boolean; error?: string }> {
  try {
    const payload = await getPayloadClient()
    const existing = await taskProgressRepository.findByUserAndTask([taskId], [userId])
    if (existing && existing.length > 0) {
      await payload.update({
        collection: 'task-progress',
        id: existing[0].id,
        data: {
          searchPartner,
        },
      })
    } else {
      // Create new entry if it doesn't exist
      await taskProgressRepository.createOrUpdate({
        user: userId,
        task: taskId,
        status: 'not-started',
      })
      // Update again with searchPartner
      const created = await taskProgressRepository.findByUserAndTask([taskId], [userId])
      if (created && created.length > 0) {
        await payload.update({
          collection: 'task-progress',
          id: created[0].id,
          data: {
            searchPartner,
          },
        })
      }
    }

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
export async function getTaskProgressEntries(
  userIds: string[],
  subjectIds: string[],
): Promise<TaskProgress[]> {
  return await taskProgressRepository.findByUsersAndSubject(userIds, subjectIds, { depth: 2 })
}
