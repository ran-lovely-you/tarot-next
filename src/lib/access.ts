import { createAdminClient } from './supabase-server'

export async function getUserAccess(userId: string) {
  const supabase = createAdminClient()
  const { data } = await supabase
    .from('user_access')
    .select('*')
    .eq('user_id', userId)
    .single()
  return data
}

export function hasAccess(access: any): boolean {
  if (!access) return false
  if (access.access_type === 'onetime') return true
  if (access.access_type === 'subscription' && access.access_active) return true
  return false
}
