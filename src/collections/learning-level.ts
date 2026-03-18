import type { CollectionConfig } from 'payload'
import { USER_ROLE_ADMIN } from '@/domain/constants/user-role.constants'

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
