import { NextRequest, NextResponse } from 'next/server'
import { createClient, createAdminClient } from '@/lib/supabase-server'

async function getUser() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export async function GET() {
  const user = await getUser()
  if (!user) return NextResponse.json([], { status: 200 })
  const admin = createAdminClient()
  const { data } = await admin.from('reading_history')
    .select('id, created_at, spread_label, question, data_json')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(50)
  return NextResponse.json(data || [])
}

export async function POST(req: NextRequest) {
  const user = await getUser()
  if (!user) return NextResponse.json({ ok: false })
  const { spreadLabel, question, data } = await req.json()
  const admin = createAdminClient()
  await admin.from('reading_history').insert({
    user_id: user.id,
    spread_label: spreadLabel || '',
    question: question || '',
    data_json: data
  })
  return NextResponse.json({ ok: true })
}

export async function DELETE(req: NextRequest) {
  const user = await getUser()
  if (!user) return NextResponse.json({ ok: false })
  const { id } = await req.json()
  const admin = createAdminClient()
  await admin.from('reading_history').delete().eq('id', id).eq('user_id', user.id)
  return NextResponse.json({ ok: true })
}
