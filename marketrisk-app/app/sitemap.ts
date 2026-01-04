import { MetadataRoute } from 'next'
import { getBlogPosts, getDocumentation } from '@/lib/cms/payload'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_URL || 'https://www.marketrisk.ro'

  // Fetch blog posts and documentation from PayloadCMS (Romanian only for sitemap)
  let blogPosts: any[] = []
  let docPages: any[] = []

  try {
    const [blogResult, docsResult] = await Promise.all([
      getBlogPosts('ro', 100), // Fetch all published blog posts
      getDocumentation(undefined, 'ro'), // Fetch all documentation
    ])
    blogPosts = blogResult.docs || []
    docPages = docsResult.docs || []
  } catch (error) {
    // If CMS not available yet, return static pages only
    console.warn('CMS not available for sitemap generation:', error)
  }

  // Static pages (Romanian and English)
  const staticPagesRo: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/ro`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
      alternates: {
        languages: {
          en: `${baseUrl}/en`,
        },
      },
    },
    {
      url: `${baseUrl}/ro/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
      alternates: {
        languages: {
          en: `${baseUrl}/en/about`,
        },
      },
    },
    {
      url: `${baseUrl}/ro/pricing`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
      alternates: {
        languages: {
          en: `${baseUrl}/en/pricing`,
        },
      },
    },
    {
      url: `${baseUrl}/ro/faq`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
      alternates: {
        languages: {
          en: `${baseUrl}/en/faq`,
        },
      },
    },
    {
      url: `${baseUrl}/ro/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
      alternates: {
        languages: {
          en: `${baseUrl}/en/contact`,
        },
      },
    },
    {
      url: `${baseUrl}/ro/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
      alternates: {
        languages: {
          en: `${baseUrl}/en/blog`,
        },
      },
    },
    {
      url: `${baseUrl}/ro/docs`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
      alternates: {
        languages: {
          en: `${baseUrl}/en/docs`,
        },
      },
    },
    {
      url: `${baseUrl}/ro/privacy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
      alternates: {
        languages: {
          en: `${baseUrl}/en/privacy`,
        },
      },
    },
    {
      url: `${baseUrl}/ro/terms`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
      alternates: {
        languages: {
          en: `${baseUrl}/en/terms`,
        },
      },
    },
  ]

  // Blog post pages (Romanian with English alternates)
  const blogPages: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `${baseUrl}/ro/blog/${post.slug}`,
    lastModified: new Date(post.updatedAt || post.createdAt),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
    alternates: {
      languages: {
        en: `${baseUrl}/en/blog/${post.slug}`,
      },
    },
  }))

  // Documentation pages (Romanian with English alternates)
  const docsPages: MetadataRoute.Sitemap = docPages.map((doc) => ({
    url: `${baseUrl}/ro/docs/${doc.slug}`,
    lastModified: new Date(doc.updatedAt || doc.createdAt),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
    alternates: {
      languages: {
        en: `${baseUrl}/en/docs/${doc.slug}`,
      },
    },
  }))

  return [...staticPagesRo, ...blogPages, ...docsPages]
}
