import { useEffect } from 'react'

/**
 * SEO Component for dynamic meta tags per page
 * Usage: <SEO title="Page Title" description="Page description" />
 */
export default function SEO({ 
  title = 'marketrisk - Credit Risk Monitoring for Romanian SMEs',
  description = 'Simple credit risk monitoring for Romanian SMEs: build a watchlist, get actionable alerts, and avoid bad debt before it hits cashflow.',
  keywords = 'credit risk monitoring, Romanian SMEs, risk alerts, insolvency monitoring, debt management',
  image = 'https://www.marketrisk.ro/og-image.jpg',
  url = 'https://www.marketrisk.ro/',
  type = 'website'
}) {
  useEffect(() => {
    // Update document title
    document.title = title

    // Update or create meta tags
    const updateMetaTag = (name, content, attribute = 'name') => {
      let element = document.querySelector(`meta[${attribute}="${name}"]`)
      if (!element) {
        element = document.createElement('meta')
        element.setAttribute(attribute, name)
        document.head.appendChild(element)
      }
      element.setAttribute('content', content)
    }

    // Primary meta tags
    updateMetaTag('description', description)
    updateMetaTag('keywords', keywords)
    updateMetaTag('title', title)

    // Open Graph tags
    updateMetaTag('og:title', title, 'property')
    updateMetaTag('og:description', description, 'property')
    updateMetaTag('og:image', image, 'property')
    updateMetaTag('og:url', url, 'property')
    updateMetaTag('og:type', type, 'property')

    // Twitter Card tags
    updateMetaTag('twitter:title', title)
    updateMetaTag('twitter:description', description)
    updateMetaTag('twitter:image', image)

    // Canonical URL
    let canonical = document.querySelector('link[rel="canonical"]')
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.setAttribute('rel', 'canonical')
      document.head.appendChild(canonical)
    }
    canonical.setAttribute('href', url)
  }, [title, description, keywords, image, url, type])

  return null
}

