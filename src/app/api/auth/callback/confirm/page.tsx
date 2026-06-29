'use client'
import { useEffect } from 'react'
import { createClient } from '@/lib/supabase-browser'

export default function ConfirmPage() {
  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        // user_accessを初期化
        await fetch('/api/auth/init', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: session.user.id })
        })
        window.location.href = '/pricing'
      } else {
        window.location.href = '/login?error=auth'
      }
    })
  }, [])

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0e0a22', color: '#d4af37', fontFamily: 'serif', fontSize: 18 }}>
      ✦ 認証中...
    </div>
  )
}
