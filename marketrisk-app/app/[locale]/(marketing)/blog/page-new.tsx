import { Metadata } from 'next'
import { getBlogPosts } from '@/lib/cms/payload'
import { generateMarketingPageMetadata } from '@/lib/seo/metadata'
import { BlogClient } from './BlogClient'

interface BlogIndexPageProps {
  params: Promise<{
    locale: 'ro' | 'en'
  }>
}

/**
 * Generate metadata for blog index page
 */
export async function generateMetadata({
  params,
}: BlogIndexPageProps): Promise<Metadata> {
  const { locale } = await params
  return generateMarketingPageMetadata('home', locale)
}

/**
 * Blog index page with SEO and PayloadCMS integration
 */
export default async function BlogIndexPage({ params }: BlogIndexPageProps) {
  const { locale } = await params

  // Fetch blog posts from PayloadCMS
  let posts: any[] = []
  let useFallback = false

  try {
    const result = await getBlogPosts(locale, 100) // Fetch up to 100 posts
    posts = result.docs || []
  } catch (error) {
    console.error('Error fetching blog posts from CMS:', error)
    useFallback = true
  }

  // Fallback to static data if CMS unavailable
  if (useFallback || posts.length === 0) {
    const { getAllBlogPosts } = await import('@/lib/data/blogPosts')
    const staticPosts = getAllBlogPosts()

    // Transform static posts to match CMS format
    posts = staticPosts.map((post) => ({
      id: post.slug,
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt,
      publishedAt: post.date,
      readingTime: parseInt(post.readingTime) || undefined,
      category: post.tag
        ? {
            name: post.tag,
            slug: post.tag.toLowerCase().replace(/\s+/g, '-'),
          }
        : undefined,
    }))
  } else {
    // Transform CMS posts to simplified format for client
    posts = posts.map((post) => {
      // Get localized content
      const title = typeof post.title === 'string' ? post.title : post.title?.[locale] || ''
      const excerpt = typeof post.excerpt === 'string' ? post.excerpt : post.excerpt?.[locale] || ''

      // Get category
      let category
      if (post.category && typeof post.category === 'object') {
        const catName = post.category.name
        const categoryName = typeof catName === 'string' ? catName : catName?.[locale] || ''
        category = {
          name: categoryName,
          slug: post.category.slug || '',
        }
      }

      return {
        id: post.id,
        slug: post.slug,
        title,
        excerpt,
        publishedAt: post.publishedAt || post.createdAt,
        readingTime: post.readingTime,
        category,
      }
    })
  }

  return <BlogClient posts={posts} locale={locale} />
}
