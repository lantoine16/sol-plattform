import type { CollectionConfig } from 'payload'
import { USER_ROLE_ADMIN } from '@/domain/constants/user-role.constants'
import { learningLevelService } from '@/lib/services/learning-level.service'

export const LearningLevel: CollectionConfig = {
  slug: 'learning-levels',
  labels: {
    singular: 'Lernlevel',
    plural: 'Lernlevel',
  },
  admin: {
    useAsTitle: 'description',
    hidden: ({ user }) => {
      return !(user?.role === USER_ROLE_ADMIN)
    },
  },
  hooks: {
    afterOperation: [
      async ({ operation, result }) => {
        if (operation === 'deleteByID') {
          const level = result as { id: string }
          await learningLevelService.removeLearningLevelsFromTasksAndProgress([level.id])
        } else if (operation === 'delete') {
          const docs = (result as { docs: { id: string }[] }).docs
          await learningLevelService.removeLearningLevelsFromTasksAndProgress(
            docs.map((level) => level.id),
          )
        }
      },
    ],
  },
  fields: [
    {
      name: 'description',
      label: 'Bezeichnung',
      type: 'text',
      required: true,
      unique: true,
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
