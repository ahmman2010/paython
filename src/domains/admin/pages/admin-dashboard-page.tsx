import { useTranslation } from 'react-i18next'
import { Building2, Users, CreditCard, Activity } from 'lucide-react'
import { StatCard, Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui'

export function AdminDashboardPage() {
  const { t } = useTranslation()

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{t('admin.title')}</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard title={t('admin.companies')} value="12" icon={Building2} trend={{ value: 8, label: 'this month' }} />
        <StatCard title="Active Users" value="156" icon={Users} trend={{ value: 12, label: 'this month' }} />
        <StatCard title="MRR" value="SAR 45,000" icon={CreditCard} trend={{ value: 15, label: 'vs last month' }} />
        <StatCard title="API Calls" value="23.4K" icon={Activity} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Companies</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { name: 'Al-Futtaim Motors', plan: 'Enterprise', status: 'Active' },
                { name: 'Gulf Auto Trading', plan: 'Professional', status: 'Active' },
                { name: 'Saudi Star Motors', plan: 'Starter', status: 'Trial' },
              ].map((company, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                  <div>
                    <p className="font-medium">{company.name}</p>
                    <p className="text-xs text-gray-500">{company.plan}</p>
                  </div>
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                    company.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {company.status}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Health</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { label: 'Database', status: 'Healthy', color: 'green' },
                { label: 'Storage', status: 'Healthy', color: 'green' },
                { label: 'Auth Service', status: 'Healthy', color: 'green' },
                { label: 'Webhooks', status: 'Active', color: 'green' },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                  <span className="text-sm">{item.label}</span>
                  <div className="flex items-center gap-2">
                    <div className={`h-2 w-2 rounded-full bg-${item.color}-500`} />
                    <span className="text-xs text-gray-600">{item.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
