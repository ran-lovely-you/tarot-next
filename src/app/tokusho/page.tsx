export default function TokushoPage() {
  const rows = [
    ['販売業者', '【事業者名を入力】'],
    ['所在地', '請求があった場合、遅滞なく開示いたします。'],
    ['電話番号', '請求があった場合、遅滞なく開示いたします。'],
    ['メールアドレス', 'support@example.com'],
    ['販売価格', '・買い切りプラン：¥2,500（税込）\n・月額サブスクリプション：¥980 / 月（税込）'],
    ['支払方法', 'クレジットカード（VISA・Mastercard・American Express・JCB）'],
    ['支払時期', '・買い切り：購入時に即時決済\n・月額サブスク：初回購入時、以降毎月同日に自動更新'],
    ['サービス提供時期', '決済完了後、即時ご利用いただけます'],
    ['返品・キャンセル', 'デジタルコンテンツの性質上、購入後の返品・返金は原則お受けしておりません。月額サブスクは次回更新日前日までにキャンセル手続きで翌月以降の請求を停止できます。'],
    ['動作環境', 'インターネット接続環境およびWebブラウザ（Chrome・Safari・Firefox・Edge 最新版推奨）'],
  ]
  return (
    <div style={{ minHeight: '100vh' }}>
      <nav style={{ display: 'flex', alignItems: 'center', padding: '14px 28px', borderBottom: '1px solid #4a2e7a' }}>
        <a href="/" style={{ fontFamily: "'Cinzel Decorative',serif", color: '#d4af37', fontSize: 16, letterSpacing: '0.12em', textDecoration: 'none' }}>✦ Tarot Reading</a>
      </nav>
      <div style={{ maxWidth: 700, margin: '0 auto', padding: '48px 20px 80px' }}>
        <h1 style={{ fontSize: 18, letterSpacing: '0.15em', color: '#d4af37', marginBottom: 30 }}>特定商取引法に基づく表記</h1>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <tbody>
            {rows.map(([th, td]) => (
              <tr key={th}>
                <th style={{ padding: '12px 16px', border: '1px solid #4a2e7a', background: 'rgba(26,16,53,0.5)', color: '#9a94c0', textAlign: 'left', width: '34%', verticalAlign: 'top', fontWeight: 600 }}>{th}</th>
                <td style={{ padding: '12px 16px', border: '1px solid #4a2e7a', color: '#e8e4f8', lineHeight: 1.8, whiteSpace: 'pre-line' }}>{td}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ marginTop: 30, textAlign: 'center' }}>
          <a href="/pricing" style={{ color: '#9a94c0', fontSize: 13 }}>← 料金プランへ戻る</a>
        </div>
      </div>
    </div>
  )
}
