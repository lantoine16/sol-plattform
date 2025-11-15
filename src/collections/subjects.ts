import type { CollectionConfig } from 'payload'
import { processBulkCreate } from '@/lib/services/bulk-create.service'

export const Subjects: CollectionConfig = {
  slug: 'subjects',
  labels: {
    singular: 'Fach',
    plural: 'Fächer',
  },
  admin: {
    useAsTitle: 'description',
  },
  fields: [
    {
      name: 'bulkCreate',
      type: 'ui',
      admin: {
        components: {
          Field: '@/components/payload/BulkGroupField#BulkSubjectField',
        },
        disableListColumn: true,
        condition: (data) => {
          // Nur auf der Create-Seite anzeigen (wenn keine ID vorhanden)
          return !data?.id
        },
      },
    },
    {
      name: 'description',
      label: 'Bezeichnung',
      type: 'text',
      required: false, // Wird im Hook validiert
      unique: true,
      admin: {
        condition: (data) => {
          // Nur beim Bearbeiten anzeigen (wenn ID vorhanden)
          return data?.id
        },
      },
    },
  ],
  hooks: {
    beforeChange: [
      async ({ data, operation, req }) => {
        // Nur bei Create-Operation und wenn bulkCreateData vorhanden ist
        if (operation === 'create' && data.bulkCreateData && !data.description) {
          const bulkData = data.bulkCreateData as string

          const firstItemName = await processBulkCreate({
            collection: 'subjects',
            bulkData,
            descriptionField: 'description',
            req,
          })

          // Setze das erste Element als description für das Hauptdokument
          if (firstItemName) {
            data.description = firstItemName
          }
        }
        return data
      },
    ],
  },
}
