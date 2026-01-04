import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'FAQ - MarketRisk | Frequently Asked Questions about Credit Risk Monitoring',
  description: 'Find answers to common questions about MarketRisk: pricing, features, security, support, and more. Get help with credit risk monitoring for Romanian SMEs and B2B companies.',
  keywords: 'FAQ, frequently asked questions, MarketRisk help, credit risk monitoring questions, Romanian SME support, CUI monitoring help, ANAF API support, BPI alerts FAQ',
  openGraph: {
    title: 'FAQ - MarketRisk | Frequently Asked Questions',
    description: 'Find answers to common questions about MarketRisk: pricing, features, security, support, and more. Get help with credit risk monitoring for Romanian SMEs and B2B companies.',
    url: 'https://www.marketrisk.ro/faq',
    siteName: 'MarketRisk',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FAQ - MarketRisk | Frequently Asked Questions',
    description: 'Find answers to common questions about MarketRisk: pricing, features, security, support, and more. Get help with credit risk monitoring for Romanian SMEs and B2B companies.',
  },
  alternates: {
    canonical: 'https://www.marketrisk.ro/faq',
  },
}

export default function FAQLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
