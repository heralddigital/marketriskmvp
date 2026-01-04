// PayloadCMS Configuration
import { buildConfig } from 'payload'
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { fileURLToPath } from 'url'

// Collections
import { Users } from './payload/collections/Users'
import { BlogPosts } from './payload/collections/BlogPosts'
import { Documentation } from './payload/collections/Documentation'
import { Media } from './payload/collections/Media'
import { Categories } from './payload/collections/Categories'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  // Admin configuration
  admin: {
    user: Users.slug,
    meta: {
      titleSuffix: '- MarketRisk CMS',
      favicon: '/logos/logo.svg',
      ogImage: '/og-image.png',
    },
  },

  // Collections (content types)
  collections: [
    Users,
    BlogPosts,
    Documentation,
    Media,
    Categories,
  ],

  // Database
  db: mongooseAdapter({
    url: process.env.DATABASE_URI || process.env.MONGODB_URI || '',
  }),

  // Rich text editor
  editor: lexicalEditor({}),

  // TypeScript
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },

  // Localization configuration
  localization: {
    locales: ['ro', 'en'],
    defaultLocale: 'ro',
    fallback: true,
  },

  // GraphQL
  graphQL: {
    schemaOutputFile: path.resolve(dirname, 'generated-schema.graphql'),
  },

  // Server URL
  serverURL: process.env.NEXT_PUBLIC_URL || 'http://localhost:3000',

  // CORS
  cors: [
    process.env.NEXT_PUBLIC_URL || 'http://localhost:3000',
  ].filter(Boolean),

  // CSRF protection
  csrf: [
    process.env.NEXT_PUBLIC_URL || 'http://localhost:3000',
  ].filter(Boolean),
})
