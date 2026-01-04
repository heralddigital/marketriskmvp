// Schema.org structured data utilities for SEO
// Provides JSON-LD markup for better search engine understanding

import type { BlogPost, Documentation } from '@/payload-types'

export interface OrganizationSchema {
  '@context': 'https://schema.org'
  '@type': 'Organization'
  name: string
  url: string
  logo: string
  description: string
  address: {
    '@type': 'PostalAddress'
    addressCountry: string
  }
  contactPoint: {
    '@type': 'ContactPoint'
    contactType: string
    email: string
  }
  sameAs: string[]
}

export interface WebsiteSchema {
  '@context': 'https://schema.org'
  '@type': 'WebSite'
  name: string
  url: string
  description: string
  inLanguage: string[]
  potentialAction: {
    '@type': 'SearchAction'
    target: {
      '@type': 'EntryPoint'
      urlTemplate: string
    }
    'query-input': string
  }
}

export interface ArticleSchema {
  '@context': 'https://schema.org'
  '@type': 'Article' | 'BlogPosting' | 'TechArticle'
  headline: string
  description: string
  image?: string
  datePublished: string
  dateModified: string
  author: {
    '@type': 'Person' | 'Organization'
    name: string
  }
  publisher: OrganizationSchema
  inLanguage: string
  articleSection?: string
  keywords?: string[]
}

export interface BreadcrumbSchema {
  '@context': 'https://schema.org'
  '@type': 'BreadcrumbList'
  itemListElement: Array<{
    '@type': 'ListItem'
    position: number
    name: string
    item: string
  }>
}

export interface FAQSchema {
  '@context': 'https://schema.org'
  '@type': 'FAQPage'
  mainEntity: Array<{
    '@type': 'Question'
    name: string
    acceptedAnswer: {
      '@type': 'Answer'
      text: string
    }
  }>
}

/**
 * Generate Organization schema for MarketRisk
 */
export function getOrganizationSchema(locale: 'ro' | 'en' = 'ro'): OrganizationSchema {
  const baseUrl = process.env.NEXT_PUBLIC_URL || 'https://marketrisk.ro'

  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'MarketRisk',
    url: baseUrl,
    logo: `${baseUrl}/logos/logo.svg`,
    description:
      locale === 'ro'
        ? 'Platformă B2B pentru analiza riscurilor de credit ale companiilor din România'
        : 'B2B platform for analyzing credit risks of companies in Romania',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'RO',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer support',
      email: 'contact@marketrisk.ro',
    },
    sameAs: [
      // Add social media URLs when available
    ],
  }
}

/**
 * Generate Website schema for MarketRisk
 */
export function getWebsiteSchema(locale: 'ro' | 'en' = 'ro'): WebsiteSchema {
  const baseUrl = process.env.NEXT_PUBLIC_URL || 'https://marketrisk.ro'

  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'MarketRisk',
    url: baseUrl,
    description:
      locale === 'ro'
        ? 'Analiză completă a riscurilor de credit pentru companii românești'
        : 'Complete credit risk analysis for Romanian companies',
    inLanguage: ['ro', 'en'],
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${baseUrl}/${locale}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }
}

/**
 * Generate Article schema from PayloadCMS blog post
 */
export function getBlogPostSchema(
  post: BlogPost,
  locale: 'ro' | 'en' = 'ro'
): ArticleSchema {
  const baseUrl = process.env.NEXT_PUBLIC_URL || 'https://marketrisk.ro'
  const organization = getOrganizationSchema(locale)

  // Get localized content
  const title = typeof post.title === 'string' ? post.title : post.title?.[locale] || ''
  const excerpt = typeof post.excerpt === 'string' ? post.excerpt : post.excerpt?.[locale] || ''

  // Get cover image URL
  let imageUrl: string | undefined
  if (post.coverImage && typeof post.coverImage === 'object') {
    imageUrl = `${baseUrl}${post.coverImage.url}`
  }

  // Get author name
  let authorName = 'MarketRisk'
  if (post.author && typeof post.author === 'object' && 'name' in post.author) {
    authorName = post.author.name as string
  }

  // Get category name
  let categoryName: string | undefined
  if (post.category && typeof post.category === 'object' && 'name' in post.category) {
    const catName = post.category.name
    categoryName = typeof catName === 'string' ? catName : catName?.[locale]
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: title,
    description: excerpt,
    image: imageUrl,
    datePublished: post.publishedAt || post.createdAt,
    dateModified: post.updatedAt,
    author: {
      '@type': 'Person',
      name: authorName,
    },
    publisher: organization,
    inLanguage: locale,
    articleSection: categoryName,
    keywords: post.seoKeywords || undefined,
  }
}

/**
 * Generate TechArticle schema from PayloadCMS documentation
 */
export function getDocumentationSchema(
  doc: Documentation,
  locale: 'ro' | 'en' = 'ro'
): ArticleSchema {
  const baseUrl = process.env.NEXT_PUBLIC_URL || 'https://marketrisk.ro'
  const organization = getOrganizationSchema(locale)

  // Get localized content
  const title = typeof doc.title === 'string' ? doc.title : doc.title?.[locale] || ''
  const excerpt = typeof doc.excerpt === 'string' ? doc.excerpt : doc.excerpt?.[locale] || ''

  return {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: title,
    description: excerpt,
    datePublished: doc.createdAt,
    dateModified: doc.updatedAt,
    author: {
      '@type': 'Organization',
      name: 'MarketRisk',
    },
    publisher: organization,
    inLanguage: locale,
    articleSection: doc.category || undefined,
  }
}

/**
 * Generate Breadcrumb schema
 */
export function getBreadcrumbSchema(
  breadcrumbs: Array<{ name: string; href: string }>,
  locale: 'ro' | 'en' = 'ro'
): BreadcrumbSchema {
  const baseUrl = process.env.NEXT_PUBLIC_URL || 'https://marketrisk.ro'

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: `${baseUrl}${crumb.href}`,
    })),
  }
}

/**
 * Generate FAQ schema
 */
export function getFAQSchema(
  faqs: Array<{ question: string; answer: string }>
): FAQSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }
}

/**
 * Render JSON-LD script tag for embedding in Next.js pages
 */
export function renderJsonLd(schema: object): string {
  return JSON.stringify(schema, null, 2)
}

/**
 * Generate multiple schemas for a page
 */
export function combineSchemas(...schemas: object[]): object[] {
  return schemas
}
