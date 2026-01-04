// Email notification helpers
// Send transactional emails for various events

import { sendEmailWithTemplate } from './resend'
import WelcomeEmail from '@/emails/WelcomeEmail'
import SubscriptionConfirmation from '@/emails/SubscriptionConfirmation'
import PaymentFailed from '@/emails/PaymentFailed'
import { getPlanConfig, type PlanId } from '../stripe/config'

/**
 * Send welcome email to new user
 */
export async function sendWelcomeEmail({
  to,
  name,
  locale = 'ro',
}: {
  to: string
  name: string
  locale?: 'ro' | 'en'
}) {
  const subject =
    locale === 'ro' ? 'Bun venit la MarketRisk!' : 'Welcome to MarketRisk!'

  return sendEmailWithTemplate({
    to,
    subject,
    template: WelcomeEmail({ name, locale }),
  })
}

/**
 * Send subscription confirmation email
 */
export async function sendSubscriptionConfirmationEmail({
  to,
  name,
  planId,
  nextBillingDate,
  locale = 'ro',
}: {
  to: string
  name: string
  planId: PlanId
  nextBillingDate: Date
  locale?: 'ro' | 'en'
}) {
  const plan = getPlanConfig(planId)
  const planName = locale === 'ro' ? plan.nameRo : plan.name

  const subject =
    locale === 'ro'
      ? `Confirmare abonament ${planName}`
      : `${planName} subscription confirmation`

  const formattedDate = nextBillingDate.toLocaleDateString(
    locale === 'ro' ? 'ro-RO' : 'en-US',
    {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }
  )

  const price = plan.price ? `€${plan.price}/${locale === 'ro' ? 'lună' : 'month'}` : 'Custom'

  return sendEmailWithTemplate({
    to,
    subject,
    template: SubscriptionConfirmation({
      name,
      planName,
      price,
      features: plan.features[locale],
      nextBillingDate: formattedDate,
      locale,
    }),
  })
}

/**
 * Send payment failed email
 */
export async function sendPaymentFailedEmail({
  to,
  name,
  planId,
  attemptDate,
  nextAttemptDate,
  locale = 'ro',
}: {
  to: string
  name: string
  planId: PlanId
  attemptDate: Date
  nextAttemptDate: Date
  locale?: 'ro' | 'en'
}) {
  const plan = getPlanConfig(planId)
  const planName = locale === 'ro' ? plan.nameRo : plan.name

  const subject =
    locale === 'ro'
      ? 'Problemă cu plata abonamentului'
      : 'Subscription payment issue'

  const formatDate = (date: Date) =>
    date.toLocaleDateString(locale === 'ro' ? 'ro-RO' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })

  return sendEmailWithTemplate({
    to,
    subject,
    template: PaymentFailed({
      name,
      planName,
      attemptDate: formatDate(attemptDate),
      nextAttempt: formatDate(nextAttemptDate),
      locale,
    }),
  })
}

/**
 * Send subscription canceled email
 */
export async function sendSubscriptionCanceledEmail({
  to,
  name,
  planId,
  endDate,
  locale = 'ro',
}: {
  to: string
  name: string
  planId: PlanId
  endDate: Date
  locale?: 'ro' | 'en'
}) {
  const plan = getPlanConfig(planId)
  const planName = locale === 'ro' ? plan.nameRo : plan.name

  const subject =
    locale === 'ro' ? 'Abonament anulat' : 'Subscription canceled'

  const formattedDate = endDate.toLocaleDateString(
    locale === 'ro' ? 'ro-RO' : 'en-US',
    {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }
  )

  const html = `
    <h1>${subject}</h1>
    <p>${locale === 'ro' ? 'Bună' : 'Hi'}, ${name}</p>
    <p>${
      locale === 'ro'
        ? `Abonamentul dvs. ${planName} a fost anulat.`
        : `Your ${planName} subscription has been canceled.`
    }</p>
    <p>${
      locale === 'ro'
        ? `Veți continua să aveți acces până la ${formattedDate}.`
        : `You will continue to have access until ${formattedDate}.`
    }</p>
    <p>${
      locale === 'ro'
        ? 'După această dată, contul dvs. va fi retrogradat la planul gratuit.'
        : 'After this date, your account will be downgraded to the free plan.'
    }</p>
    <p>${
      locale === 'ro'
        ? 'Vă mulțumim că ați folosit MarketRisk!'
        : 'Thank you for using MarketRisk!'
    }</p>
  `

  const { sendEmail } = await import('./resend')

  return sendEmail({
    to,
    subject,
    html,
  })
}

/**
 * Send invoice paid email (receipt)
 */
export async function sendInvoiceReceiptEmail({
  to,
  name,
  amount,
  invoiceUrl,
  locale = 'ro',
}: {
  to: string
  name: string
  amount: string
  invoiceUrl: string
  locale?: 'ro' | 'en'
}) {
  const subject = locale === 'ro' ? 'Chitanță plată MarketRisk' : 'MarketRisk payment receipt'

  const html = `
    <h1>${subject}</h1>
    <p>${locale === 'ro' ? 'Bună' : 'Hi'}, ${name}</p>
    <p>${
      locale === 'ro'
        ? `Am primit plata dvs. de ${amount}. Vă mulțumim!`
        : `We received your payment of ${amount}. Thank you!`
    }</p>
    <p>
      <a href="${invoiceUrl}" style="background-color: #2F5232; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block;">
        ${locale === 'ro' ? 'Descarcă factura' : 'Download invoice'}
      </a>
    </p>
    <p>${
      locale === 'ro'
        ? 'Dacă aveți întrebări, contactați-ne la support@marketrisk.ro'
        : 'If you have questions, contact us at support@marketrisk.ro'
    }</p>
  `

  const { sendEmail } = await import('./resend')

  return sendEmail({
    to,
    subject,
    html,
  })
}
