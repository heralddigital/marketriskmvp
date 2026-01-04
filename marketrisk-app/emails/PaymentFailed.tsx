// Payment failed email
// Sent when subscription payment fails

import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components'

interface PaymentFailedProps {
  name: string
  planName: string
  attemptDate: string
  nextAttempt: string
  locale?: 'ro' | 'en'
}

export default function PaymentFailed({
  name,
  planName,
  attemptDate,
  nextAttempt,
  locale = 'ro',
}: PaymentFailedProps) {
  const content = {
    ro: {
      preview: 'Plata dvs. nu a reușit',
      title: 'Problemă cu plata',
      greeting: `Bună, ${name}`,
      body1: `Nu am putut procesa plata pentru abonamentul dvs. ${planName}.`,
      details: 'Detalii:',
      attemptLabel: 'Data încercării',
      nextLabel: 'Următoarea încercare',
      body2: 'Încercăm automat din nou să procesăm plata în următoarele zile. Pentru a evita întreruperea serviciului, vă rugăm să actualizați metoda de plată.',
      reasons: 'Motive frecvente:',
      reason1: '• Fonduri insuficiente în cont',
      reason2: '• Cardul a expirat',
      reason3: '• Limită de cheltuieli depășită',
      reason4: '• Card blocat de bancă',
      action: 'Ce trebuie să faceți:',
      actionText: 'Actualizați metoda de plată în setări pentru a preveni suspendarea serviciului.',
      cta: 'Actualizează metoda de plată',
      support: 'Dacă aveți întrebări sau aveți nevoie de ajutor, contactați-ne la support@marketrisk.ro',
      footer: 'Echipa MarketRisk',
    },
    en: {
      preview: 'Your payment failed',
      title: 'Payment issue',
      greeting: `Hi, ${name}`,
      body1: `We couldn't process the payment for your ${planName} subscription.`,
      details: 'Details:',
      attemptLabel: 'Attempt date',
      nextLabel: 'Next attempt',
      body2: 'We automatically retry processing the payment over the next few days. To avoid service interruption, please update your payment method.',
      reasons: 'Common reasons:',
      reason1: '• Insufficient funds',
      reason2: '• Card expired',
      reason3: '• Spending limit exceeded',
      reason4: '• Card blocked by bank',
      action: 'What you need to do:',
      actionText: 'Update your payment method in settings to prevent service suspension.',
      cta: 'Update payment method',
      support: 'If you have questions or need help, contact us at support@marketrisk.ro',
      footer: 'The MarketRisk Team',
    },
  }

  const t = content[locale]
  const manageUrl = `https://marketrisk.ro/${locale}/app/settings`

  return (
    <Html>
      <Head />
      <Preview>{t.preview}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={warningBanner}>
            <Text style={warningIcon}>⚠️</Text>
            <Heading style={h1}>{t.title}</Heading>
          </Section>

          <Text style={text}>{t.greeting},</Text>

          <Text style={text}>{t.body1}</Text>

          <Section style={detailsBox}>
            <Text style={detailsTitle}>{t.details}</Text>
            <table style={detailsTable}>
              <tr>
                <td style={detailsLabel}>{t.attemptLabel}:</td>
                <td style={detailsValue}>{attemptDate}</td>
              </tr>
              <tr>
                <td style={detailsLabel}>{t.nextLabel}:</td>
                <td style={detailsValue}>{nextAttempt}</td>
              </tr>
            </table>
          </Section>

          <Text style={text}>{t.body2}</Text>

          <Section style={reasonsSection}>
            <Text style={reasonsTitle}>{t.reasons}</Text>
            <Text style={reasonText}>{t.reason1}</Text>
            <Text style={reasonText}>{t.reason2}</Text>
            <Text style={reasonText}>{t.reason3}</Text>
            <Text style={reasonText}>{t.reason4}</Text>
          </Section>

          <Section style={actionBox}>
            <Text style={actionTitle}>{t.action}</Text>
            <Text style={actionText}>{t.actionText}</Text>
          </Section>

          <Section style={buttonContainer}>
            <Button style={button} href={manageUrl}>
              {t.cta}
            </Button>
          </Section>

          <Text style={supportText}>{t.support}</Text>

          <Text style={footer}>{t.footer}</Text>
        </Container>
      </Body>
    </Html>
  )
}

// Styles
const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
}

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
  maxWidth: '600px',
}

const warningBanner = {
  backgroundColor: '#fef3c7',
  borderTop: '4px solid #f59e0b',
  padding: '24px 40px',
  textAlign: 'center' as const,
}

const warningIcon = {
  fontSize: '48px',
  margin: '0',
}

const h1 = {
  color: '#92400e',
  fontSize: '28px',
  fontWeight: 'bold',
  margin: '16px 0 0',
}

const text = {
  color: '#333',
  fontSize: '16px',
  lineHeight: '26px',
  margin: '16px 0',
  padding: '0 40px',
}

const detailsBox = {
  backgroundColor: '#fff7ed',
  border: '1px solid #fed7aa',
  borderRadius: '8px',
  margin: '24px 40px',
  padding: '20px',
}

const detailsTitle = {
  color: '#92400e',
  fontSize: '14px',
  fontWeight: 'bold',
  margin: '0 0 12px 0',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.5px',
}

const detailsTable = {
  width: '100%',
}

const detailsLabel = {
  color: '#92400e',
  fontSize: '14px',
  padding: '6px 0',
}

const detailsValue = {
  color: '#451a03',
  fontSize: '14px',
  fontWeight: '600',
  padding: '6px 0',
}

const reasonsSection = {
  padding: '0 40px',
  margin: '24px 0',
}

const reasonsTitle = {
  color: '#92400e',
  fontSize: '16px',
  fontWeight: 'bold',
  margin: '0 0 12px 0',
}

const reasonText = {
  color: '#451a03',
  fontSize: '14px',
  lineHeight: '24px',
  margin: '6px 0',
}

const actionBox = {
  backgroundColor: '#fef3c7',
  borderRadius: '8px',
  margin: '24px 40px',
  padding: '20px',
}

const actionTitle = {
  color: '#92400e',
  fontSize: '16px',
  fontWeight: 'bold',
  margin: '0 0 8px 0',
}

const actionText = {
  color: '#451a03',
  fontSize: '14px',
  lineHeight: '22px',
  margin: '0',
}

const buttonContainer = {
  padding: '24px 40px',
  textAlign: 'center' as const,
}

const button = {
  backgroundColor: '#f59e0b',
  borderRadius: '8px',
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '14px 32px',
}

const supportText = {
  color: '#666',
  fontSize: '14px',
  lineHeight: '22px',
  margin: '24px 0',
  padding: '0 40px',
  textAlign: 'center' as const,
}

const footer = {
  color: '#2F5232',
  fontSize: '16px',
  fontWeight: 'bold',
  margin: '32px 0',
  padding: '0 40px',
  textAlign: 'center' as const,
}
