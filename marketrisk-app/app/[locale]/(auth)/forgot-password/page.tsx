'use client'

import { useState } from 'react'
import Link from 'next/link'
import { resetPassword } from '../actions'
import { Mail, ArrowLeft, AlertCircle, CheckCircle } from 'lucide-react'

export default function ForgotPasswordPage() {
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError(null)

    try {
      const result = await resetPassword(formData)
      if (result?.error) {
        setError(result.error)
      } else if (result?.success) {
        setSuccess(true)
      }
    } catch (err) {
      setError('A apărut o eroare. Vă rugăm încercați din nou.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[var(--color-paper)] flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="w-10 h-10 bg-[var(--color-mughal-green)] rounded-[4px] flex items-center justify-center">
                <span className="text-white font-bold text-xl">M</span>
              </div>
              <h1 className="text-2xl font-bold text-[var(--color-mughal-green)]">
                market<span className="font-extrabold">risk</span>
              </h1>
            </div>
          </Link>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Resetează parola
          </h2>
          <p className="text-gray-600">
            Îți vom trimite instrucțiuni pe email
          </p>
        </div>

        {/* Reset Password Card */}
        <div className="bg-white border border-[var(--color-bone)] rounded-[4px] shadow-sm p-8">
          {success ? (
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Email trimis!
              </h3>
              <p className="text-gray-600 mb-6">
                Verifică-ți inbox-ul pentru instrucțiunile de resetare a parolei.
              </p>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 text-[var(--color-mughal-green)] hover:text-[var(--color-mughal-green-dark)] font-medium"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Înapoi la Login</span>
              </Link>
            </div>
          ) : (
            <>
              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-[4px] flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              )}

              <form action={handleSubmit}>
                {/* Email Field */}
                <div className="mb-6">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      className="block w-full pl-10 pr-3 py-2 border border-[var(--color-bone)] rounded-[4px] focus:outline-none focus:ring-2 focus:ring-[var(--color-mughal-green)] focus:border-transparent"
                      placeholder="nume@companie.ro"
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 bg-[var(--color-mughal-green)] text-white py-2.5 px-4 rounded-[4px] font-medium hover:bg-[var(--color-mughal-green-dark)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-mughal-green)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors mb-4"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Se trimite...</span>
                    </>
                  ) : (
                    <span>Trimite instrucțiuni</span>
                  )}
                </button>

                {/* Back to Login Link */}
                <Link
                  href="/login"
                  className="flex items-center justify-center gap-2 text-gray-600 hover:text-gray-900 text-sm font-medium"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Înapoi la Login</span>
                </Link>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
