import { NextRequest, NextResponse } from 'next/server'

// implicitフローではコールバックは不要
// マジックリンクはloginページで処理される
export async function GET(request: NextRequest) {
  const { origin } = new URL(request.url)
  return NextResponse.redirect(`${origin}/login`)
}
