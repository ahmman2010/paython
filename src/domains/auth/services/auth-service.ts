import { supabase } from '@/lib/supabase'
import type { AuthUser, LoginCredentials, SignUpData } from '@/shared/types/auth'

export async function signIn({ email, password }: LoginCredentials) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw new Error(error.message)
  return data
}

export async function signUp({ email, password, fullName, fullNameAr, phone }: SignUpData) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName, full_name_ar: fullNameAr, phone },
    },
  })
  if (error) throw new Error(error.message)
  return data
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) throw new Error(error.message)
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  const { data: { user: authUser } } = await supabase.auth.getUser()
  if (!authUser) return null

  const { data: profile } = await supabase
    .from('users')
    .select('*')
    .eq('auth_id', authUser.id)
    .single()

  if (!profile) return null

  return {
    id: profile.id,
    authId: profile.auth_id,
    email: profile.email,
    fullName: profile.full_name,
    fullNameAr: profile.full_name_ar,
    phone: profile.phone,
    role: profile.role as AuthUser['role'],
    tenantId: profile.tenant_id,
    avatarUrl: profile.avatar_url,
    isActive: profile.is_active,
  }
}

export async function resetPassword(email: string) {
  const { error } = await supabase.auth.resetPasswordForEmail(email)
  if (error) throw new Error(error.message)
}
