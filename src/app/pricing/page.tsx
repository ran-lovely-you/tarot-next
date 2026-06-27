'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase-browser'

export default function PricingPage() {
  const [user, setUser]     = useState<any>(null)
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
  }, [])

  async function checkout(type: 'onetime' | 'subscription') {
    if (!user) { location.href = '/login'; return }
    if (access?.access_active) { location.href = '/app'; return }
    const res  = await fetch('/api/checkout', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ type }) })
    const data = await res.json()
    if (data.url) location.href = data.url
    else alert(data.error || 'エラーが発生しました')
  }

  async function logout() {
    await supabase.auth.signOut()
    location.href = '/login'
  }

  const hasActive = access?.access_active
  const planLabel = access?.access_type === 'subscription' ? 'サブスク月額' : access?.access_type === 'onetime' ? '買い切り' : ''

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* トップバー */}
      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 28px', borderBottom: '1px solid #4a2e7a', background: 'rgba(14,10,34,0.97)', position: 'sticky', top: 0, zIndex: 100 }}>
        <span style={{ fontFamily: "'Cinzel Decorative',serif", color: '#d4af37', fontSize: 16, letterSpacing: '0.12em' }}>✦ Tarot Reading</span>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
          {user && <span style={{ fontSize: 11, color: '#9a94c0' }}>{user.email}</span>}
          {planLabel && <span style={{ fontSize: 10, padding: '3px 10px', border: '1px solid #4a2e7a', borderRadius: 20, color: '#9b6fd4' }}>{planLabel}</span>}
          {user
            ? <button onClick={logout} style={btnStyle}>ログアウト</button>
            : <a href="/login" style={btnStyle}>ログイン</a>
          }
        </div>
      </nav>

      {/* ヒーロー */}
      <div style={{ textAlign: 'center', padding: '60px 20px 36px' }}>
        <h1 style={{ fontFamily: "'Cinzel Decorative',serif", fontSize: 'clamp(20px,4vw,28px)', color: '#d4af37', letterSpacing: '0.1em', textShadow: '0 0 20px rgba(212,175,55,0.3)', marginBottom: 10 }}>✦ 料金プラン ✦</h1>
        <p style={{ color: '#9a94c0', fontSize: 13, letterSpacing: '0.1em' }}>タロットカードが紡ぐ、あなただけの鑑定をお届けします</p>
      </div>

      {/* 利用中バナー */}
      {!loading && hasActive && (
        <div style={{ background: 'rgba(212,175,55,0.08)', border: '1px solid #d4af37', borderRadius: 12, padding: '16px 20px', textAlign: 'center', maxWidth: 820, margin: '0 auto 28px', width: 'calc(100% - 40px)', fontSize: 13, color: '#f0d060', lineHeight: 2 }}>
          ✦ ご利用中です — <a href="/app" style={{ color: '#d4af37', fontWeight: 700 }}>今すぐ占いを始める →</a>
        </div>
      )}

      {/* 価格カード */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 22, maxWidth: 820, margin: '0 auto', padding: '0 20px 60px', width: '100%' }}>

        {/* 単発購入 */}
        <div style={cardStyle}>
          <div style={labelStyle}>ONE TIME</div>
          <div style={amountStyle}>¥2,500 <span style={{ fontSize: 14, color: '#9a94c0', fontWeight: 400 }}>/ 買い切り</span></div>
          <p style={descStyle}>一度のお支払いで永続利用。じっくり占いを楽しみたい方に。</p>
          <ul style={featureListStyle}>
            {['12種類のスプレッドをすべて利用','20のトピック別鑑定','鑑定履歴の保存（最大50件）','PDF出力・印刷機能','AIによる動的鑑定文（要APIキー）','永続アクセス（更新不要）'].map(f => <li key={f} style={featureItemStyle}>✦ {f}</li>)}
          </ul>
          <button style={primaryBtnStyle} onClick={() => checkout('onetime')}>
            {hasActive ? '→ 占いを開く' : '¥2,500 で購入する'}
          </button>
        </div>

        {/* サブスク */}
        <div style={{ ...cardStyle, border: '1px solid #d4af37', boxShadow: '0 0 30px rgba(212,175,55,0.15)' }}>
          <div style={{ display: 'inline-block', background: '#d4af37', color: '#1a1035', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', padding: '3px 12px', borderRadius: 20, marginBottom: 14 }}>おすすめ</div>
          <div style={labelStyle}>SUBSCRIPTION</div>
          <div style={amountStyle}>¥980 <span style={{ fontSize: 14, color: '#9a94c0', fontWeight: 400 }}>/ 月</span></div>
          <p style={descStyle}>毎月自動更新。AI鑑定や新機能を継続的にお楽しみいただけます。</p>
          <ul style={featureListStyle}>
            {['買い切りプランの全機能を含む','サーバー側AI鑑定（APIキー不要）','毎月の新機能・スプレッド追加','優先メールサポート','いつでも解約可能'].map(f => <li key={f} style={featureItemStyle}>✦ {f}</li>)}
          </ul>
          <button style={goldBtnStyle} onClick={() => checkout('subscription')}>
            {hasActive ? '→ 占いを開く' : '月額 ¥980 で始める'}
          </button>
        </div>
      </div>

      {/* FAQ */}
      <div style={{ maxWidth: 640, margin: '0 auto 60px', padding: '0 20px' }}>
        <div style={{ fontSize: 12, letterSpacing: '0.3em', color: '#d4af37', textAlign: 'center', marginBottom: 24 }}>◈ よくある質問 ◈</div>
        {[
          ['支払いは安全ですか？', 'Stripe（ストライプ）が決済を処理します。カード情報は当サービスには保存されず、国際的なセキュリティ基準（PCI DSS）に準拠しています。'],
          ['単発とサブスクの違いは？', '単発（¥2,500）は一度のお支払いで永続利用。サブスク（月額¥980）はAI鑑定や新機能のアップデートを継続的にお楽しみいただけます。'],
          ['サブスクはいつでも解約できますか？', 'はい。マイページのポータルリンクからStripeの管理画面にアクセスし、いつでも解約できます。解約後も次回更新日まで利用可能です。'],
          ['返金はできますか？', 'デジタルコンテンツの性質上、原則として返金はお受けしておりません。ご不明点は購入前にお問い合わせください。'],
        ].map(([q, a]) => (
          <div key={q} style={{ marginBottom: 22 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: '#f0eefc', marginBottom: 6 }}>Q. {q}</div>
            <div style={{ fontSize: 12, color: '#9a94c0', lineHeight: 1.9 }}>{a}</div>
          </div>
        ))}
      </div>

      <footer style={{ borderTop: '1px solid #4a2e7a', padding: '20px 28px', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10, fontSize: 11, color: '#9a94c0' }}>
        <span>© 2025 Tarot Reading</span>
        <div style={{ display: 'flex', gap: 20 }}>
          <a href="/tokusho" style={{ color: '#9a94c0', textDecoration: 'none' }}>特定商取引法に基づく表記</a>
          <a href="mailto:support@example.com" style={{ color: '#9a94c0', textDecoration: 'none' }}>お問い合わせ</a>
        </div>
      </footer>
    </div>
  )
}

const btnStyle: React.CSSProperties = { background: 'none', border: '1px solid #4a2e7a', borderRadius: 50, color: '#9a94c0', fontSize: 11, padding: '5px 14px', cursor: 'pointer', fontFamily: 'inherit', textDecoration: 'none', display: 'inline-block' }
const cardStyle: React.CSSProperties = { background: 'rgba(26,16,53,0.8)', border: '1px solid #4a2e7a', borderRadius: 18, padding: '32px 28px', display: 'flex', flexDirection: 'column' }
const labelStyle: React.CSSProperties = { fontSize: 11, letterSpacing: '0.25em', color: '#9a94c0' }
const amountStyle: React.CSSProperties = { fontSize: 36, fontWeight: 700, color: '#f0eefc', margin: '10px 0' }
const descStyle: React.CSSProperties = { fontSize: 12, color: '#9a94c0', marginBottom: 20, lineHeight: 1.7 }
const featureListStyle: React.CSSProperties = { listStyle: 'none', fontSize: 13, lineHeight: 2.1, color: '#e8e4f8', marginBottom: 28, flex: 1, padding: 0 }
const featureItemStyle: React.CSSProperties = { color: '#e8e4f8' }
const primaryBtnStyle: React.CSSProperties = { width: '100%', padding: 14, background: 'linear-gradient(135deg,#6b3fa0,#4a2070)', border: '1px solid #9b6fd4', borderRadius: 50, color: '#f0eefc', fontFamily: 'inherit', fontSize: 15, fontWeight: 600, letterSpacing: '0.12em', cursor: 'pointer' }
const goldBtnStyle: React.CSSProperties = { width: '100%', padding: 14, background: 'linear-gradient(135deg,#b8860b,#d4af37)', border: 'none', borderRadius: 50, color: '#1a1035', fontFamily: 'inherit', fontSize: 15, fontWeight: 700, letterSpacing: '0.12em', cursor: 'pointer' }
