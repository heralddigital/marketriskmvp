'use client'

import React, { useEffect } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import Script from 'next/script'
import { getBlogPostBySlug, getAllBlogPosts } from '@/lib/data/blogPosts'
import type { BlogPost } from '@/lib/data/blogPosts'

function slugifyHeading(text: string) {
  return String(text || '')
    .trim()
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

function Section({ section }: { section: BlogPost['sections'][0] }) {
  if (!section) return null
  if (section.type === 'h2') {
    return (
      <h2 className="text-lg font-semibold text-text-primary mt-8" style={{ letterSpacing: '-0.2px' }}>
        {section.text}
      </h2>
    )
  }
  if (section.type === 'ul') {
    return (
      <ul className="space-y-2 mt-4">
        {(section.items || []).map((item) => (
          <li key={item} className="text-sm text-text-secondary flex items-start gap-2">
            <span className="text-brand-mughal-green mt-[2px]">•</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    )
  }
  // default: paragraph
  return <p className="text-sm text-text-secondary mt-4 leading-relaxed">{section.text}</p>
}

function AuthorCard({ author }: { author: BlogPost['author'] }) {
  const safe = author || {}
  const name = safe.name || 'marketrisk'
  const role = safe.role || 'Editorial'
  const org = safe.org || 'marketrisk'
  const bio = safe.bio || 'Practical notes on calm reporting and trustworthy dashboards.'
  const initials = name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((x) => x[0]?.toUpperCase())
    .join('')

  return (
    <div className="bg-white border border-border-subtle rounded-xl p-5">
      <p className="text-xs text-text-muted mb-3">Author</p>
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 bg-brand-mughal-green rounded-lg flex items-center justify-center flex-shrink-0">
          <span className="text-sm font-semibold text-white">{initials || 'MR'}</span>
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-text-primary truncate">{name}</p>
          <p className="text-xs text-text-muted mt-0.5">
            {role} · {org}
          </p>
        </div>
      </div>
      <p className="text-sm text-text-secondary mt-4 leading-relaxed">{bio}</p>
    </div>
  )
}

export default function BlogPostPage() {
  const params = useParams()
  const slug = params.slug as string
  const post = getBlogPostBySlug(slug)
  const allPosts = getAllBlogPosts()

  // Update document title for SEO
  useEffect(() => {
    if (post) {
      document.title = `${post.title} | MarketRisk Blog`
    }
  }, [post])

  if (!post) {
    return (
      <div className="bg-white border border-border-subtle p-8 rounded-xl">
        <p className="text-xs text-text-muted mb-2">Not found</p>
        <h1 className="text-2xl font-semibold text-text-primary" style={{ letterSpacing: '-0.3px' }}>
          This article doesn&apos;t exist.
        </h1>
        <p className="text-sm text-text-secondary mt-3">Try returning to the articles list.</p>
        <div className="mt-6 flex gap-3">
          <Link
            href="/blog"
            className="px-6 py-3 bg-brand-mughal-green text-white rounded-lg font-medium text-sm hover:bg-brand-mughal-green-2 transition-all duration-normal inline-block"
          >
            All articles
          </Link>
        </div>
      </div>
    )
  }

  const headings = (post.sections || [])
    .map((s, idx) => {
      if (s?.type !== 'h2' || !s.text) return null
      const base = slugifyHeading(s.text) || 'section'
      return { text: s.text, id: `${base}-${idx}`, idx }
    })
    .filter((h): h is { text: string; id: string; idx: number } => h !== null)

  // Related posts
  const sameTagPosts = allPosts.filter((p) => p.slug !== post.slug && p.tag === post.tag)
  const otherPosts = allPosts.filter((p) => p.slug !== post.slug && p.tag !== post.tag)
  const relatedPosts = [...sameTagPosts, ...otherPosts].slice(0, 3)

  // Structured data for SEO
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    author: {
      '@type': 'Person',
      name: post.author.name,
      jobTitle: post.author.role,
    },
    publisher: {
      '@type': 'Organization',
      name: 'MarketRisk',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.marketrisk.ro/logo.png',
      },
    },
    datePublished: post.date,
    dateModified: post.date,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://www.marketrisk.ro/blog/${post.slug}`,
    },
    keywords: `${post.tag}, credit risk, Romanian B2B, risk management`,
  }

  return (
    <>
      {/* Structured Data for SEO */}
      <Script
        id="blog-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <article className="space-y-8">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary transition-colors duration-normal"
          >
            <span aria-hidden="true">←</span>
            Back
          </Link>
          <div className="w-px h-5 bg-border-subtle" />
          <Link
            href="/blog"
            className="text-sm text-brand-mughal-green hover:text-brand-mughal-green-2 transition-colors duration-normal"
          >
            All articles
          </Link>
        </div>
        <span className="text-xs text-text-muted">{post.readingTime}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[260px_minmax(0,1fr)] gap-6 items-start">
        {/* Left sidebar */}
        <aside className="hidden md:block sticky top-[96px] space-y-4">
          <div className="bg-white border border-border-subtle rounded-xl p-5">
            <p className="text-xs text-text-muted mb-3">On this page</p>
            <div className="space-y-2">
              {headings.length === 0 ? (
                <p className="text-sm text-text-secondary">No sections</p>
              ) : (
                headings.map((h) => (
                  <button
                    key={h.id}
                    type="button"
                    onClick={() => document.getElementById(h.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                    className="text-left w-full text-sm text-text-secondary hover:text-text-primary transition-colors duration-normal"
                  >
                    {h.text}
                  </button>
                ))
              )}
            </div>
          </div>

          <AuthorCard author={post.author} />

          {/* CTA: Documentation */}
          <div className="bg-gradient-to-br from-brand-mughal-green/10 to-brand-mughal-green/5 border border-brand-mughal-green/20 rounded-xl p-5">
            <p className="text-xs text-brand-mughal-green mb-2 font-medium">Learn more</p>
            <p className="text-sm font-semibold text-text-primary mb-2">Documentation</p>
            <p className="text-xs text-text-secondary mb-4">Explore our guides on credit risk monitoring, CUI checks, and BPI alerts.</p>
            <Link
              href="/docs"
              className="block w-full px-4 py-2 bg-brand-mughal-green text-white rounded-lg text-sm font-medium hover:bg-brand-mughal-green-2 transition-all duration-200 text-center"
            >
              View Documentation →
            </Link>
          </div>

          {/* CTA: Sign Up */}
          <div className="bg-white border-2 border-brand-mughal-green rounded-xl p-5">
            <p className="text-xs text-brand-mughal-green mb-2 font-medium">Get started</p>
            <p className="text-sm font-semibold text-text-primary mb-2">Start monitoring credit risk</p>
            <p className="text-xs text-text-secondary mb-4">Get early access to <span className="text-brand-mughal-green font-medium">marketrisk</span> and protect your cashflow.</p>
            <Link
              href="/#waitlist"
              className="block w-full px-4 py-2 bg-brand-mughal-green text-white rounded-lg text-sm font-medium hover:bg-brand-mughal-green-2 transition-all duration-200 text-center"
            >
              Get Early Access →
            </Link>
          </div>
        </aside>

        {/* Main content */}
        <div className="space-y-6">
          <header className="bg-white border border-border-subtle rounded-xl p-8">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-medium text-text-primary bg-surface-bone px-2.5 py-1 rounded-pill">
                {post.tag}
              </span>
              <span className="text-xs text-text-muted">{post.date}</span>
            </div>
            <h1 className="text-3xl font-semibold text-text-primary" style={{ letterSpacing: '-0.6px' }}>
              {post.title}
            </h1>
            <p className="text-sm text-text-secondary mt-3 max-w-2xl">{post.excerpt}</p>
          </header>

          {/* Mobile author card */}
          <div className="md:hidden">
            <AuthorCard author={post.author} />
          </div>

          <section className="bg-white border border-border-subtle rounded-xl p-8">
            {(post.sections || []).map((s, idx) => {
              if (s?.type === 'h2') {
                const base = s.text ? slugifyHeading(s.text) || 'section' : 'section'
                const id = `${base}-${idx}`
                return (
                  <h2
                    key={`${s.type || 'p'}-${idx}`}
                    id={id}
                    className="text-lg font-semibold text-text-primary mt-8 scroll-mt-28"
                    style={{ letterSpacing: '-0.2px' }}
                  >
                    {s.text}
                  </h2>
                )
              }
              return <Section key={`${s?.type || 'p'}-${idx}`} section={s} />
            })}
          </section>

          {/* CTA: Sign Up - After Content */}
          <div className="bg-gradient-to-br from-brand-mughal-green via-brand-mughal-green-2 to-brand-mughal-green rounded-xl p-8 text-center relative overflow-hidden">
            {/* Background pattern */}
            <div className="absolute inset-0 pointer-events-none opacity-10">
              <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="cta-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="var(--brand-pistachio)" strokeWidth="1"/>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#cta-grid)" />
              </svg>
            </div>
            <div className="relative z-10">
              <h3 className="text-2xl font-semibold text-text-inverse mb-3" style={{ letterSpacing: '-0.4px' }}>
                Ready to protect your cashflow?
              </h3>
              <p className="text-text-inverse-muted mb-6 max-w-2xl mx-auto">
                Start monitoring credit risk for your Romanian SME partners. Get smart alerts when something changes—so you can act fast.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  href="/#waitlist"
                  className="px-6 py-3 bg-white text-brand-mughal-green rounded-lg font-medium text-sm hover:shadow-lg transition-all duration-200 inline-block"
                >
                  Get Early Access
                </Link>
                <Link
                  href="/docs"
                  className="px-6 py-3 bg-white/10 backdrop-blur-sm text-white border border-white/20 rounded-lg font-medium text-sm hover:bg-white/20 transition-all duration-200 inline-block"
                >
                  View Documentation
                </Link>
              </div>
            </div>
          </div>

          {/* Share Section */}
          <div className="bg-surface-paper border border-border-subtle rounded-xl p-6">
            <p className="text-xs text-text-muted mb-4 font-medium">Share this article</p>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  if (typeof window !== 'undefined' && window.navigator.share) {
                    window.navigator.share({
                      title: post.title,
                      text: post.excerpt,
                      url: window.location.href,
                    })
                  } else if (typeof window !== 'undefined') {
                    navigator.clipboard.writeText(window.location.href)
                    alert('Link copied to clipboard!')
                  }
                }}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-border-subtle rounded-lg text-sm text-text-secondary hover:border-brand-mughal-green hover:text-brand-mughal-green transition-all duration-200"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                Share
              </button>
              <button
                type="button"
                onClick={() => {
                  if (typeof window !== 'undefined') {
                    navigator.clipboard.writeText(window.location.href)
                    alert('Link copied to clipboard!')
                  }
                }}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-border-subtle rounded-lg text-sm text-text-secondary hover:border-brand-mughal-green hover:text-brand-mughal-green transition-all duration-200"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Copy link
              </button>
            </div>
          </div>

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-text-primary mb-6">Related articles</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedPosts.map((relatedPost) => (
                  <Link
                    key={relatedPost.slug}
                    href={`/blog/${relatedPost.slug}`}
                    className="block text-left bg-white border border-border-subtle p-6 rounded-xl hover:shadow-md hover:border-brand-mughal-green/50 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring group"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xs font-medium text-text-primary bg-surface-bone px-2.5 py-1 rounded-full">
                        {relatedPost.tag}
                      </span>
                      <span className="text-xs text-text-muted">{relatedPost.date}</span>
                    </div>
                    <h4 className="text-base font-semibold text-text-primary mb-2 group-hover:text-brand-mughal-green transition-colors duration-200">
                      {relatedPost.title}
                    </h4>
                    <p className="text-sm text-text-secondary line-clamp-2 mb-3">{relatedPost.excerpt}</p>
                    <span className="text-sm text-brand-mughal-green group-hover:underline">Read more →</span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* CTA: Documentation Link */}
          <div className="bg-surface-paper border border-border-subtle rounded-xl p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <p className="text-xs text-text-muted mb-2 font-medium">Learn more</p>
                <h4 className="text-base font-semibold text-text-primary mb-2">Explore our documentation</h4>
                <p className="text-sm text-text-secondary">
                  Get detailed guides on CUI credit checks, BPI monitoring, watchlist management, and more.
                </p>
              </div>
              <Link
                href="/docs"
                className="px-4 py-2 bg-brand-mughal-green text-white rounded-lg text-sm font-medium hover:bg-brand-mughal-green-2 transition-all duration-200 whitespace-nowrap inline-block"
              >
                View Docs →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </article>
    </>
  )
}
