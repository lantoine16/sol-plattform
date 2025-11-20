import { userRepository } from '../data/repositories/user.repository'
import { taskRepository } from '../data/repositories/task.repository'
import { taskProgressRepository } from '../data/repositories/task-progress.repository'
import { Task } from '@/payload-types'
import { parseBulkData } from '@/domain/utils/parse-bulk-data.util'

export interface BulkTaskCreateOptions {
  bulkData: string
  subject: string
  learningGroup?: string[] | null
  user?: string[] | null
}

/**
 * Verarbeitet Bulk-Erstellung von Tasks aus einem mehrzeiligen Text.
 * Erstellt ALLE Tasks aus dem bulkData (jede Zeile = ein Task).
 * Jede Task erhält die gleichen Werte für subject, learningGroup, user.
 * Der afterChange Hook wird automatisch für jede erstellte Task ausgeführt und erstellt die TaskProgress-Einträge.
 *
 * @param options - Optionen für die Bulk-Task-Erstellung
 * @returns Array der erstellten Task-IDs oder leeres Array, wenn keine Daten vorhanden sind
 */
export async function processBulkTaskCreate({
  bulkData,
  subject,
  learningGroup,
  user,
}: BulkTaskCreateOptions): Promise<Task[]> {
  // Teile die Eingabe in Zeilen auf und filtere leere Zeilen
  const taskDescriptions = parseBulkData(bulkData)

  if (taskDescriptions.length === 0) {
    return []
  }

  const createdTasks = await taskRepository.createTasks({
    description: taskDescriptions,
    subject,
    learningGroups: learningGroup,
    users: user,
  })

  const userIds = await getUsersFromLearningGroupsAndUsers(learningGroup, user)

  const createdTaskProgresses = await taskProgressRepository.createTaskProgresses({
    user: userIds,
    task: createdTasks.map((task) => task.id),
  })

  // Gib die IDs der erstellten Tasks zurück
  return createdTasks
}

export async function updateTaskProgressesForTask(task: Task): Promise<void> {
  // Normalisiere learningGroup: extrahiere IDs aus LearningGroup-Objekten
  // task.learningGroup ist immer ein Array oder null/undefined
  const learningGroupIds: string[] | null | undefined = task.learningGroup
    ? task.learningGroup.map((lg) => (typeof lg === 'string' ? lg : lg.id))
    : null

  // Normalisiere user: extrahiere IDs aus User-Objekten
  // task.user ist immer ein Array oder null/undefined
  const userIds: string[] | null | undefined = task.user
    ? task.user.map((u) => (typeof u === 'string' ? u : u.id))
    : null

  //userIds von den ausgewählten Schülern und den Schülern aus den Lerngruppen
  const allUserIdsArrayToAssignToTask = await getUsersFromLearningGroupsAndUsers(
    learningGroupIds,
    userIds,
  )

  //für diese Schüler existiert ein Aufgabenfortschritt
  const existingTaskProgresses = await taskProgressRepository.findByUserAndTask([task.id])
  const userIdsWithExistingTaskProgresses = existingTaskProgresses?.map((taskProgress) =>
    typeof taskProgress.user === 'string' ? taskProgress.user : taskProgress.user.id,
  )

  //für diese Schüler muss ein Aufgabenfortschritt erstellt werden
  const userIdsWithoutExistingTaskProgresses = allUserIdsArrayToAssignToTask?.filter(
    (userId) => !userIdsWithExistingTaskProgresses?.includes(userId),
  )
  //für diese Schüler muss der Aufgabenfortschritt gelöscht werden
  const userIdsWithTaskProgressToDelete = userIdsWithExistingTaskProgresses?.filter(
    (userId) => !allUserIdsArrayToAssignToTask?.includes(userId),
  )
  if (userIdsWithoutExistingTaskProgresses?.length > 0) {
    await taskProgressRepository.createTaskProgresses({
      user: userIdsWithoutExistingTaskProgresses,
      task: [task.id],
    })
  }
  if (userIdsWithTaskProgressToDelete && userIdsWithTaskProgressToDelete?.length > 0) {
    await taskProgressRepository.deleteTaskProgresses(userIdsWithTaskProgressToDelete, [task.id])
  }
}

export async function getUsersFromLearningGroupsAndUsers(
  learningGroup: string[] | string | null | undefined,
  user: string[] | string | null | undefined,
): Promise<string[]> {
  // Sammle alle UserIDs sodass diese dann zur Erstellen der Aufgabenfortschritte verwendet werden können
  const userIdsSet = new Set<string>()

  if (learningGroup) {
    const learningGroupIds = Array.isArray(learningGroup) ? learningGroup : [learningGroup]
    const usersFromGroups = await userRepository.findByLearningGroups(learningGroupIds)
    usersFromGroups.forEach((userDoc) => {
      if (userDoc?.id) {
        userIdsSet.add(userDoc.id)
      }
    })
  }

  if (user) {
    const userArray = Array.isArray(user) ? user : [user]
    userArray.forEach((userId) => {
      if (userId) {
        userIdsSet.add(userId)
      }
    })
  }

  const userIds = Array.from(userIdsSet)
  return userIds
}
