'use client'

import { useState } from 'react'
import { redirectToPortal } from '@/lib/stripe/client'
import { getPlanConfig, getDisplayPrice, type PlanId } from '@/lib/stripe/config'
import { CreditCard, Calendar, AlertCircle, CheckCircle2 } from 'lucide-react'

interface SubscriptionCardProps {
  userId: string
  currentPlan: PlanId
  subscriptionStatus: string | null
  periodEnd: string | null
  locale: 'ro' | 'en'
}

export function SubscriptionCard({
  userId,
  currentPlan,
  subscriptionStatus,
  periodEnd,
  locale,
}: SubscriptionCardProps) {
  const [isLoading, setIsLoading] = useState(false)

  const plan = getPlanConfig(currentPlan)

  const handleManageSubscription = async () => {
    setIsLoading(true)
    try {
      await redirectToPortal()
    } catch (error) {
      console.error('Error opening customer portal:', error)
      alert(
        locale === 'ro'
          ? 'A apărut o eroare. Vă rugăm încercați din nou.'
          : 'An error occurred. Please try again.'
      )
    } finally {
      setIsLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString(locale === 'ro' ? 'ro-RO' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const getStatusColor = (status: string | null) => {
    switch (status) {
      case 'active':
      case 'trialing':
        return 'text-green-600 bg-green-50'
      case 'past_due':
        return 'text-yellow-600 bg-yellow-50'
      case 'canceled':
      case 'incomplete':
      case 'unpaid':
        return 'text-red-600 bg-red-50'
      default:
        return 'text-gray-600 bg-gray-50'
    }
  }

  const getStatusText = (status: string | null) => {
    if (!status || status === 'free') {
      return locale === 'ro' ? 'Gratuit' : 'Free'
    }

    const statusMap = {
      ro: {
        active: 'Activ',
        trialing: 'Perioadă de probă',
        past_due: 'Plată restantă',
        canceled: 'Anulat',
        incomplete: 'Incomplet',
        unpaid: 'Neplătit',
      },
      en: {
        active: 'Active',
        trialing: 'Trialing',
        past_due: 'Past Due',
        canceled: 'Canceled',
        incomplete: 'Incomplete',
        unpaid: 'Unpaid',
      },
    }

    return statusMap[locale][status as keyof typeof statusMap['ro']] || status
  }

  const content = {
    ro: {
      title: 'Abonament curent',
      status: 'Status',
      renewsOn: 'Se reînnoiește pe',
      endsOn: 'Se încheie pe',
      features: 'Caracteristici incluse',
      manage: 'Gestionează abonamentul',
      upgrade: 'Fă upgrade',
      loading: 'Se încarcă...',
    },
    en: {
      title: 'Current subscription',
      status: 'Status',
      renewsOn: 'Renews on',
      endsOn: 'Ends on',
      features: 'Included features',
      manage: 'Manage subscription',
      upgrade: 'Upgrade',
      loading: 'Loading...',
    },
  }

  const t = content[locale]
  const planName = locale === 'ro' ? plan.nameRo : plan.name

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">{t.title}</h2>
        {subscriptionStatus !== 'free' && subscriptionStatus !== 'canceled' && (
          <button
            onClick={handleManageSubscription}
            disabled={isLoading}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#2F5232] text-white rounded-lg text-sm font-medium hover:bg-[#1a2e1b] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <CreditCard className="w-4 h-4" />
            {isLoading ? t.loading : t.manage}
          </button>
        )}
      </div>

      {/* Plan Info */}
      <div className="space-y-4">
        {/* Plan Name and Price */}
        <div className="flex items-baseline justify-between">
          <div>
            <h3 className="text-2xl font-bold text-gray-900">{planName}</h3>
            <p className="text-sm text-gray-600 mt-1">
              {getDisplayPrice(currentPlan, locale)}
              {plan.price !== null && plan.price > 0 && (
                <span className="text-gray-500">
                  {' '}
                  / {locale === 'ro' ? 'lună' : 'month'}
                </span>
              )}
            </p>
          </div>

          {/* Status Badge */}
          <span
            className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(subscriptionStatus)}`}
          >
            {subscriptionStatus === 'active' || subscriptionStatus === 'trialing' ? (
              <CheckCircle2 className="w-4 h-4" />
            ) : (
              <AlertCircle className="w-4 h-4" />
            )}
            {getStatusText(subscriptionStatus)}
          </span>
        </div>

        {/* Period End */}
        {periodEnd && subscriptionStatus !== 'canceled' && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="w-4 h-4" />
            <span>
              {subscriptionStatus === 'active' ? t.renewsOn : t.endsOn}:{' '}
              <span className="font-medium">{formatDate(periodEnd)}</span>
            </span>
          </div>
        )}

        {/* Features List */}
        <div className="pt-4 border-t border-gray-200">
          <h4 className="text-sm font-medium text-gray-700 mb-3">{t.features}</h4>
          <ul className="space-y-2">
            {plan.features[locale].map((feature, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                <CheckCircle2 className="w-4 h-4 text-[#2F5232] flex-shrink-0 mt-0.5" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Upgrade CTA for free users */}
        {currentPlan === 'free' && (
          <div className="pt-4 border-t border-gray-200">
            <a
              href={`/${locale}/pricing`}
              className="block w-full text-center py-3 bg-[#2F5232] text-white rounded-lg font-medium hover:bg-[#1a2e1b] transition-colors"
            >
              {t.upgrade}
            </a>
          </div>
        )}
      </div>
    </div>
  )
}
