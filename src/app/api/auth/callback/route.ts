import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { origin, hash } = new URL(request.url)
  
  // implicitフローの場合はフラグメント（#以降）をクライアントで処理
  return new NextResponse(
    `<!DOCTYPE html>
<html>
<head><title>Loading...</title></head>
<body>
<script>
  const hash = window.location.hash
  if (hash && hash.includes('access_token')) {
    // セッションをSupabaseに渡してリダイレクト
    window.location.href = '/auth/confirm' + hash
  } else {
    window.location.href = '/login?error=auth'
  }
</script>
</body>
</html>`,
    { headers: { 'Content-Type': 'text/html' } }
  )
}
