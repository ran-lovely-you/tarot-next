import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'
import { createAdminClient } from '@/lib/supabase-server'
import { getUserAccess, hasAccess } from '@/lib/access'

async function getAuthedUser() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export async function GET() {
  const user = await getAuthedUser()
  if (!user) return NextResponse.json({ error: '認証が必要です' }, { status: 401 })
  const access = await getUserAccess(user.id)
  if (!hasAccess(access)) return NextResponse.json({ error: '有効なプランが必要です' }, { status: 403 })

  const admin = createAdminClient()
  const { data } = await admin.from('reading_history')
    .select('id, created_at, spread_label, question, data_json')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(50)
  return NextResponse.json(data || [])
}

export async function POST(req: NextRequest) {
  const user = await getAuthedUser()
  if (!user) return NextResponse.json({ error: '認証が必要です' }, { status: 401 })
  const access = await getUserAccess(user.id)
  if (!hasAccess(access)) return NextResponse.json({ error: '有効なプランが必要です' }, { status: 403 })

  const { spreadLabel, question, data } = await req.json()
  const admin = createAdminClient()
  await admin.from('reading_history').insert({
    user_id:     user.id,
    spread_label: spreadLabel || '',
    question:    question || '',
    data_json:   data
  })
  return NextResponse.json({ ok: true })
}

export async function DELETE(req: NextRequest) {
  const user = await getAuthedUser()
  if (!user) return NextResponse.json({ error: '認証が必要です' }, { status: 401 })
  const { id } = await req.json()
  const admin = createAdminClient()
  await admin.from('reading_history').delete().eq('id', id).eq('user_id', user.id)
  return NextResponse.json({ ok: true })
}
