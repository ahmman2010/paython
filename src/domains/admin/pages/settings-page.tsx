import { useTranslation } from 'react-i18next'
import {
  Building2, MapPin, Receipt, FileText, Plug, Key, Shield,
} from 'lucide-react'
import { Card, CardContent } from '@/shared/components/ui'
import type { LucideIcon } from 'lucide-react'

interface SettingsSection {
  icon: LucideIcon
  titleKey: string
  description: string
}

const sections: SettingsSection[] = [
  { icon: Building2, titleKey: 'settings.companyProfile', description: 'Manage company name, logo, brand colors, and contact info' },
  { icon: MapPin, titleKey: 'settings.branches', description: 'Add/edit branches, working hours, and appointment capacity' },
  { icon: Receipt, titleKey: 'settings.taxes', description: 'Configure VAT rates and tax settings' },
  { icon: FileText, titleKey: 'settings.documentTemplates', description: 'Customize quote, contract, and invoice templates' },
  { icon: Plug, titleKey: 'settings.integrations', description: 'Connect WhatsApp, accounting, and bank systems' },
  { icon: Key, titleKey: 'settings.webhooks', description: 'Manage API keys and webhook subscriptions' },
  { icon: Shield, titleKey: 'settings.dataRetention', description: 'Data retention policies and customer consent settings' },
]

export function SettingsPage() {
  const { t } = useTranslation()

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{t('settings.title')}</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sections.map((section, i) => (
          <Card key={i} className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="flex items-start gap-4 pt-6">
              <div className="rounded-lg bg-blue-50 p-3 flex-shrink-0">
                <section.icon className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold">{t(section.titleKey)}</h3>
                <p className="text-sm text-gray-500 mt-1">{section.description}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
