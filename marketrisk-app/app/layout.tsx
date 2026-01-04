// Root layout - minimal wrapper
// The actual HTML structure is in app/[locale]/layout.tsx
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MarketRisk - Credit Risk Monitoring for Romanian B2B",
  description: "Monitor credit risk, track insolvency alerts, and protect your cashflow with real-time BPI monitoring and CUI credit checks.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_URL || 'https://marketrisk.ro'),
  openGraph: {
    type: 'website',
    siteName: 'MarketRisk',
    images: [
      {
        url: '/logos/og-image.png',
        width: 1200,
        height: 630,
        alt: 'MarketRisk - Credit Risk Analysis Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    creator: '@marketrisk',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
