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
      setTimeout(() => alert('✦ ご購入ありがとうございます！タロット鑑定をお楽しみください。'), 400)
    }

    // 履歴をサーバーにも保存
    const origSave = (window as any).saveToHistory
    ;(window as any).saveToHistory = async (entry: any) => {
      if (origSave) origSave(entry)
      try {
        await fetch('/api/history', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ spreadLabel: entry.spreadLabel, question: entry.question, data: entry })
        })
      } catch (e) {}
    }

    // 履歴表示時にサーバーから取得
    const origToggle = (window as any).toggleHistoryView
    ;(window as any).toggleHistoryView = async () => {
      const area = document.getElementById('history-area')
      if (!area) return
      const show = area.style.display === 'none' || area.style.display === ''
      area.style.display = show ? 'block' : 'none'
      if (show) {
        try {
          const rows = await fetch('/api/history').then(r => r.json())
          const norm = rows.map((r: any) => ({ ...r.data_json, date: r.created_at, _serverId: r.id }))
          localStorage.setItem('tarotHistory', JSON.stringify(norm))
        } catch (e) {}
        if (typeof (window as any).renderHistory === 'function') (window as any).renderHistory()
        area.scrollIntoView({ behavior: 'smooth' })
      }
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
    else alert(data.error || 'エラーが発生しました')
  }

  const planLabel = accessType === 'subscription' ? 'サブスク月額' : '買い切り'

  return (
    <>
      {/* トップバー */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '12px 24px', borderBottom: '1px solid #4a2e7a',
        background: 'rgba(14,10,34,0.95)', position: 'relative', zIndex: 10,
        fontFamily: "'Noto Serif JP', serif"
      }}>
        <span style={{ fontFamily: "'Cinzel Decorative', serif", color: '#d4af37', fontSize: 15, letterSpacing: '0.12em' }}>
          ✦ Tarot Reading
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 11, color: '#9a94c0' }}>{userEmail}</span>
          <span style={{ fontSize: 10, padding: '3px 10px', border: '1px solid #4a2e7a', borderRadius: 20, color: '#9b6fd4' }}>
            {planLabel}
          </span>
          {accessType === 'subscription' && (
            <button onClick={openPortal} style={btnStyle}>プラン管理</button>
          )}
          <button onClick={doLogout} style={btnStyle}>ログアウト</button>
        </div>
      </div>

      {/* タロットアプリ本体をiframeで読み込む */}
      <iframe
        src="/tarot-app.html"
        style={{ width: '100%', height: 'calc(100vh - 53px)', border: 'none' }}
        title="タロット占い"
      />
    </>
  )
}

const btnStyle: React.CSSProperties = {
  background: 'none', border: '1px solid #4a2e7a', borderRadius: 50,
  color: '#9a94c0', fontSize: 11, padding: '5px 14px', cursor: 'pointer', fontFamily: 'inherit'
}
