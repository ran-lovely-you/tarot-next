import { redirect } from 'next/navigation'
import { createClient, createAdminClient } from '@/lib/supabase-server'
import TarotApp from './TarotApp'

export default async function AppPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const admin = createAdminClient()
  const { data: access } = await admin.from('user_access')
    .select('*').eq('user_id', user!.id).single()

  if (!access?.access_active) redirect('/pricing')

  return (
    <TarotApp
      userEmail={user!.email ?? ''}
      accessType={access?.access_type ?? 'onetime'}
      checkoutSuccess={false}
    />
  )
}
