import type { CollectionSlug, PayloadRequest } from 'payload'
import { getPayloadClient } from '@/lib/data/payload-client'

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
