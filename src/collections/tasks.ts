import { relationship } from 'node_modules/payload/dist/fields/validations'
import type { CollectionConfig } from 'payload'

export const Tasks: CollectionConfig = {
  slug: 'tasks',
  labels: {
    singular: 'Aufgabe',
    plural: 'Aufgaben',
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
    },
    {
      name: 'learningGroup',
      label: 'Lerngruppe',
      type: 'relationship',
      relationTo: 'learning-groups',
      required: true,
      hasMany: true,
    },
    {
      name: 'subject',
      label: 'Fach',
      type: 'relationship',
      relationTo: 'subjects',
      required: true,
    },
    {
      name: 'taskProgress',
      label: 'Aufgabenfortschritte',
      type: 'join',
      collection: 'task-progress',
      on: 'task',
      hasMany: true,
    },
  ],
}
