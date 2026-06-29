import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')

  if (!code) {
    return NextResponse.redirect(`${origin}/login?error=no_code`)
  }

  try {
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll: () => cookieStore.getAll(),
          setAll: (cs) => cs.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        }
      }
    )

    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (error) {
      console.error('Auth error:', error.message)
      return NextResponse.redirect(`${origin}/login?error=auth`)
    }

    if (data.user) {
      const { createClient } = require('@supabase/supabase-js')
      const admin = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      )
      await admin.from('user_access').upsert(
        { user_id: data.user.id },
        { onConflict: 'user_id', ignoreDuplicates: true }
      )
      return NextResponse.redirect(`${origin}/pricing`)
    }
  } catch (e) {
    console.error('Callback error:', e)
  }

  return NextResponse.redirect(`${origin}/login?error=auth`)
}
