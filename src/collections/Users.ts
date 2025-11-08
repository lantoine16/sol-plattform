import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  labels: {
    singular: 'Benutzer',
    plural: 'Benutzer',
  },
  admin: {
    useAsTitle: 'firstname',
  },
  auth: true,
  fields: [
    {
      name: 'firstname',
      label: 'Vorname',
      type: 'text',
      required: true,
    },
    {
      name: 'lastname',
      label: 'Nachname',
      type: 'text',
      required: true,
    },
    {
      name: 'email',
      label: 'E-Mail',
      type: 'email',
      required: false,
      unique: true,
    },
    {
      name: 'class',
      label: 'Klasse',
      type: 'relationship',
      hasMany: true,
      relationTo: 'classes',
      required: false,
    },
    // Email added by default
    // Add more fields as needed
    {
      name: 'role',
      label: 'Rolle',
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
        {
          label: 'Lehrer',
          value: 'teacher',
        },
      ],
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
