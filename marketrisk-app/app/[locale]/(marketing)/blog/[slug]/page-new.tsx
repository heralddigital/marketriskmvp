import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
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
  params: Promise<{
    locale: 'ro' | 'en'
    slug: string
  }>
}

/**
 * Generate metadata for blog post (SEO, OpenGraph, Twitter Cards)
 */
export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug, locale } = await params

  try {
    const post = await getBlogPost(slug, locale)

    if (!post) {
      return {
        title: locale === 'ro' ? 'Articol negăsit - MarketRisk' : 'Post Not Found - MarketRisk',
        robots: {
          index: false,
          follow: false,
        },
      }
    }

    return generateBlogPostMetadata(post, locale)
  } catch (error) {
    console.error('Error generating blog post metadata:', error)
    return {
      title: 'MarketRisk Blog',
    }
  }
}

function slugifyHeading(text: string) {
  return String(text || '')
    .trim()
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

/**
 * Blog post page component with full SEO
 */
export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug, locale } = await params

  // Fetch blog post from PayloadCMS
  let post
  try {
    post = await getBlogPost(slug, locale)
  } catch (error) {
    console.error('Error fetching blog post:', error)
    // Fall back to static data if CMS not available
    const { getBlogPostBySlug } = await import('@/lib/data/blogPosts')
    const staticPost = getBlogPostBySlug(slug)

    if (!staticPost) {
      notFound()
    }

    // Render static post (fallback mode)
    return renderStaticPost(staticPost, locale)
  }

  if (!post) {
    notFound()
  }

  // Get localized content
  const title = typeof post.title === 'string' ? post.title : post.title?.[locale] || ''
  const excerpt =
    typeof post.excerpt === 'string' ? post.excerpt : post.excerpt?.[locale] || ''

  // Get author info
  let authorName = 'MarketRisk'
  let authorRole = locale === 'ro' ? 'Editorial' : 'Editorial'
  let authorOrg = 'MarketRisk'
  let authorBio = locale === 'ro'
    ? 'Note practice despre raportare clară și panouri de control de încredere.'
    : 'Practical notes on clear reporting and trustworthy dashboards.'

  if (post.author && typeof post.author === 'object' && 'name' in post.author) {
    authorName = post.author.name as string
    // You can extend the User collection to include role, org, bio
  }

  const initials = authorName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((x) => x[0]?.toUpperCase())
    .join('')

  // Get category name
  let categoryName = locale === 'ro' ? 'Blog' : 'Blog'
  let categorySlug = ''
  if (post.category && typeof post.category === 'object' && 'name' in post.category) {
    const catName = post.category.name
    categoryName = typeof catName === 'string' ? catName : catName?.[locale] || 'Blog'
    categorySlug = (post.category as any).slug || ''
  }

  // Generate Schema.org structured data
  const blogPostSchema = getBlogPostSchema(post, locale)
  const organizationSchema = getOrganizationSchema(locale)
  const websiteSchema = getWebsiteSchema(locale)

  // Breadcrumb items
  const breadcrumbs = [
    {
      name: locale === 'ro' ? 'Blog' : 'Blog',
      href: `/${locale}/blog`,
    },
  ]

  if (categoryName !== 'Blog') {
    breadcrumbs.push({
      name: categoryName,
      href: `/${locale}/blog?category=${categorySlug}`,
    })
  }

  // Parse content sections (simplified - you'll need to implement Lexical renderer)
  // For now, showing placeholder structure
  const sections = [] // TODO: Parse from Lexical content

  // Get cover image
  let coverImageUrl: string | undefined
  let coverImageAlt = title
  if (post.coverImage && typeof post.coverImage === 'object') {
    coverImageUrl = post.coverImage.url
    coverImageAlt =
      typeof post.coverImage.alt === 'string'
        ? post.coverImage.alt
        : post.coverImage.alt?.[locale] || title
  }

  // Format date
  const publishDate = new Date(post.publishedAt || post.createdAt)
  const formattedDate = publishDate.toLocaleDateString(
    locale === 'ro' ? 'ro-RO' : 'en-US',
    {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }
  )

  const readingTimeText = post.readingTime
    ? `${post.readingTime} ${locale === 'ro' ? 'min citire' : 'min read'}`
    : ''

  return (
    <>
      {/* Schema.org JSON-LD structured data for SEO */}
      <JsonLd data={[blogPostSchema, organizationSchema, websiteSchema]} />

      <article className="space-y-8">
        {/* Back navigation */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href={`/${locale}/blog`}
              className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary transition-colors duration-normal"
            >
              <span aria-hidden="true">←</span>
              {locale === 'ro' ? 'Înapoi' : 'Back'}
            </Link>
            <div className="w-px h-5 bg-border-subtle" />
            <Link
              href={`/${locale}/blog`}
              className="text-sm text-brand-mughal-green hover:text-brand-mughal-green-2 transition-colors duration-normal"
            >
              {locale === 'ro' ? 'Toate articolele' : 'All articles'}
            </Link>
          </div>
          {readingTimeText && <span className="text-xs text-text-muted">{readingTimeText}</span>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[260px_minmax(0,1fr)] gap-6 items-start">
          {/* Left sidebar */}
          <aside className="hidden md:block sticky top-[96px] space-y-4">
            {/* Table of contents - TODO: Extract from Lexical content */}
            <div className="bg-white border border-border-subtle rounded-xl p-5">
              <p className="text-xs text-text-muted mb-3">
                {locale === 'ro' ? 'Pe această pagină' : 'On this page'}
              </p>
              <div className="space-y-2">
                <p className="text-sm text-text-secondary">
                  {locale === 'ro' ? 'Fără secțiuni' : 'No sections'}
                </p>
              </div>
            </div>

            {/* Author card */}
            <div className="bg-white border border-border-subtle rounded-xl p-5">
              <p className="text-xs text-text-muted mb-3">
                {locale === 'ro' ? 'Autor' : 'Author'}
              </p>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-brand-mughal-green rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-semibold text-white">{initials || 'MR'}</span>
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-text-primary truncate">{authorName}</p>
                  <p className="text-xs text-text-muted mt-0.5">
                    {authorRole} · {authorOrg}
                  </p>
                </div>
              </div>
              <p className="text-sm text-text-secondary mt-4 leading-relaxed">{authorBio}</p>
            </div>

            {/* CTA: Documentation */}
            <div className="bg-gradient-to-br from-brand-mughal-green/10 to-brand-mughal-green/5 border border-brand-mughal-green/20 rounded-xl p-5">
              <p className="text-xs text-brand-mughal-green mb-2 font-medium">
                {locale === 'ro' ? 'Află mai multe' : 'Learn more'}
              </p>
              <p className="text-sm font-semibold text-text-primary mb-2">
                {locale === 'ro' ? 'Documentație' : 'Documentation'}
              </p>
              <p className="text-xs text-text-secondary mb-4">
                {locale === 'ro'
                  ? 'Explorați ghidurile noastre despre monitorizarea riscurilor de credit.'
                  : 'Explore our guides on credit risk monitoring.'}
              </p>
              <Link
                href={`/${locale}/docs`}
                className="block w-full px-4 py-2 bg-brand-mughal-green text-white rounded-lg text-sm font-medium hover:bg-brand-mughal-green-2 transition-all duration-200 text-center"
              >
                {locale === 'ro' ? 'Vezi Documentația →' : 'View Documentation →'}
              </Link>
            </div>

            {/* CTA: Sign Up */}
            <div className="bg-white border-2 border-brand-mughal-green rounded-xl p-5">
              <p className="text-xs text-brand-mughal-green mb-2 font-medium">
                {locale === 'ro' ? 'Începe acum' : 'Get started'}
              </p>
              <p className="text-sm font-semibold text-text-primary mb-2">
                {locale === 'ro'
                  ? 'Începeți monitorizarea riscurilor'
                  : 'Start monitoring credit risk'}
              </p>
              <p className="text-xs text-text-secondary mb-4">
                {locale === 'ro'
                  ? 'Obțineți acces timpuriu la MarketRisk și protejați-vă fluxul de numerar.'
                  : 'Get early access to MarketRisk and protect your cashflow.'}
              </p>
              <Link
                href={`/${locale}#waitlist`}
                className="block w-full px-4 py-2 bg-brand-mughal-green text-white rounded-lg text-sm font-medium hover:bg-brand-mughal-green-2 transition-all duration-200 text-center"
              >
                {locale === 'ro' ? 'Acces Timpuriu →' : 'Get Early Access →'}
              </Link>
            </div>
          </aside>

          {/* Main content */}
          <div className="space-y-6">
            {/* Article header */}
            <header className="bg-white border border-border-subtle rounded-xl p-8">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-medium text-text-primary bg-surface-bone px-2.5 py-1 rounded-pill">
                  {categoryName}
                </span>
                <time dateTime={post.publishedAt || post.createdAt} className="text-xs text-text-muted">
                  {formattedDate}
                </time>
              </div>
              <h1
                className="text-3xl font-semibold text-text-primary mb-3"
                style={{ letterSpacing: '-0.6px' }}
              >
                {title}
              </h1>
              <p className="text-sm text-text-secondary mt-3 max-w-2xl">{excerpt}</p>
            </header>

            {/* Mobile author card */}
            <div className="md:hidden bg-white border border-border-subtle rounded-xl p-5">
              <p className="text-xs text-text-muted mb-3">
                {locale === 'ro' ? 'Autor' : 'Author'}
              </p>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-brand-mughal-green rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-semibold text-white">{initials || 'MR'}</span>
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-text-primary truncate">{authorName}</p>
                  <p className="text-xs text-text-muted mt-0.5">
                    {authorRole} · {authorOrg}
                  </p>
                </div>
              </div>
              <p className="text-sm text-text-secondary mt-4 leading-relaxed">{authorBio}</p>
            </div>

            {/* Article content */}
            <section className="bg-white border border-border-subtle rounded-xl p-8">
              <div className="prose prose-lg max-w-none">
                {/* TODO: Implement Lexical rich text renderer */}
                <p className="text-sm text-text-secondary">
                  {locale === 'ro'
                    ? 'Conținutul articolului va fi afișat aici după implementarea renderer-ului Lexical.'
                    : 'Article content will be displayed here after implementing Lexical renderer.'}
                </p>
                {/* Example of how content will be rendered: */}
                {/* <LexicalRenderer content={post.content[locale]} /> */}
              </div>
            </section>

            {/* Keywords/Tags */}
            {post.seoKeywords && post.seoKeywords.length > 0 && (
              <footer className="bg-surface-paper border border-border-subtle rounded-xl p-6">
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
            <div className="bg-gradient-to-br from-brand-mughal-green via-brand-mughal-green-2 to-brand-mughal-green rounded-xl p-8 text-center relative overflow-hidden">
              <div className="absolute inset-0 pointer-events-none opacity-10">
                <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <pattern id="cta-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                      <path
                        d="M 40 0 L 0 0 0 40"
                        fill="none"
                        stroke="var(--brand-pistachio)"
                        strokeWidth="1"
                      />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#cta-grid)" />
                </svg>
              </div>
              <div className="relative z-10">
                <h3
                  className="text-2xl font-semibold text-text-inverse mb-3"
                  style={{ letterSpacing: '-0.4px' }}
                >
                  {locale === 'ro'
                    ? 'Gata să vă protejați fluxul de numerar?'
                    : 'Ready to protect your cashflow?'}
                </h3>
                <p className="text-text-inverse-muted mb-6 max-w-2xl mx-auto">
                  {locale === 'ro'
                    ? 'Începeți monitorizarea riscurilor de credit pentru partenerii dvs. Primiți alerte inteligente când ceva se schimbă.'
                    : 'Start monitoring credit risk for your Romanian SME partners. Get smart alerts when something changes.'}
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link
                    href={`/${locale}#waitlist`}
                    className="px-6 py-3 bg-white text-brand-mughal-green rounded-lg font-medium text-sm hover:shadow-lg transition-all duration-200 inline-block"
                  >
                    {locale === 'ro' ? 'Acces Timpuriu' : 'Get Early Access'}
                  </Link>
                  <Link
                    href={`/${locale}/docs`}
                    className="px-6 py-3 bg-white/10 backdrop-blur-sm text-white border border-white/20 rounded-lg font-medium text-sm hover:bg-white/20 transition-all duration-200 inline-block"
                  >
                    {locale === 'ro' ? 'Vezi Documentația' : 'View Documentation'}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </article>
    </>
  )
}

// Fallback function to render static blog posts when CMS is unavailable
function renderStaticPost(post: any, locale: 'ro' | 'en') {
  // This is a simplified fallback - you can expand it as needed
  return (
    <article className="max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
      <p className="text-xl text-gray-600 mb-8">{post.excerpt}</p>
      <p className="text-sm text-gray-500">
        {locale === 'ro'
          ? 'CMS momentan indisponibil. Vă rugăm încercați mai târziu.'
          : 'CMS currently unavailable. Please try again later.'}
      </p>
    </article>
  )
}
