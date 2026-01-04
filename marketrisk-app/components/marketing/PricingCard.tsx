'use client'

import { useState } from 'react'
import { Check, Loader2 } from 'lucide-react'
import { createAndRedirectToCheckout } from '@/lib/stripe/client'
import { type PlanId, getPlanConfig } from '@/lib/stripe/config'

interface PricingCardProps {
  planId: PlanId
  locale: 'ro' | 'en'
  isAuthenticated: boolean
  currentPlan?: PlanId
}

export function PricingCard({
  planId,
  locale,
  isAuthenticated,
  currentPlan,
}: PricingCardProps) {
  const [isLoading, setIsLoading] = useState(false)
  const plan = getPlanConfig(planId)
  const isCurrentPlan = currentPlan === planId

  const handleSubscribe = async () => {
    if (!isAuthenticated) {
      // Redirect to signup with return URL
      window.location.href = `/${locale}/signup?returnTo=/pricing&plan=${planId}`
      return
    }

    if (planId === 'enterprise') {
      // Redirect to contact page for enterprise
      window.location.href = `/${locale}/contact?plan=enterprise`
      return
    }

    if (planId === 'free') {
      // No checkout needed for free plan
      return
    }

    setIsLoading(true)
    try {
      await createAndRedirectToCheckout(planId)
    } catch (error) {
      console.error('Error starting checkout:', error)
      alert(
        locale === 'ro'
          ? 'A apărut o eroare. Vă rugăm încercați din nou.'
          : 'An error occurred. Please try again.'
      )
      setIsLoading(false)
    }
  }

  const content = {
    ro: {
      perMonth: '/lună',
      startFree: 'Începe gratuit',
      choosePlan: 'Alege planul',
      currentPlan: 'Plan curent',
      contactSales: 'Contactează vânzări',
      custom: 'Personalizat',
    },
    en: {
      perMonth: '/month',
      startFree: 'Start free',
      choosePlan: 'Choose plan',
      currentPlan: 'Current plan',
      contactSales: 'Contact sales',
      custom: 'Custom',
    },
  }

  const t = content[locale]
  const planName = locale === 'ro' ? plan.nameRo : plan.name
  const description =
    locale === 'ro'
      ? plan.features.ro[0] // Use first feature as description
      : plan.features.en[0]

  const getButtonText = () => {
    if (isCurrentPlan) return t.currentPlan
    if (planId === 'free') return t.startFree
    if (planId === 'enterprise') return t.contactSales
    return t.choosePlan
  }

  const getButtonStyle = () => {
    if (isCurrentPlan) {
      return 'bg-gray-100 text-gray-600 cursor-default'
    }
    if (plan.popular) {
      return 'bg-[#2F5232] text-white hover:bg-[#1a2e1b]'
    }
    return 'bg-gray-100 text-gray-900 hover:bg-gray-200'
  }

  return (
    <div
      className={`relative bg-white rounded-2xl p-8 ${
        plan.popular ? 'border-2 border-[#2F5232] shadow-xl' : 'border border-gray-200'
      }`}
    >
      {plan.popular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#2F5232] text-white px-4 py-1 rounded-full text-sm font-medium">
          {locale === 'ro' ? 'Popular' : 'Popular'}
        </div>
      )}

      <div className="mb-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">{planName}</h3>
        <div className="flex items-baseline mb-4">
          {plan.price === null ? (
            <span className="text-4xl font-bold text-gray-900">{t.custom}</span>
          ) : (
            <>
              <span className="text-4xl font-bold text-gray-900">
                {plan.price === 0 ? (locale === 'ro' ? 'Gratuit' : 'Free') : `€${plan.price}`}
              </span>
              {plan.price > 0 && (
                <span className="text-gray-600 ml-1">{t.perMonth}</span>
              )}
            </>
          )}
        </div>
      </div>

      <ul className="space-y-3 mb-8">
        {plan.features[locale].map((feature, idx) => (
          <li key={idx} className="flex items-start gap-2">
            <Check className="w-5 h-5 text-[#2F5232] flex-shrink-0 mt-0.5" />
            <span className="text-gray-700 text-sm">{feature}</span>
          </li>
        ))}
      </ul>

      <button
        onClick={handleSubscribe}
        disabled={isLoading || isCurrentPlan}
        className={`w-full py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${getButtonStyle()}`}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            {locale === 'ro' ? 'Se încarcă...' : 'Loading...'}
          </>
        ) : (
          getButtonText()
        )}
      </button>
    </div>
  )
}
