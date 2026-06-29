import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createAdminClient } from '@/lib/supabase-server'

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig  = req.headers.get('stripe-signature')!
  let event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 })
  }

  const admin = createAdminClient()
  const obj   = event.data.object as any

  if (event.type === 'checkout.session.completed') {
    const uid  = obj.client_reference_id
    const mode = obj.mode
    if (mode === 'payment') {
      await admin.from('user_access').upsert({
        user_id: uid, access_type: 'onetime', access_active: true,
        stripe_customer_id: obj.customer,
      }, { onConflict: 'user_id' })
    } else if (mode === 'subscription') {
      await admin.from('user_access').upsert({
        user_id: uid, access_type: 'subscription', access_active: true,
        stripe_customer_id: obj.customer,
        stripe_subscription_id: obj.subscription,
        stripe_subscription_status: 'active',
      }, { onConflict: 'user_id' })
    }
  }

  if (event.type === 'customer.subscription.updated' || event.type === 'customer.subscription.deleted') {
    const active = obj.status === 'active' || obj.status === 'trialing'
    await admin.from('user_access')
      .update({ stripe_subscription_status: obj.status, access_active: active })
      .eq('stripe_subscription_id', obj.id)
  }

  return NextResponse.json({ received: true })
}
