import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type')

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

    let user = null

    if (code) {
      const { data, error } = await supabase.auth.exchangeCodeForSession(code)
      if (!error) user = data.user
    } else if (token_hash && type) {
      const { data, error } = await supabase.auth.verifyOtp({ token_hash, type: type as any })
      if (!error) user = data.user
    }

    if (user) {
      const { createClient } = require('@supabase/supabase-js')
      const admin = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      )
      await admin.from('user_access').upsert(
        { user_id: user.id },
        { onConflict: 'user_id', ignoreDuplicates: true }
      )
      return NextResponse.redirect(`${origin}/pricing`)
    }
  } catch (e) {
    console.error('Callback error:', e)
  }

  return NextResponse.redirect(`${origin}/login?error=auth`)
}
