import type { CollectionConfig } from 'payload'
import { TASK_STATUS_OPTIONS } from '@/domain/constants/task-status.constants'
import {
  USER_ROLE_ADMIN,
  USER_ROLE_TEACHER,
  USER_ROLE_PUPIL,
} from '@/domain/constants/user-role.constants'
export const TaskProgress: CollectionConfig = {
  slug: 'task-progress',
  labels: {
    singular: 'Aufgabenfortschritt',
    plural: 'Aufgabenfortschritte',
  },
  admin: {
    useAsTitle: 'task',
    // Schüler können diese Collection im Admin-Panel nicht sehen
    hidden: ({ user }) => {
      return user?.role === USER_ROLE_PUPIL
    },
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
    {
      name: 'searchPartner',
      label: 'Schüler sucht Partner',
      type: 'checkbox',
      required: false,
    },
  ],
  access: {
    // Lesen: Schüler sehen nur ihre eigenen TaskProgress, Lehrer und Admins sehen alle
    read: ({ req }) => {
      const user = req.user
      if (!user) return false

      // Admins und Lehrer sehen alle TaskProgress
      if (user.role === USER_ROLE_ADMIN || user.role === USER_ROLE_TEACHER) {
        return true
      }

      // Schüler sehen nur ihre eigenen TaskProgress
      if (user.role === USER_ROLE_PUPIL) {
        return {
          user: {
            equals: user.id,
          },
        }
      }

      return false
    },

    // Erstellen: Nur Lehrer und Admins können neue Einträge erstellen
    create: ({ req }) => {
      const user = req.user
      if (!user) return false

      // Alle Rollen können erstellen
      return user.role === USER_ROLE_ADMIN || user.role === USER_ROLE_TEACHER
    },

    // Update: Schüler können nur ihre eigenen updaten, Lehrer und Admins alle
    update: ({ req }) => {
      const user = req.user
      if (!user) return false

      // Admins und Lehrer können alle TaskProgress updaten
      if (user.role === USER_ROLE_ADMIN || user.role === USER_ROLE_TEACHER) {
        return true
      }

      // Schüler können nur ihre eigenen TaskProgress updaten
      if (user.role === USER_ROLE_PUPIL) {
        return {
          user: {
            equals: user.id,
          },
        }
      }

      return false
    },

    // Löschen: Nur Admins und Lehrer können Einträge löschen
    delete: ({ req }) => {
      const user = req.user
      if (!user) return false
      return user.role === USER_ROLE_ADMIN || user.role === USER_ROLE_TEACHER
    },
  },
}
