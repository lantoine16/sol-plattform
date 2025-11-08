import type { CollectionConfig } from 'payload'
import { TASK_STATUS_OPTIONS } from '@/domain/constants/task-status.constants'

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
      name: 'user',
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
      options: [...TASK_STATUS_OPTIONS],
    },
    {
      name: 'helpNeeded',
      label: 'Schüler benötigt Hilfe',
      type: 'checkbox',
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
