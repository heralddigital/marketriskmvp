'use client'

import React from 'react'
import Link from 'next/link'

interface BlogPost {
  id: string
  slug: string
  title: string
  excerpt: string
  publishedAt: string
  readingTime?: number
  category?: {
    name: string
    slug: string
  }
}

interface BlogClientProps {
  posts: BlogPost[]
  locale: 'ro' | 'en'
}

export function BlogClient({ posts, locale }: BlogClientProps) {
  const [searchQuery, setSearchQuery] = React.useState('')
  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(null)

  // Get all unique categories
  const allCategories = React.useMemo(() => {
    const categories = new Map<string, { name: string; slug: string }>()
    posts.forEach((post) => {
      if (post.category) {
        categories.set(post.category.slug, post.category)
      }
    })
    return Array.from(categories.values())
  }, [posts])

  // Filter posts based on search and category
  const filteredPosts = React.useMemo(() => {
    return posts.filter((post) => {
      const matchesSearch =
        !searchQuery ||
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (post.category?.name && post.category.name.toLowerCase().includes(searchQuery.toLowerCase()))
      const matchesCategory = !selectedCategory || post.category?.slug === selectedCategory
      return matchesSearch && matchesCategory
    })
  }, [posts, searchQuery, selectedCategory])

  // Featured post (first post)
  const featuredPost = filteredPosts.length > 0 ? filteredPosts[0] : null
  const regularPosts = filteredPosts.slice(1)

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString(locale === 'ro' ? 'ro-RO' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const getText = (key: string) => {
    const translations = {
      ro: {
        blog: 'Blog',
        latestArticles: 'Ultimele articole',
        subtitle: 'Ghiduri practice despre monitorizarea riscurilor și raportare de încredere.',
        searchPlaceholder: 'Caută articole...',
        all: 'Toate',
        found: 'Găsite',
        articles: 'articole',
        article: 'articol',
        for: 'pentru',
        in: 'în',
        featured: 'Recomandat',
        readArticle: 'Citește articolul →',
        moreArticles: 'Mai multe articole',
        readMore: 'Citește mai mult',
        noResults: 'Niciun articol găsit',
        noResultsText: 'Încercați să ajustați criteriile de căutare sau filtre.',
        clearFilters: 'Șterge filtrele',
        readyTitle: 'Gata să vă protejați fluxul de numerar?',
        readyText:
          'Începeți monitorizarea riscurilor de credit pentru partenerii dvs. Primiți alerte inteligente când ceva se schimbă.',
        getAccess: 'Acces Timpuriu',
        viewDocs: 'Vezi Documentația',
        learnMore: 'Află mai multe',
        exploreDocs: 'Explorați documentația',
        docsText:
          'Obțineți ghiduri detaliate despre verificări CUI, monitorizare BPI, gestionare liste și rapoarte de risc.',
        stayUpdated: 'Rămâneți la curent',
        newsletter: 'Fiți notificat când publicăm articole noi despre monitorizare și raportare.',
        emailPlaceholder: 'Introduceți email-ul',
        subscribe: 'Abonează-te',
        minRead: 'min citire',
      },
      en: {
        blog: 'Blog',
        latestArticles: 'Latest articles',
        subtitle: 'Practical guidance on risk monitoring and trustworthy reporting.',
        searchPlaceholder: 'Search articles...',
        all: 'All',
        found: 'Found',
        articles: 'articles',
        article: 'article',
        for: 'for',
        in: 'in',
        featured: 'Featured',
        readArticle: 'Read article →',
        moreArticles: 'More articles',
        readMore: 'Read more',
        noResults: 'No articles found',
        noResultsText: 'Try adjusting your search or filter criteria.',
        clearFilters: 'Clear filters',
        readyTitle: 'Ready to protect your cashflow?',
        readyText:
          'Start monitoring credit risk for your Romanian SME partners. Get smart alerts when something changes.',
        getAccess: 'Get Early Access',
        viewDocs: 'View Documentation',
        learnMore: 'Learn more',
        exploreDocs: 'Explore our documentation',
        docsText:
          'Get detailed guides on CUI credit checks, BPI monitoring, watchlist management, and risk reports.',
        stayUpdated: 'Stay updated',
        newsletter: 'Get notified when we publish new articles on monitoring and reporting.',
        emailPlaceholder: 'Enter your email',
        subscribe: 'Subscribe',
        minRead: 'min read',
      },
    }
    return translations[locale][key as keyof typeof translations['ro']] || key
  }

  return (
    <div className="space-y-12">
      {/* Hero Header */}
      <section className="bg-gradient-to-br from-brand-mughal-green via-brand-mughal-green-2 to-brand-mughal-green rounded-2xl p-8 md:p-12 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none opacity-10 overflow-hidden rounded-2xl">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="blog-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path
                  d="M 40 0 L 0 0 0 40"
                  fill="none"
                  stroke="var(--brand-pistachio)"
                  strokeWidth="1"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#blog-grid)" />
          </svg>
        </div>

        <div className="relative z-10">
          <p className="text-xs text-brand-pistachio mb-3 font-medium">{getText('blog')}</p>
          <h1
            className="text-4xl md:text-5xl font-semibold text-text-inverse mb-4"
            style={{ letterSpacing: '-0.8px' }}
          >
            {getText('latestArticles')}
          </h1>
          <p className="text-text-inverse-muted text-lg max-w-2xl mb-8">{getText('subtitle')}</p>

          {/* Search Bar */}
          <div className="max-w-xl">
            <div className="relative">
              <input
                type="text"
                placeholder={getText('searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/10 backdrop-blur-sm text-text-inverse placeholder:text-text-inverse-muted border border-white/20 rounded-lg px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-brand-pistachio focus:border-transparent transition-all duration-200"
              />
              <svg
                className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-inverse-muted"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* Category Filters */}
      {allCategories.length > 0 && (
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => setSelectedCategory(null)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              !selectedCategory
                ? 'bg-brand-mughal-green text-white'
                : 'bg-white border border-border-subtle text-text-secondary hover:border-brand-mughal-green hover:text-brand-mughal-green'
            }`}
          >
            {getText('all')}
          </button>
          {allCategories.map((category) => (
            <button
              key={category.slug}
              type="button"
              onClick={() => setSelectedCategory(category.slug)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                selectedCategory === category.slug
                  ? 'bg-brand-mughal-green text-white'
                  : 'bg-white border border-border-subtle text-text-secondary hover:border-brand-mughal-green hover:text-brand-mughal-green'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      )}

      {/* Results count */}
      {(searchQuery || selectedCategory) && (
        <div className="text-sm text-text-secondary">
          {getText('found')} {filteredPosts.length}{' '}
          {filteredPosts.length === 1 ? getText('article') : getText('articles')}
          {searchQuery && ` ${getText('for')} "${searchQuery}"`}
          {selectedCategory && ` ${getText('in')} ${allCategories.find((c) => c.slug === selectedCategory)?.name}`}
        </div>
      )}

      {/* Featured Post */}
      {featuredPost && (
        <section>
          <p className="text-xs text-text-muted mb-4 font-medium">{getText('featured')}</p>
          <Link
            href={`/${locale}/blog/${featuredPost.slug}`}
            className="block text-left w-full bg-white border-2 border-brand-mughal-green rounded-xl p-8 hover:shadow-lg transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring group"
          >
            <div className="flex items-center gap-2 mb-4">
              {featuredPost.category && (
                <span className="text-xs font-medium text-brand-mughal-green bg-brand-mughal-green/10 px-3 py-1.5 rounded-full">
                  {featuredPost.category.name}
                </span>
              )}
              <span className="text-xs text-text-muted">{formatDate(featuredPost.publishedAt)}</span>
            </div>
            <h2
              className="text-2xl md:text-3xl font-semibold text-text-primary mb-3 group-hover:text-brand-mughal-green transition-colors duration-200"
              style={{ letterSpacing: '-0.4px' }}
            >
              {featuredPost.title}
            </h2>
            <p className="text-base text-text-secondary mb-4 max-w-3xl">{featuredPost.excerpt}</p>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-brand-mughal-green group-hover:underline">
                {getText('readArticle')}
              </span>
              {featuredPost.readingTime && (
                <span className="text-xs text-text-muted">
                  {featuredPost.readingTime} {getText('minRead')}
                </span>
              )}
            </div>
          </Link>
        </section>
      )}

      {/* Regular Posts Grid */}
      {regularPosts.length > 0 && (
        <section>
          {featuredPost && <p className="text-xs text-text-muted mb-4 font-medium">{getText('moreArticles')}</p>}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {regularPosts.map((post) => (
              <Link
                key={post.id}
                href={`/${locale}/blog/${post.slug}`}
                className="block text-left bg-white border border-border-subtle p-6 rounded-xl hover:shadow-md hover:border-brand-mughal-green/50 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring group"
              >
                <div className="flex items-center gap-2 mb-3">
                  {post.category && (
                    <span className="text-xs font-medium text-text-primary bg-surface-bone px-2.5 py-1 rounded-full">
                      {post.category.name}
                    </span>
                  )}
                  <span className="text-xs text-text-muted">{formatDate(post.publishedAt)}</span>
                </div>
                <h3 className="text-lg font-semibold text-text-primary mb-2 group-hover:text-brand-mughal-green transition-colors duration-200">
                  {post.title}
                </h3>
                <p className="text-sm text-text-secondary mb-4 line-clamp-2">{post.excerpt}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-brand-mughal-green group-hover:underline">
                    {getText('readMore')}
                  </span>
                  {post.readingTime && (
                    <span className="text-xs text-text-muted">
                      {post.readingTime} {getText('minRead')}
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* No Results */}
      {filteredPosts.length === 0 && (
        <div className="bg-white border border-border-subtle rounded-xl p-12 text-center">
          <p className="text-lg font-medium text-text-primary mb-2">{getText('noResults')}</p>
          <p className="text-sm text-text-secondary mb-6">{getText('noResultsText')}</p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('')
              setSelectedCategory(null)
            }}
            className="px-6 py-3 bg-brand-mughal-green text-white rounded-lg font-medium text-sm hover:bg-brand-mughal-green-2 transition-all duration-normal"
          >
            {getText('clearFilters')}
          </button>
        </div>
      )}

      {/* CTA: Sign Up */}
      <section className="bg-gradient-to-br from-brand-mughal-green via-brand-mughal-green-2 to-brand-mughal-green rounded-xl p-8 md:p-12 text-center relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none opacity-10 overflow-hidden rounded-xl">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="blog-cta-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path
                  d="M 40 0 L 0 0 0 40"
                  fill="none"
                  stroke="var(--brand-pistachio)"
                  strokeWidth="1"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#blog-cta-grid)" />
          </svg>
        </div>
        <div className="relative z-10 max-w-3xl mx-auto">
          <h3
            className="text-3xl font-semibold text-text-inverse mb-4"
            style={{ letterSpacing: '-0.6px' }}
          >
            {getText('readyTitle')}
          </h3>
          <p className="text-text-inverse-muted text-lg mb-8">{getText('readyText')}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={`/${locale}#waitlist`}
              className="px-8 py-3 bg-white text-brand-mughal-green rounded-lg font-medium text-sm hover:shadow-lg transition-all duration-200 inline-block"
            >
              {getText('getAccess')}
            </Link>
            <Link
              href={`/${locale}/docs`}
              className="px-8 py-3 bg-white/10 backdrop-blur-sm text-white border border-white/20 rounded-lg font-medium text-sm hover:bg-white/20 transition-all duration-200 inline-block"
            >
              {getText('viewDocs')}
            </Link>
          </div>
        </div>
      </section>

      {/* Documentation CTA */}
      <section className="bg-surface-paper border border-border-subtle rounded-xl p-8">
        <div className="max-w-3xl mx-auto">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex-1">
              <p className="text-xs text-text-muted mb-2 font-medium">{getText('learnMore')}</p>
              <h3 className="text-xl font-semibold text-text-primary mb-2">{getText('exploreDocs')}</h3>
              <p className="text-sm text-text-secondary">{getText('docsText')}</p>
            </div>
            <Link
              href={`/${locale}/docs`}
              className="px-6 py-3 bg-brand-mughal-green text-white rounded-lg font-medium text-sm hover:bg-brand-mughal-green-2 transition-all duration-200 whitespace-nowrap inline-block"
            >
              {getText('viewDocs')} →
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="bg-surface-paper border border-border-subtle rounded-xl p-8">
        <div className="max-w-2xl mx-auto text-center">
          <h3 className="text-xl font-semibold text-text-primary mb-2">{getText('stayUpdated')}</h3>
          <p className="text-sm text-text-secondary mb-6">{getText('newsletter')}</p>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              window.location.href = `/${locale}#waitlist`
            }}
            className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
          >
            <input
              type="email"
              placeholder={getText('emailPlaceholder')}
              className="flex-1 px-4 py-3 bg-white border border-border-subtle rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-mughal-green focus:border-transparent"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-brand-mughal-green text-white rounded-lg font-medium text-sm hover:bg-brand-mughal-green-2 transition-all duration-normal whitespace-nowrap"
            >
              {getText('subscribe')}
            </button>
          </form>
        </div>
      </section>
    </div>
  )
}
