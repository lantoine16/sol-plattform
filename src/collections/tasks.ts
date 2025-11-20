import type { CollectionConfig } from 'payload'
import type { Task } from '@/payload-types'
import { updateTaskProgressesForTask } from '@/lib/services/create-tasks.service'
import { taskProgressRepository } from '@/lib/data/repositories/task-progress.repository'
import { redirect } from 'next/navigation'
import { RedirectType } from 'next/dist/client/components/redirect-error'
import { revalidatePath } from 'next/cache'

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
      async ({ operation, result }) => {
        if (operation === 'updateByID') {
          // Im afterChange Hook sollte data.id verfügbar sein
          const task = result as Task
          await updateTaskProgressesForTask(task)
          //redirect(`/collections/tasks/${task.id}`)
        } else if (operation === 'update') {
          Promise.all(
            result.docs.map((task) => {
              return updateTaskProgressesForTask(task as Task)
            }),
          )
        } else if (operation === 'delete') {
          Promise.all(
            result.docs.map((task) => {
              return taskProgressRepository.deleteTaskProgressesByTask(task.id)
            }),
          )
        } else if (operation === 'deleteByID') {
          const task = result as Task
          await taskProgressRepository.deleteTaskProgressesByTask(task.id)
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
