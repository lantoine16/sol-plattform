import type { CollectionConfig } from 'payload'
import { SUBJECT_COLOR_OPTIONS } from '@/domain/constants/subject-color.constants'
import { USER_ROLE_ADMIN } from '@/domain/constants/user-role.constants'

export const Subjects: CollectionConfig = {
  slug: 'subjects',
  labels: {
    singular: 'Fach',
    plural: 'Fächer',
  },
  admin: {
    useAsTitle: 'description',
    hidden: ({ user }) => {
      return !(user?.role === USER_ROLE_ADMIN)
    },
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
      return user.role === USER_ROLE_ADMIN
    },
    update: ({ req }) => {
      const user = req.user
      if (!user) return false
      return user.role === USER_ROLE_ADMIN
    },
    delete: ({ req }) => {
      const user = req.user
      if (!user) return false
      return user.role === USER_ROLE_ADMIN
    },
  },
}
