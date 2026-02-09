import { Menu, Bell, LogOut, User } from 'lucide-react'
import { LanguageSwitcher } from './language-switcher'
import { useAuth } from '@/shared/hooks/useAuth'
import { useTranslation } from 'react-i18next'

interface TopBarProps {
  onMenuClick: () => void
}

export function TopBar({ onMenuClick }: TopBarProps) {
  const { user, logout } = useAuth()
  const { t } = useTranslation()

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="rounded-lg p-2 hover:bg-gray-100 md:hidden"
          aria-label="Toggle menu"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>
      <div className="flex items-center gap-2">
        <LanguageSwitcher />
        <button className="relative rounded-lg p-2 hover:bg-gray-100" aria-label="Notifications">
          <Bell className="h-5 w-5 text-gray-600" />
        </button>
        <div className="flex items-center gap-2 rounded-lg px-3 py-1.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
            <User className="h-4 w-4 text-blue-600" />
          </div>
          <span className="hidden text-sm font-medium text-gray-700 sm:block">
            {user?.fullName || 'User'}
          </span>
        </div>
        <button
          onClick={logout}
          className="rounded-lg p-2 hover:bg-gray-100 text-gray-600"
          title={t('auth.logout')}
        >
          <LogOut className="h-5 w-5" />
        </button>
      </div>
    </header>
  )
}
