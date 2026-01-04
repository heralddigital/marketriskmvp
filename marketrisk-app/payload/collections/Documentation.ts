import type { CollectionConfig } from 'payload'

export const Documentation: CollectionConfig = {
  slug: 'documentation',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'order', 'status'],
    group: 'Content',
  },
  access: {
    create: ({ req: { user } }) => {
      return user?.role === 'admin' || user?.role === 'editor'
    },
    read: ({ req: { user } }) => {
      // Public can read published docs
      if (user) return true
      return {
        status: {
          equals: 'published',
        },
      }
    },
    update: ({ req: { user } }) => {
      return user?.role === 'admin' || user?.role === 'editor'
    },
    delete: ({ req: { user } }) => {
      return user?.role === 'admin'
    },
  },
  versions: {
    drafts: true,
    maxPerDoc: 50, // More versions for docs (frequent updates)
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true,
      admin: {
        description: 'Documentation page title',
      },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'URL slug',
      },
      hooks: {
        beforeValidate: [
          ({ value, data }) => {
            if (!value && data?.title?.ro) {
              return data.title.ro
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '')
            }
            return value
          },
        ],
      },
    },
    {
      name: 'category',
      type: 'select',
      required: true,
      options: [
        {
          label: 'Getting Started',
          value: 'getting-started',
        },
        {
          label: 'API Reference',
          value: 'api',
        },
        {
          label: 'Risk Algorithm',
          value: 'risk-algorithm',
        },
        {
          label: 'Integration Guides',
          value: 'integration',
        },
        {
          label: 'Features',
          value: 'features',
        },
        {
          label: 'FAQ',
          value: 'faq',
        },
        {
          label: 'Troubleshooting',
          value: 'troubleshooting',
        },
      ],
      admin: {
        description: 'Documentation category',
      },
    },
    {
      name: 'order',
      type: 'number',
      required: true,
      defaultValue: 0,
      admin: {
        description: 'Display order within category (lower numbers appear first)',
        position: 'sidebar',
      },
    },
    {
      name: 'excerpt',
      type: 'textarea',
      localized: true,
      admin: {
        description: 'Short description for navigation/search',
      },
    },
    {
      name: 'content',
      type: 'richText',
      required: true,
      localized: true,
      admin: {
        description: 'Main documentation content (supports code blocks)',
      },
    },
    {
      name: 'codeExamples',
      type: 'array',
      label: 'Code Examples',
      fields: [
        {
          name: 'title',
          type: 'text',
          localized: true,
        },
        {
          name: 'language',
          type: 'select',
          options: [
            { label: 'JavaScript', value: 'javascript' },
            { label: 'TypeScript', value: 'typescript' },
            { label: 'JSON', value: 'json' },
            { label: 'Bash', value: 'bash' },
            { label: 'SQL', value: 'sql' },
            { label: 'Python', value: 'python' },
          ],
        },
        {
          name: 'code',
          type: 'code',
          required: true,
        },
        {
          name: 'description',
          type: 'textarea',
          localized: true,
        },
      ],
      admin: {
        description: 'Standalone code examples with syntax highlighting',
      },
    },
    {
      name: 'relatedDocs',
      type: 'relationship',
      relationTo: 'documentation',
      hasMany: true,
      admin: {
        description: 'Related documentation pages',
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'draft',
      options: [
        {
          label: 'Draft',
          value: 'draft',
        },
        {
          label: 'Published',
          value: 'published',
        },
        {
          label: 'Deprecated',
          value: 'deprecated',
        },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'lastUpdated',
      type: 'date',
      admin: {
        position: 'sidebar',
        readOnly: true,
      },
      hooks: {
        beforeChange: [
          () => {
            return new Date().toISOString()
          },
        ],
      },
    },
    // SEO fields
    {
      name: 'seo',
      type: 'group',
      label: 'SEO',
      fields: [
        {
          name: 'metaTitle',
          type: 'text',
          localized: true,
        },
        {
          name: 'metaDescription',
          type: 'textarea',
          localized: true,
        },
      ],
    },
  ],
}
