import type { CollectionConfig } from 'payload'
import { processBulkCreate } from '@/lib/services/bulk-create.service'

export const LearningGroups: CollectionConfig = {
  slug: 'learning-groups',
  labels: {
    singular: 'Lerngruppe',
    plural: 'Lerngruppen',
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
          Field: '@/components/payload/BulkGroupField#BulkLearningGroupField',
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
            collection: 'learning-groups',
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
