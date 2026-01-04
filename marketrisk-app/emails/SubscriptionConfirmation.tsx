// Subscription confirmation email
// Sent when user successfully subscribes to a paid plan

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
  Hr,
} from '@react-email/components'

interface SubscriptionConfirmationProps {
  name: string
  planName: string
  price: string
  features: string[]
  nextBillingDate: string
  locale?: 'ro' | 'en'
}

export default function SubscriptionConfirmation({
  name,
  planName,
  price,
  features,
  nextBillingDate,
  locale = 'ro',
}: SubscriptionConfirmationProps) {
  const content = {
    ro: {
      preview: 'Confirmare abonament MarketRisk',
      title: 'Abonamentul dvs. este activ!',
      greeting: `Bună, ${name}!`,
      body1: `Vă mulțumim pentru abonarea la planul ${planName}. Abonamentul dvs. este acum activ.`,
      details: 'Detalii abonament:',
      plan: 'Plan',
      amount: 'Sumă',
      nextBilling: 'Următoarea facturare',
      included: 'Ce este inclus:',
      body2: 'Puteți accesa toate funcțiile premium imediat din dashboard-ul dvs.',
      cta: 'Accesează Dashboard',
      manage: 'Gestionați abonamentul',
      manageText: 'Puteți actualiza metoda de plată sau anula abonamentul oricând din setări.',
      manageButton: 'Gestionează abonamentul',
      invoice: 'Veți primi o factură prin email în scurt timp.',
      footer: 'Echipa MarketRisk',
      support: 'Aveți întrebări? Contactați-ne la support@marketrisk.ro',
    },
    en: {
      preview: 'MarketRisk subscription confirmation',
      title: 'Your subscription is active!',
      greeting: `Hi, ${name}!`,
      body1: `Thank you for subscribing to the ${planName} plan. Your subscription is now active.`,
      details: 'Subscription details:',
      plan: 'Plan',
      amount: 'Amount',
      nextBilling: 'Next billing',
      included: "What's included:",
      body2: 'You can access all premium features immediately from your dashboard.',
      cta: 'Go to Dashboard',
      manage: 'Manage subscription',
      manageText: 'You can update your payment method or cancel your subscription anytime from settings.',
      manageButton: 'Manage subscription',
      invoice: 'You will receive an invoice via email shortly.',
      footer: 'The MarketRisk Team',
      support: 'Have questions? Contact us at support@marketrisk.ro',
    },
  }

  const t = content[locale]
  const dashboardUrl = `https://marketrisk.ro/${locale}/app/dashboard`
  const manageUrl = `https://marketrisk.ro/${locale}/app/settings`

  return (
    <Html>
      <Head />
      <Preview>{t.preview}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>{t.title}</Heading>

          <Text style={text}>{t.greeting}</Text>

          <Text style={text}>{t.body1}</Text>

          <Section style={detailsBox}>
            <Text style={detailsTitle}>{t.details}</Text>

            <table style={detailsTable}>
              <tr>
                <td style={detailsLabel}>{t.plan}:</td>
                <td style={detailsValue}>{planName}</td>
              </tr>
              <tr>
                <td style={detailsLabel}>{t.amount}:</td>
                <td style={detailsValue}>{price}</td>
              </tr>
              <tr>
                <td style={detailsLabel}>{t.nextBilling}:</td>
                <td style={detailsValue}>{nextBillingDate}</td>
              </tr>
            </table>
          </Section>

          <Section style={featuresSection}>
            <Text style={featuresTitle}>{t.included}</Text>
            {features.map((feature, index) => (
              <Text key={index} style={featureItem}>
                ✓ {feature}
              </Text>
            ))}
          </Section>

          <Text style={text}>{t.body2}</Text>

          <Section style={buttonContainer}>
            <Button style={button} href={dashboardUrl}>
              {t.cta}
            </Button>
          </Section>

          <Hr style={hr} />

          <Section style={manageSection}>
            <Heading as="h2" style={h2}>
              {t.manage}
            </Heading>
            <Text style={manageText}>{t.manageText}</Text>
            <Button style={secondaryButton} href={manageUrl}>
              {t.manageButton}
            </Button>
          </Section>

          <Text style={invoiceText}>{t.invoice}</Text>

          <Text style={footer}>{t.footer}</Text>
          <Text style={supportText}>{t.support}</Text>
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

const h1 = {
  color: '#2F5232',
  fontSize: '32px',
  fontWeight: 'bold',
  margin: '40px 0',
  padding: '0 40px',
  textAlign: 'center' as const,
}

const h2 = {
  color: '#2F5232',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '0 0 16px 0',
}

const text = {
  color: '#333',
  fontSize: '16px',
  lineHeight: '26px',
  margin: '16px 0',
  padding: '0 40px',
}

const detailsBox = {
  backgroundColor: '#f9fafb',
  border: '1px solid #e5e7eb',
  borderRadius: '8px',
  margin: '24px 40px',
  padding: '24px',
}

const detailsTitle = {
  color: '#2F5232',
  fontSize: '14px',
  fontWeight: 'bold',
  margin: '0 0 16px 0',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.5px',
}

const detailsTable = {
  width: '100%',
  borderCollapse: 'collapse' as const,
}

const detailsLabel = {
  color: '#666',
  fontSize: '14px',
  padding: '8px 0',
  width: '40%',
}

const detailsValue = {
  color: '#333',
  fontSize: '14px',
  fontWeight: '600',
  padding: '8px 0',
}

const featuresSection = {
  margin: '24px 40px',
}

const featuresTitle = {
  color: '#2F5232',
  fontSize: '16px',
  fontWeight: 'bold',
  margin: '0 0 12px 0',
}

const featureItem = {
  color: '#2F5232',
  fontSize: '14px',
  lineHeight: '24px',
  margin: '6px 0',
}

const buttonContainer = {
  padding: '24px 40px',
}

const button = {
  backgroundColor: '#2F5232',
  borderRadius: '8px',
  color: '#fff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  padding: '12px 24px',
}

const hr = {
  borderColor: '#e5e7eb',
  margin: '32px 40px',
}

const manageSection = {
  padding: '0 40px',
}

const manageText = {
  color: '#666',
  fontSize: '14px',
  lineHeight: '22px',
  margin: '0 0 16px 0',
}

const secondaryButton = {
  backgroundColor: '#ffffff',
  border: '1px solid #2F5232',
  borderRadius: '8px',
  color: '#2F5232',
  fontSize: '14px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '10px 20px',
}

const invoiceText = {
  color: '#666',
  fontSize: '14px',
  fontStyle: 'italic',
  margin: '24px 0',
  padding: '0 40px',
}

const footer = {
  color: '#2F5232',
  fontSize: '16px',
  fontWeight: 'bold',
  margin: '32px 0 8px',
  padding: '0 40px',
}

const supportText = {
  color: '#666',
  fontSize: '14px',
  lineHeight: '22px',
  margin: '8px 0',
  padding: '0 40px',
}
