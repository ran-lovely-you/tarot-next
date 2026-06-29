'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase-browser'

export default function PricingPage() {
  const [user, setUser] = useState<any>(null)
  const [access, setAccess] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      if (user) {
        const { data } = await supabase.from('user_access').select('*').eq('user_id', user.id).single()
        setAccess(data)
      }
      setLoading(false)
    })()
    // URLパラメータ確認
    const p = new URLSearchParams(location.search)
    if (p.get('checkout') === 'cancel') {
      alert('Payment was cancelled.')
      history.replaceState({}, '', '/pricing')
    }
  }, [])

  async function checkout(type: string) {
    if (!user) { location.href = '/login'; return }
    if (access?.access_active) { location.href = '/app'; return }
    const res = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type })
    })
    const data = await res.json()
    if (data.url) location.href = data.url
    else alert(data.error || 'Error occurred')
  }

  async function logout() {
    await supabase.auth.signOut()
    location.href = '/login'
  }

  async function openPortal() {
    const res = await fetch('/api/billing-portal', { method: 'POST' })
    const data = await res.json()
    if (data.url) location.href = data.url
  }

  const hasActive = access?.access_active
  const planLabel = access?.access_type === 'subscription' ? 'Subscription' : access?.access_type === 'onetime' ? 'One-time' : ''

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <nav style={s.nav}>
        <span style={s.brand}>Tarot Reading</span>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
          {user && <span style={{ fontSize: 11, color: '#9a94c0' }}>{user.email}</span>}
          {planLabel && <span style={{ fontSize: 10, padding: '3px 10px', border: '1px solid #4a2e7a', borderRadius: 20, color: '#9b6fd4' }}>{planLabel}</span>}
          {access?.access_type === 'subscription' && (
            <button onClick={openPortal} style={s.topBtn}>Manage Plan</button>
          )}
          {user
            ? <button onClick={logout} style={s.topBtn}>Logout</button>
            : <a href="/login" style={s.topBtn}>Login</a>
          }
        </div>
      </nav>

      <div style={{ textAlign: 'center', padding: '60px 20px 36px' }}>
        <h1 style={{ fontFamily: "'Cinzel Decorative',serif", fontSize: 'clamp(20px,4vw,28px)', color: '#d4af37', letterSpacing: '0.1em', marginBottom: 10 }}>
          Tarot Reading Plans
        </h1>
        <p style={{ color: '#9a94c0', fontSize: 13 }}>Choose your plan to start your tarot journey</p>
      </div>

      {!loading && hasActive && (
        <div style={{ background: 'rgba(212,175,55,0.08)', border: '1px solid #d4af37', borderRadius: 12, padding: '16px 20px', textAlign: 'center', maxWidth: 820, margin: '0 auto 28px', width: 'calc(100% - 40px)', fontSize: 13, color: '#f0d060' }}>
          Active plan — <a href="/app" style={{ color: '#d4af37', fontWeight: 700 }}>Start Reading →</a>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 22, maxWidth: 820, margin: '0 auto', padding: '0 20px 60px', width: '100%' }}>
        {/* 単発購入 */}
        <div style={s.card}>
          <div style={s.planLabel}>ONE TIME</div>
          <div style={s.price}>¥2,500 <span style={s.priceSub}>/ one-time</span></div>
          <ul style={s.features}>
            {['12 spread types','20 topic readings','Reading history (50 max)','PDF export','AI readings (API key required)','Lifetime access'].map(f => (
              <li key={f} style={{ marginBottom: 8 }}>✦ {f}</li>
            ))}
          </ul>
          <button style={s.btnPrimary} onClick={() => checkout('onetime')}>
            {hasActive ? '→ Open App' : 'Buy for ¥2,500'}
          </button>
        </div>

        {/* サブスク */}
        <div style={{ ...s.card, border: '1px solid #d4af37', boxShadow: '0 0 30px rgba(212,175,55,0.15)' }}>
          <div style={{ display: 'inline-block', background: '#d4af37', color: '#1a1035', fontSize: 10, fontWeight: 700, padding: '3px 12px', borderRadius: 20, marginBottom: 14 }}>RECOMMENDED</div>
          <div style={s.planLabel}>SUBSCRIPTION</div>
          <div style={s.price}>¥980 <span style={s.priceSub}>/ month</span></div>
          <ul style={s.features}>
            {['All one-time features','Server-side AI readings','Monthly new features','Priority support','Cancel anytime'].map(f => (
              <li key={f} style={{ marginBottom: 8 }}>✦ {f}</li>
            ))}
          </ul>
          <button style={s.btnGold} onClick={() => checkout('subscription')}>
            {hasActive ? '→ Open App' : 'Start ¥980/month'}
          </button>
          {access?.access_type === 'subscription' && (
            <span onClick={openPortal} style={{ display: 'block', textAlign: 'center', marginTop: 12, fontSize: 12, color: '#9a94c0', cursor: 'pointer', textDecoration: 'underline' }}>
              Manage / Cancel subscription
            </span>
          )}
        </div>
      </div>

      <footer style={s.footer}>
        <span>© 2025 Tarot Reading</span>
        <div style={{ display: 'flex', gap: 20 }}>
          <a href="/tokusho" style={s.footerLink}>Legal Notice</a>
          <a href="mailto:support@example.com" style={s.footerLink}>Contact</a>
        </div>
      </footer>
    </div>
  )
}

const s: Record<string, React.CSSProperties> = {
  nav:       { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 28px', borderBottom: '1px solid #4a2e7a', background: 'rgba(14,10,34,0.97)', position: 'sticky', top: 0, zIndex: 100 },
  brand:     { fontFamily: "'Cinzel Decorative',serif", color: '#d4af37', fontSize: 16, letterSpacing: '0.12em' },
  topBtn:    { background: 'none', border: '1px solid #4a2e7a', borderRadius: 50, color: '#9a94c0', fontSize: 11, padding: '5px 14px', cursor: 'pointer', fontFamily: 'inherit', textDecoration: 'none', display: 'inline-block' },
  card:      { background: 'rgba(26,16,53,0.8)', border: '1px solid #4a2e7a', borderRadius: 18, padding: '32px 28px', display: 'flex', flexDirection: 'column' },
  planLabel: { fontSize: 11, letterSpacing: '0.25em', color: '#9a94c0' },
  price:     { fontSize: 36, fontWeight: 700, color: '#f0eefc', margin: '10px 0' },
  priceSub:  { fontSize: 14, color: '#9a94c0', fontWeight: 400 },
  features:  { listStyle: 'none', fontSize: 13, lineHeight: 2, color: '#e8e4f8', marginBottom: 28, flex: 1, padding: 0 },
  btnPrimary:{ width: '100%', padding: 14, background: 'linear-gradient(135deg,#6b3fa0,#4a2070)', border: '1px solid #9b6fd4', borderRadius: 50, color: '#f0eefc', fontFamily: 'inherit', fontSize: 15, fontWeight: 600, letterSpacing: '0.12em', cursor: 'pointer' },
  btnGold:   { width: '100%', padding: 14, background: 'linear-gradient(135deg,#b8860b,#d4af37)', border: 'none', borderRadius: 50, color: '#1a1035', fontFamily: 'inherit', fontSize: 15, fontWeight: 700, letterSpacing: '0.12em', cursor: 'pointer' },
  footer:    { borderTop: '1px solid #4a2e7a', padding: '20px 28px', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10, fontSize: 11, color: '#9a94c0' },
  footerLink:{ color: '#9a94c0', textDecoration: 'none' }
}
