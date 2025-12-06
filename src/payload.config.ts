// storage-adapter-import-placeholder
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { payloadCloudPlugin } from '@payloadcms/payload-cloud'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { de } from '@payloadcms/translations/languages/de'
import { Users } from './collections/Users'
import { LearningGroups } from './collections/learning-groups'
import { LearningLocations } from './collections/learning-location'
import { Subjects } from './collections/subjects'
import { Tasks } from './collections/tasks'
import { TaskProgress } from './collections/task-progress'
import { Graduations } from './collections/Graduations'
import { TitleDescriptionBlock } from './collections/blocks/title-description.block'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname, 'app/(payload)'),
    },
    // Custom Admin Layout Components
    components: {
      graphics: {
        Logo: '@/components/payload/Logo',
        Icon: '@/components/payload/Logo',
      },
      //actions: ['@/components/admin/FrontendLink'],
      beforeNavLinks: ['@/components/payload/CustomNavLinks'],
      afterLogin: ['@/components/payload/ImpressumLink'],
      // Nav: '@/components/CustomNav',
      views: {
        // Learning Group Dashboard - zeigt alle Schüler der ausgewählten Lerngruppe
        learningGroupDashboard: {
          Component: '@/components/pages/learning-group-dashboard',
          path: '/dashboard',
        },
        // Detailansicht - zeigt die Detailansicht für Lerngruppen im Admin-Bereich
        detailView: {
          Component: '@/components/pages/learning-group-details',
          path: '/detailView',
        },
        taskBoard: {
          Component: '@/components/pages/task-board-page',
          path: '/taskboard',
        },
      },
    },
    meta: {
      titleSuffix: ' - Lernjobmonitoring',
      icons: [
        { rel: 'icon', type: 'image/png', url: '/logo.png' },
        { rel: 'apple-touch-icon', type: 'image/png', url: '/logo.png' }, // für iOS when adding to home screen
        { rel: 'mask-icon', type: 'image/png', url: '/logo.png' }, // für Safari to mask the Admin Panel Icon
      ],
    },
  },
  routes: {
    admin: '/',
  },
  blocks: [TitleDescriptionBlock],
  collections: [
    Tasks,
    TaskProgress,
    Users,
    Subjects,
    Graduations,
    LearningGroups,
    LearningLocations,
  ],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: mongooseAdapter({
    url: process.env.DATABASE_URI || '',
  }),
  sharp,
  plugins: [
    payloadCloudPlugin(),
    // storage-adapter-placeholder
  ],
  i18n: {
    supportedLanguages: { de },
  },
})
