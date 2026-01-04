// Breadcrumb navigation component with Schema.org support
// Provides visual breadcrumbs and SEO-friendly structured data

import Link from 'next/link'
import { ChevronRight, Home } from 'lucide-react'
import { JsonLd } from './JsonLd'
import { getBreadcrumbSchema } from '@/lib/seo/schema'

export interface BreadcrumbItem {
  name: string
  href: string
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
  locale?: 'ro' | 'en'
  className?: string
}

/**
 * Breadcrumb navigation with Schema.org markup
 * Automatically includes home page as first item
 */
export function Breadcrumbs({ items, locale = 'ro', className = '' }: BreadcrumbsProps) {
  const homeLabel = locale === 'ro' ? 'Acasă' : 'Home'
  const homeHref = `/${locale}`

  // Combine home with provided items
  const allItems: BreadcrumbItem[] = [{ name: homeLabel, href: homeHref }, ...items]

  // Generate Schema.org breadcrumb markup
  const breadcrumbSchema = getBreadcrumbSchema(allItems, locale)

  return (
    <>
      <JsonLd data={breadcrumbSchema} />

      <nav
        aria-label="Breadcrumb"
        className={`flex items-center space-x-2 text-sm ${className}`}
      >
        <ol className="flex items-center space-x-2">
          {allItems.map((item, index) => {
            const isLast = index === allItems.length - 1
            const isHome = index === 0

            return (
              <li key={item.href} className="flex items-center">
                {index > 0 && (
                  <ChevronRight className="mx-2 h-4 w-4 text-gray-400" aria-hidden="true" />
                )}

                {isLast ? (
                  <span className="font-medium text-[#2F5232]" aria-current="page">
                    {item.name}
                  </span>
                ) : (
                  <Link
                    href={item.href}
                    className="flex items-center text-gray-600 hover:text-[#2F5232] transition-colors"
                  >
                    {isHome && <Home className="mr-1 h-4 w-4" aria-hidden="true" />}
                    {item.name}
                  </Link>
                )}
              </li>
            )
          })}
        </ol>
      </nav>
    </>
  )
}
