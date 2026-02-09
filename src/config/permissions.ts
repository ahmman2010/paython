import type { UserRole, Permission } from '@/shared/types/auth'

export const ROLE_PERMISSIONS: Record<UserRole, readonly Permission[]> = {
  platform_admin: [
    'inventory.view', 'inventory.edit', 'pricing.view', 'pricing.edit',
    'deals.view', 'deals.manage', 'invoices.view', 'invoices.manage',
    'reports.view', 'settings.manage', 'integrations.manage',
    'customers.view', 'customers.edit', 'appointments.view', 'appointments.manage',
    'leads.view', 'leads.manage', 'quotes.view', 'quotes.manage',
    'contracts.view', 'contracts.manage', 'payments.view', 'payments.manage',
    'delivery.view', 'delivery.manage', 'team.view', 'team.manage', 'audit.view',
  ],
  company_admin: [
    'inventory.view', 'inventory.edit', 'pricing.view', 'pricing.edit',
    'deals.view', 'deals.manage', 'invoices.view', 'invoices.manage',
    'reports.view', 'settings.manage', 'integrations.manage',
    'customers.view', 'customers.edit', 'appointments.view', 'appointments.manage',
    'leads.view', 'leads.manage', 'quotes.view', 'quotes.manage',
    'contracts.view', 'contracts.manage', 'payments.view', 'payments.manage',
    'delivery.view', 'delivery.manage', 'team.view', 'team.manage', 'audit.view',
  ],
  branch_manager: [
    'inventory.view', 'inventory.edit', 'pricing.view',
    'deals.view', 'deals.manage', 'invoices.view',
    'reports.view', 'customers.view', 'customers.edit',
    'appointments.view', 'appointments.manage',
    'leads.view', 'leads.manage', 'quotes.view', 'quotes.manage',
    'contracts.view', 'payments.view', 'delivery.view', 'delivery.manage',
    'team.view', 'team.manage',
  ],
  sales_manager: [
    'inventory.view', 'pricing.view', 'deals.view', 'deals.manage',
    'reports.view', 'customers.view', 'customers.edit',
    'appointments.view', 'appointments.manage',
    'leads.view', 'leads.manage', 'quotes.view', 'quotes.manage',
    'contracts.view', 'team.view', 'team.manage',
  ],
  sales_rep: [
    'inventory.view', 'pricing.view', 'deals.view', 'deals.manage',
    'customers.view', 'customers.edit', 'appointments.view', 'appointments.manage',
    'leads.view', 'leads.manage', 'quotes.view', 'quotes.manage',
  ],
  inventory_manager: [
    'inventory.view', 'inventory.edit', 'pricing.view', 'pricing.edit',
  ],
  finance: [
    'invoices.view', 'invoices.manage', 'payments.view', 'payments.manage',
    'reports.view', 'deals.view', 'contracts.view', 'contracts.manage',
  ],
  customer_service: [
    'customers.view', 'customers.edit', 'appointments.view', 'appointments.manage',
    'leads.view', 'leads.manage', 'inventory.view',
  ],
  tele_sales: [
    'leads.view', 'leads.manage', 'customers.view', 'customers.edit',
    'appointments.view', 'appointments.manage', 'inventory.view',
  ],
  operations: [
    'delivery.view', 'delivery.manage', 'inventory.view',
    'deals.view', 'contracts.view',
  ],
  analyst: [
    'inventory.view', 'deals.view', 'reports.view',
    'customers.view', 'invoices.view', 'leads.view', 'audit.view',
  ],
}

export function hasPermission(userRole: UserRole, permission: Permission): boolean {
  return ROLE_PERMISSIONS[userRole]?.includes(permission) ?? false
}

export function hasAnyPermission(userRole: UserRole, permissions: Permission[]): boolean {
  return permissions.some((p) => hasPermission(userRole, p))
}
