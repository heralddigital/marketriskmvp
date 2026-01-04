import { Metadata } from 'next'
import { getBlogPostBySlug } from '@/lib/data/blogPosts'

export function generateBlogMetadata(slug: string): Metadata {
  const post = getBlogPostBySlug(slug)

  if (!post) {
    return {
      title: 'Blog Post Not Found - MarketRisk',
      description: 'The requested blog post could not be found.',
    }
  }

  const url = `https://www.marketrisk.ro/blog/${post.slug}`

  return {
    title: `${post.title} | MarketRisk Blog`,
    description: post.excerpt,
    keywords: `${post.tag}, credit risk, Romanian B2B, ${post.title}, risk management, SME monitoring`,
    authors: [{ name: post.author.name }],
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url,
      siteName: 'MarketRisk',
      type: 'article',
      publishedTime: post.date,
      authors: [post.author.name],
      tags: [post.tag, 'Credit Risk', 'Romanian B2B', 'Risk Management'],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
    },
    alternates: {
      canonical: url,
    },
  }
}
