// Resend email client and utilities
// Use this for sending transactional emails

import { Resend } from 'resend'

/**
 * Initialize Resend client
 * Singleton pattern
 */
let resendInstance: Resend | null = null

export function getResend(): Resend {
  if (!process.env.RESEND_API_KEY) {
    throw new Error('RESEND_API_KEY is not set in environment variables')
  }

  if (!resendInstance) {
    resendInstance = new Resend(process.env.RESEND_API_KEY)
  }

  return resendInstance
}

/**
 * Email sender configuration
 */
export const EMAIL_CONFIG = {
  from: process.env.EMAIL_FROM || 'MarketRisk <noreply@marketrisk.ro>',
  replyTo: 'support@marketrisk.ro',
  support: 'support@marketrisk.ro',
  sales: 'sales@marketrisk.ro',
} as const

/**
 * Send email using Resend
 */
export async function sendEmail({
  to,
  subject,
  html,
  text,
  replyTo,
}: {
  to: string | string[]
  subject: string
  html: string
  text?: string
  replyTo?: string
}) {
  const resend = getResend()

  try {
    const { data, error } = await resend.emails.send({
      from: EMAIL_CONFIG.from,
      to: Array.isArray(to) ? to : [to],
      subject,
      html,
      text,
      replyTo: replyTo || EMAIL_CONFIG.replyTo,
    })

    if (error) {
      console.error('Error sending email:', error)
      throw error
    }

    console.log('Email sent successfully:', data?.id)
    return data
  } catch (error) {
    console.error('Failed to send email:', error)
    throw error
  }
}

/**
 * Send email with React Email template
 */
export async function sendEmailWithTemplate({
  to,
  subject,
  template,
  replyTo,
}: {
  to: string | string[]
  subject: string
  template: React.ReactElement
  replyTo?: string
}) {
  const resend = getResend()

  try {
    const { data, error } = await resend.emails.send({
      from: EMAIL_CONFIG.from,
      to: Array.isArray(to) ? to : [to],
      subject,
      react: template,
      replyTo: replyTo || EMAIL_CONFIG.replyTo,
    })

    if (error) {
      console.error('Error sending email:', error)
      throw error
    }

    console.log('Email sent successfully:', data?.id)
    return data
  } catch (error) {
    console.error('Failed to send email:', error)
    throw error
  }
}
