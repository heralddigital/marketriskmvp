import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { sendWelcomeEmail } from '@/lib/email/notifications'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/app/dashboard'

  if (code) {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error && data.user) {
      // Send welcome email for new users (check if this is their first session)
      try {
        const { data: userProfile } = await supabase
          .from('users')
          .select('email, name, locale, created_at')
          .eq('id', data.user.id)
          .single()

        // Send welcome email if user was created recently (within last hour)
        if (userProfile) {
          const createdAt = new Date(userProfile.created_at)
          const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000)

          if (createdAt > oneHourAgo) {
            await sendWelcomeEmail({
              to: userProfile.email,
              name: userProfile.name || data.user.email?.split('@')[0] || 'User',
              locale: (userProfile.locale || 'ro') as 'ro' | 'en',
            })
            console.log(`Welcome email sent to ${userProfile.email}`)
          }
        }
      } catch (emailError) {
        console.error('Error sending welcome email:', emailError)
        // Don't fail the auth flow if email fails
      }

      const forwardedHost = request.headers.get('x-forwarded-host')
      const isLocalEnv = process.env.NODE_ENV === 'development'

      if (isLocalEnv) {
        return NextResponse.redirect(`${origin}${next}`)
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`)
      } else {
        return NextResponse.redirect(`${origin}${next}`)
      }
    }
  }

  // Return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/login?error=auth`)
}
