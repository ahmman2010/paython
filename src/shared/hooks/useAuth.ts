import { create } from 'zustand'
import type { AuthUser } from '@/shared/types/auth'

interface AuthStore {
  user: AuthUser | null
  tenantId: string | null
  isLoading: boolean
  isAuthenticated: boolean
  setUser: (user: AuthUser | null) => void
  setTenantId: (id: string | null) => void
  setLoading: (loading: boolean) => void
  logout: () => void
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  tenantId: null,
  isLoading: true,
  isAuthenticated: false,
  setUser: (user) => set({ user, isAuthenticated: !!user, isLoading: false }),
  setTenantId: (tenantId) => set({ tenantId }),
  setLoading: (isLoading) => set({ isLoading }),
  logout: () => set({ user: null, tenantId: null, isAuthenticated: false }),
}))

export function useAuth() {
  const store = useAuthStore()
  return store
}
