// Next.js metadata generation utilities with SEO, OpenGraph, and Twitter Cards
// Use these functions to generate metadata for pages

import type { Metadata } from 'next'
import type { BlogPost, Documentation } from '@/payload-types'

export interface MetadataOptions {
  title: string
  description: string
  keywords?: string[]
  image?: string
  url?: string
  locale?: 'ro' | 'en'
  type?: 'website' | 'article'
  publishedTime?: string
  modifiedTime?: string
  authors?: string[]
  section?: string
  noIndex?: boolean
}

/**
 * Get base URL from environment
 */
function getBaseUrl(): string {
  return process.env.NEXT_PUBLIC_URL || 'https://marketrisk.ro'
}

/**
 * Generate complete metadata object for Next.js pages
 */
export function generateMetadata(options: MetadataOptions): Metadata {
  const {
    title,
    description,
    keywords = [],
    image,
    url,
    locale = 'ro',
    type = 'website',
    publishedTime,
    modifiedTime,
    authors = ['MarketRisk'],
    section,
    noIndex = false,
  } = options

  const baseUrl = getBaseUrl()
  const fullUrl = url ? `${baseUrl}${url}` : baseUrl
  const ogImage = image ? `${baseUrl}${image}` : `${baseUrl}/logos/og-image.png`

  const metadata: Metadata = {
    title,
    description,
    keywords: keywords.length > 0 ? keywords : undefined,
    authors: authors.map((name) => ({ name })),
    creator: 'MarketRisk',
    publisher: 'MarketRisk',
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: fullUrl,
      languages: {
        ro: `${baseUrl}/ro${url || ''}`,
        en: `${baseUrl}/en${url || ''}`,
      },
    },
    openGraph: {
      type: type as 'website' | 'article',
      locale: locale === 'ro' ? 'ro_RO' : 'en_US',
      alternateLocale: locale === 'ro' ? 'en_US' : 'ro_RO',
      url: fullUrl,
      title,
      description,
      siteName: 'MarketRisk',
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
      creator: '@marketrisk',
    },
    robots: noIndex
      ? {
          index: false,
          follow: false,
        }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
          },
        },
  }

  // Add article-specific metadata
  if (type === 'article' && metadata.openGraph) {
    metadata.openGraph.type = 'article'
    metadata.openGraph.publishedTime = publishedTime
    metadata.openGraph.modifiedTime = modifiedTime
    metadata.openGraph.authors = authors
    metadata.openGraph.section = section
  }

  return metadata
}

/**
 * Generate metadata from PayloadCMS blog post
 */
export function generateBlogPostMetadata(
  post: BlogPost,
  locale: 'ro' | 'en' = 'ro'
): Metadata {
  const baseUrl = getBaseUrl()

  // Get localized content
  const title = typeof post.title === 'string' ? post.title : post.title?.[locale] || ''
  const excerpt = typeof post.excerpt === 'string' ? post.excerpt : post.excerpt?.[locale] || ''

  // Use SEO fields if provided, otherwise fall back to defaults
  const seoTitle =
    (typeof post.seoTitle === 'string' ? post.seoTitle : post.seoTitle?.[locale]) || title
  const seoDescription =
    (typeof post.seoDescription === 'string'
      ? post.seoDescription
      : post.seoDescription?.[locale]) || excerpt

  // Get image URL
  let imageUrl: string | undefined
  if (post.seoImage && typeof post.seoImage === 'object') {
    imageUrl = post.seoImage.url
  } else if (post.coverImage && typeof post.coverImage === 'object') {
    imageUrl = post.coverImage.url
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

  return generateMetadata({
    title: seoTitle,
    description: seoDescription,
    keywords: post.seoKeywords || [],
    image: imageUrl,
    url: `/${locale}/blog/${post.slug}`,
    locale,
    type: 'article',
    publishedTime: post.publishedAt || post.createdAt,
    modifiedTime: post.updatedAt,
    authors: [authorName],
    section: categoryName,
    noIndex: post.status !== 'published',
  })
}

/**
 * Generate metadata from PayloadCMS documentation
 */
export function generateDocumentationMetadata(
  doc: Documentation,
  locale: 'ro' | 'en' = 'ro'
): Metadata {
  const baseUrl = getBaseUrl()

  // Get localized content
  const title = typeof doc.title === 'string' ? doc.title : doc.title?.[locale] || ''
  const excerpt = typeof doc.excerpt === 'string' ? doc.excerpt : doc.excerpt?.[locale] || ''

  // Use SEO fields if provided
  const seoTitle =
    (typeof doc.seoTitle === 'string' ? doc.seoTitle : doc.seoTitle?.[locale]) || title
  const seoDescription =
    (typeof doc.seoDescription === 'string'
      ? doc.seoDescription
      : doc.seoDescription?.[locale]) || excerpt

  return generateMetadata({
    title: seoTitle,
    description: seoDescription,
    keywords: doc.seoKeywords || [],
    url: `/${locale}/docs/${doc.slug}`,
    locale,
    type: 'article',
    publishedTime: doc.createdAt,
    modifiedTime: doc.updatedAt,
    section: doc.category || undefined,
    noIndex: doc.status !== 'published',
  })
}

/**
 * Generate metadata for marketing pages (About, Pricing, etc.)
 */
export function generateMarketingPageMetadata(
  page: 'home' | 'about' | 'pricing' | 'contact' | 'faq' | 'privacy' | 'terms',
  locale: 'ro' | 'en' = 'ro'
): Metadata {
  const baseUrl = getBaseUrl()

  const content = {
    ro: {
      home: {
        title: 'MarketRisk - Analiză Riscuri de Credit pentru Companii Românești',
        description:
          'Platformă B2B pentru evaluarea riscurilor de credit ale companiilor din România. Date în timp real de la ANAF, BPI și Ministerul Justiției.',
        keywords: [
          'risc credit',
          'analiza companii',
          'rating companii',
          'date financiare romania',
          'riscuri business',
        ],
      },
      about: {
        title: 'Despre MarketRisk - Platforma de Analiză a Riscurilor',
        description:
          'Aflați cum MarketRisk vă ajută să luați decizii de business informate prin analiza completă a riscurilor companiilor românești.',
        keywords: ['despre marketrisk', 'platforma analiza', 'companii romania'],
      },
      pricing: {
        title: 'Prețuri și Planuri - MarketRisk',
        description:
          'Alegeți planul potrivit pentru afacerea dvs. De la €39/lună până la soluții enterprise personalizate.',
        keywords: ['prețuri', 'abonamente', 'planuri', 'tarife'],
      },
      contact: {
        title: 'Contact - MarketRisk',
        description:
          'Contactați echipa MarketRisk pentru întrebări, suport sau demonstrații personalizate.',
        keywords: ['contact', 'suport', 'demo', 'asistenta'],
      },
      faq: {
        title: 'Întrebări Frecvente - MarketRisk',
        description:
          'Răspunsuri la cele mai frecvente întrebări despre platforma MarketRisk, analiza riscurilor și funcționalități.',
        keywords: ['intrebari', 'ajutor', 'faq', 'ghid'],
      },
      privacy: {
        title: 'Politica de Confidențialitate - MarketRisk',
        description:
          'Politica de confidențialitate și protecția datelor MarketRisk, conform GDPR.',
        keywords: ['confidentialitate', 'gdpr', 'date personale'],
      },
      terms: {
        title: 'Termeni și Condiții - MarketRisk',
        description: 'Termenii și condițiile de utilizare a platformei MarketRisk.',
        keywords: ['termeni', 'conditii', 'contract'],
      },
    },
    en: {
      home: {
        title: 'MarketRisk - Credit Risk Analysis for Romanian Companies',
        description:
          'B2B platform for evaluating credit risks of Romanian companies. Real-time data from ANAF, BPI and Ministry of Justice.',
        keywords: [
          'credit risk',
          'company analysis',
          'business rating',
          'romania financial data',
          'business risks',
        ],
      },
      about: {
        title: 'About MarketRisk - Risk Analysis Platform',
        description:
          'Learn how MarketRisk helps you make informed business decisions through comprehensive analysis of Romanian companies.',
        keywords: ['about marketrisk', 'analysis platform', 'romanian companies'],
      },
      pricing: {
        title: 'Pricing & Plans - MarketRisk',
        description:
          'Choose the right plan for your business. From €39/month to custom enterprise solutions.',
        keywords: ['pricing', 'subscriptions', 'plans', 'rates'],
      },
      contact: {
        title: 'Contact - MarketRisk',
        description:
          'Contact MarketRisk team for questions, support or personalized demonstrations.',
        keywords: ['contact', 'support', 'demo', 'assistance'],
      },
      faq: {
        title: 'Frequently Asked Questions - MarketRisk',
        description:
          'Answers to the most common questions about MarketRisk platform, risk analysis and features.',
        keywords: ['questions', 'help', 'faq', 'guide'],
      },
      privacy: {
        title: 'Privacy Policy - MarketRisk',
        description: 'MarketRisk privacy policy and data protection, GDPR compliant.',
        keywords: ['privacy', 'gdpr', 'personal data'],
      },
      terms: {
        title: 'Terms and Conditions - MarketRisk',
        description: 'Terms and conditions of use of the MarketRisk platform.',
        keywords: ['terms', 'conditions', 'contract'],
      },
    },
  }

  const pageContent = content[locale][page]
  const url = page === 'home' ? `/${locale}` : `/${locale}/${page}`

  return generateMetadata({
    title: pageContent.title,
    description: pageContent.description,
    keywords: pageContent.keywords,
    url,
    locale,
    type: 'website',
  })
}

/**
 * Generate metadata for app dashboard pages
 */
export function generateDashboardMetadata(
  page: 'dashboard' | 'search' | 'watchlist' | 'alerts' | 'history' | 'settings',
  locale: 'ro' | 'en' = 'ro'
): Metadata {
  const content = {
    ro: {
      dashboard: {
        title: 'Dashboard - MarketRisk',
        description: 'Tabloul de bord cu companiile urmărite și alerte recente.',
      },
      search: {
        title: 'Căutare Companii - MarketRisk',
        description: 'Căutați și analizați orice companie din România.',
      },
      watchlist: {
        title: 'Lista de Urmărire - MarketRisk',
        description: 'Gestionați companiile pe care le urmăriți.',
      },
      alerts: {
        title: 'Alerte - MarketRisk',
        description: 'Notificări despre schimbări în riscurile companiilor.',
      },
      history: {
        title: 'Istoric Căutări - MarketRisk',
        description: 'Vedeți istoricul căutărilor dvs.',
      },
      settings: {
        title: 'Setări - MarketRisk',
        description: 'Configurați contul și preferințele dvs.',
      },
    },
    en: {
      dashboard: {
        title: 'Dashboard - MarketRisk',
        description: 'Dashboard with watched companies and recent alerts.',
      },
      search: {
        title: 'Search Companies - MarketRisk',
        description: 'Search and analyze any company in Romania.',
      },
      watchlist: {
        title: 'Watchlist - MarketRisk',
        description: 'Manage companies you are watching.',
      },
      alerts: {
        title: 'Alerts - MarketRisk',
        description: 'Notifications about changes in company risks.',
      },
      history: {
        title: 'Search History - MarketRisk',
        description: 'View your search history.',
      },
      settings: {
        title: 'Settings - MarketRisk',
        description: 'Configure your account and preferences.',
      },
    },
  }

  const pageContent = content[locale][page]

  return generateMetadata({
    title: pageContent.title,
    description: pageContent.description,
    url: `/${locale}/app/${page}`,
    locale,
    type: 'website',
    noIndex: true, // Don't index authenticated pages
  })
}
