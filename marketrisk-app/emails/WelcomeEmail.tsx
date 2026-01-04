// Welcome email template
// Sent when user signs up

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

interface WelcomeEmailProps {
  name: string
  locale?: 'ro' | 'en'
}

export default function WelcomeEmail({ name, locale = 'ro' }: WelcomeEmailProps) {
  const content = {
    ro: {
      preview: 'Bun venit la MarketRisk',
      title: 'Bun venit la MarketRisk!',
      greeting: `Bună, ${name}!`,
      body1: 'Vă mulțumim că v-ați alăturat MarketRisk, platforma de încredere pentru analiza riscurilor de credit în România.',
      body2: 'Cu contul dvs. gratuit, puteți:',
      feature1: '✓ Căuta până la 5 companii pe lună',
      feature2: '✓ Accesa date ANAF în timp real',
      feature3: '✓ Genera rapoarte PDF',
      body3: 'Gata să începeți? Explorați dashboard-ul dvs. și descoperiți riscurile companiilor românești.',
      cta: 'Accesează Dashboard',
      upgrade: 'Doriți mai multe? Upgrade la Professional pentru căutări nelimitate și alerte în timp real.',
      footer: 'Echipa MarketRisk',
      support: 'Aveți întrebări? Contactați-ne la support@marketrisk.ro',
    },
    en: {
      preview: 'Welcome to MarketRisk',
      title: 'Welcome to MarketRisk!',
      greeting: `Hi, ${name}!`,
      body1: 'Thank you for joining MarketRisk, the trusted platform for credit risk analysis in Romania.',
      body2: 'With your free account, you can:',
      feature1: '✓ Search up to 5 companies per month',
      feature2: '✓ Access real-time ANAF data',
      feature3: '✓ Generate PDF reports',
      body3: 'Ready to get started? Explore your dashboard and discover risks of Romanian companies.',
      cta: 'Go to Dashboard',
      upgrade: 'Want more? Upgrade to Professional for unlimited searches and real-time alerts.',
      footer: 'The MarketRisk Team',
      support: 'Have questions? Contact us at support@marketrisk.ro',
    },
  }

  const t = content[locale]
  const dashboardUrl = `https://marketrisk.ro/${locale}/app/dashboard`
  const pricingUrl = `https://marketrisk.ro/${locale}/pricing`

  return (
    <Html>
      <Head />
      <Preview>{t.preview}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>{t.title}</Heading>

          <Text style={text}>{t.greeting}</Text>

          <Text style={text}>{t.body1}</Text>

          <Text style={text}>{t.body2}</Text>

          <Section style={features}>
            <Text style={feature}>{t.feature1}</Text>
            <Text style={feature}>{t.feature2}</Text>
            <Text style={feature}>{t.feature3}</Text>
          </Section>

          <Text style={text}>{t.body3}</Text>

          <Section style={buttonContainer}>
            <Button style={button} href={dashboardUrl}>
              {t.cta}
            </Button>
          </Section>

          <Section style={upgradeBox}>
            <Text style={upgradeText}>{t.upgrade}</Text>
            <Button style={upgradeButton} href={pricingUrl}>
              {locale === 'ro' ? 'Vezi planurile' : 'View plans'}
            </Button>
          </Section>

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

const text = {
  color: '#333',
  fontSize: '16px',
  lineHeight: '26px',
  margin: '16px 0',
  padding: '0 40px',
}

const features = {
  padding: '0 40px',
  margin: '24px 0',
}

const feature = {
  color: '#2F5232',
  fontSize: '16px',
  lineHeight: '28px',
  margin: '8px 0',
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

const upgradeBox = {
  backgroundColor: '#f0f7f0',
  borderRadius: '8px',
  margin: '24px 40px',
  padding: '24px',
}

const upgradeText = {
  color: '#333',
  fontSize: '14px',
  lineHeight: '22px',
  margin: '0 0 16px 0',
}

const upgradeButton = {
  backgroundColor: '#8ACA74',
  borderRadius: '8px',
  color: '#2F5232',
  fontSize: '14px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '10px 20px',
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
