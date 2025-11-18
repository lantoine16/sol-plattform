import type { CollectionConfig } from 'payload'
import type { Task } from '@/payload-types'
import { UpdateTaskProgresses } from '@/lib/services/bulk-create.service'
import router from 'next/router'

export const Tasks: CollectionConfig = {
  slug: 'tasks',
  labels: {
    singular: 'Aufgabe',
    plural: 'Aufgaben',
  },
  admin: {
    useAsTitle: 'description',
    components: {
      edit: {
        SaveButton: '@/components/payload/TasksSaveButton',
      },
    },
  },
  hooks: {
    afterOperation: [
      async ({ operation, result ,req, collection, args }) => {
        console.log('operation', operation)
        if (operation === 'updateByID') {
          console.log('result', result)
          // Im afterChange Hook sollte data.id verfügbar sein
          const task = result as Task
          await UpdateTaskProgresses(task)
        }
        if (operation === 'update') {
          Promise.all(result.docs.map((task) => {
            return UpdateTaskProgresses(task as Task)
          }))
        }
      },
    ],
  },
  fields: [
    {
      name: 'bulkCreate',
      type: 'ui',
      admin: {
        components: {
          Field: '@/components/payload/BulkGroupField#BulkTaskField',
        },
        disableListColumn: true,
        condition: (data) => {
          // Nur auf der Create-Seite anzeigen (wenn keine ID vorhanden)
          // Prüfe sowohl id als auch createdAt/updatedAt, da diese nur bei gespeicherten Dokumenten vorhanden sind
          const hasId = data?.id || data?.createdAt || data?.updatedAt
          return !hasId
        },
      },
    },
    {
      name: 'description',
      label: 'Bezeichnung',
      type: 'text',
      required: true,
      admin: {
        condition: (data) => {
          // Nur beim Bearbeiten anzeigen (wenn ID vorhanden)
          // Prüfe sowohl id als auch createdAt/updatedAt, da diese nur bei gespeicherten Dokumenten vorhanden sind
          const hasId = data?.id || data?.createdAt || data?.updatedAt
          return hasId
        },
      },
    },
    {
      name: 'subject',
      label: 'Fach',
      type: 'relationship',
      relationTo: 'subjects',
      required: true,
    },
    {
      name: 'learningGroup',
      label: 'Lerngruppe',
      type: 'relationship',
      relationTo: 'learning-groups',
      required: false,
      hasMany: true,
    },
    {
      name: 'user',
      label: 'Schüler',
      type: 'relationship',
      relationTo: 'users',
      required: false,
      hasMany: true,
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
