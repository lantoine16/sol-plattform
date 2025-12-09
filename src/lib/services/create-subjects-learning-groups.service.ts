import type { CollectionSlug } from 'payload'
import { parseBulkData } from '@/domain/utils/parse-bulk-data.util'
import { subjectRepository } from '@/lib/data/repositories/subject.repository'
import { learningGroupRepository } from '@/lib/data/repositories/learning-group.repository'

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
  if (collection === 'subjects') {
    return await subjectRepository.createBulk(itemNames)
  } else if (collection === 'learning-groups') {
    return await learningGroupRepository.createBulk(itemNames)
  }

  throw new Error(`Unsupported collection: ${collection}`)
}
