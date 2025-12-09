import type { CollectionSlug } from 'payload'
import { parseBulkData } from '@/domain/utils/parse-bulk-data.util'
import { learningGroupRepository } from '@/lib/data/repositories/learning-group.repository'
import { learningLocationRepository } from '@/lib/data/repositories/learning-location.repository'
/**
 * Verarbeitet Bulk-Erstellung von Subjects oder LearningGroups aus einem mehrzeiligen Text.
 * Erstellt ALLE Einträge (jede Zeile = ein Eintrag).
 * Wird für Server Actions und Hooks verwendet.
 *
 * @returns Array der erstellten Dokumente oder leeres Array, wenn keine Daten vorhanden sind
 */
export async function processLearningGroupsLocationsBulkCreate({
  collection,
  bulkData,
}: {
  collection: CollectionSlug
  bulkData: string
}): Promise<any[]> {
  // Teile die Eingabe in Zeilen auf und filtere leere Zeilen
  const itemNames = parseBulkData(bulkData)

  if (itemNames.length === 0) {
    return []
  }

  // Verwende das entsprechende Repository basierend auf der Collection
  if (collection === 'learning-location') {
    return await learningLocationRepository.createBulk(itemNames)
  } else if (collection === 'learning-groups') {
    return await learningGroupRepository.createBulk(itemNames)
  }

  throw new Error(`Unsupported collection: ${collection}`)
}
