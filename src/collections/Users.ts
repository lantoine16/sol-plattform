import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
  },
  auth: true,
  fields: [
    // Email added by default
    // Add more fields as needed
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'pupil',
      options: [
        {
          label: 'Admin',
          value: 'admin',
        },
        {
          label: 'Schüler',
          value: 'pupil',
        },
      ],
    },
  ],
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
}
