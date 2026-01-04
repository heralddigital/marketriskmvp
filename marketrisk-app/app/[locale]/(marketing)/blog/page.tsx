'use client'

import React from 'react'
import Link from 'next/link'
import { getAllBlogPosts } from '@/lib/data/blogPosts'

export default function BlogIndexPage() {
  const posts = getAllBlogPosts()
  const [searchQuery, setSearchQuery] = React.useState('')
  const [selectedTag, setSelectedTag] = React.useState<string | null>(null)

  // Get all unique tags
  const allTags = React.useMemo(() => {
    const tags = new Set<string>()
    posts.forEach((post) => {
      if (post.tag) tags.add(post.tag)
    })
    return Array.from(tags)
  }, [posts])

  // Filter posts based on search and tag
  const filteredPosts = React.useMemo(() => {
    return posts.filter((post) => {
      const matchesSearch =
        !searchQuery ||
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (post.tag && post.tag.toLowerCase().includes(searchQuery.toLowerCase()))
      const matchesTag = !selectedTag || post.tag === selectedTag
      return matchesSearch && matchesTag
    })
  }, [posts, searchQuery, selectedTag])

  // Featured post (first post)
  const featuredPost = filteredPosts.length > 0 ? filteredPosts[0] : null
  const regularPosts = filteredPosts.slice(1)

  return (
    <div className="space-y-12">
      {/* Hero Header */}
      <section className="bg-gradient-to-br from-brand-mughal-green via-brand-mughal-green-2 to-brand-mughal-green rounded-2xl p-8 md:p-12 relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 pointer-events-none opacity-10 overflow-hidden rounded-2xl">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="blog-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="var(--brand-pistachio)" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#blog-grid)" />
          </svg>
        </div>

        <div className="relative z-10">
          <p className="text-xs text-brand-pistachio mb-3 font-medium">Blog</p>
          <h1 className="text-4xl md:text-5xl font-semibold text-text-inverse mb-4" style={{ letterSpacing: '-0.8px' }}>
            Latest articles
          </h1>
          <p className="text-text-inverse-muted text-lg max-w-2xl mb-8">
            Practical guidance on calm reporting, trustworthy dashboards, and decision-ready summaries.
          </p>

          {/* Search Bar */}
          <div className="max-w-xl">
            <div className="relative">
              <input
                type="text"
                placeholder="Search articles..."
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* Tag Filters */}
      {allTags.length > 0 && (
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => setSelectedTag(null)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              !selectedTag
                ? 'bg-brand-mughal-green text-white'
                : 'bg-white border border-border-subtle text-text-secondary hover:border-brand-mughal-green hover:text-brand-mughal-green'
            }`}
          >
            All
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => setSelectedTag(tag)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                selectedTag === tag
                  ? 'bg-brand-mughal-green text-white'
                  : 'bg-white border border-border-subtle text-text-secondary hover:border-brand-mughal-green hover:text-brand-mughal-green'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      )}

      {/* Results count */}
      {(searchQuery || selectedTag) && (
        <div className="text-sm text-text-secondary">
          Found {filteredPosts.length} {filteredPosts.length === 1 ? 'article' : 'articles'}
          {searchQuery && ` for "${searchQuery}"`}
          {selectedTag && ` in ${selectedTag}`}
        </div>
      )}

      {/* Featured Post */}
      {featuredPost && (
        <section>
          <p className="text-xs text-text-muted mb-4 font-medium">Featured</p>
          <Link
            href={`/blog/${featuredPost.slug}`}
            className="block text-left w-full bg-white border-2 border-brand-mughal-green rounded-xl p-8 hover:shadow-lg transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring group"
          >
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xs font-medium text-brand-mughal-green bg-brand-mughal-green/10 px-3 py-1.5 rounded-full">
                {featuredPost.tag}
              </span>
              <span className="text-xs text-text-muted">{featuredPost.date}</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-semibold text-text-primary mb-3 group-hover:text-brand-mughal-green transition-colors duration-200" style={{ letterSpacing: '-0.4px' }}>
              {featuredPost.title}
            </h2>
            <p className="text-base text-text-secondary mb-4 max-w-3xl">{featuredPost.excerpt}</p>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-brand-mughal-green group-hover:underline">
                Read article →
              </span>
              <span className="text-xs text-text-muted">{featuredPost.readingTime}</span>
            </div>
          </Link>
        </section>
      )}

      {/* Regular Posts Grid */}
      {regularPosts.length > 0 && (
        <section>
          {featuredPost && <p className="text-xs text-text-muted mb-4 font-medium">More articles</p>}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {regularPosts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="block text-left bg-white border border-border-subtle p-6 rounded-xl hover:shadow-md hover:border-brand-mughal-green/50 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring group"
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-medium text-text-primary bg-surface-bone px-2.5 py-1 rounded-full">
                    {post.tag}
                  </span>
                  <span className="text-xs text-text-muted">{post.date}</span>
                </div>
                <h3 className="text-lg font-semibold text-text-primary mb-2 group-hover:text-brand-mughal-green transition-colors duration-200">
                  {post.title}
                </h3>
                <p className="text-sm text-text-secondary mb-4 line-clamp-2">{post.excerpt}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-brand-mughal-green group-hover:underline">Read more</span>
                  <span className="text-xs text-text-muted">{post.readingTime}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* No Results */}
      {filteredPosts.length === 0 && (
        <div className="bg-white border border-border-subtle rounded-xl p-12 text-center">
          <p className="text-lg font-medium text-text-primary mb-2">No articles found</p>
          <p className="text-sm text-text-secondary mb-6">
            Try adjusting your search or filter criteria.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('')
              setSelectedTag(null)
            }}
            className="px-6 py-3 bg-brand-mughal-green text-white rounded-lg font-medium text-sm hover:bg-brand-mughal-green-2 transition-all duration-normal"
          >
            Clear filters
          </button>
        </div>
      )}

      {/* CTA: Sign Up */}
      <section className="bg-gradient-to-br from-brand-mughal-green via-brand-mughal-green-2 to-brand-mughal-green rounded-xl p-8 md:p-12 text-center relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 pointer-events-none opacity-10 overflow-hidden rounded-xl">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="blog-cta-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="var(--brand-pistachio)" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#blog-cta-grid)" />
          </svg>
        </div>
        <div className="relative z-10 max-w-3xl mx-auto">
          <h3 className="text-3xl font-semibold text-text-inverse mb-4" style={{ letterSpacing: '-0.6px' }}>
            Ready to protect your cashflow?
          </h3>
          <p className="text-text-inverse-muted text-lg mb-8">
            Start monitoring credit risk for your Romanian SME partners. Get smart alerts when something changes—so you can act fast and avoid bad debt.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/#waitlist"
              className="px-8 py-3 bg-white text-brand-mughal-green rounded-lg font-medium text-sm hover:shadow-lg transition-all duration-200 inline-block"
            >
              Get Early Access
            </Link>
            <Link
              href="/docs"
              className="px-8 py-3 bg-white/10 backdrop-blur-sm text-white border border-white/20 rounded-lg font-medium text-sm hover:bg-white/20 transition-all duration-200 inline-block"
            >
              View Documentation
            </Link>
          </div>
        </div>
      </section>

      {/* Documentation CTA */}
      <section className="bg-surface-paper border border-border-subtle rounded-xl p-8">
        <div className="max-w-3xl mx-auto">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex-1">
              <p className="text-xs text-text-muted mb-2 font-medium">Learn more</p>
              <h3 className="text-xl font-semibold text-text-primary mb-2">Explore our documentation</h3>
              <p className="text-sm text-text-secondary">
                Get detailed guides on CUI credit checks, BPI monitoring, watchlist management, and building effective credit risk reports.
              </p>
            </div>
            <Link
              href="/docs"
              className="px-6 py-3 bg-brand-mughal-green text-white rounded-lg font-medium text-sm hover:bg-brand-mughal-green-2 transition-all duration-200 whitespace-nowrap inline-block"
            >
              View Documentation →
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="bg-surface-paper border border-border-subtle rounded-xl p-8">
        <div className="max-w-2xl mx-auto text-center">
          <h3 className="text-xl font-semibold text-text-primary mb-2">Stay updated</h3>
          <p className="text-sm text-text-secondary mb-6">
            Get notified when we publish new articles on risk monitoring and reporting.
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              window.location.href = '/#waitlist'
            }}
            className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
          >
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 bg-white border border-border-subtle rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-mughal-green focus:border-transparent"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-brand-mughal-green text-white rounded-lg font-medium text-sm hover:bg-brand-mughal-green-2 transition-all duration-normal whitespace-nowrap"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  )
}
