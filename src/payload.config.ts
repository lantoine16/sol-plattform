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
      //actions: ['@/components/admin/FrontendLink'],
      beforeNavLinks: ['@/components/payload/CustomNavLinks'],
      // Nav: '@/components/CustomNav',
      views: {
        // Detailansicht - zeigt die Detailansicht für Lerngruppen im Admin-Bereich
        detailView: {
          Component: '@/components/pages/learning-group-details',
          path: '/detailView',
        },
      },
    },
  },
  routes: {
    admin: '/',
  },
  collections: [Users, LearningGroups, LearningLocations, Subjects, Tasks, TaskProgress],
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
