import type { CollectionSlug, PayloadRequest } from 'payload'
import { getPayloadClient } from '@/lib/data/payload-client'
import { userRepository } from '../data/repositories/user.repository'
import { taskRepository } from '../data/repositories/task.repository'
import { taskProgressRepository } from '../data/repositories/task-progress.repository'
import { TaskProgress } from '@/payload-types'

type BulkCreateOptions = {
  collection: string
  bulkData: string
  descriptionField: string
  req: PayloadRequest
}

/**
 * Verarbeitet Bulk-Erstellung von Einträgen aus einem mehrzeiligen Text.
 * Das erste Element wird zurückgegeben, damit es als description für das Hauptdokument gesetzt werden kann.
 * Die restlichen Elemente werden parallel erstellt.
 *
 * @param options - Optionen für die Bulk-Erstellung
 * @returns Das erste Element aus der Liste (für das Hauptdokument) oder null, wenn keine Daten vorhanden sind
 */
export async function processBulkCreate({
  collection,
  bulkData,
  descriptionField,
  req,
}: BulkCreateOptions): Promise<string | null> {
  // Teile die Eingabe in Zeilen auf und filtere leere Zeilen
  const itemNames = bulkData
    .split('\n')
    .map((name) => name.trim())
    .filter((name) => name.length > 0)

  if (itemNames.length === 0) {
    return null
  }

  // Das erste Element wird für das Hauptdokument verwendet
  const firstItem = itemNames[0]
  const remainingItems = itemNames.slice(1)

  // Erstelle alle restlichen Einträge parallel
  if (remainingItems.length > 0) {
    const payload = await getPayloadClient()

    await Promise.all(
      remainingItems.map((name) =>
        payload.create({
          collection: collection as CollectionSlug,
          data: {
            [descriptionField]: name,
          },
          req,
        }),
      ),
    )
  }

  return firstItem
}

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
}: BulkTaskCreateOptions): Promise<TaskProgress[]> {

  // Teile die Eingabe in Zeilen auf und filtere leere Zeilen
  const taskDescriptions = bulkData
    .split('\n')
    .map((name) => name.trim())
    .filter((name) => name.length > 0)

  if (taskDescriptions.length === 0) {
    return []
  }

  const createdTasks = await taskRepository.createTasks({
    description: taskDescriptions,
    subject,
    learningGroups: learningGroup,
    users: user
  })


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


  const createdTaskProgresses = await taskProgressRepository.createTaskProgresses({
    user: userIds,
    task: createdTasks.map((task) => task.id),
  })

  // Gib die IDs der erstellten Tasks zurück
  return createdTaskProgresses
}
