import type { Block } from 'payload'

export const TitleDescriptionBlock: Block = {
  slug: 'title-description',
  labels: {
    singular: 'Aufgabe',
    plural: 'Aufgaben',
  },
  admin: {
    disableBlockName: true,
  },
  fields: [
    {
      name: 'title',
      label: 'Titel',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      label: 'Beschreibung',
      type: 'textarea',
      required: false,
    },
  ],
}
