import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
  },
  auth: true,
  fields: [
    {
      name: 'Vorname',
      type: 'text',
      required: true,
    },
    {
      name: 'Nachname',
      type: 'text',
      required: true,
    },
    {
      name: 'email',
      type: 'email',
      required: false,
      unique: true,
    },
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
