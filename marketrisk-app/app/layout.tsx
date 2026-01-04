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
  // Since we're using internationalized routing with app/[locale]/layout.tsx,
  // we normally want the locale layout to handle the html/body tags.
  // However, Next.js expects the ROOT layout to contain them if they are missing.
  // In a [locale] setup, the distinct root layout (this file) should essentially pass through,
  // BUT Next.js 13+ app directory structure requires the actual root layout to define <html> and <body>
  // if it's the top-level layout file.

  // The structure here is:
  // app/layout.tsx (ROOT) -> app/[locale]/layout.tsx (LOCALE ROOT)

  // If we return just 'children', Next.js complains.
  // We should actually NOT have this app/layout.tsx if we want [locale] to be the root,
  // OR we need to let [locale] handle it and remove this file,
  // OR we keep this file but make it a true root layout that handles the language agnostic parts.

  // Given the error, let's wrap it in a minimal structure, but the [locale] layout
  // will eventually override the language attribute.

  return (
    <html suppressHydrationWarning>
      <body suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
