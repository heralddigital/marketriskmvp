// PayloadCMS helper functions for Next.js app
import config from '@payload-config'
import { getPayload as getPayloadClient } from 'payload'
import type { Payload } from 'payload'

// Cache the Payload instance
let cached: { client: Payload | null; promise: Promise<Payload> | null } = {
  client: null,
  promise: null,
}

/**
 * Get PayloadCMS instance (singleton pattern)
 * Use this in Server Components and API routes
 */
export async function getPayload(): Promise<Payload> {
  if (cached.client) {
    return cached.client
  }

  if (!cached.promise) {
    cached.promise = getPayloadClient({ config })
  }

  try {
    cached.client = await cached.promise
  } catch (e) {
    cached.promise = null
    throw e
  }

  return cached.client
}

/**
 * Fetch blog posts with filters
 * @param locale - Language (ro/en)
 * @param limit - Number of posts to fetch
 * @param category - Optional category filter
 */
export async function getBlogPosts(
  locale: 'ro' | 'en' = 'ro',
  limit: number = 10,
  category?: string
) {
  const payload = await getPayload()

  const result = await payload.find({
    collection: 'blog-posts',
    locale,
    depth: 2, // Include related data (author, category, etc.)
    limit,
    where: {
      ...(category && {
        'category.slug': {
          equals: category,
        },
      }),
      status: {
        equals: 'published',
      },
    },
    sort: '-publishedAt',
  })

  return result
}

/**
 * Fetch single blog post by slug
 */
export async function getBlogPost(slug: string, locale: 'ro' | 'en' = 'ro') {
  const payload = await getPayload()

  const result = await payload.find({
    collection: 'blog-posts',
    locale,
    depth: 2,
    where: {
      slug: {
        equals: slug,
      },
      status: {
        equals: 'published',
      },
    },
    limit: 1,
  })

  return result.docs[0] || null
}

/**
 * Fetch documentation by category
 */
export async function getDocumentation(
  category?: string,
  locale: 'ro' | 'en' = 'ro'
) {
  const payload = await getPayload()

  const result = await payload.find({
    collection: 'documentation',
    locale,
    depth: 1,
    where: {
      ...(category && {
        category: {
          equals: category,
        },
      }),
      status: {
        equals: 'published',
      },
    },
    sort: 'order',
  })

  return result
}

/**
 * Fetch single documentation page
 */
export async function getDocumentationPage(
  slug: string,
  locale: 'ro' | 'en' = 'ro'
) {
  const payload = await getPayload()

  const result = await payload.find({
    collection: 'documentation',
    locale,
    depth: 2,
    where: {
      slug: {
        equals: slug,
      },
      status: {
        equals: 'published',
      },
    },
    limit: 1,
  })

  return result.docs[0] || null
}

/**
 * Fetch all categories
 */
export async function getCategories(locale: 'ro' | 'en' = 'ro') {
  const payload = await getPayload()

  const result = await payload.find({
    collection: 'categories',
    locale,
    limit: 100,
  })

  return result
}

/**
 * Search blog posts and documentation
 */
export async function searchContent(
  query: string,
  locale: 'ro' | 'en' = 'ro',
  collections: ('blog-posts' | 'documentation')[] = ['blog-posts', 'documentation']
) {
  const payload = await getPayload()
  const results = []

  for (const collection of collections) {
    const result = await payload.find({
      collection,
      locale,
      where: {
        or: [
          {
            title: {
              contains: query,
            },
          },
          {
            excerpt: {
              contains: query,
            },
          },
          {
            content: {
              contains: query,
            },
          },
        ],
        status: {
          equals: 'published',
        },
      },
      limit: 10,
    })

    results.push(...result.docs)
  }

  return results
}
