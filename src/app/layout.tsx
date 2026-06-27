import type { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'タロット占い — 天星鑑定',
  description: '12種類のスプレッドと20のトピックで導く、本格タロット鑑定サービス',
}
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Noto+Serif+JP:wght@400;600;700&family=Cinzel+Decorative:wght@700&display=swap" rel="stylesheet" />
      </head>
      <body style={{ margin: 0, background: '#0e0a22', color: '#e8e4f8', fontFamily: "'Noto Serif JP', serif" }}>
        {children}
      </body>
    </html>
  )
}
