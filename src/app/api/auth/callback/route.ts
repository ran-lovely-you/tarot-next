import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { userId } = await req.json()
  if (!userId) return NextResponse.json({ error: 'No userId' }, { status: 400 })

  const { createClient } = require('@supabase/supabase-js')
  const admin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
  await admin.from('user_access').upsert(
    { user_id: userId },
    { onConflict: 'user_id', ignoreDuplicates: true }
  )
  return NextResponse.json({ ok: true })
}
