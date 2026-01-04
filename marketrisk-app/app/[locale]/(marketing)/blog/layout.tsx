import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Blog - MarketRisk | Credit Risk Insights & Romanian B2B Guides',
  description: 'Practical guidance on calm reporting, trustworthy dashboards, Romanian B2B credit risk, CUI checks, BPI monitoring, and decision-ready summaries.',
  keywords: 'credit risk blog, Romanian B2B credit risk, CUI credit checks, BPI alerts, insolvency monitoring, risk reporting, SME credit risk, watchlist management',
  openGraph: {
    title: 'Blog - MarketRisk | Credit Risk Insights & Romanian B2B Guides',
    description: 'Practical guidance on calm reporting, trustworthy dashboards, Romanian B2B credit risk, CUI checks, BPI monitoring, and decision-ready summaries.',
    url: 'https://www.marketrisk.ro/blog',
    siteName: 'MarketRisk',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blog - MarketRisk | Credit Risk Insights & Romanian B2B Guides',
    description: 'Practical guidance on calm reporting, trustworthy dashboards, Romanian B2B credit risk, CUI checks, BPI monitoring, and decision-ready summaries.',
  },
  alternates: {
    canonical: 'https://www.marketrisk.ro/blog',
  },
}

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
