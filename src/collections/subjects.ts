import type { CollectionConfig } from 'payload'

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
      name: 'description',
      label: 'Bezeichnung',
      type: 'text',
      required: true,
      unique: true,
    }
  ],
}
