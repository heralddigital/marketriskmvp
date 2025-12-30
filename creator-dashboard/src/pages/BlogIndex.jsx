import React from 'react'

export default function BlogIndexPage({ posts, onOpenPost }) {
  return (
    <div className="space-y-8">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-xs text-text-muted mb-2">Blog</p>
          <h1 className="text-2xl font-semibold text-text-primary" style={{ letterSpacing: '-0.3px' }}>
            Latest articles
          </h1>
          <p className="text-sm text-text-secondary mt-3 max-w-2xl">
            Practical guidance on calm reporting, trustworthy dashboards, and decision-ready summaries.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {(posts || []).map((post) => (
          <button
            key={post.slug}
            type="button"
            onClick={() => onOpenPost?.(post.slug)}
            className="text-left bg-white border border-border-subtle p-6 rounded-xl hover:shadow-sm transition-all duration-normal focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-medium text-text-primary bg-surface-bone px-2.5 py-1 rounded-pill">
                {post.tag}
              </span>
              <span className="text-xs text-text-muted">{post.date}</span>
            </div>
            <h3 className="text-lg font-medium text-text-primary mb-2">{post.title}</h3>
            <p className="text-sm text-text-secondary">{post.excerpt}</p>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-sm text-brand-mughal-green">Read more</span>
              <span className="text-xs text-text-muted">{post.readingTime}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}


