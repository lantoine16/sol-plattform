import type { CollectionConfig } from 'payload'

export const LearningGroups: CollectionConfig = {
  slug: 'learning-groups',
  labels: {
    singular: 'Lerngruppe',
    plural: 'Lerngruppen',
  },
  admin: {
    useAsTitle: 'description',
    components: {
      edit: {
        SaveButton: '@/components/payload/LearningGroupsSaveButton',
      },
    },
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
          // Prüfe sowohl id als auch createdAt/updatedAt, da diese nur bei gespeicherten Dokumenten vorhanden sind
          const hasId = data?.id || data?.createdAt || data?.updatedAt
          return !hasId
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
          // Prüfe sowohl id als auch createdAt/updatedAt, da diese nur bei gespeicherten Dokumenten vorhanden sind
          const hasId = data?.id || data?.createdAt || data?.updatedAt
          return hasId
        },
      },
    },
  ],
}
