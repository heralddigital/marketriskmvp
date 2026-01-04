import type { CollectionConfig } from 'payload'

export const Categories: CollectionConfig = {
  slug: 'categories',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug', 'description'],
    group: 'Content',
  },
  access: {
    create: ({ req: { user } }) => {
      return user?.role === 'admin'
    },
    read: () => true,
    update: ({ req: { user } }) => {
      return user?.role === 'admin'
    },
    delete: ({ req: { user } }) => {
      return user?.role === 'admin'
    },
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      localized: true,
      admin: {
        description: 'Category name (e.g., "Credit Risk", "Business Intelligence")',
      },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'URL-friendly slug',
      },
      hooks: {
        beforeValidate: [
          ({ value, data }) => {
            if (!value && data?.name?.ro) {
              return data.name.ro
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
      name: 'description',
      type: 'textarea',
      localized: true,
      admin: {
        description: 'Category description',
      },
    },
    {
      name: 'color',
      type: 'select',
      options: [
        { label: 'Green', value: 'green' },
        { label: 'Pistachio', value: 'pistachio' },
        { label: 'Blue', value: 'blue' },
        { label: 'Yellow', value: 'yellow' },
        { label: 'Red', value: 'red' },
      ],
      admin: {
        description: 'Badge color for this category',
      },
    },
  ],
}
