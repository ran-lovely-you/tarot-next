import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase-admin'

export async function POST(req: NextRequest) {
  try {
    const { userId } = await req.json()
    if (!userId) return NextResponse.json({ ok: false })
    const admin = createAdminClient()
    await admin.from('user_access').upsert(
      { user_id: userId },
      { onConflict: 'user_id', ignoreDuplicates: true }
    )
    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ ok: true })
  }
}
