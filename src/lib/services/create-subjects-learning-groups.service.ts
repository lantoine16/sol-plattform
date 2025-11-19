import type { CollectionSlug, PayloadRequest } from 'payload'
import { getPayloadClient } from '@/lib/data/payload-client'
import { parseBulkData } from '@/domain/utils/parse-bulk-data.util'

/**
 * Verarbeitet Bulk-Erstellung von Subjects oder LearningGroups aus einem mehrzeiligen Text.
 * Erstellt ALLE Einträge (jede Zeile = ein Eintrag).
 * Wird für Server Actions und Hooks verwendet.
 *
 * @returns Array der erstellten Dokumente oder leeres Array, wenn keine Daten vorhanden sind
 */
export async function processLearningGroupsSubjectBulkCreate({
  collection,
  bulkData,
  descriptionField,
}: {
  collection: CollectionSlug
  bulkData: string
  descriptionField: string
}): Promise<any[]> {
  // Teile die Eingabe in Zeilen auf und filtere leere Zeilen
  const itemNames = parseBulkData(bulkData)

  if (itemNames.length === 0) {
    return []
  }

  const payload = await getPayloadClient()

  // Erstelle alle Einträge parallel
  const createdItems = await Promise.all(
    itemNames.map((name) =>
      payload.create({
        collection,
        data: {
          [descriptionField]: name,
        },
      }),
    ),
  )

  return createdItems
}
