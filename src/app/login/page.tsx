'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase-browser'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [step, setStep] = useState<'email' | 'otp'>('email')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const supabase = createClient()

  async function sendOtp() {
    setError('')
    if (!email) { setError('Please enter your email address'); return }
    setLoading(true)
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { shouldCreateUser: true }
    })
    setLoading(false)
    if (error) { setError(error.message); return }
    setStep('otp')
  }

  async function verifyOtp() {
    setError('')
    if (!otp) { setError('Please enter the code'); return }
    setLoading(true)
    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token: otp,
      type: 'email'
    })
    setLoading(false)
    if (error) { setError(error.message); return }
    if (data.user) {
      // user_accessを初期化
      await fetch('/api/auth/init', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: data.user.id })
      })
      window.location.href = '/pricing'
    }
  }

  return (
    <div style={s.bg}>
      <nav style={s.nav}>
        <span style={s.brand}>Tarot Reading</span>
      </nav>
      <div style={s.center}>
        <div style={s.card}>
          <div style={s.title}>Tarot Reading</div>
          <div style={s.subtitle}>
            {step === 'email' ? 'Login / Register with Email' : 'Enter the code from your email'}
          </div>
          <p style={s.err}>{error}</p>
          {step === 'email' ? (
            <>
              <input
                style={s.input}
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && sendOtp()}
              />
              <button style={s.btn} onClick={sendOtp} disabled={loading}>
                {loading ? 'Sending...' : 'Send Code'}
              </button>
            </>
          ) : (
            <>
              <div style={{ fontSize: 13, color: '#9a94c0', marginBottom: 16 }}>
                Code sent to: {email}
              </div>
              <input
                style={s.input}
                type="text"
                placeholder="6-digit code"
                value={otp}
                onChange={e => setOtp(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && verifyOtp()}
                maxLength={6}
              />
              <button style={s.btn} onClick={verifyOtp} disabled={loading}>
                {loading ? 'Verifying...' : 'Verify Code'}
              </button>
              <button style={s.backBtn} onClick={() => { setStep('email'); setError(''); setOtp('') }}>
                Back
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
  bg:        { minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#0e0a22' },
  nav:       { display: 'flex', alignItems: 'center', padding: '14px 28px', borderBottom: '1px solid #4a2e7a' },
  brand:     { fontFamily: "'Cinzel Decorative', serif", color: '#d4af37', fontSize: 16, letterSpacing: '0.12em' },
  center:    { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' },
  card:      { background: 'rgba(26,16,53,0.85)', border: '1px solid #4a2e7a', borderRadius: 16, padding: '40px 36px', maxWidth: 400, width: '100%', textAlign: 'center' },
  title:     { fontFamily: "'Cinzel Decorative', serif", fontSize: 18, color: '#d4af37', letterSpacing: '0.1em', marginBottom: 10 },
  subtitle:  { fontSize: 13, color: '#9a94c0', marginBottom: 28, letterSpacing: '0.05em' },
  err:       { color: '#e08080', fontSize: 12, minHeight: 18, marginBottom: 10 },
  input:     { width: '100%', background: 'rgba(14,10,34,0.7)', border: '1px solid #4a2e7a', borderRadius: 8, padding: '12px 14px', color: '#e8e4f8', fontFamily: 'inherit', fontSize: 14, outline: 'none', boxSizing: 'border-box', marginBottom: 16 },
  btn:       { width: '100%', padding: '14px', background: 'linear-gradient(135deg,#6b3fa0,#4a2070)', border: '1px solid #9b6fd4', borderRadius: 50, color: '#f0eefc', fontFamily: 'inherit', fontSize: 15, fontWeight: 600, letterSpacing: '0.12em', cursor: 'pointer' },
  backBtn:   { width: '100%', padding: '10px', background: 'none', border: '1px solid #4a2e7a', borderRadius: 50, color: '#9a94c0', fontFamily: 'inherit', fontSize: 13, cursor: 'pointer', marginTop: 10 },
  footer:    { textAlign: 'center', padding: '20px', borderTop: '1px solid #4a2e7a' },
  footerLink:{ color: '#9a94c0', fontSize: 12, textDecoration: 'none' }
}
