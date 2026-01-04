'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { signUp, signInWithGoogle } from '../actions'
import { UserPlus, Mail, Lock, User, Building, AlertCircle, CheckCircle } from 'lucide-react'

export default function SignUpPage() {
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError(null)

    try {
      const result = await signUp(formData)
      if (result?.error) {
        setError(result.error)
      } else if (result?.success) {
        setSuccess(true)
        // Redirect to login after 3 seconds
        setTimeout(() => {
          router.push('/login')
        }, 3000)
      }
    } catch (err) {
      setError('A apărut o eroare. Vă rugăm încercați din nou.')
    } finally {
      setLoading(false)
    }
  }

  async function handleGoogleSignIn() {
    setLoading(true)
    setError(null)
    try {
      await signInWithGoogle()
    } catch (err) {
      setError('Nu s-a putut conecta cu Google')
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-[var(--color-paper)] flex items-center justify-center px-4">
        <div className="max-w-md w-full">
          <div className="bg-white border border-[var(--color-bone)] rounded-[4px] shadow-sm p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Cont creat cu succes!
            </h2>
            <p className="text-gray-600 mb-4">
              Verifică-ți emailul pentru a confirma contul.
            </p>
            <p className="text-sm text-gray-500">
              Vei fi redirecționat către pagina de login...
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[var(--color-paper)] flex items-center justify-center px-4 py-12">
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
            Creează cont gratuit
          </h2>
          <p className="text-gray-600">
            Începe să monitorizezi riscul de credit astăzi
          </p>
        </div>

        {/* Sign Up Card */}
        <div className="bg-white border border-[var(--color-bone)] rounded-[4px] shadow-sm p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-[4px] flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          <form action={handleSubmit}>
            {/* Full Name Field */}
            <div className="mb-4">
              <label
                htmlFor="fullName"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Nume complet
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  autoComplete="name"
                  required
                  className="block w-full pl-10 pr-3 py-2 border border-[var(--color-bone)] rounded-[4px] focus:outline-none focus:ring-2 focus:ring-[var(--color-mughal-green)] focus:border-transparent"
                  placeholder="Ion Popescu"
                />
              </div>
            </div>

            {/* Company Name Field (Optional) */}
            <div className="mb-4">
              <label
                htmlFor="companyName"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Companie <span className="text-gray-400 text-xs">(opțional)</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Building className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="companyName"
                  name="companyName"
                  type="text"
                  autoComplete="organization"
                  className="block w-full pl-10 pr-3 py-2 border border-[var(--color-bone)] rounded-[4px] focus:outline-none focus:ring-2 focus:ring-[var(--color-mughal-green)] focus:border-transparent"
                  placeholder="SC Example SRL"
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="mb-4">
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

            {/* Password Field */}
            <div className="mb-6">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Parolă
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
              <p className="mt-1 text-xs text-gray-500">
                Minimum 8 caractere
              </p>
            </div>

            {/* Terms Agreement */}
            <div className="mb-6">
              <label className="flex items-start gap-2">
                <input
                  type="checkbox"
                  required
                  className="mt-1 h-4 w-4 text-[var(--color-mughal-green)] focus:ring-[var(--color-mughal-green)] border-gray-300 rounded"
                />
                <span className="text-sm text-gray-600">
                  Sunt de acord cu{' '}
                  <Link
                    href="/terms"
                    className="text-[var(--color-mughal-green)] hover:text-[var(--color-mughal-green-dark)]"
                  >
                    Termenii și Condițiile
                  </Link>{' '}
                  și{' '}
                  <Link
                    href="/privacy"
                    className="text-[var(--color-mughal-green)] hover:text-[var(--color-mughal-green-dark)]"
                  >
                    Politica de Confidențialitate
                  </Link>
                </span>
              </label>
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
                  <span>Se creează contul...</span>
                </>
              ) : (
                <>
                  <UserPlus className="w-5 h-5" />
                  <span>Creează cont</span>
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[var(--color-bone)]" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">sau</span>
            </div>
          </div>

          {/* Google Sign In */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 bg-white text-gray-700 py-2.5 px-4 border border-[var(--color-bone)] rounded-[4px] font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-mughal-green)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            <span>Continuă cu Google</span>
          </button>
        </div>

        {/* Sign In Link */}
        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Ai deja cont?{' '}
            <Link
              href="/login"
              className="text-[var(--color-mughal-green)] hover:text-[var(--color-mughal-green-dark)] font-medium"
            >
              Intră în cont
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
