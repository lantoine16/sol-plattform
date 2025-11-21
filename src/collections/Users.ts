import type { CollectionConfig } from 'payload'
import { USER_ROLE_OPTIONS, USER_ROLE_DEFAULT_VALUE } from '@/domain/constants/user-role.constants'
import { updateTaskProgressesForUser } from '@/lib/services/create-users.service'
import { User } from '@/payload-types'
import { taskProgressRepository } from '@/lib/data/repositories/task-progress.repository'
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
    // Überschreibe username Feld um unique und required zu setzen
    //TODO: Klappt noch nicht wirklich, unique nimmt er nicht
    {
      name: 'username',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        condition: (data) => {
          // Nur beim Bearbeiten anzeigen (wenn ID vorhanden)
          const hasId = data?.id || data?.createdAt || data?.updatedAt
          return hasId
        },
      },
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
  hooks: {
    //TODO: Eigentlich sollte das mit unique:true im users klappen, das hier nur workaround, checken warum das anderen nicht funktioniert
    //Prüft ob username unique ist
    beforeChange: [
      async ({ data, req, operation, originalDoc }) => {
        // Prüfe nur wenn data und username gesetzt sind
        if (!data || !data.username) {
          return data
        }

        // Suche nach anderen Benutzern mit dem gleichen Benutzernamen
        const existingUser = await req.payload.find({
          collection: 'users',
          where: {
            username: {
              equals: data.username,
            },
          },
          limit: 1,
        })

        // Wenn ein Benutzer gefunden wurde
        if (existingUser.docs.length > 0) {
          const foundUser = existingUser.docs[0]

          // Beim Update: Erlaube es, wenn es derselbe Benutzer ist
          if (operation === 'update' && originalDoc && foundUser.id === originalDoc.id) {
            return data
          }

          // Beim Create oder Update zu einem anderen Benutzer: Fehler werfen
          throw new Error(`Der Benutzername "${data.username}" ist bereits vergeben.`)
        }

        return data
      },
    ],
    afterOperation: [
      async ({ operation, result }) => {
        if (operation === 'updateByID') {
          // Im afterChange Hook sollte data.id verfügbar sein
          const user = result as User
          await updateTaskProgressesForUser(user)
          //redirect(`/collections/tasks/${task.id}`)
        } else if (operation === 'update') {
          Promise.all(
            result.docs.map((user) => {
              return updateTaskProgressesForUser(user as User)
            }),
          )
        } else if (operation === 'delete') {
          Promise.all(
            result.docs.map((user) => {
              return taskProgressRepository.deleteTaskProgressesByUser(user.id)
            }),
          )
        } else if (operation === 'deleteByID') {
          const user = result as User
          await taskProgressRepository.deleteTaskProgressesByUser(user.id)
        }
      },
    ],
  }
}
