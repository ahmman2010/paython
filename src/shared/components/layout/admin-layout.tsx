import { useState } from 'react'
import { Outlet, Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import { TopBar } from './top-bar'
import {
  LayoutDashboard, Building2, CreditCard, FileText,
  Plug, Shield, X,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

interface AdminNavItem {
  icon: LucideIcon
  labelKey: string
  href: string
}

const adminNavItems: AdminNavItem[] = [
  { icon: LayoutDashboard, labelKey: 'nav.dashboard', href: '/admin/dashboard' },
  { icon: Building2, labelKey: 'admin.companies', href: '/admin/companies' },
  { icon: CreditCard, labelKey: 'admin.plans', href: '/admin/plans' },
  { icon: FileText, labelKey: 'admin.templates', href: '/admin/templates' },
  { icon: Plug, labelKey: 'admin.integrations', href: '/admin/integrations' },
  { icon: Shield, labelKey: 'nav.auditLogs', href: '/admin/audit-logs' },
]

export function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { t } = useTranslation()
  const location = useLocation()

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}
      <aside
        className={cn(
          'fixed top-0 start-0 z-50 h-full w-64 bg-gray-900 transition-transform duration-200 md:translate-x-0 md:static md:z-auto',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full rtl:translate-x-full rtl:md:translate-x-0'
        )}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-800">
          <Link to="/admin/dashboard" className="text-xl font-bold text-white">
            {t('app.name')} <span className="text-xs text-gray-400">Admin</span>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="md:hidden p-1 rounded hover:bg-gray-800 text-white">
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="p-2 space-y-0.5">
          {adminNavItems.map((item) => {
            const isActive = location.pathname.startsWith(item.href)
            return (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-gray-800 text-white'
                    : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'
                )}
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                <span>{t(item.labelKey)}</span>
              </Link>
            )
          })}
        </nav>
      </aside>
      <div className="flex flex-1 flex-col overflow-hidden">
        <TopBar onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
