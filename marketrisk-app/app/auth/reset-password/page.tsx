'use client'

import { useState } from 'react'
import Link from 'next/link'
import { updatePassword } from '../../[locale]/(auth)/actions'
import { Lock, AlertCircle } from 'lucide-react'

export default function ResetPasswordPage() {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError(null)

    try {
      const result = await updatePassword(formData)
      if (result?.error) {
        setError(result.error)
      }
      // If successful, updatePassword will redirect to dashboard
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
            Setează parolă nouă
          </h2>
          <p className="text-gray-600">
            Alege o parolă sigură pentru contul tău
          </p>
        </div>

        {/* Reset Password Card */}
        <div className="bg-white border border-[var(--color-bone)] rounded-[4px] shadow-sm p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-[4px] flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          <form action={handleSubmit}>
            {/* New Password Field */}
            <div className="mb-4">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Parolă nouă
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  minLength={8}
                  className="block w-full pl-10 pr-3 py-2 border border-[var(--color-bone)] rounded-[4px] focus:outline-none focus:ring-2 focus:ring-[var(--color-mughal-green)] focus:border-transparent"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {/* Confirm Password Field */}
            <div className="mb-6">
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Confirmă parola
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  minLength={8}
                  className="block w-full pl-10 pr-3 py-2 border border-[var(--color-bone)] rounded-[4px] focus:outline-none focus:ring-2 focus:ring-[var(--color-mughal-green)] focus:border-transparent"
                  placeholder="••••••••"
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Minimum 8 caractere
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-[var(--color-mughal-green)] text-white py-2.5 px-4 rounded-[4px] font-medium hover:bg-[var(--color-mughal-green-dark)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-mughal-green)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Se actualizează...</span>
                </>
              ) : (
                <span>Actualizează parola</span>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
