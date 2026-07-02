'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { flowType: 'implicit', persistSession: true } }
  )
}

export default function AppPage() {
  const [user, setUser] = useState<any>(null)
  const [access, setAccess] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = getSupabase()
    ;(async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.user) {
        location.href = '/login'
        return
      }
      const { data } = await supabase
        .from('user_access').select('*')
        .eq('user_id', session.user.id).single()

      if (!data?.access_active) {
        location.href = '/pricing'
        return
      }

      setUser(session.user)
      setAccess(data)
      setLoading(false)

      // checkout=successの場合
      const params = new URLSearchParams(location.search)
      if (params.get('checkout') === 'success') {
        setTimeout(() => alert('Thank you for your purchase! Enjoy your tarot reading.'), 400)
        history.replaceState({}, '', '/app')
      }
    })()
  }, [])

  async function doLogout() {
    const supabase = getSupabase()
    await supabase.auth.signOut()
    location.href = '/login'
  }

  async function openPortal() {
    const res = await fetch('/api/billing-portal', { method: 'POST' })
    const data = await res.json()
    if (data.url) location.href = data.url
  }

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0e0a22', color: '#d4af37', fontSize: 18 }}>
        ✦ Loading...
      </div>
    )
  }

  const planLabel = access?.access_type === 'subscription' ? 'Subscription' : 'One-time'

  return (
    <>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '12px 24px', borderBottom: '1px solid #4a2e7a',
        background: 'rgba(14,10,34,0.95)', zIndex: 10,
        fontFamily: "'Noto Serif JP', serif"
      }}>
        <span style={{ fontFamily: "'Cinzel Decorative', serif", color: '#d4af37', fontSize: 15, letterSpacing: '0.12em' }}>
          Tarot Reading
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 11, color: '#9a94c0' }}>{user?.email}</span>
          <span style={{ fontSize: 10, padding: '3px 10px', border: '1px solid #4a2e7a', borderRadius: 20, color: '#9b6fd4' }}>
            {planLabel}
          </span>
          {access?.access_type === 'subscription' && (
            <button onClick={openPortal} style={btnStyle}>Manage Plan</button>
          )}
          <button onClick={doLogout} style={btnStyle}>Logout</button>
        </div>
      </div>
      <iframe
        src="/tarot-app.html"
        style={{ width: '100%', height: 'calc(100vh - 53px)', border: 'none', display: 'block' }}
        title="Tarot Reading App"
      />
    </>
  )
}

const btnStyle: React.CSSProperties = {
  background: 'none', border: '1px solid #4a2e7a', borderRadius: 50,
  color: '#9a94c0', fontSize: 11, padding: '5px 14px', cursor: 'pointer', fontFamily: 'inherit'
}
