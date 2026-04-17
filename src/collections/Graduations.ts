import { USER_ROLE_ADMIN } from '@/domain/constants/user-role.constants'
import { COLOR_OPTIONS } from '@/domain/constants/color.constants'
import type { CollectionConfig } from 'payload'

export const Graduations: CollectionConfig = {
  slug: 'graduations',
  labels: {
    singular: 'Graduierung',
    plural: 'Graduierungen',
  },
  admin: {
    useAsTitle: 'description',
    defaultColumns: [
      'description',
      'abbreviation',
      'color',
      'canChangeLearningLocation',
      'updatedAt',
    ],
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
      name: 'abbreviation',
      label: 'Kürzel',
      type: 'text',
      required: true,
    },
    {
      name: 'color',
      label: 'Farbe',
      type: 'select',
      required: false,
      options: COLOR_OPTIONS.map((option) => ({
        label: option.label,
        value: option.value,
      })),
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
