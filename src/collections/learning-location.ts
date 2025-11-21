import type { CollectionConfig } from 'payload'

export const LearningLocations: CollectionConfig = {
  slug: 'learning-location',
  labels: {
    singular: 'Lernort',
    plural: 'Lernorte',
  },
  admin: {
    useAsTitle: 'description',
    components: {
      edit: {
        SaveButton: '@/components/payload/LearningLocationsSaveButton',
      },
    },
  },
  fields: [
    {
      name: 'bulkCreate',
      type: 'ui',
      admin: {
        components: {
          Field: '@/components/payload/BulkGroupField#BulkLearningLocationField',
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
    {
      name: 'users',
      label: 'Benutzer',
      type: 'join',
      collection: 'users',
      on: 'learningLocation',
      hasMany: true,
    },
  ],
}
