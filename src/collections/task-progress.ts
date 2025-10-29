import type { CollectionConfig } from 'payload'

export const TaskProgress: CollectionConfig = {
  slug: 'task-progress',
  labels: {
    singular: 'Bearbeitungsstand',
    plural: 'Bearbeitungsstände',
  },
  admin: {
    useAsTitle: 'id',
  },
  fields: [
    {
      name: 'student',
      label: 'Schüler',
      type: 'relationship',
      relationTo: 'users',
      required: true,
    },
    {
      name: 'task',
      label: 'Aufgabe',
      type: 'relationship',
      relationTo: 'tasks',
      required: true,
    },
    {
      name: 'status',
      label: 'Status',
      type: 'select',
      required: true,
      options: [
        {
          label: 'Nicht begonnen',
          value: 'not-started',
        },
        {
          label: 'In Bearbeitung',
          value: 'in-progress',
        },
        {
          label: 'Benötige Hilfe',
          value: 'need-help',
        },
        {
          label: 'Fertig',
          value: 'finished',
        },
      ],
    },
    {
      name: 'note',
      label: 'Notiz',
      type: 'textarea',
      required: false,
    },
  ],
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
}
