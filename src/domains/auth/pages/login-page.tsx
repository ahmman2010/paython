import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslation } from 'react-i18next'
import { useNavigate, Link } from 'react-router-dom'
import { Button, Input, Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui'
import { LanguageSwitcher } from '@/shared/components/layout'
import { loginSchema, type LoginFormData } from '../types/schemas'
import { signIn } from '../services/auth-service'
import { useAuthStore } from '@/shared/hooks/useAuth'
import { getCurrentUser } from '../services/auth-service'

export function LoginPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const { setUser, setTenantId } = useAuthStore()

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
      if (user) {
        setUser(user)
        setTenantId(user.tenantId)
        if (user.role === 'platform_admin') {
          navigate('/admin/dashboard')
        } else if (user.tenantId) {
          navigate(`/app/${user.tenantId}/dashboard`)
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-blue-600">{t('app.name')}</h1>
            <p className="text-sm text-gray-500 mt-1">{t('app.tagline')}</p>
          </div>
          <LanguageSwitcher />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t('auth.loginTitle')}</CardTitle>
            <p className="text-sm text-gray-500">{t('auth.loginSubtitle')}</p>
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
                placeholder="email@example.com"
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
              <div className="flex items-center justify-end">
                <Link to="/forgot-password" className="text-sm text-blue-600 hover:underline">
                  {t('auth.forgotPassword')}
                </Link>
              </div>
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
