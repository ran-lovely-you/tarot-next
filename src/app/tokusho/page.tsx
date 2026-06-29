export default function TokushoPage() {
  const rows = [
    ['Seller', 'Please enter your business name'],
    ['Address', 'Will be disclosed upon request'],
    ['Phone', 'Will be disclosed upon request'],
    ['Email', 'support@example.com'],
    ['Service', 'Tarot Reading Online Service'],
    ['Price', 'One-time: ¥2,500 / Monthly subscription: ¥980/month'],
    ['Payment', 'Credit card (Visa, Mastercard, Amex, JCB)'],
    ['Delivery', 'Immediate access after payment'],
    ['Refunds', 'No refunds for digital content. Subscriptions can be cancelled anytime.'],
  ]
  return (
    <div style={{ minHeight: '100vh' }}>
      <nav style={{ display: 'flex', alignItems: 'center', padding: '14px 28px', borderBottom: '1px solid #4a2e7a' }}>
        <a href="/" style={{ fontFamily: "'Cinzel Decorative',serif", color: '#d4af37', fontSize: 16, letterSpacing: '0.12em', textDecoration: 'none' }}>Tarot Reading</a>
      </nav>
      <div style={{ maxWidth: 700, margin: '0 auto', padding: '48px 20px 80px' }}>
        <h1 style={{ fontSize: 18, letterSpacing: '0.15em', color: '#d4af37', marginBottom: 30 }}>Legal Notice (Tokusho-ho)</h1>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <tbody>
            {rows.map(([th, td]) => (
              <tr key={th}>
                <th style={{ padding: '12px 16px', border: '1px solid #4a2e7a', background: 'rgba(26,16,53,0.5)', color: '#9a94c0', textAlign: 'left', width: '34%', verticalAlign: 'top' }}>{th}</th>
                <td style={{ padding: '12px 16px', border: '1px solid #4a2e7a', color: '#e8e4f8', lineHeight: 1.8 }}>{td}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ marginTop: 30, textAlign: 'center' }}>
          <a href="/pricing" style={{ color: '#9a94c0', fontSize: 13 }}>Back to Pricing</a>
        </div>
      </div>
    </div>
  )
}
