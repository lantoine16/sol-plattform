import type { CollectionConfig } from 'payload'

export const Graduations: CollectionConfig = {
  slug: 'graduations',
  labels: {
    singular: 'Graduierung',
    plural: 'Graduierungen',
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
    },
    {
      name: 'number',
      label: 'Zahl',
      type: 'number',
      required: true,
    },
    {
      name: 'canChangeLearningLocation',
      label: 'Darf Lernort wechseln',
      type: 'checkbox',
      defaultValue: false,
    },
  ],
}

