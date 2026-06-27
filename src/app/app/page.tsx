import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase-server'
import { getUserAccess, hasAccess } from '@/lib/access'
import TarotApp from './TarotApp'

export default async function AppPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const access = await getUserAccess(user.id)
  if (!hasAccess(access)) redirect('/pricing')

  return (
    <TarotApp
      userEmail={user.email ?? ''}
      accessType={access?.access_type ?? 'onetime'}
      checkoutSuccess={false}
    />
  )
}
