import type { CollectionConfig } from 'payload'

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
      name: 'description',
      label: 'Bezeichnung',
      type: 'text',
      required: true,
      unique: true,
      /*admin: {
        condition: (data) => {
          // Nur beim Bearbeiten anzeigen (wenn ID vorhanden)
          return data?.id
        },
      }, */
    },
    {
      name: 'isClass',
      label: 'Klasse',
      type: 'checkbox',
      defaultValue: false,
    },
  ],
}
/*
{
  name: 'bulkCreate',
  type: 'ui',
  admin: {
    components: {
      Field: '@/components/BulkLearningGroupField',
    },
    disableListColumn: true,
    condition: (data) => {
      // Nur auf der Create-Seite anzeigen (wenn keine ID vorhanden)
      return !data?.id
    },
  },
},*/

