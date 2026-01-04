'use client'

import React from 'react'
import Link from 'next/link'
import { CheckCircle2 } from 'lucide-react'

export default function DocumentationPage() {
  const [activeSection, setActiveSection] = React.useState('overview')

  const sections = [
    { id: 'overview', label: 'Overview' },
    { id: 'algorithm', label: 'Risk Scoring Algorithm' },
    { id: 'api', label: 'API Reference' },
    { id: 'integration', label: 'Integration Guide' },
  ]

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section>
        <div>
          <p className="text-xs text-text-muted mb-2">Documentation</p>
          <h1 className="text-3xl md:text-4xl font-semibold text-text-primary mb-4" style={{ letterSpacing: '-0.5px' }}>
            Developer & Algorithm Documentation
          </h1>
          <p className="text-lg text-text-secondary max-w-3xl">
            Everything you need to understand our risk scoring algorithm, integrate with our API, and make informed decisions using <span className="text-brand-mughal-green font-medium">marketrisk</span> data.
          </p>
        </div>
      </section>

      {/* Navigation Tabs */}
      <section>
        <div className="border-b border-border-subtle">
          <nav className="flex gap-6 -mb-px">
            {sections.map((section) => (
              <button
                key={section.id}
                type="button"
                onClick={() => {
                  setActiveSection(section.id)
                  document.getElementById(section.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                }}
                className={`pb-4 px-1 text-sm font-medium transition-colors duration-normal border-b-2 ${
                  activeSection === section.id
                    ? 'text-brand-mughal-green border-brand-mughal-green'
                    : 'text-text-secondary border-transparent hover:text-text-primary hover:border-border-subtle'
                }`}
              >
                {section.label}
              </button>
            ))}
          </nav>
        </div>
      </section>

      {/* Overview Section */}
      <section id="overview" className="scroll-mt-8">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-text-primary mb-4" style={{ letterSpacing: '-0.3px' }}>
            Overview
          </h2>
          <p className="text-text-secondary mb-6">
            <span className="text-brand-mughal-green font-medium">marketrisk</span> provides comprehensive credit risk monitoring for Romanian SMEs through a proprietary risk scoring algorithm and RESTful API. Our system aggregates data from official Romanian registries including ANAF, BPI (Insolvency Proceedings), and PortalJust (Court Cases) to deliver real-time risk assessments.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border border-border-subtle p-6 rounded-xl hover:shadow-sm transition-all duration-normal">
            <div className="w-10 h-10 bg-surface-bone flex items-center justify-center rounded-lg mb-4">
              <div className="w-5 h-5 bg-brand-mughal-green rounded-md" />
            </div>
            <h3 className="text-lg font-medium text-text-primary mb-2">Real-time Data</h3>
            <p className="text-sm text-text-secondary">
              Continuous monitoring of Romanian business registries with automatic updates when risk factors change.
            </p>
          </div>
          <div className="bg-white border border-border-subtle p-6 rounded-xl hover:shadow-sm transition-all duration-normal">
            <div className="w-10 h-10 bg-surface-bone flex items-center justify-center rounded-lg mb-4">
              <div className="w-5 h-5 bg-brand-mughal-green rounded-md" />
            </div>
            <h3 className="text-lg font-medium text-text-primary mb-2">Transparent Algorithm</h3>
            <p className="text-sm text-text-secondary">
              Our proprietary MRCS algorithm is fully documented, allowing you to understand exactly how risk scores are calculated.
            </p>
          </div>
          <div className="bg-white border border-border-subtle p-6 rounded-xl hover:shadow-sm transition-all duration-normal">
            <div className="w-10 h-10 bg-surface-bone flex items-center justify-center rounded-lg mb-4">
              <div className="w-5 h-5 bg-brand-mughal-green rounded-md" />
            </div>
            <h3 className="text-lg font-medium text-text-primary mb-2">Developer-Friendly API</h3>
            <p className="text-sm text-text-secondary">
              RESTful API with comprehensive documentation, code examples, and webhook support for seamless integration.
            </p>
          </div>
        </div>
      </section>

      {/* Algorithm Section */}
      <section id="algorithm" className="scroll-mt-8">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-text-primary mb-4" style={{ letterSpacing: '-0.3px' }}>
            Proprietary Risk Scoring Algorithm
          </h2>
          <p className="text-text-secondary mb-6">
            The <span className="text-brand-mughal-green font-medium">marketrisk</span> Credit Score (MRCS) is a multi-factor risk assessment system designed specifically for the Romanian market. It evaluates companies based on legal status, financial indicators, litigation history, and operational signals to provide a comprehensive risk profile.
          </p>
        </div>

        {/* Algorithm Design */}
        <div className="bg-white border border-border-subtle p-6 rounded-xl mb-6">
          <h3 className="text-lg font-medium text-text-primary mb-4">Algorithm Design: <span className="text-brand-mughal-green">marketrisk</span> Credit Score (MRCS)</h3>
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-text-primary mb-2">Philosophy</p>
              <p className="text-sm text-text-secondary">
                Multi-factor risk assessment based on Romanian regulatory data, financial indicators, and behavioral signals.
              </p>
            </div>
          </div>
        </div>

        {/* Risk Factors */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-text-primary mb-6">Risk Factors & Point System</h3>

          {/* Category 1 */}
          <div className="bg-white border border-border-subtle p-6 rounded-xl mb-6">
            <h4 className="text-lg font-medium text-text-primary mb-4">Category 1: Legal & Regulatory Status (60 points max)</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border-subtle">
                    <th className="text-left p-3 text-text-primary font-medium">Factor</th>
                    <th className="text-left p-3 text-text-primary font-medium">Points</th>
                    <th className="text-left p-3 text-text-primary font-medium">Data Source</th>
                    <th className="text-left p-3 text-text-primary font-medium">Logic</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-border-subtle">
                    <td className="p-3 text-text-primary">Inactive company</td>
                    <td className="p-3 text-text-secondary">+50</td>
                    <td className="p-3 text-text-secondary">ANAF</td>
                    <td className="p-3 text-text-secondary">If stare_firma != "ACTIVA"</td>
                  </tr>
                  <tr className="border-b border-border-subtle">
                    <td className="p-3 text-text-primary">Insolvency proceedings</td>
                    <td className="p-3 text-text-secondary">+40</td>
                    <td className="p-3 text-text-secondary">BPI Registry</td>
                    <td className="p-3 text-text-secondary">Active insolvency case</td>
                  </tr>
                  <tr className="border-b border-border-subtle">
                    <td className="p-3 text-text-primary">Insolvency history</td>
                    <td className="p-3 text-text-secondary">+20</td>
                    <td className="p-3 text-text-secondary">BPI Registry</td>
                    <td className="p-3 text-text-secondary">Closed case &lt; 3 years</td>
                  </tr>
                  <tr className="border-b border-border-subtle">
                    <td className="p-3 text-text-primary">VAT deregistered</td>
                    <td className="p-3 text-text-secondary">+35</td>
                    <td className="p-3 text-text-secondary">ANAF</td>
                    <td className="p-3 text-text-secondary">Lost VAT registration</td>
                  </tr>
                  <tr className="border-b border-border-subtle">
                    <td className="p-3 text-text-primary">Split VAT regime</td>
                    <td className="p-3 text-text-secondary">+15</td>
                    <td className="p-3 text-text-secondary">ANAF</td>
                    <td className="p-3 text-text-secondary">TVA la incasare active</td>
                  </tr>
                  <tr className="border-b border-border-subtle">
                    <td className="p-3 text-text-primary">State debts (high)</td>
                    <td className="p-3 text-text-secondary">+30</td>
                    <td className="p-3 text-text-secondary">ANAF</td>
                    <td className="p-3 text-text-secondary">Debts &gt; €10,000</td>
                  </tr>
                  <tr className="border-b border-border-subtle">
                    <td className="p-3 text-text-primary">State debts (medium)</td>
                    <td className="p-3 text-text-secondary">+15</td>
                    <td className="p-3 text-text-secondary">ANAF</td>
                    <td className="p-3 text-text-secondary">Debts €1,000-€10,000</td>
                  </tr>
                  <tr>
                    <td className="p-3 text-text-primary">State debts (low)</td>
                    <td className="p-3 text-text-secondary">+5</td>
                    <td className="p-3 text-text-secondary">ANAF</td>
                    <td className="p-3 text-text-secondary">Debts &lt; €1,000</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Category 2 */}
          <div className="bg-white border border-border-subtle p-6 rounded-xl mb-6">
            <h4 className="text-lg font-medium text-text-primary mb-4">Category 2: Litigation & Legal Risk (40 points max)</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border-subtle">
                    <th className="text-left p-3 text-text-primary font-medium">Factor</th>
                    <th className="text-left p-3 text-text-primary font-medium">Points</th>
                    <th className="text-left p-3 text-text-primary font-medium">Data Source</th>
                    <th className="text-left p-3 text-text-primary font-medium">Logic</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-border-subtle">
                    <td className="p-3 text-text-primary">Active lawsuits (defendant)</td>
                    <td className="p-3 text-text-secondary">+8 per case</td>
                    <td className="p-3 text-text-secondary">PortalJust</td>
                    <td className="p-3 text-text-secondary">Max 40 points (5+ cases)</td>
                  </tr>
                  <tr className="border-b border-border-subtle">
                    <td className="p-3 text-text-primary">Lost cases (recent)</td>
                    <td className="p-3 text-text-secondary">+12 per case</td>
                    <td className="p-3 text-text-secondary">PortalJust</td>
                    <td className="p-3 text-text-secondary">Last 2 years, max 36 points</td>
                  </tr>
                  <tr className="border-b border-border-subtle">
                    <td className="p-3 text-text-primary">Bankruptcy filing</td>
                    <td className="p-3 text-text-secondary">+40</td>
                    <td className="p-3 text-text-secondary">PortalJust</td>
                    <td className="p-3 text-text-secondary">Active bankruptcy</td>
                  </tr>
                  <tr className="border-b border-border-subtle">
                    <td className="p-3 text-text-primary">Execution proceedings</td>
                    <td className="p-3 text-text-secondary">+25</td>
                    <td className="p-3 text-text-secondary">PortalJust</td>
                    <td className="p-3 text-text-secondary">Active executare silita</td>
                  </tr>
                  <tr>
                    <td className="p-3 text-text-primary">Labor disputes</td>
                    <td className="p-3 text-text-secondary">+10 per case</td>
                    <td className="p-3 text-text-secondary">PortalJust</td>
                    <td className="p-3 text-text-secondary">Employee lawsuits</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Category 3 */}
          <div className="bg-white border border-border-subtle p-6 rounded-xl mb-6">
            <h4 className="text-lg font-medium text-text-primary mb-4">Category 3: Financial Behavior (30 points max)</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border-subtle">
                    <th className="text-left p-3 text-text-primary font-medium">Factor</th>
                    <th className="text-left p-3 text-text-primary font-medium">Points</th>
                    <th className="text-left p-3 text-text-primary font-medium">Data Source</th>
                    <th className="text-left p-3 text-text-primary font-medium">Logic</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-border-subtle">
                    <td className="p-3 text-text-primary">No financial statements</td>
                    <td className="p-3 text-text-secondary">+20</td>
                    <td className="p-3 text-text-secondary">ANAF/MFinante</td>
                    <td className="p-3 text-text-secondary">Missing last 2 years</td>
                  </tr>
                  <tr className="border-b border-border-subtle">
                    <td className="p-3 text-text-primary">Delayed filing</td>
                    <td className="p-3 text-text-secondary">+10</td>
                    <td className="p-3 text-text-secondary">ANAF</td>
                    <td className="p-3 text-text-secondary">Late submission</td>
                  </tr>
                  <tr className="border-b border-border-subtle">
                    <td className="p-3 text-text-primary">Negative equity (balance sheet)</td>
                    <td className="p-3 text-text-secondary">+25</td>
                    <td className="p-3 text-text-secondary">MFinante</td>
                    <td className="p-3 text-text-secondary">If available</td>
                  </tr>
                  <tr>
                    <td className="p-3 text-text-primary">Revenue drop &gt;50%</td>
                    <td className="p-3 text-text-secondary">+15</td>
                    <td className="p-3 text-text-secondary">MFinante</td>
                    <td className="p-3 text-text-secondary">YoY decline</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Category 4 */}
          <div className="bg-white border border-border-subtle p-6 rounded-xl mb-6">
            <h4 className="text-lg font-medium text-text-primary mb-4">Category 4: Operational Red Flags (20 points max)</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border-subtle">
                    <th className="text-left p-3 text-text-primary font-medium">Factor</th>
                    <th className="text-left p-3 text-text-primary font-medium">Points</th>
                    <th className="text-left p-3 text-text-primary font-medium">Data Source</th>
                    <th className="text-left p-3 text-text-primary font-medium">Logic</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-border-subtle">
                    <td className="p-3 text-text-primary">Company age &lt; 6 months</td>
                    <td className="p-3 text-text-secondary">+15</td>
                    <td className="p-3 text-text-secondary">ANAF</td>
                    <td className="p-3 text-text-secondary">Too new</td>
                  </tr>
                  <tr className="border-b border-border-subtle">
                    <td className="p-3 text-text-primary">Frequent address changes</td>
                    <td className="p-3 text-text-secondary">+10</td>
                    <td className="p-3 text-text-secondary">ANAF</td>
                    <td className="p-3 text-text-secondary">3+ changes in 2 years</td>
                  </tr>
                  <tr className="border-b border-border-subtle">
                    <td className="p-3 text-text-primary">No employees reported</td>
                    <td className="p-3 text-text-secondary">+8</td>
                    <td className="p-3 text-text-secondary">ANAF</td>
                    <td className="p-3 text-text-secondary">Zero employees</td>
                  </tr>
                  <tr>
                    <td className="p-3 text-text-primary">Domain not active</td>
                    <td className="p-3 text-text-secondary">+5</td>
                    <td className="p-3 text-text-secondary">Web check</td>
                    <td className="p-3 text-text-secondary">No website</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Category 5 */}
          <div className="bg-white border border-border-subtle p-6 rounded-xl mb-6">
            <h4 className="text-lg font-medium text-text-primary mb-4">Category 5: Positive Adjustments (negative points)</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border-subtle">
                    <th className="text-left p-3 text-text-primary font-medium">Factor</th>
                    <th className="text-left p-3 text-text-primary font-medium">Points</th>
                    <th className="text-left p-3 text-text-primary font-medium">Data Source</th>
                    <th className="text-left p-3 text-text-primary font-medium">Logic</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-border-subtle">
                    <td className="p-3 text-text-primary">Company age &gt;10 years</td>
                    <td className="p-3 text-text-secondary">-10</td>
                    <td className="p-3 text-text-secondary">ANAF</td>
                    <td className="p-3 text-text-secondary">Established</td>
                  </tr>
                  <tr className="border-b border-border-subtle">
                    <td className="p-3 text-text-primary">Large company (50+ employees)</td>
                    <td className="p-3 text-text-secondary">-15</td>
                    <td className="p-3 text-text-secondary">ANAF</td>
                    <td className="p-3 text-text-secondary">More stable</td>
                  </tr>
                  <tr className="border-b border-border-subtle">
                    <td className="p-3 text-text-primary">Certified accounts</td>
                    <td className="p-3 text-text-secondary">-10</td>
                    <td className="p-3 text-text-secondary">MFinante</td>
                    <td className="p-3 text-text-secondary">Audited financials</td>
                  </tr>
                  <tr>
                    <td className="p-3 text-text-primary">Exporter</td>
                    <td className="p-3 text-text-secondary">-8</td>
                    <td className="p-3 text-text-secondary">ANAF</td>
                    <td className="p-3 text-text-secondary">International trade</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Risk Classification */}
        <div className="bg-brand-mughal-green rounded-2xl p-8 relative overflow-hidden mb-8">
          <div className="absolute inset-0 opacity-20">
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <rect
                x="66%"
                y="-10%"
                width="360"
                height="220"
                rx="4"
                fill="none"
                stroke="rgba(220, 222, 197, 0.28)"
                strokeWidth="1"
              />
            </svg>
          </div>
          <div className="relative z-10">
            <h3 className="text-xl font-semibold text-text-inverse mb-6" style={{ letterSpacing: '-0.3px' }}>
              Risk Classification Thresholds
            </h3>
            <p className="text-text-inverse-muted text-sm mb-6">
              Total Score Calculation: <code className="bg-white/20 px-2 py-1 rounded text-xs">MRCS = sum(all_positive_factors) - sum(all_negative_factors)</code>
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/20">
                    <th className="text-left p-3 text-text-inverse font-medium">Risk Level</th>
                    <th className="text-left p-3 text-text-inverse font-medium">Score Range</th>
                    <th className="text-left p-3 text-text-inverse font-medium">Badge Color</th>
                    <th className="text-left p-3 text-text-inverse font-medium">Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-white/20">
                    <td className="p-3 text-text-inverse font-medium">GREEN (Low Risk)</td>
                    <td className="p-3 text-text-inverse-muted">0-14 points</td>
                    <td className="p-3">
                      <span className="inline-block w-3 h-3 rounded-full bg-green-500"></span>
                      <span className="ml-2 text-text-inverse-muted">Green</span>
                    </td>
                    <td className="p-3 text-text-inverse-muted">Monitor quarterly</td>
                  </tr>
                  <tr className="border-b border-white/20">
                    <td className="p-3 text-text-inverse font-medium">YELLOW (Medium Risk)</td>
                    <td className="p-3 text-text-inverse-muted">15-49 points</td>
                    <td className="p-3">
                      <span className="inline-block w-3 h-3 rounded-full bg-yellow-500"></span>
                      <span className="ml-2 text-text-inverse-muted">Yellow</span>
                    </td>
                    <td className="p-3 text-text-inverse-muted">Monitor monthly</td>
                  </tr>
                  <tr>
                    <td className="p-3 text-text-inverse font-medium">RED (High Risk)</td>
                    <td className="p-3 text-text-inverse-muted">50+ points</td>
                    <td className="p-3">
                      <span className="inline-block w-3 h-3 rounded-full bg-red-500"></span>
                      <span className="ml-2 text-text-inverse-muted">Red</span>
                    </td>
                    <td className="p-3 text-text-inverse-muted">Alert immediately</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* API Reference Section */}
      <section id="api" className="scroll-mt-8">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-text-primary mb-4" style={{ letterSpacing: '-0.3px' }}>
            API Reference
          </h2>
          <p className="text-text-secondary mb-6">
            The <span className="text-brand-mughal-green font-medium">marketrisk</span> API is a RESTful service that provides programmatic access to company risk data, watchlist management, and real-time alerts. All API requests require authentication using API keys.
          </p>
        </div>

        {/* Authentication */}
        <div className="bg-white border border-border-subtle p-6 rounded-xl mb-6">
          <h3 className="text-lg font-medium text-text-primary mb-4">Authentication</h3>
          <p className="text-sm text-text-secondary mb-4">
            All API requests must include your API key in the Authorization header:
          </p>
          <div className="bg-surface-paper border border-border-subtle rounded-lg p-4 mb-4">
            <code className="text-xs text-text-secondary font-mono">
              Authorization: Bearer YOUR_API_KEY
            </code>
          </div>
          <p className="text-sm text-text-secondary">
            API keys can be generated from your account settings. Keep your API keys secure and never expose them in client-side code.
          </p>
        </div>

        {/* Base URL */}
        <div className="bg-white border border-border-subtle p-6 rounded-xl mb-6">
          <h3 className="text-lg font-medium text-text-primary mb-4">Base URL</h3>
          <div className="bg-surface-paper border border-border-subtle rounded-lg p-4">
            <code className="text-xs text-text-secondary font-mono">
              https://api.marketrisk.ro/v1
            </code>
          </div>
        </div>

        {/* Endpoints */}
        <div className="space-y-6">
          {/* Get Company Risk Score */}
          <div className="bg-white border border-border-subtle p-6 rounded-xl">
            <div className="flex items-start gap-4 mb-4">
              <span className="px-3 py-1 bg-brand-mughal-green text-white text-xs font-medium rounded">GET</span>
              <div className="flex-1">
                <h3 className="text-lg font-medium text-text-primary mb-2">Get Company Risk Score</h3>
                <code className="text-sm text-text-secondary font-mono">/companies/{'{'}cui{'}'}/risk-score</code>
              </div>
            </div>
            <p className="text-sm text-text-secondary mb-4">
              Retrieve the current risk score and detailed risk factors for a Romanian company by CUI (Company Unique Identifier).
            </p>

            <div className="mb-4">
              <p className="text-sm font-medium text-text-primary mb-2">Parameters</p>
              <div className="bg-surface-paper border border-border-subtle rounded-lg p-4">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-border-subtle">
                      <th className="text-left p-2 text-text-primary font-medium">Parameter</th>
                      <th className="text-left p-2 text-text-primary font-medium">Type</th>
                      <th className="text-left p-2 text-text-primary font-medium">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="p-2 text-text-secondary font-mono">cui</td>
                      <td className="p-2 text-text-secondary">string</td>
                      <td className="p-2 text-text-secondary">Romanian company CUI (required)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mb-4">
              <p className="text-sm font-medium text-text-primary mb-2">Example Request</p>
              <div className="bg-surface-paper border border-border-subtle rounded-lg p-4">
                <code className="text-xs text-text-secondary font-mono whitespace-pre">
{`curl https://api.marketrisk.ro/v1/companies/RO12345678/risk-score \\
  -H "Authorization: Bearer YOUR_API_KEY"`}
                </code>
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-text-primary mb-2">Example Response</p>
              <div className="bg-surface-paper border border-border-subtle rounded-lg p-4">
                <code className="text-xs text-text-secondary font-mono whitespace-pre">
{`{
  "cui": "RO12345678",
  "company_name": "Example SRL",
  "risk_score": 25,
  "risk_level": "YELLOW",
  "last_updated": "2024-01-15T10:30:00Z",
  "risk_factors": {
    "legal_regulatory": 15,
    "litigation": 10,
    "financial": 0,
    "operational": 0
  },
  "positive_adjustments": -5,
  "details": {
    "state_debts_medium": true,
    "active_lawsuits": 1
  }
}`}
                </code>
              </div>
            </div>
          </div>

          {/* Add to Watchlist */}
          <div className="bg-white border border-border-subtle p-6 rounded-xl">
            <div className="flex items-start gap-4 mb-4">
              <span className="px-3 py-1 bg-brand-mughal-green text-white text-xs font-medium rounded">POST</span>
              <div className="flex-1">
                <h3 className="text-lg font-medium text-text-primary mb-2">Add Company to Watchlist</h3>
                <code className="text-sm text-text-secondary font-mono">/watchlist/companies</code>
              </div>
            </div>
            <p className="text-sm text-text-secondary mb-4">
              Add a company to your watchlist for continuous monitoring and alerts.
            </p>

            <div className="mb-4">
              <p className="text-sm font-medium text-text-primary mb-2">Request Body</p>
              <div className="bg-surface-paper border border-border-subtle rounded-lg p-4">
                <code className="text-xs text-text-secondary font-mono whitespace-pre">
{`{
  "cui": "RO12345678",
  "tags": ["supplier", "important"],
  "notes": "Main supplier for Q1"
}`}
                </code>
              </div>
            </div>
          </div>

          {/* Get Watchlist */}
          <div className="bg-white border border-border-subtle p-6 rounded-xl">
            <div className="flex items-start gap-4 mb-4">
              <span className="px-3 py-1 bg-brand-mughal-green text-white text-xs font-medium rounded">GET</span>
              <div className="flex-1">
                <h3 className="text-lg font-medium text-text-primary mb-2">Get Watchlist</h3>
                <code className="text-sm text-text-secondary font-mono">/watchlist/companies</code>
              </div>
            </div>
            <p className="text-sm text-text-secondary mb-4">
              Retrieve all companies in your watchlist with their current risk scores.
            </p>
          </div>

          {/* Webhooks */}
          <div className="bg-white border border-border-subtle p-6 rounded-xl">
            <div className="flex items-start gap-4 mb-4">
              <span className="px-3 py-1 bg-brand-mughal-green text-white text-xs font-medium rounded">POST</span>
              <div className="flex-1">
                <h3 className="text-lg font-medium text-text-primary mb-2">Configure Webhooks</h3>
                <code className="text-sm text-text-secondary font-mono">/webhooks</code>
              </div>
            </div>
            <p className="text-sm text-text-secondary mb-4">
              Set up webhooks to receive real-time notifications when risk scores change or new risk factors are detected.
            </p>

            <div className="mb-4">
              <p className="text-sm font-medium text-text-primary mb-2">Request Body</p>
              <div className="bg-surface-paper border border-border-subtle rounded-lg p-4">
                <code className="text-xs text-text-secondary font-mono whitespace-pre">
{`{
  "url": "https://your-domain.com/webhooks/risk-alerts",
  "events": ["risk_score_changed", "new_insolvency", "new_lawsuit"],
  "secret": "your_webhook_secret"
}`}
                </code>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Integration Guide */}
      <section id="integration" className="scroll-mt-8">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-text-primary mb-4" style={{ letterSpacing: '-0.3px' }}>
            Integration Guide
          </h2>
          <p className="text-text-secondary mb-6">
            Quick start guides and best practices for integrating <span className="text-brand-mughal-green font-medium">marketrisk</span> into your application or workflow.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white border border-border-subtle p-6 rounded-xl hover:shadow-sm transition-all duration-normal">
            <h3 className="text-lg font-medium text-text-primary mb-3">Quick Start</h3>
            <p className="text-sm text-text-secondary mb-4">
              Get up and running with the <span className="text-brand-mughal-green font-medium">marketrisk</span> API in minutes. Includes authentication setup, your first API call, and basic error handling.
            </p>
            <ul className="space-y-2 text-sm text-text-secondary">
              <li className="flex items-start gap-2">
                <span className="text-brand-mughal-green mt-[2px]">→</span>
                <span>Generate your API key from account settings</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-brand-mughal-green mt-[2px]">→</span>
                <span>Make your first request to test authentication</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-brand-mughal-green mt-[2px]">→</span>
                <span>Add companies to your watchlist</span>
              </li>
            </ul>
          </div>

          <div className="bg-white border border-border-subtle p-6 rounded-xl hover:shadow-sm transition-all duration-normal">
            <h3 className="text-lg font-medium text-text-primary mb-3">Webhook Setup</h3>
            <p className="text-sm text-text-secondary mb-4">
              Configure webhooks to receive real-time notifications when risk factors change. Includes security best practices and event types.
            </p>
            <ul className="space-y-2 text-sm text-text-secondary">
              <li className="flex items-start gap-2">
                <span className="text-brand-mughal-green mt-[2px]">→</span>
                <span>Set up your webhook endpoint</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-brand-mughal-green mt-[2px]">→</span>
                <span>Verify webhook signatures</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-brand-mughal-green mt-[2px]">→</span>
                <span>Handle retries and errors</span>
              </li>
            </ul>
          </div>

          <div className="bg-white border border-border-subtle p-6 rounded-xl hover:shadow-sm transition-all duration-normal">
            <h3 className="text-lg font-medium text-text-primary mb-3">Rate Limits</h3>
            <p className="text-sm text-text-secondary mb-4">
              Understand API rate limits and how to handle them gracefully. Different plans have different limits.
            </p>
            <ul className="space-y-2 text-sm text-text-secondary">
              <li className="flex items-start gap-2">
                <span className="text-brand-mughal-green mt-[2px]">→</span>
                <span>Free: 100 requests/day</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-brand-mughal-green mt-[2px]">→</span>
                <span>Starter: 1,000 requests/day</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-brand-mughal-green mt-[2px]">→</span>
                <span>PRO: 10,000 requests/day</span>
              </li>
            </ul>
          </div>

          <div className="bg-white border border-border-subtle p-6 rounded-xl hover:shadow-sm transition-all duration-normal">
            <h3 className="text-lg font-medium text-text-primary mb-3">Error Handling</h3>
            <p className="text-sm text-text-secondary mb-4">
              Learn about API error codes, response formats, and best practices for handling errors in your integration.
            </p>
            <ul className="space-y-2 text-sm text-text-secondary">
              <li className="flex items-start gap-2">
                <span className="text-brand-mughal-green mt-[2px]">→</span>
                <span>HTTP status codes</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-brand-mughal-green mt-[2px]">→</span>
                <span>Error response format</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-brand-mughal-green mt-[2px]">→</span>
                <span>Retry strategies</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Support Section */}
      <section className="bg-brand-mughal-green rounded-2xl p-8 md:p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid-docs" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="var(--brand-pistachio)" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid-docs)" />
          </svg>
        </div>
        <div className="relative z-10 max-w-2xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-semibold text-text-inverse mb-4" style={{ letterSpacing: '-0.5px' }}>
            Need Help?
          </h2>
          <p className="text-text-inverse-muted text-lg mb-6">
            Our support team is here to help with API integration, algorithm questions, or any technical issues.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:support@marketrisk.ro"
              className="px-6 py-3 bg-white text-brand-mughal-green rounded-lg font-medium text-sm hover:shadow-sm transition-all duration-normal inline-block"
            >
              Contact Support
            </a>
            <Link
              href="/contact"
              className="px-6 py-3 bg-white/10 text-white border border-white/20 rounded-lg font-medium text-sm hover:bg-white/20 transition-all duration-normal inline-block"
            >
              View Contact Page
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
