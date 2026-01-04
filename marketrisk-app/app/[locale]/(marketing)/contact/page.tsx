'use client'

import React from 'react'

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).trim())
}

export default function ContactPage() {
  const email = 'hello@marketrisk.ro'
  const phone = '+40 712 345 678'
  const telHref = `tel:${phone.replace(/\s+/g, '')}`

  const [form, setForm] = React.useState({ 
    topic: 'general', 
    name: '', 
    email: '', 
    message: '' 
  })
  const [status, setStatus] = React.useState<{ type: 'idle' | 'error' | 'success', message: string }>({ 
    type: 'idle', 
    message: '' 
  })

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const normalizedEmail = form.email.trim().toLowerCase()
    const allowedTopics = new Set(['general', 'technical', 'partnership', 'privacy'])
    if (!allowedTopics.has(form.topic)) {
      setStatus({ type: 'error', message: 'Please select a topic.' })
      return
    }
    if (!form.name.trim()) {
      setStatus({ type: 'error', message: 'Please enter your name.' })
      return
    }
    if (!isValidEmail(normalizedEmail)) {
      setStatus({ type: 'error', message: 'Please enter a valid email address.' })
      return
    }
    if (!form.message.trim()) {
      setStatus({ type: 'error', message: 'Please add a short message.' })
      return
    }

    // This is a static demo app: we simulate success without sending anywhere.
    setStatus({ type: 'success', message: "Thanks — we'll reply within 1–2 business days." })
    setForm({ topic: 'general', name: '', email: '', message: '' })
  }

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs text-text-muted mb-2">Contact</p>
        <h1 className="text-2xl font-semibold text-text-primary" style={{ letterSpacing: '-0.3px' }}>
          Get in touch.
        </h1>
        <p className="text-sm text-text-secondary mt-3 max-w-2xl">
          Questions, demos, or partnership ideas—send a note and we'll get back to you.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white border border-border-subtle rounded-xl p-6">
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-text-muted mb-2" htmlFor="contact-topic">
                Topic
              </label>
              <select
                id="contact-topic"
                value={form.topic}
                onChange={(e) => setForm((p) => ({ ...p, topic: e.target.value }))}
                className="w-full px-4 py-3 border rounded-lg text-sm transition-all duration-normal appearance-none bg-white border-border-subtle text-text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring bg-no-repeat"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%230B0F0C' stroke-width='2'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`,
                  backgroundPosition: 'right 12px center',
                  backgroundSize: '16px',
                }}
              >
                <option value="general">General Inquiry</option>
                <option value="technical">Technical</option>
                <option value="partnership">Partnership or Strategy</option>
                <option value="privacy">Privacy</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-text-muted mb-2" htmlFor="contact-name">
                  Name
                </label>
                <input
                  id="contact-name"
                  value={form.name}
                  onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                  autoComplete="name"
                  placeholder="Your name"
                  className="w-full px-4 py-3 border rounded-lg text-sm transition-all duration-normal bg-white border-border-subtle text-text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-text-muted mb-2" htmlFor="contact-email">
                  Email
                </label>
                <input
                  id="contact-email"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                  inputMode="email"
                  autoComplete="email"
                  placeholder="Work email"
                  className="w-full px-4 py-3 border rounded-lg text-sm transition-all duration-normal bg-white border-border-subtle text-text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-text-muted mb-2" htmlFor="contact-message">
                Message
              </label>
              <textarea
                id="contact-message"
                value={form.message}
                onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
                rows={6}
                placeholder="What would you like to discuss?"
                className="w-full px-4 py-3 border rounded-lg text-sm transition-all duration-normal bg-white border-border-subtle text-text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring resize-y"
              />
            </div>

            {status.type !== 'idle' && (
              <div
                role={status.type === 'error' ? 'alert' : 'status'}
                className={`text-sm rounded-lg border px-4 py-3 ${
                  status.type === 'error'
                    ? 'bg-state-danger-soft border-state-danger text-state-danger'
                    : 'bg-state-success-soft border-state-success text-state-success'
                }`}
              >
                {status.message}
              </div>
            )}

            <div className="flex items-center gap-3">
              <button
                type="submit"
                className="px-6 py-3 bg-brand-mughal-green text-white rounded-lg font-medium text-sm hover:bg-brand-mughal-green-2 transition-all duration-normal"
              >
                Send message
              </button>
              <button
                type="button"
                onClick={() => {
                  setForm({ topic: 'general', name: '', email: '', message: '' })
                  setStatus({ type: 'idle', message: '' })
                }}
                className="px-6 py-3 bg-white text-brand-mughal-green rounded-lg font-medium text-sm hover:shadow-sm transition-all duration-normal border border-border-subtle"
              >
                Reset
              </button>
            </div>
          </form>
        </div>

        <aside className="bg-white border border-border-subtle rounded-xl p-6">
          <p className="text-sm font-medium text-text-primary mb-4">Direct contact</p>
          <div className="space-y-3">
            <a
              href={`mailto:${email}`}
              className="text-sm text-text-secondary hover:text-text-primary transition-colors duration-normal block"
            >
              {email}
            </a>
            <a
              href={telHref}
              className="text-sm text-text-secondary hover:text-text-primary transition-colors duration-normal block"
            >
              {phone}
            </a>
          </div>

          <div className="mt-6 pt-6 border-t border-border-subtle">
            <p className="text-xs text-text-muted">
              Tip: In this demo, the form doesn't send an email—it just validates inputs and shows a success state.
            </p>
          </div>
        </aside>
      </div>
    </div>
  )
}
