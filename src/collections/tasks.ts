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
      name: 'class',
      label: 'Klasse',
      type: 'relationship',
      relationTo: 'classes',
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
  ],
}
