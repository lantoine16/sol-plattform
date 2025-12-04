import type { CollectionConfig } from 'payload'
import type { Task } from '@/payload-types'
import { updateTaskProgressesForTask } from '@/lib/services/create-tasks.service'
import { taskProgressRepository } from '@/lib/data/repositories/task-progress.repository'
import {
  USER_ROLE_ADMIN,
  USER_ROLE_PUPIL,
  USER_ROLE_TEACHER,
} from '@/domain/constants/user-role.constants'
import { TitleDescriptionBlock } from './blocks/title-description.block'

export const Tasks: CollectionConfig = {
  slug: 'tasks',
  labels: {
    singular: 'Aufgabe',
    plural: 'Aufgaben',
  },
  admin: {
    useAsTitle: 'title',
    components: {
      edit: {
        SaveButton: '@/components/payload/TasksSaveButton',
      },
    },
    hidden: ({ user }) => {
      return user?.role === USER_ROLE_PUPIL
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
      name: 'taskBlocks',
      label: 'Titel und Beschreibung der Aufgaben',
      type: 'blocks',
      blocks: [TitleDescriptionBlock],
      defaultValue: () => [
        {
          blockType: 'title-description',
          title: '',
          description: '',
        },
      ],
      admin: {
        condition: (data) => {
          // Nur auf der Create-Seite anzeigen (wenn keine ID vorhanden)
          // Prüfe sowohl id als auch createdAt/updatedAt, da diese nur bei gespeicherten Dokumenten vorhanden sind
          const hasId = data?.id || data?.createdAt || data?.updatedAt
          return !hasId
        },
        initCollapsed: false,
        isSortable: false,
      },
      labels: {
        singular: 'Aufgabe',
        plural: 'Aufgaben',
      },
      minRows: 1,
      // Make this field not required for API operations
      required: false,
      virtual: true,
    },
    {
      name: 'title',
      label: 'Titel',
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
      name: 'description',
      label: 'Beschreibung',
      type: 'textarea',
      required: false,
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
      admin: {
        condition: (data) => {
          // Nur beim Bearbeiten anzeigen (wenn ID vorhanden)
          // Prüfe sowohl id als auch createdAt/updatedAt, da diese nur bei gespeicherten Dokumenten vorhanden sind
          const hasId = data?.id || data?.createdAt || data?.updatedAt
          return hasId
        },
      },
    },
  ],
  access: {
    read: () => {
      return true
    },
    create: ({ req }) => {
      const user = req.user
      if (!user) return false
      return user.role === USER_ROLE_ADMIN || user.role === USER_ROLE_TEACHER
    },
    update: ({ req }) => {
      const user = req.user
      if (!user) return false
      return user.role === USER_ROLE_ADMIN || user.role === USER_ROLE_TEACHER
    },
    delete: ({ req }) => {
      const user = req.user
      if (!user) return false
      return user.role === USER_ROLE_ADMIN || user.role === USER_ROLE_TEACHER
    },
  },
}
