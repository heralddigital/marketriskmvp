import React from 'react'

export default function TermsPage() {
  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs text-text-muted mb-2">Terms</p>
        <h1 className="text-2xl font-semibold text-text-primary" style={{ letterSpacing: '-0.3px' }}>
          Terms of Service
        </h1>
        <p className="text-sm text-text-secondary mt-3 max-w-2xl">
          This is placeholder copy for the UI. Replace with your final Terms before production use.
        </p>
      </div>

      <section className="bg-white border border-border-subtle p-6 rounded-xl space-y-5">
        <div>
          <h2 className="text-lg font-medium text-text-primary mb-2">Use of the service</h2>
          <p className="text-sm text-text-secondary">
            You agree to use <span className="text-brand-mughal-green font-medium">marketrisk</span> responsibly and comply with applicable laws. Don't attempt to disrupt or access
            the service in unauthorized ways.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-medium text-text-primary mb-2">No financial advice</h2>
          <p className="text-sm text-text-secondary">
            <span className="text-brand-mughal-green font-medium">marketrisk</span> provides informational reporting tools. It does not provide investment, legal, or financial advice.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-medium text-text-primary mb-2">Limitation of liability</h2>
          <p className="text-sm text-text-secondary">
            To the maximum extent permitted by law, the service is provided “as is” without warranties, and liability is
            limited to fees paid (if any) for the applicable period.
          </p>
        </div>
      </section>
    </div>
  )
}


