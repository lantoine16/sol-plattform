import { USER_ROLE_ADMIN } from '@/domain/constants/user-role.constants'
import type { CollectionConfig } from 'payload'

export const LearningLocations: CollectionConfig = {
  slug: 'learning-location',
  labels: {
    singular: 'Lernort',
    plural: 'Lernorte',
  },
  admin: {
    useAsTitle: 'description',
    components: {
      edit: {
        SaveButton: '@/components/payload/LearningLocationsSaveButton',
      },
    },
    hidden: ({ user }) => {
      return !(user?.role === USER_ROLE_ADMIN)
    },
  },
  fields: [
    {
      name: 'bulkCreate',
      type: 'ui',
      admin: {
        components: {
          Field: '@/components/payload/BulkGroupField#BulkLearningLocationField',
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
      required: false, // Wird im Hook validiert
      unique: true,
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
      name: 'users',
      label: 'Benutzer',
      type: 'join',
      collection: 'users',
      on: 'currentLearningLocation',
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
