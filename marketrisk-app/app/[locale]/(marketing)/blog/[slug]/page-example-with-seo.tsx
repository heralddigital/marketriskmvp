// EXAMPLE: Blog post page with full SEO implementation
// This demonstrates how to use all SEO utilities with PayloadCMS
// Copy this pattern to update the actual blog/[slug]/page.tsx

import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getBlogPost, getBlogPosts } from '@/lib/cms/payload'
import { generateBlogPostMetadata } from '@/lib/seo/metadata'
import {
  getBlogPostSchema,
  getOrganizationSchema,
  getWebsiteSchema,
} from '@/lib/seo/schema'
import { JsonLd } from '@/components/seo/JsonLd'
import { Breadcrumbs } from '@/components/seo/Breadcrumbs'

interface BlogPostPageProps {
  params: {
    locale: 'ro' | 'en'
    slug: string
  }
}

/**
 * Generate metadata for blog post (SEO, OpenGraph, Twitter Cards)
 * This function is called by Next.js to generate page metadata
 */
export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug, locale } = params

  try {
    const post = await getBlogPost(slug, locale)

    if (!post) {
      return {
        title: 'Post Not Found - MarketRisk',
        robots: {
          index: false,
          follow: false,
        },
      }
    }

    // Generate full metadata with OpenGraph and Twitter Cards
    return generateBlogPostMetadata(post, locale)
  } catch (error) {
    console.error('Error generating blog post metadata:', error)
    return {
      title: 'MarketRisk Blog',
    }
  }
}

/**
 * Generate static params for all blog posts (optional, for static generation)
 * Uncomment if you want to pre-render all blog posts at build time
 */
// export async function generateStaticParams() {
//   const [roPosts, enPosts] = await Promise.all([
//     getBlogPosts('ro', 100),
//     getBlogPosts('en', 100),
//   ])
//
//   return [
//     ...(roPosts.docs || []).map((post: any) => ({
//       locale: 'ro' as const,
//       slug: post.slug,
//     })),
//     ...(enPosts.docs || []).map((post: any) => ({
//       locale: 'en' as const,
//       slug: post.slug,
//     })),
//   ]
// }

/**
 * Blog post page component with full SEO
 */
export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug, locale } = params

  // Fetch blog post from PayloadCMS
  const post = await getBlogPost(slug, locale)

  if (!post) {
    notFound()
  }

  // Get localized content
  const title = typeof post.title === 'string' ? post.title : post.title?.[locale] || ''
  const excerpt =
    typeof post.excerpt === 'string' ? post.excerpt : post.excerpt?.[locale] || ''
  const content = typeof post.content === 'string' ? post.content : post.content?.[locale]

  // Generate Schema.org structured data
  const blogPostSchema = getBlogPostSchema(post, locale)
  const organizationSchema = getOrganizationSchema(locale)
  const websiteSchema = getWebsiteSchema(locale)

  // Get category name for breadcrumbs
  let categoryName = 'Blog'
  if (post.category && typeof post.category === 'object' && 'name' in post.category) {
    const catName = post.category.name
    categoryName = typeof catName === 'string' ? catName : catName?.[locale] || 'Blog'
  }

  // Breadcrumb items
  const breadcrumbs = [
    {
      name: locale === 'ro' ? 'Blog' : 'Blog',
      href: `/${locale}/blog`,
    },
    {
      name: categoryName,
      href: `/${locale}/blog?category=${post.category && typeof post.category === 'object' && 'slug' in post.category ? post.category.slug : ''}`,
    },
    {
      name: title,
      href: `/${locale}/blog/${slug}`,
    },
  ]

  return (
    <>
      {/* Schema.org JSON-LD structured data for SEO */}
      <JsonLd data={[blogPostSchema, organizationSchema, websiteSchema]} />

      {/* Breadcrumb navigation with schema */}
      <Breadcrumbs items={breadcrumbs} locale={locale} className="mb-6" />

      <article className="max-w-4xl mx-auto">
        {/* Article header */}
        <header className="mb-8">
          {/* Category and date */}
          <div className="flex items-center gap-3 mb-4">
            {post.category && typeof post.category === 'object' && 'name' in post.category && (
              <span className="text-sm font-medium text-[#2F5232] bg-[#8ACA74]/10 px-3 py-1 rounded-full">
                {categoryName}
              </span>
            )}
            <time
              dateTime={post.publishedAt || post.createdAt}
              className="text-sm text-gray-600"
            >
              {new Date(post.publishedAt || post.createdAt).toLocaleDateString(
                locale === 'ro' ? 'ro-RO' : 'en-US',
                {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                }
              )}
            </time>
            {post.readingTime && (
              <>
                <span className="text-gray-400">·</span>
                <span className="text-sm text-gray-600">
                  {post.readingTime}{' '}
                  {locale === 'ro' ? 'min citire' : 'min read'}
                </span>
              </>
            )}
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
            {title}
          </h1>

          {/* Excerpt */}
          <p className="text-xl text-gray-600 leading-relaxed">{excerpt}</p>

          {/* Author info */}
          {post.author && typeof post.author === 'object' && 'name' in post.author && (
            <div className="flex items-center gap-3 mt-6 pt-6 border-t border-gray-200">
              <div className="w-12 h-12 bg-[#2F5232] rounded-full flex items-center justify-center text-white font-semibold">
                {(post.author.name as string)
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .toUpperCase()
                  .slice(0, 2)}
              </div>
              <div>
                <p className="font-medium text-gray-900">{post.author.name as string}</p>
                <p className="text-sm text-gray-600">
                  {locale === 'ro' ? 'Autor' : 'Author'}
                </p>
              </div>
            </div>
          )}

          {/* Cover image */}
          {post.coverImage && typeof post.coverImage === 'object' && (
            <div className="mt-8 rounded-xl overflow-hidden">
              <img
                src={post.coverImage.url || ''}
                alt={
                  typeof post.coverImage.alt === 'string'
                    ? post.coverImage.alt
                    : post.coverImage.alt?.[locale] || title
                }
                className="w-full h-auto"
                loading="eager"
              />
            </div>
          )}
        </header>

        {/* Article content */}
        <div
          className="prose prose-lg max-w-none
            prose-headings:text-gray-900
            prose-h2:text-3xl prose-h2:font-bold prose-h2:mt-12 prose-h2:mb-4
            prose-h3:text-2xl prose-h3:font-semibold prose-h3:mt-8 prose-h3:mb-3
            prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-4
            prose-a:text-[#2F5232] prose-a:no-underline hover:prose-a:underline
            prose-strong:text-gray-900 prose-strong:font-semibold
            prose-ul:my-6 prose-li:text-gray-700
            prose-code:text-[#2F5232] prose-code:bg-gray-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded"
        >
          {/* Render Lexical content - you'll need to implement this based on Lexical's serializer */}
          {/* For now, showing placeholder */}
          <div dangerouslySetInnerHTML={{ __html: JSON.stringify(content, null, 2) }} />

          {/* TODO: Implement Lexical rich text renderer */}
          {/* Example: <LexicalRenderer content={content} /> */}
        </div>

        {/* Article footer with tags */}
        {post.seoKeywords && post.seoKeywords.length > 0 && (
          <footer className="mt-12 pt-8 border-t border-gray-200">
            <p className="text-sm font-medium text-gray-700 mb-3">
              {locale === 'ro' ? 'Cuvinte cheie' : 'Keywords'}
            </p>
            <div className="flex flex-wrap gap-2">
              {post.seoKeywords.map((keyword, index) => (
                <span
                  key={index}
                  className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </footer>
        )}

        {/* CTA Section */}
        <div className="mt-12 bg-gradient-to-br from-[#2F5232] to-[#1a2e1b] rounded-2xl p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-3">
            {locale === 'ro'
              ? 'Începeți monitorizarea riscurilor'
              : 'Start monitoring risks'}
          </h2>
          <p className="text-white/90 mb-6 max-w-2xl mx-auto">
            {locale === 'ro'
              ? 'Platformă completă pentru analiza riscurilor de credit ale companiilor românești'
              : 'Complete platform for analyzing credit risks of Romanian companies'}
          </p>
          <a
            href={`/${locale}/pricing`}
            className="inline-block bg-white text-[#2F5232] px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            {locale === 'ro' ? 'Vezi planurile' : 'View plans'}
          </a>
        </div>
      </article>
    </>
  )
}
