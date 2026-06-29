'use client'
import { useEffect, useRef } from 'react'

interface Props {
  userEmail: string
  accessType: string
  checkoutSuccess: boolean
}

export default function TarotApp({ userEmail, accessType, checkoutSuccess }: Props) {
  const initialized = useRef(false)

  useEffect(() => {
    if (initialized.current) return
    initialized.current = true
    if (checkoutSuccess) {
      setTimeout(() => alert('Thank you for your purchase! Enjoy your tarot reading.'), 400)
    }
  }, [checkoutSuccess])

  async function doLogout() {
    const { createClient } = await import('@/lib/supabase-browser')
    const sb = createClient()
    await sb.auth.signOut()
    location.href = '/login'
  }

  async function openPortal() {
    const res = await fetch('/api/billing-portal', { method: 'POST' })
    const data = await res.json()
    if (data.url) location.href = data.url
    else alert(data.error || 'Error occurred')
  }

  const planLabel = accessType === 'subscription' ? 'Subscription' : 'One-time'

  return (
    <>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '12px 24px', borderBottom: '1px solid #4a2e7a',
        background: 'rgba(14,10,34,0.95)', position: 'relative', zIndex: 10,
        fontFamily: "'Noto Serif JP', serif"
      }}>
        <span style={{ fontFamily: "'Cinzel Decorative', serif", color: '#d4af37', fontSize: 15, letterSpacing: '0.12em' }}>
          Tarot Reading
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 11, color: '#9a94c0' }}>{userEmail}</span>
          <span style={{ fontSize: 10, padding: '3px 10px', border: '1px solid #4a2e7a', borderRadius: 20, color: '#9b6fd4' }}>
            {planLabel}
          </span>
          {accessType === 'subscription' && (
            <button onClick={openPortal} style={btnStyle}>Manage Plan</button>
          )}
          <button onClick={doLogout} style={btnStyle}>Logout</button>
        </div>
      </div>
      <iframe
        src="/tarot-app.html"
        style={{ width: '100%', height: 'calc(100vh - 53px)', border: 'none' }}
        title="Tarot Reading App"
      />
    </>
  )
}

const btnStyle: React.CSSProperties = {
  background: 'none', border: '1px solid #4a2e7a', borderRadius: 50,
  color: '#9a94c0', fontSize: 11, padding: '5px 14px', cursor: 'pointer', fontFamily: 'inherit'
}
