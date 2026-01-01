import React from 'react'
import { X, Check, Settings } from 'lucide-react'

const COOKIE_CONSENT_KEY = 'marketrisk_cookie_consent_v1'

export default function CookieConsent() {
  const [showModal, setShowModal] = React.useState(false)
  const [showSettings, setShowSettings] = React.useState(false)
  const [preferences, setPreferences] = React.useState({
    essential: true, // Always true, cannot be disabled
    analytics: false,
    marketing: false,
  })

  React.useEffect(() => {
    // Check if consent has been given
    try {
      const stored = localStorage.getItem(COOKIE_CONSENT_KEY)
      if (!stored) {
        // Show modal after a short delay for better UX
        const timer = setTimeout(() => setShowModal(true), 1000)
        return () => clearTimeout(timer)
      }
    } catch (e) {
      console.error('Failed to read cookie consent', e)
    }
  }, [])

  const saveConsent = (consentData) => {
    try {
      localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify({
        ...consentData,
        timestamp: new Date().toISOString(),
      }))
      setShowModal(false)
    } catch (e) {
      console.error('Failed to save cookie consent', e)
    }
  }

  const handleAcceptAll = () => {
    saveConsent({
      essential: true,
      analytics: true,
      marketing: true,
    })
  }

  const handleRejectAll = () => {
    saveConsent({
      essential: true,
      analytics: false,
      marketing: false,
    })
  }

  const handleSavePreferences = () => {
    saveConsent(preferences)
  }

  const togglePreference = (key) => {
    if (key === 'essential') return // Essential cookies cannot be disabled
    setPreferences((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  if (!showModal) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] transition-opacity duration-normal"
        onClick={() => setShowModal(false)}
      />

      {/* Modal */}
      <div className="fixed bottom-0 left-0 right-0 md:bottom-6 md:left-6 md:right-auto md:max-w-[480px] z-[101] animate-in slide-in-from-bottom md:slide-in-from-left duration-normal">
        <div className="bg-white rounded-xl md:rounded-2xl border border-border-subtle shadow-lg m-4 md:m-0">
          {/* Header */}
          <div className="p-6 border-b border-border-subtle">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-text-primary mb-2">
                  Cookie Preferences
                </h2>
                <p className="text-sm text-text-secondary">
                  We use cookies to enhance your browsing experience, analyze site traffic, and personalize content. By clicking "Accept All", you consent to our use of cookies.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface-paper transition-colors duration-normal text-text-muted hover:text-text-primary"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Settings Panel */}
          {showSettings && (
            <div className="p-6 border-b border-border-subtle bg-surface-paper">
              <h3 className="text-sm font-semibold text-text-primary mb-4">
                Customize your cookie preferences
              </h3>
              <div className="space-y-4">
                {/* Essential Cookies */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-sm font-medium text-text-primary">Essential Cookies</h4>
                      <span className="text-xs text-text-muted bg-surface-bone px-2 py-0.5 rounded-pill">
                        Always Active
                      </span>
                    </div>
                    <p className="text-xs text-text-secondary">
                      Required for the website to function properly. These cannot be disabled.
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    <div className="w-10 h-6 bg-brand-mughal-green rounded-full flex items-center justify-center cursor-not-allowed opacity-60">
                      <Check size={14} className="text-white" />
                    </div>
                  </div>
                </div>

                {/* Analytics Cookies */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-text-primary mb-1">Analytics Cookies</h4>
                    <p className="text-xs text-text-secondary">
                      Help us understand how visitors interact with our website by collecting and reporting information anonymously.
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    <button
                      type="button"
                      onClick={() => togglePreference('analytics')}
                      className={`w-10 h-6 rounded-full transition-all duration-normal flex items-center ${
                        preferences.analytics
                          ? 'bg-brand-mughal-green justify-end pr-1'
                          : 'bg-surface-bone justify-start pl-1'
                      }`}
                      aria-label="Toggle analytics cookies"
                    >
                      <div className="w-4 h-4 bg-white rounded-full shadow-sm" />
                    </button>
                  </div>
                </div>

                {/* Marketing Cookies */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-text-primary mb-1">Marketing Cookies</h4>
                    <p className="text-xs text-text-secondary">
                      Used to deliver personalized advertisements and track campaign performance.
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    <button
                      type="button"
                      onClick={() => togglePreference('marketing')}
                      className={`w-10 h-6 rounded-full transition-all duration-normal flex items-center ${
                        preferences.marketing
                          ? 'bg-brand-mughal-green justify-end pr-1'
                          : 'bg-surface-bone justify-start pl-1'
                      }`}
                      aria-label="Toggle marketing cookies"
                    >
                      <div className="w-4 h-4 bg-white rounded-full shadow-sm" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Footer Actions */}
          <div className="p-6">
            <div className="flex flex-col sm:flex-row gap-3">
              {showSettings ? (
                <>
                  <button
                    type="button"
                    onClick={handleSavePreferences}
                    className="flex-1 px-6 py-3 bg-brand-mughal-green text-white rounded-lg font-medium text-sm hover:bg-brand-mughal-green-2 transition-all duration-normal"
                  >
                    Save Preferences
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowSettings(false)}
                    className="px-6 py-3 bg-white border border-border-subtle text-text-primary rounded-lg font-medium text-sm hover:bg-surface-paper transition-all duration-normal"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={handleAcceptAll}
                    className="flex-1 px-6 py-3 bg-brand-mughal-green text-white rounded-lg font-medium text-sm hover:bg-brand-mughal-green-2 transition-all duration-normal"
                  >
                    Accept All
                  </button>
                  <button
                    type="button"
                    onClick={handleRejectAll}
                    className="px-6 py-3 bg-white border border-border-subtle text-text-primary rounded-lg font-medium text-sm hover:bg-surface-paper transition-all duration-normal"
                  >
                    Reject All
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowSettings(true)}
                    className="px-6 py-3 bg-white border border-border-subtle text-text-primary rounded-lg font-medium text-sm hover:bg-surface-paper transition-all duration-normal flex items-center gap-2"
                  >
                    <Settings size={16} />
                    Customize
                  </button>
                </>
              )}
            </div>
            <p className="text-xs text-text-muted mt-4 text-center">
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  // Navigate to privacy policy - you can update this
                  window.location.href = '#privacy'
                }}
                className="text-brand-mughal-green hover:text-brand-mughal-green-2 underline"
              >
                Learn more about our cookie policy
              </a>
            </p>
          </div>
        </div>
      </div>
    </>
  )
}

