import type { CollectionConfig } from 'payload'
import { SUBJECT_COLOR_OPTIONS } from '@/domain/constants/subject-color.constants'

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
    },
    {
      name: 'color',
      label: 'Farbe',
      type: 'select',
      required: false,
      options: SUBJECT_COLOR_OPTIONS.map((option) => ({
        label: option.label,
        value: option.value,
      })),
    },
    {
      name: 'tasks',
      label: 'Aufgaben',
      type: 'join',
      collection: 'tasks',
      on: 'subject',
      hasMany: true,
    },
  ],
}
