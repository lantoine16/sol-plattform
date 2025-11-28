import { USER_ROLE_ADMIN, USER_ROLE_PUPIL, USER_ROLE_TEACHER } from '@/domain/constants/user-role.constants'
import type { CollectionConfig } from 'payload'

export const Graduations: CollectionConfig = {
  slug: 'graduations',
  labels: {
    singular: 'Graduierung',
    plural: 'Graduierungen',
  },
  admin: {
    useAsTitle: 'description',
    hidden: ({ user }) => {
      return user?.role === USER_ROLE_PUPIL
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
      name: 'number',
      label: 'Zahl',
      type: 'number',
      required: true,
    },
    {
      name: 'canChangeLearningLocation',
      label: 'Darf Lernort wechseln',
      type: 'checkbox',
      defaultValue: false,
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
