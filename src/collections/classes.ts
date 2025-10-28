import type { CollectionConfig } from 'payload'

export const Class: CollectionConfig = {
  slug: 'class',
  admin: {
    useAsTitle: 'Bezeichnung',
  },
  fields: [
    {
      name: 'Bezeichnung',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        condition: (data) => {
          // Nur beim Bearbeiten anzeigen (wenn ID vorhanden)
          return data?.id
        },
      },
    },
  ],
}
/*
{
  name: 'bulkCreate',
  type: 'ui',
  admin: {
    components: {
      Field: '@/components/BulkClassField',
    },
    disableListColumn: true,
    condition: (data) => {
      // Nur auf der Create-Seite anzeigen (wenn keine ID vorhanden)
      return !data?.id
    },
  },
},*/
