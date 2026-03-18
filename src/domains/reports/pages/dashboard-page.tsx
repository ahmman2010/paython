import { useTranslation } from 'react-i18next'
import { useAuthStore } from '@/shared/hooks/useAuth'
import {
  Users, UserPlus, Calendar, Handshake, FileText, Receipt,
  Car, TrendingUp,
} from 'lucide-react'
import { StatCard, Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui'
import { useCars } from '@/domains/inventory/hooks/use-cars'
import { useLeads } from '@/domains/crm/hooks/use-leads'
import { useDeals } from '@/domains/sales/hooks/use-deals'
import { useAppointments } from '@/domains/appointments/hooks/use-appointments'
import { useQuotes } from '@/domains/sales/hooks/use-quotes'
import { formatCurrency } from '@/lib/utils'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell,
} from 'recharts'

const COLORS = ['#2563EB', '#059669', '#D97706', '#DC2626', '#7C3AED', '#0891B2']

export function DashboardPage() {
  const { t } = useTranslation()
  const { tenantId } = useAuthStore()

  const { data: cars } = useCars(tenantId || '')
  const { data: leads } = useLeads(tenantId || '')
  const { data: deals } = useDeals(tenantId || '')
  const { data: appointments } = useAppointments(tenantId || '')
  const { data: quotes } = useQuotes(tenantId || '')

  const totalRevenue = (deals || [])
    .filter((d) => d.stage === 'delivered')
    .reduce((sum, d) => sum + (d.totalAmount || 0), 0)

  const stageDistribution = [
    { name: 'New', value: (deals || []).filter((d) => d.stage === 'new_lead').length },
    { name: 'Qualified', value: (deals || []).filter((d) => d.stage === 'qualified').length },
    { name: 'Quote Sent', value: (deals || []).filter((d) => d.stage === 'quote_sent').length },
    { name: 'Contract', value: (deals || []).filter((d) => d.stage === 'contract_signed').length },
    { name: 'Delivered', value: (deals || []).filter((d) => d.stage === 'delivered').length },
    { name: 'Lost', value: (deals || []).filter((d) => d.stage === 'lost').length },
  ].filter((s) => s.value > 0)

  const monthlyData = [
    { month: 'Jan', leads: 12, deals: 4 },
    { month: 'Feb', leads: 19, deals: 7 },
    { month: 'Mar', leads: 15, deals: 5 },
    { month: 'Apr', leads: 22, deals: 9 },
    { month: 'May', leads: 28, deals: 11 },
    { month: 'Jun', leads: 24, deals: 10 },
  ]

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{t('nav.dashboard')}</h1>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard title={t('reports.leadsToday')} value={(leads || []).length} icon={UserPlus} />
        <StatCard title={t('reports.appointmentsBooked')} value={(appointments || []).length} icon={Calendar} />
        <StatCard title={t('reports.quotesSent')} value={(quotes || []).length} icon={FileText} />
        <StatCard title={t('reports.revenue')} value={formatCurrency(totalRevenue)} icon={TrendingUp} />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard title={t('nav.deals')} value={(deals || []).length} icon={Handshake} />
        <StatCard title={t('nav.cars')} value={(cars || []).length} icon={Car} />
        <StatCard title={t('nav.customers')} value="-" icon={Users} />
        <StatCard
          title={t('reports.conversionRate')}
          value={
            (leads || []).length > 0
              ? `${Math.round(((deals || []).filter((d) => d.stage === 'delivered').length / (leads || []).length) * 100)}%`
              : '0%'
          }
          icon={Receipt}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{t('reports.pipelineFunnel')}</CardTitle>
          </CardHeader>
          <CardContent>
            {stageDistribution.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={stageDistribution} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                    {stageDistribution.map((_, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-gray-400">
                {t('common.noData')}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Leads & Deals Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="leads" fill="#2563EB" name="Leads" radius={[4, 4, 0, 0]} />
                <Bar dataKey="deals" fill="#059669" name="Deals" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
