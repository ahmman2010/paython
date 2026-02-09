import { USER_ROLES, PERMISSIONS } from '@/config/constants'

export type UserRole = (typeof USER_ROLES)[number]
export type Permission = (typeof PERMISSIONS)[number]

export interface AuthUser {
  id: string
  authId: string
  email: string
  fullName: string
  fullNameAr: string | null
  phone: string | null
  role: UserRole
  tenantId: string | null
  avatarUrl: string | null
  isActive: boolean
}

export interface AuthState {
  user: AuthUser | null
  tenantId: string | null
  isLoading: boolean
  isAuthenticated: boolean
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface SignUpData {
  email: string
  password: string
  fullName: string
  fullNameAr?: string
  phone?: string
}
