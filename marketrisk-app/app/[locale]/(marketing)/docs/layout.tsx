import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Documentation - MarketRisk | API Reference, Integration Guides & Risk Algorithm',
  description: 'Complete MarketRisk documentation: understand our risk scoring algorithm, integrate via REST API, explore webhook automation, and learn best practices for Romanian B2B credit monitoring.',
  keywords: 'MarketRisk API, credit risk API, Romanian company API, CUI monitoring API, risk score algorithm, ANAF integration, BPI monitoring, webhook integration, credit monitoring documentation',
  openGraph: {
    title: 'Documentation - MarketRisk | API Reference & Integration Guides',
    description: 'Complete MarketRisk documentation: understand our risk scoring algorithm, integrate via REST API, explore webhook automation, and learn best practices for Romanian B2B credit monitoring.',
    url: 'https://www.marketrisk.ro/docs',
    siteName: 'MarketRisk',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Documentation - MarketRisk | API Reference & Integration Guides',
    description: 'Complete MarketRisk documentation: understand our risk scoring algorithm, integrate via REST API, explore webhook automation, and learn best practices for Romanian B2B credit monitoring.',
  },
  alternates: {
    canonical: 'https://www.marketrisk.ro/docs',
  },
}

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
