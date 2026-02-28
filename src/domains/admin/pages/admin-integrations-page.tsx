import { useTranslation } from 'react-i18next'
import { Plug, MessageCircle, Building2, CreditCard, FileBarChart, Settings } from 'lucide-react'
import { Button, Badge, Card, CardContent } from '@/shared/components/ui'

interface Integration {
  id: string
  name: string
  nameAr: string
  description: string
  descriptionAr: string
  icon: typeof Plug
  category: string
  status: 'connected' | 'available' | 'coming_soon'
  companiesUsing?: number
}

const integrations: Integration[] = [
  { id: '1', name: 'WhatsApp Business', nameAr: 'واتساب للأعمال', description: 'Send automated notifications and chat with customers', descriptionAr: 'إرسال إشعارات تلقائية والتحدث مع العملاء', icon: MessageCircle, category: 'Communication', status: 'connected', companiesUsing: 12 },
  { id: '2', name: 'ZATCA E-Invoicing', nameAr: 'فوترة هيئة الزكاة', description: 'Comply with Saudi e-invoicing regulations (FATOORAH)', descriptionAr: 'التوافق مع نظام الفوترة الإلكترونية (فاتورة)', icon: FileBarChart, category: 'Compliance', status: 'connected', companiesUsing: 18 },
  { id: '3', name: 'Bank Transfer (SADAD)', nameAr: 'التحويل البنكي (سداد)', description: 'Accept payments via SADAD billing system', descriptionAr: 'قبول المدفوعات عبر نظام سداد', icon: CreditCard, category: 'Payments', status: 'available' },
  { id: '4', name: 'Elm (Absher)', nameAr: 'علم (أبشر)', description: 'Vehicle registration and ownership transfer', descriptionAr: 'تسجيل المركبات ونقل الملكية', icon: Building2, category: 'Government', status: 'available' },
  { id: '5', name: 'SAP Business One', nameAr: 'ساب بزنس ون', description: 'Sync inventory and financials with SAP', descriptionAr: 'مزامنة المخزون والماليات مع ساب', icon: Plug, category: 'ERP', status: 'coming_soon' },
  { id: '6', name: 'Moyasar Payments', nameAr: 'ميسر للدفع', description: 'Accept online card payments (mada, Visa, MC)', descriptionAr: 'قبول الدفع الإلكتروني (مدى، فيزا، ماستركارد)', icon: CreditCard, category: 'Payments', status: 'coming_soon' },
]

export function AdminIntegrationsPage() {
  const { i18n } = useTranslation()
  const isAr = i18n.language === 'ar'

  const statusLabel = (status: Integration['status']) => {
    if (status === 'connected') return { text: isAr ? 'متصل' : 'Connected', variant: 'success' as const }
    if (status === 'available') return { text: isAr ? 'متاح' : 'Available', variant: 'default' as const }
    return { text: isAr ? 'قريباً' : 'Coming Soon', variant: 'secondary' as const }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{isAr ? 'التكاملات العامة' : 'Global Integrations'}</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {integrations.map((integration) => {
          const Icon = integration.icon
          const status = statusLabel(integration.status)
          return (
            <Card key={integration.id} className={integration.status === 'coming_soon' ? 'opacity-70' : ''}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                    <Icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <Badge variant={status.variant}>{status.text}</Badge>
                </div>
                <h3 className="font-semibold mb-1">{isAr ? integration.nameAr : integration.name}</h3>
                <p className="text-sm text-gray-500 mb-4">{isAr ? integration.descriptionAr : integration.description}</p>
                {integration.companiesUsing && (
                  <p className="text-xs text-gray-400 mb-4">{integration.companiesUsing} {isAr ? 'شركة تستخدم' : 'companies using'}</p>
                )}
                <Button
                  variant={integration.status === 'connected' ? 'outline' : 'default'}
                  size="sm"
                  className="w-full"
                  disabled={integration.status === 'coming_soon'}
                >
                  {integration.status === 'connected' ? <><Settings className="h-4 w-4 me-2" />{isAr ? 'إعدادات' : 'Settings'}</> : isAr ? 'تفعيل' : 'Enable'}
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
