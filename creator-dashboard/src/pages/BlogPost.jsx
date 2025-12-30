import React from 'react'

function slugifyHeading(text) {
  return String(text || '')
    .trim()
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

function Section({ section }) {
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

function AuthorCard({ author }) {
  const safe = author || {}
  const name = safe.name || 'MarketRisk'
  const role = safe.role || 'Editorial'
  const org = safe.org || 'MarketRisk'
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

export default function BlogPostPage({ post, onBack, onAllArticles }) {
  if (!post) {
    return (
      <div className="bg-white border border-border-subtle p-8 rounded-xl">
        <p className="text-xs text-text-muted mb-2">Not found</p>
        <h1 className="text-2xl font-semibold text-text-primary" style={{ letterSpacing: '-0.3px' }}>
          This article doesn’t exist.
        </h1>
        <p className="text-sm text-text-secondary mt-3">Try returning to the articles list.</p>
        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={() => onAllArticles?.()}
            className="px-6 py-3 bg-brand-mughal-green text-white rounded-lg font-medium text-sm hover:bg-brand-mughal-green-2 transition-all duration-normal"
          >
            All articles
          </button>
          <button
            type="button"
            onClick={() => onBack?.()}
            className="px-6 py-3 bg-white text-brand-mughal-green rounded-lg font-medium text-sm hover:shadow-sm transition-all duration-normal border border-border-subtle"
          >
            Back
          </button>
        </div>
      </div>
    )
  }

  const headings = (post.sections || [])
    .map((s, idx) => {
      if (s?.type !== 'h2') return null
      const base = slugifyHeading(s.text) || 'section'
      return { text: s.text, id: `${base}-${idx}`, idx }
    })
    .filter(Boolean)

  return (
    <article className="space-y-8">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => onBack?.()}
            className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary transition-colors duration-normal"
          >
            <span aria-hidden="true">←</span>
            Back
          </button>
          <div className="w-px h-5 bg-border-subtle" />
          <button
            type="button"
            onClick={() => onAllArticles?.()}
            className="text-sm text-brand-mughal-green hover:text-brand-mughal-green-2 transition-colors duration-normal"
          >
            All articles
          </button>
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
                const base = slugifyHeading(s.text) || 'section'
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
        </div>
      </div>
    </article>
  )
}


