import type { Metadata } from 'next'

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
    <div className="px-4 sm:px-6 lg:px-8 py-8 md:py-12 max-w-7xl mx-auto w-full">
      {children}
    </div>
  )
}
