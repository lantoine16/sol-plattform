import type { CollectionConfig } from 'payload'

export const Pupils: CollectionConfig = {
  slug: 'pupils',
  admin: {
    useAsTitle: 'Vorname',
  },
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
      name: 'Klasse',
      type: 'relationship',
      relationTo: 'class',
      required: true,
      hasMany: false,
    },
  ],
}
