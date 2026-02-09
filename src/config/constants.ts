export const APP_NAME = 'Intilaaqah'
export const APP_NAME_AR = 'انطلاقة'
export const APP_DOMAIN = 'intilaaqah.app'

export const SUPPORTED_LANGUAGES = ['en', 'ar'] as const
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number]

export const DEFAULT_LANGUAGE: SupportedLanguage = 'ar'

export const CURRENCY = 'SAR'
export const COUNTRY_CODE = '+966'

export const VAT_RATE = 0.15

export const CAR_CONDITIONS = ['new', 'used'] as const
export const CAR_BODY_TYPES = [
  'sedan', 'suv', 'pickup', 'coupe', 'hatchback',
  'van', 'convertible', 'wagon', 'crossover',
] as const
export const FUEL_TYPES = ['petrol', 'diesel', 'electric', 'hybrid', 'plugin_hybrid'] as const
export const TRANSMISSION_TYPES = ['automatic', 'manual', 'cvt'] as const
export const CAR_AVAILABILITY = ['in_stock', 'reserved', 'sold', 'in_transit'] as const

export const DEAL_STAGES = [
  'new_lead', 'qualified', 'car_selected', 'quote_sent',
  'documents_collected', 'financing_approval', 'contract_signed',
  'payment_completed', 'registration', 'delivery_scheduled', 'delivered', 'lost',
] as const

export const SALE_TYPES = ['cash', 'installment', 'lease_to_own'] as const

export const LEAD_SOURCES = [
  'website', 'walk_in', 'whatsapp', 'phone', 'campaign', 'referral',
] as const

export const APPOINTMENT_TYPES = [
  'inspection', 'test_drive', 'showroom_visit', 'maintenance', 'financing_consultation',
] as const

export const USER_ROLES = [
  'platform_admin', 'company_admin', 'branch_manager', 'sales_manager',
  'sales_rep', 'inventory_manager', 'finance', 'customer_service',
  'tele_sales', 'operations', 'analyst',
] as const

export const PERMISSIONS = [
  'inventory.view', 'inventory.edit', 'pricing.view', 'pricing.edit',
  'deals.view', 'deals.manage', 'invoices.view', 'invoices.manage',
  'reports.view', 'settings.manage', 'integrations.manage',
  'customers.view', 'customers.edit', 'appointments.view', 'appointments.manage',
  'leads.view', 'leads.manage', 'quotes.view', 'quotes.manage',
  'contracts.view', 'contracts.manage', 'payments.view', 'payments.manage',
  'delivery.view', 'delivery.manage', 'team.view', 'team.manage',
  'audit.view',
] as const

export const PAGINATION_DEFAULT = 20
export const PAGINATION_OPTIONS = [10, 20, 50, 100] as const
