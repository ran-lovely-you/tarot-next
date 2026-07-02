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

export default function PricingPage() {
  const [user, setUser] = useState<any>(null)
  const [access, setAccess] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = getSupabase()
    ;(async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        setUser(session.user)
        const { data } = await supabase.from('user_access').select('*').eq('user_id', session.user.id).single()
        setAccess(data)
      }
      setLoading(false)
    })()
    const params = new URLSearchParams(location.search)
    if (params.get('checkout') === 'cancel') {
      alert('決済がキャンセルされました。')
      history.replaceState({}, '', '/pricing')
    }
  }, [])

  async function checkout(type: string) {
    if (!user) { location.href = '/login'; return }
    if (access?.access_active) { location.href = '/app'; return }
    const res = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, userId: user.id, userEmail: user.email })
    })
    const data = await res.json()
    if (data.url) location.href = data.url
    else alert(data.error || 'エラーが発生しました')
  }

  async function logout() {
    const supabase = getSupabase()
    await supabase.auth.signOut()
    location.href = '/login'
  }

  async function openPortal() {
    const res = await fetch('/api/billing-portal', { method: 'POST' })
    const data = await res.json()
    if (data.url) location.href = data.url
  }

  const hasActive = access?.access_active
  const planLabel = access?.access_type === 'subscription' ? 'サブスク月額' : access?.access_type === 'onetime' ? '買い切り' : ''

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <nav style={s.nav}>
        <span style={s.brand}>✦ タロット占い 天星鑑定</span>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
          {user && <span style={{ fontSize: 11, color: '#9a94c0' }}>{user.email}</span>}
          {planLabel && <span style={{ fontSize: 10, padding: '3px 10px', border: '1px solid #4a2e7a', borderRadius: 20, color: '#9b6fd4' }}>{planLabel}</span>}
          {access?.access_type === 'subscription' && (
            <button onClick={openPortal} style={s.topBtn}>プラン管理</button>
          )}
          {user
            ? <button onClick={logout} style={s.topBtn}>ログアウト</button>
            : <a href="/login" style={s.topBtn}>ログイン</a>
          }
        </div>
      </nav>

      <div style={{ textAlign: 'center', padding: '60px 20px 36px' }}>
        <h1 style={{ fontFamily: "'Cinzel Decorative',serif", fontSize: 'clamp(18px,4vw,26px)', color: '#d4af37', letterSpacing: '0.08em', marginBottom: 10 }}>
          ✦ 料金プラン ✦
        </h1>
        <p style={{ color: '#9a94c0', fontSize: 13, letterSpacing: '0.05em' }}>タロットカードが紡ぐ、あなただけの鑑定をお届けします</p>
      </div>

      {!loading && hasActive && (
        <div style={{ background: 'rgba(212,175,55,0.08)', border: '1px solid #d4af37', borderRadius: 12, padding: '16px 20px', textAlign: 'center', maxWidth: 820, margin: '0 auto 28px', width: 'calc(100% - 40px)', fontSize: 13, color: '#f0d060', lineHeight: 2 }}>
          ✦ ご利用中です — <a href="/app" style={{ color: '#d4af37', fontWeight: 700 }}>今すぐ占いを始める →</a>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 22, maxWidth: 820, margin: '0 auto', padding: '0 20px 60px', width: '100%' }}>
        {/* 単発購入 */}
        <div style={s.card}>
          <div style={s.planLabel}>ONE TIME</div>
          <div style={s.price}>¥2,500 <span style={s.priceSub}>/ 買い切り</span></div>
          <p style={s.planDesc}>一度のお支払いで永続利用。じっくり占いを楽しみたい方に。</p>
          <ul style={s.features}>
            {[
              '12種類のスプレッドをすべて利用',
              '20のトピック別鑑定',
              '鑑定履歴の保存（最大50件）',
              'PDF出力・印刷機能',
              'AIによる動的鑑定文（要APIキー）',
              '永続アクセス（更新不要）'
            ].map(f => <li key={f} style={{ marginBottom: 8 }}>✦ {f}</li>)}
          </ul>
          <button style={s.btnPrimary} onClick={() => checkout('onetime')}>
            {hasActive ? '→ 占いを始める' : '¥2,500 で購入する'}
          </button>
        </div>

        {/* サブスクリプション */}
        <div style={{ ...s.card, border: '1px solid #d4af37', boxShadow: '0 0 30px rgba(212,175,55,0.15)' }}>
          <div style={{ display: 'inline-block', background: '#d4af37', color: '#1a1035', fontSize: 10, fontWeight: 700, padding: '3px 12px', borderRadius: 20, marginBottom: 14 }}>おすすめ</div>
          <div style={s.planLabel}>SUBSCRIPTION</div>
          <div style={s.price}>¥980 <span style={s.priceSub}>/ 月</span></div>
          <p style={s.planDesc}>毎月自動更新。AI鑑定や新機能を継続的にお楽しみいただけます。</p>
          <ul style={s.features}>
            {[
              '買い切りプランの全機能を含む',
              'サーバー側AI鑑定（APIキー不要）',
              '毎月の新機能・スプレッド追加',
              '優先メールサポート',
              'いつでも解約可能'
            ].map(f => <li key={f} style={{ marginBottom: 8 }}>✦ {f}</li>)}
          </ul>
          <button style={s.btnGold} onClick={() => checkout('subscription')}>
            {hasActive ? '→ 占いを始める' : '月額 ¥980 で始める'}
          </button>
          {access?.access_type === 'subscription' && (
            <span onClick={openPortal} style={{ display: 'block', textAlign: 'center', marginTop: 12, fontSize: 12, color: '#9a94c0', cursor: 'pointer', textDecoration: 'underline' }}>
              プランの変更・解約はこちら
            </span>
          )}
        </div>
      </div>

      {/* FAQ */}
      <div style={{ maxWidth: 640, margin: '0 auto 60px', padding: '0 20px' }}>
        <div style={{ fontSize: 12, letterSpacing: '0.3em', color: '#d4af37', textAlign: 'center', marginBottom: 24 }}>◈ よくある質問 ◈</div>
        {[
          ['支払いは安全ですか？', 'Stripe（ストライプ）が決済を処理します。カード情報は当サービスには保存されず、国際的なセキュリティ基準（PCI DSS）に準拠しています。'],
          ['単発とサブスクの違いは？', '単発（¥2,500）は一度のお支払いで永続利用。サブスク（月額¥980）はAI鑑定や新機能のアップデートを継続的にお楽しみいただけます。'],
          ['サブスクはいつでも解約できますか？', 'はい。「プランの変更・解約」リンクからStripeの管理画面にアクセスし、いつでも解約できます。'],
          ['返金はできますか？', 'デジタルコンテンツの性質上、原則として返金はお受けしておりません。ご不明点は購入前にお問い合わせください。'],
        ].map(([q, a]) => (
          <div key={q as string} style={{ marginBottom: 22 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: '#f0eefc', marginBottom: 6 }}>Q. {q}</div>
            <div style={{ fontSize: 12, color: '#9a94c0', lineHeight: 1.9 }}>{a}</div>
          </div>
        ))}
      </div>

      <footer style={s.footer}>
        <span>© 2025 タロット占い 天星鑑定　運営：美好蘭</span>
        <div style={{ display: 'flex', gap: 20 }}>
          <a href="/tokusho" style={s.footerLink}>特定商取引法に基づく表記</a>
          <a href="mailto:ran-miyoshi@outlook.jp" style={s.footerLink}>お問い合わせ</a>
        </div>
      </footer>
    </div>
  )
}

const s: Record<string, React.CSSProperties> = {
  nav:        { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 28px', borderBottom: '1px solid #4a2e7a', background: 'rgba(14,10,34,0.97)', position: 'sticky', top: 0, zIndex: 100 },
  brand:      { fontFamily: "'Cinzel Decorative',serif", color: '#d4af37', fontSize: 15, letterSpacing: '0.08em' },
  topBtn:     { background: 'none', border: '1px solid #4a2e7a', borderRadius: 50, color: '#9a94c0', fontSize: 11, padding: '5px 14px', cursor: 'pointer', fontFamily: 'inherit', textDecoration: 'none', display: 'inline-block' },
  card:       { background: 'rgba(26,16,53,0.8)', border: '1px solid #4a2e7a', borderRadius: 18, padding: '32px 28px', display: 'flex', flexDirection: 'column' },
  planLabel:  { fontSize: 11, letterSpacing: '0.25em', color: '#9a94c0' },
  price:      { fontSize: 36, fontWeight: 700, color: '#f0eefc', margin: '10px 0' },
  priceSub:   { fontSize: 14, color: '#9a94c0', fontWeight: 400 },
  planDesc:   { fontSize: 12, color: '#9a94c0', marginBottom: 20, lineHeight: 1.7 },
  features:   { listStyle: 'none', fontSize: 13, lineHeight: 2, color: '#e8e4f8', marginBottom: 28, flex: 1, padding: 0 },
  btnPrimary: { width: '100%', padding: 14, background: 'linear-gradient(135deg,#6b3fa0,#4a2070)', border: '1px solid #9b6fd4', borderRadius: 50, color: '#f0eefc', fontFamily: 'inherit', fontSize: 15, fontWeight: 600, letterSpacing: '0.12em', cursor: 'pointer' },
  btnGold:    { width: '100%', padding: 14, background: 'linear-gradient(135deg,#b8860b,#d4af37)', border: 'none', borderRadius: 50, color: '#1a1035', fontFamily: 'inherit', fontSize: 15, fontWeight: 700, letterSpacing: '0.12em', cursor: 'pointer' },
  footer:     { borderTop: '1px solid #4a2e7a', padding: '20px 28px', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10, fontSize: 11, color: '#9a94c0' },
  footerLink: { color: '#9a94c0', textDecoration: 'none' }
}
