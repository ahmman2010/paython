import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard, Car, Users, UserPlus, Handshake, FileText,
  FileCheck, Receipt, CreditCard, Calendar, Truck, ClipboardList,
  UsersRound, Phone, BarChart3, Settings, Shield, X,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

interface NavItem {
  icon: LucideIcon
  labelKey: string
  href: string
  permission?: string
}

const navItems: NavItem[] = [
  { icon: LayoutDashboard, labelKey: 'nav.dashboard', href: 'dashboard' },
  { icon: Car, labelKey: 'nav.inventory', href: 'inventory' },
  { icon: UserPlus, labelKey: 'nav.leads', href: 'leads' },
  { icon: Users, labelKey: 'nav.customers', href: 'customers' },
  { icon: Calendar, labelKey: 'nav.appointments', href: 'appointments' },
  { icon: Handshake, labelKey: 'nav.deals', href: 'deals' },
  { icon: FileText, labelKey: 'nav.quotes', href: 'quotes' },
  { icon: FileCheck, labelKey: 'nav.contracts', href: 'contracts' },
  { icon: Receipt, labelKey: 'nav.invoices', href: 'invoices' },
  { icon: CreditCard, labelKey: 'nav.payments', href: 'payments' },
  { icon: Truck, labelKey: 'nav.delivery', href: 'delivery' },
  { icon: ClipboardList, labelKey: 'nav.registration', href: 'registration' },
  { icon: UsersRound, labelKey: 'nav.salesTeam', href: 'sales-team' },
  { icon: Phone, labelKey: 'nav.teleSales', href: 'tele-sales' },
  { icon: BarChart3, labelKey: 'nav.reports', href: 'reports' },
  { icon: Settings, labelKey: 'nav.settings', href: 'settings' },
  { icon: Shield, labelKey: 'nav.auditLogs', href: 'audit-logs' },
]

interface SidebarProps {
  tenantSlug: string
  isOpen: boolean
  onClose: () => void
}

export function Sidebar({ tenantSlug, isOpen, onClose }: SidebarProps) {
  const { t } = useTranslation()
  const location = useLocation()
  const basePath = `/app/${tenantSlug}`

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 md:hidden" onClick={onClose} />
      )}
      <aside
        className={cn(
          'fixed top-0 start-0 z-50 h-full w-64 bg-white border-e border-gray-200 transition-transform duration-200 md:translate-x-0 md:static md:z-auto',
          isOpen ? 'translate-x-0' : '-translate-x-full rtl:translate-x-full rtl:md:translate-x-0'
        )}
      >
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
          <Link to={basePath} className="text-xl font-bold text-blue-600">
            {t('app.name')}
          </Link>
          <button onClick={onClose} className="md:hidden p-1 rounded hover:bg-gray-100">
            <X className="h-5 w-5" />
          </button>
        </div>
        {/* Nav items */}
        <nav className="p-2 space-y-0.5 overflow-y-auto h-[calc(100vh-4rem)]">
          {navItems.map((item) => {
            const fullPath = `${basePath}/${item.href}`
            const isActive = location.pathname.startsWith(fullPath)
            return (
              <Link
                key={item.href}
                to={fullPath}
                onClick={onClose}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                )}
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                <span>{t(item.labelKey)}</span>
              </Link>
            )
          })}
        </nav>
      </aside>
    </>
  )
}
