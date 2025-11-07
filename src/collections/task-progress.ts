import type { CollectionConfig } from 'payload'

const statusOptions = [
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
] as const

// Exportiere den Standard-Status-Wert 'not-started'
export const TASK_PROGRESS_DEFAULT_STATUS = statusOptions[0].label

// Funktion zum Konvertieren von Status-Wert zu Label
export const getStatusLabel = (value: string | null): string => {
  if (!value) return TASK_PROGRESS_DEFAULT_STATUS
  const option = statusOptions.find((opt) => opt.value === value)
  return option?.label || TASK_PROGRESS_DEFAULT_STATUS
}

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
      options: [...statusOptions],
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
