import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase-admin'
import { stripe } from '@/lib/stripe'

export async function POST(req: NextRequest) {
  const { type, userId, userEmail } = await req.json()

  if (!userId) return NextResponse.json({ error: 'ログインが必要です' }, { status: 401 })

  const priceId = type === 'subscription'
    ? process.env.STRIPE_PRICE_SUBSCRIPTION!
    : process.env.STRIPE_PRICE_ONETIME!

  const admin = createAdminClient()
  const { data: access } = await admin
    .from('user_access').select('stripe_customer_id')
    .eq('user_id', userId).single()

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL

  try {
    const session = await stripe.checkout.sessions.create({
      mode: type === 'subscription' ? 'subscription' : 'payment',
      customer: access?.stripe_customer_id || undefined,
      customer_email: access?.stripe_customer_id ? undefined : userEmail,
      client_reference_id: userId,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${siteUrl}/app?checkout=success`,
      cancel_url: `${siteUrl}/pricing?checkout=cancel`,
    })
    return NextResponse.json({ url: session.url })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
