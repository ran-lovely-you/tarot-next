'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

// PKCEを完全に無効化したクライアント
function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        flowType: 'implicit',
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
      }
    }
  )
}

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    // URLにアクセストークンがある場合（マジックリンクからの戻り）
    const hash = window.location.hash
    if (hash && hash.includes('access_token')) {
      const supabase = getSupabase()
      supabase.auth.getSession().then(async ({ data: { session } }) => {
        if (session?.user) {
          // user_accessを初期化
          await fetch('/api/auth/init', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: session.user.id })
          }).catch(() => {})
          window.location.href = '/pricing'
        } else {
          setChecking(false)
        }
      })
    } else {
      setChecking(false)
    }
  }, [])

  async function sendLink() {
    setError('')
    if (!email) { setError('Please enter your email address'); return }
    setLoading(true)
    const supabase = getSupabase()
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: true,
        emailRedirectTo: `${siteUrl}/login`,
      }
    })
    setLoading(false)
    if (error) { setError(error.message); return }
    setSent(true)
  }

  if (checking) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0e0a22', color: '#d4af37', fontSize: 18, fontFamily: 'serif' }}>
        ✦ Loading...
      </div>
    )
  }

  return (
    <div style={s.bg}>
      <nav style={s.nav}>
        <span style={s.brand}>Tarot Reading</span>
      </nav>
      <div style={s.center}>
        <div style={s.card}>
          <div style={s.title}>Tarot Reading</div>
          <div style={s.subtitle}>Login / Register with Email</div>
          {sent ? (
            <div style={s.sentMsg}>
              Email sent!<br />
              <span style={{ fontSize: 13, color: '#9a94c0' }}>
                Please click the link in your inbox.<br />
                The link will log you in automatically.
              </span>
            </div>
          ) : (
            <>
              <p style={s.err}>{error}</p>
              <input
                style={s.input}
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && sendLink()}
              />
              <button style={s.btn} onClick={sendLink} disabled={loading}>
                {loading ? 'Sending...' : 'Send Login Link'}
              </button>
            </>
          )}
        </div>
      </div>
      <footer style={s.footer}>
        <a href="/tokusho" style={s.footerLink}>Legal Notice</a>
      </footer>
    </div>
  )
}

const s: Record<string, React.CSSProperties> = {
  bg:         { minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#0e0a22' },
  nav:        { display: 'flex', alignItems: 'center', padding: '14px 28px', borderBottom: '1px solid #4a2e7a' },
  brand:      { fontFamily: "'Cinzel Decorative', serif", color: '#d4af37', fontSize: 16, letterSpacing: '0.12em' },
  center:     { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' },
  card:       { background: 'rgba(26,16,53,0.85)', border: '1px solid #4a2e7a', borderRadius: 16, padding: '40px 36px', maxWidth: 400, width: '100%', textAlign: 'center' },
  title:      { fontFamily: "'Cinzel Decorative', serif", fontSize: 18, color: '#d4af37', letterSpacing: '0.1em', marginBottom: 10 },
  subtitle:   { fontSize: 13, color: '#9a94c0', marginBottom: 28 },
  err:        { color: '#e08080', fontSize: 12, minHeight: 18, marginBottom: 10 },
  input:      { width: '100%', background: 'rgba(14,10,34,0.7)', border: '1px solid #4a2e7a', borderRadius: 8, padding: '12px 14px', color: '#e8e4f8', fontFamily: 'inherit', fontSize: 14, outline: 'none', boxSizing: 'border-box', marginBottom: 16 },
  btn:        { width: '100%', padding: '14px', background: 'linear-gradient(135deg,#6b3fa0,#4a2070)', border: '1px solid #9b6fd4', borderRadius: 50, color: '#f0eefc', fontFamily: 'inherit', fontSize: 15, fontWeight: 600, letterSpacing: '0.12em', cursor: 'pointer' },
  sentMsg:    { background: 'rgba(107,63,160,0.2)', border: '1px solid #6b3fa0', borderRadius: 10, padding: '20px', color: '#d4af37', lineHeight: 2 },
  footer:     { textAlign: 'center', padding: '20px', borderTop: '1px solid #4a2e7a' },
  footerLink: { color: '#9a94c0', fontSize: 12, textDecoration: 'none' }
}
