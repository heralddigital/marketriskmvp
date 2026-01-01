'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'

export interface AuthResult {
  error?: string
  success?: boolean
}

/**
 * Sign up a new user
 */
export async function signUp(formData: FormData): Promise<AuthResult> {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const fullName = formData.get('fullName') as string
  const companyName = formData.get('companyName') as string

  if (!email || !password) {
    return { error: 'Email și parola sunt obligatorii' }
  }

  if (password.length < 8) {
    return { error: 'Parola trebuie să aibă minimum 8 caractere' }
  }

  const supabase = await createClient()

  // Sign up with Supabase Auth
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        company_name: companyName,
      },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
    },
  })

  if (authError) {
    console.error('Sign up error:', authError)
    return { error: authError.message }
  }

  if (!authData.user) {
    return { error: 'Nu s-a putut crea contul' }
  }

  // The user profile will be created automatically by the handle_new_user trigger
  return { success: true }
}

/**
 * Sign in an existing user
 */
export async function signIn(formData: FormData): Promise<AuthResult> {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email || !password) {
    return { error: 'Email și parola sunt obligatorii' }
  }

  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    console.error('Sign in error:', error)
    return { error: 'Email sau parolă incorectă' }
  }

  redirect('/app/dashboard')
}

/**
 * Sign out the current user
 */
export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}

/**
 * Send password reset email
 */
export async function resetPassword(formData: FormData): Promise<AuthResult> {
  const email = formData.get('email') as string

  if (!email) {
    return { error: 'Email-ul este obligatoriu' }
  }

  const supabase = await createClient()

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password`,
  })

  if (error) {
    console.error('Password reset error:', error)
    return { error: 'Nu s-a putut trimite email-ul de resetare' }
  }

  return { success: true }
}

/**
 * Update password (after reset)
 */
export async function updatePassword(formData: FormData): Promise<AuthResult> {
  const password = formData.get('password') as string
  const confirmPassword = formData.get('confirmPassword') as string

  if (!password || !confirmPassword) {
    return { error: 'Ambele câmpuri sunt obligatorii' }
  }

  if (password !== confirmPassword) {
    return { error: 'Parolele nu coincid' }
  }

  if (password.length < 8) {
    return { error: 'Parola trebuie să aibă minimum 8 caractere' }
  }

  const supabase = await createClient()

  const { error } = await supabase.auth.updateUser({
    password,
  })

  if (error) {
    console.error('Update password error:', error)
    return { error: 'Nu s-a putut actualiza parola' }
  }

  redirect('/app/dashboard')
}

/**
 * Get the current user
 */
export async function getUser() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return user
}

/**
 * Sign in with Google
 */
export async function signInWithGoogle() {
  const supabase = await createClient()
  const origin = (await headers()).get('origin')

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${origin}/auth/callback`,
    },
  })

  if (error) {
    console.error('Google sign in error:', error)
    return redirect('/login?error=google')
  }

  if (data.url) {
    redirect(data.url)
  }
}
