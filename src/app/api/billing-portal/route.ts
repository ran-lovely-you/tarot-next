import { NextResponse } from 'next/server'
import { createClient, createAdminClient } from '@/lib/supabase-server'
import { stripe } from '@/lib/stripe'

export async function POST() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'ログインが必要です' }, { status: 401 })

  const admin = createAdminClient()
  const { data: access } = await admin.from('user_access').select('stripe_customer_id').eq('user_id', user.id).single()
  if (!access?.stripe_customer_id)
    return NextResponse.json({ error: '決済情報が見つかりません' }, { status: 400 })

  try {
    const portal = await stripe.billingPortal.sessions.create({
      customer: access.stripe_customer_id,
      return_url: `${process.env.NEXT_PUBLIC_SITE_URL}/app`
    })
    return NextResponse.json({ url: portal.url })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
