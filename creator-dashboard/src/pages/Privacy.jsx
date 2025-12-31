import React from 'react'

export default function PrivacyPage() {
  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs text-text-muted mb-2">Privacy</p>
        <h1 className="text-2xl font-semibold text-text-primary" style={{ letterSpacing: '-0.3px' }}>
          Privacy Policy
        </h1>
        <p className="text-sm text-text-secondary mt-3 max-w-2xl">
          This is a demo policy for the UI. Replace with your legal text before shipping.
        </p>
      </div>

      <section className="bg-white border border-border-subtle p-6 rounded-xl space-y-5">
        <div>
          <h2 className="text-lg font-medium text-text-primary mb-2">What we collect</h2>
          <p className="text-sm text-text-secondary">
            Basic account details (like name and email), plus usage data to improve the product. We aim to collect the
            minimum needed to operate <span className="text-brand-mughal-green font-medium">marketrisk</span>.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-medium text-text-primary mb-2">How we use it</h2>
          <ul className="space-y-2">
            <li className="text-sm text-text-secondary flex items-start gap-2">
              <span className="text-brand-mughal-green mt-[2px]">•</span>
              <span>Provide the service and support requests</span>
            </li>
            <li className="text-sm text-text-secondary flex items-start gap-2">
              <span className="text-brand-mughal-green mt-[2px]">•</span>
              <span>Improve reliability, performance, and UX</span>
            </li>
            <li className="text-sm text-text-secondary flex items-start gap-2">
              <span className="text-brand-mughal-green mt-[2px]">•</span>
              <span>Security monitoring and fraud prevention</span>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-lg font-medium text-text-primary mb-2">Your choices</h2>
          <p className="text-sm text-text-secondary">
            You can request access, correction, or deletion of personal data. Contact us using the details on the
            Contact page.
          </p>
        </div>
      </section>
    </div>
  )
}


