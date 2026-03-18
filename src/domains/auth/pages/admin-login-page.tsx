import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { Button, Input, Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui'
import { LanguageSwitcher } from '@/shared/components/layout'
import { loginSchema, type LoginFormData } from '../types/schemas'
import { signIn, getCurrentUser } from '../services/auth-service'
import { useAuthStore } from '@/shared/hooks/useAuth'
import { Shield } from 'lucide-react'

export function AdminLoginPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const { setUser } = useAuthStore()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormData) => {
    try {
      setError('')
      await signIn(data)
      const user = await getCurrentUser()
      if (user?.role === 'platform_admin') {
        setUser(user)
        navigate('/admin/dashboard')
      } else {
        setError('Unauthorized: Admin access required')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-900 px-4">
      <div className="w-full max-w-md">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-2">
            <Shield className="h-8 w-8 text-blue-400" />
            <div>
              <h1 className="text-2xl font-bold text-white">{t('app.name')}</h1>
              <p className="text-xs text-gray-400">{t('admin.title')}</p>
            </div>
          </div>
          <LanguageSwitcher />
        </div>
        <Card>
          <CardHeader>
            <CardTitle>{t('auth.loginTitle')}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {error && (
                <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700">
                  {error}
                </div>
              )}
              <Input
                label={t('auth.email')}
                type="email"
                placeholder="admin@intilaaqah.app"
                error={errors.email?.message ? t(errors.email.message) : undefined}
                {...register('email')}
              />
              <Input
                label={t('auth.password')}
                type="password"
                placeholder="••••••••"
                error={errors.password?.message ? t(errors.password.message) : undefined}
                {...register('password')}
              />
              <Button type="submit" className="w-full" loading={isSubmitting}>
                {t('auth.login')}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
