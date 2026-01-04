// New homepage with migrated marketing components
// This replaces the old homepage with modern, consistent components

import { Hero } from '@/components/marketing/Hero'
import { Features } from '@/components/marketing/Features'
import { Stats } from '@/components/marketing/Stats'
import { FAQ } from '@/components/marketing/FAQ'
import { CallToAction } from '@/components/marketing/CallToAction'
import { generateMarketingPageMetadata } from '@/lib/seo/metadata'
import type { Metadata } from 'next'

interface HomePageProps {
  params: Promise<{
    locale: 'ro' | 'en'
  }>
}

export async function generateMetadata({ params }: HomePageProps): Promise<Metadata> {
  const { locale } = await params
  return generateMarketingPageMetadata('home', locale)
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-8">
        <Hero locale={locale} />
      </div>

      {/* Stats Section */}
      <Stats locale={locale} />

      {/* Features Section */}
      <Features locale={locale} />

      {/* FAQ Section */}
      <FAQ locale={locale} />

      {/* Call to Action */}
      <CallToAction locale={locale} variant="default" />
    </div>
  )
}
