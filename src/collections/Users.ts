import type { CollectionConfig } from 'payload'
import { USER_ROLE_OPTIONS, USER_ROLE_DEFAULT_VALUE } from '@/domain/constants/user-role.constants'

export const Users: CollectionConfig = {
  slug: 'users',
  labels: {
    singular: 'Benutzer',
    plural: 'Benutzer',
  },
  admin: {
    useAsTitle: 'firstname',
    components: {
      edit: {
        SaveButton: '@/components/payload/UsersSaveButton',
      },
    },
  },
  auth: {
    loginWithUsername: {
      allowEmailLogin: true,
      requireEmail: false,
    },
  },
  fields: [
    {
      name: 'hideAuthFields',
      type: 'ui',
      admin: {
        components: {
          Field: '@/components/payload/HideAuthFieldsOnCreate',
        },
        disableListColumn: true,
        condition: (data) => {
          // Nur auf der Create-Seite anzeigen (wenn keine ID vorhanden)
          const hasId = data?.id || data?.createdAt || data?.updatedAt
          return !hasId
        },
      },
    },
    {
      name: 'bulkCreate',
      type: 'ui',
      admin: {
        components: {
          Field: '@/components/payload/BulkGroupField#BulkUserField',
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
      name: 'firstname',
      label: 'Vorname',
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
      name: 'lastname',
      label: 'Nachname',
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
      name: 'learningGroup',
      label: 'Lerngruppe',
      type: 'relationship',
      hasMany: true,
      relationTo: 'learning-groups',
      required: false,
    },
    // Email added by default
    // Add more fields as needed
    {
      name: 'role',
      label: 'Rolle',
      type: 'select',
      required: true,
      defaultValue: USER_ROLE_DEFAULT_VALUE,
      options: [...USER_ROLE_OPTIONS],
    },

    {
      name: 'taskProgress',
      label: 'Aufgabenfortschritte',
      type: 'join',
      collection: 'task-progress',
      on: 'user',
      hasMany: true,
    },
  ],
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
}
