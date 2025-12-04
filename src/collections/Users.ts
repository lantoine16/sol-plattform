import type { CollectionConfig } from 'payload'
import {
  USER_ROLE_OPTIONS,
  USER_ROLE_DEFAULT_VALUE,
  USER_ROLE_PUPIL,
  USER_ROLE_TEACHER,
  USER_ROLE_ADMIN,
} from '@/domain/constants/user-role.constants'
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
    hidden: ({ user }) => {
      return user?.role === USER_ROLE_PUPIL
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
      access: {
        update: ({ req }) => {
          const user = req.user
          if (!user) return false
          return user.role === USER_ROLE_ADMIN
        },
      },
      admin: {
        condition: (data) => {
          // Nur beim Bearbeiten anzeigen (wenn ID vorhanden)
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
      access: {
        update: ({ req }) => {
          const user = req.user
          if (!user) return false
          return user.role === USER_ROLE_ADMIN
        },
      },
      admin: {
        condition: (data) => {
          // Nur beim Bearbeiten anzeigen (wenn ID vorhanden)
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
      access: {
        update: ({ req }) => {
          const user = req.user
          if (!user) return false
          return user.role === USER_ROLE_ADMIN
        },
      },
    },
    {
      name: 'currentLearningLocation',
      label: 'Aktueller Lernort',
      type: 'relationship',
      relationTo: 'learning-location',
      required: false,
      access: {
        update: async ({ req, doc }) => {
          const user = req.user
          if (!user) return false

          // Admins und Lehrer können immer ändern
          if (user.role === USER_ROLE_ADMIN || user.role === USER_ROLE_TEACHER) {
            return true
          }

          // Schüler: Prüfe ob die Graduation das Ändern erlaubt
          if (user.role === USER_ROLE_PUPIL) {
            // Prüfe canChangeLearningLocation in der Graduation des Users
            // user.graduation kann eine ID oder ein populiertes Objekt sein
            const graduation = user.graduation

            if (!graduation) {
              return false // Keine Graduation = kein Recht
            }

            // Wenn es ein Objekt ist, prüfe direkt
            if (typeof graduation === 'object' && graduation !== null) {
              return graduation.canChangeLearningLocation === true
            }

            // Wenn es eine ID ist, lade die Graduation
            const graduationDoc = await req.payload.findByID({
              collection: 'graduations',
              id: graduation,
            })

            return graduationDoc?.canChangeLearningLocation === true
          }

          return false
        },
      },
    },
    // Überschreibe username Feld um unique und required zu setzen
    //TODO: Klappt noch nicht wirklich, unique nimmt er nicht
    {
      name: 'username',
      type: 'text',
      required: true,
      unique: true,
      access: {
        update: ({ req }) => {
          const user = req.user
          if (!user) return false
          return user.role === USER_ROLE_ADMIN
        },
      },
      admin: {
        condition: (data) => {
          // Nur beim Bearbeiten anzeigen (wenn ID vorhanden)
          const hasId = data?.id || data?.createdAt || data?.updatedAt
          return hasId
        },
      },
    },
    {
      name: 'password',
      label: 'Passwort',
      type: 'text',
      // Nicht required: true, da beim Update das Feld leer sein darf (Passwort bleibt dann unverändert)
      required: false,
      access: {
        update: ({ req, doc }) => {
          const user = req.user
          if (!user) return false

          // Admins können alle Passwörter ändern
          if (user.role === USER_ROLE_ADMIN) {
            return true
          }

          // Lehrer und Schüler können nur ihr eigenes Passwort ändern
          // doc ist das Dokument, das gerade bearbeitet wird
          return doc?.id === user.id
        },
      },
      //dieses Feld dient nur der Access-Control, daher hidden
      hidden: true,
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
      access: {
        update: ({ req }) => {
          const user = req.user
          if (!user) return false
          return user.role === USER_ROLE_ADMIN
        },
      },
    },
    {
      name: 'graduation',
      label: 'Graduierung',
      type: 'relationship',
      relationTo: 'graduations',
      required: false,
      access: {
        update: ({ req }) => {
          const user = req.user
          if (!user) return false
          return user.role === USER_ROLE_ADMIN || user.role === USER_ROLE_TEACHER
        },
      },
    },
    {
      name: 'defaultLearningLocation',
      label: 'Standardlernort',
      type: 'relationship',
      relationTo: 'learning-location',
      required: false,
      access: {
        update: ({ req }) => {
          const user = req.user
          if (!user) return false
          return user.role === USER_ROLE_ADMIN || user.role === USER_ROLE_TEACHER
        },
      },
    },
    {
      name: 'taskProgress',
      label: 'Aufgabenfortschritte',
      type: 'join',
      collection: 'task-progress',
      on: 'user',
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
      async ({ operation, result, req }) => {
        //Schüler können Lerngruppe nich updaten, daher müssen sie die TaskProgresses nicht updaten
        if (req.user?.role === USER_ROLE_PUPIL) {
          return
        }
        if (operation === 'updateByID') {
          // Im afterChange Hook sollte data.id verfügbar sein
          const user = result as User
          await updateTaskProgressesForUser(user)
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
  },
  access: {
    read: ({ req }) => {
      const user = req.user
      if (!user) return false
      if (user.role === USER_ROLE_ADMIN || user.role === USER_ROLE_TEACHER) {
        return true
      }
      if (user.role === USER_ROLE_PUPIL) {
        return {
          id: {
            equals: user.id,
          },
        }
      }
      return false
    },
    create: ({ req }) => {
      const user = req.user
      if (!user) return false
      return user.role === USER_ROLE_ADMIN
    },
    update: ({ req }) => {
      const user = req.user
      if (!user) return false

      // Admins und Lehrer können alle Nutzer updaten (Lehrer nur manche Felder )
      if (user.role === USER_ROLE_ADMIN || user.role === USER_ROLE_TEACHER) {
        return true
      }

      // Schüler können nur ihre eigenen Dokumente updaten
      if (user.role === USER_ROLE_PUPIL) {
        return { id: { equals: user.id } }
      }

      return false
    },
    delete: ({ req }) => {
      const user = req.user
      if (!user) return false
      return user.role === USER_ROLE_ADMIN
    },
    // Nur Admins können Benutzer entsperren (Force Unlock Button)
    unlock: ({ req }) => {
      const user = req.user
      if (!user) return false
      return user.role === USER_ROLE_ADMIN
    },
  },
}
