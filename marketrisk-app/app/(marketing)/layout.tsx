import type { Metadata } from 'next'
import Header from '@/components/marketing/Header'
import Footer from '@/components/marketing/Footer'

export const metadata: Metadata = {
  title: 'MarketRisk - Monitorizare Risc de Credit',
  description: 'Verifică solvabilitatea partenerilor tăi de afaceri cu date din ANAF, PortalJust și BPI. Scor de risc calculat automat pentru orice firmă din România.',
}

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}
