import { NextRequest, NextResponse } from 'next/server'
import { createClient, createAdminClient } from '@/lib/supabase-server'
import { stripe } from '@/lib/stripe'

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Login required' }, { status: 401 })

  const { type } = await req.json()
  const priceId = type === 'subscription'
    ? process.env.STRIPE_PRICE_SUBSCRIPTION!
    : process.env.STRIPE_PRICE_ONETIME!

  const admin = createAdminClient()
  const { data: access } = await admin
    .from('user_access').select('stripe_customer_id')
    .eq('user_id', user.id).single()

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL

  try {
    const session = await stripe.checkout.sessions.create({
      mode: type === 'subscription' ? 'subscription' : 'payment',
      customer: access?.stripe_customer_id || undefined,
      customer_email: access?.stripe_customer_id ? undefined : user.email,
      client_reference_id: user.id,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${siteUrl}/app?checkout=success`,
      cancel_url: `${siteUrl}/pricing?checkout=cancel`,
    })
    return NextResponse.json({ url: session.url })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
