import type { CollectionConfig } from 'payload'

export const Pupils: CollectionConfig = {
  slug: 'pupils',
  admin: {
    useAsTitle: 'Vorname',
  },
  access: {
    read: ({ req: { user } }) => {
      // Admins können alle Schüler sehen
      if (user?.role === 'admin') return true
      // Schüler können nur ihre eigenen Daten sehen
      if (user) {
        return {
          user: {
            equals: user.id,
          },
        }
      }
      return false
    },
    create: ({ req: { user } }) => user?.role === 'admin',
    update: ({ req: { user } }) => user?.role === 'admin',
    delete: ({ req: { user } }) => user?.role === 'admin',
  },
  fields: [
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      hasMany: false,
      unique: true,
      admin: {
        description: 'Verknüpfung zum Benutzer-Konto',
      },
    },
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
      name: 'Klasse',
      type: 'relationship',
      relationTo: 'class',
      required: true,
      hasMany: false,
    },
  ],
}
