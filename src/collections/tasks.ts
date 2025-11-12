import type { CollectionConfig } from 'payload'
import type { Task } from '@/payload-types'
import { getPayloadClient } from '@/lib/data/payload-client'
import { TASK_STATUS_OPTIONS } from '@/domain/constants/task-status.constants'

export const Tasks: CollectionConfig = {
  slug: 'tasks',
  labels: {
    singular: 'Aufgabe',
    plural: 'Aufgaben',
  },
  admin: {
    useAsTitle: 'description',
  },
  hooks: {
    afterChange: [
      async ({ doc, operation }: { doc: Task; operation: string }): Promise<Task> => {
        // doc ist jetzt typisiert als Task
        if (operation !== 'create' && operation !== 'update') {
          return doc
        }

        const payload = await getPayloadClient()
        const taskId = doc.id

        // Sammle alle Schüler-IDs in einem Set (vermeidet Duplikate)
        const userIds = new Set<string>()

        // 1. Direkt ausgewählte Schüler hinzufügen (sind IDs im Hook)
        if (doc.user) {
          const userArray = Array.isArray(doc.user) ? doc.user : [doc.user]
          userArray.forEach((userId) => {
            if (userId) {
              userIds.add(userId as string)
            }
          })
        }

        // 2. Schüler aus Lerngruppen hinzufügen
        if (doc.learningGroup) {
          const learningGroupIds = Array.isArray(doc.learningGroup)
            ? (doc.learningGroup as string[])
            : ([doc.learningGroup] as string[])

          // Hole alle Schüler aus allen Lerngruppen parallel
          if (learningGroupIds.length > 0) {
            const usersFromGroups = await payload.find({
              collection: 'users',
              where: {
                learningGroup: {
                  in: learningGroupIds,
                },
              },
            })

            usersFromGroups.docs.forEach((user) => {
              userIds.add(user.id)
            })
          }
        }

        // 3. Prüfe, welche TaskProgress-Einträge bereits existieren (effizient in einer Query)
        const existingTaskProgress = await payload.find({
          collection: 'task-progress',
          where: {
            and: [
              {
                task: {
                  equals: taskId,
                },
              },
              {
                user: {
                  in: Array.from(userIds),
                },
              },
            ],
          },
        })

        const existingUserIds = new Set(existingTaskProgress.docs.map((tp) => tp.user as string))

        // 4. Erstelle nur für User ohne bestehenden Eintrag (parallel für maximale Effizienz)
        const usersToCreate = Array.from(userIds).filter((userId) => !existingUserIds.has(userId))

        if (usersToCreate.length > 0) {
          const createPromises = usersToCreate.map((userId) =>
            payload.create({
              collection: 'task-progress',
              data: {
                user: userId,
                task: taskId,
                status: TASK_STATUS_OPTIONS[0].value,
                helpNeeded: false,
              },
            }),
          )

          // Warte auf alle parallelen Erstellungen
          await Promise.all(createPromises)
        }

        return doc
      },
    ],
    afterDelete: [
      async ({ doc, id }) => {
        const payload = await getPayloadClient()
        const taskId = doc?.id || id

        // Finde alle TaskProgress-Einträge für diese Aufgabe
        const taskProgressEntries = await payload.find({
          collection: 'task-progress',
          where: {
            task: {
              equals: taskId,
            },
          },
          limit: 10000, // Ausreichend groß für alle Einträge
        })

        // Lösche alle TaskProgress-Einträge parallel
        if (taskProgressEntries.docs.length > 0) {
          const deletePromises = taskProgressEntries.docs.map((tp) =>
            payload.delete({
              collection: 'task-progress',
              id: tp.id,
            }),
          )

          await Promise.all(deletePromises)
        }

        return doc
      },
    ],
  },
  fields: [
    {
      name: 'description',
      label: 'Bezeichnung',
      type: 'text',
      required: true,
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
