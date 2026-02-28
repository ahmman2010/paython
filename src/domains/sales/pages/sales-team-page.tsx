import { useTranslation } from 'react-i18next'
import { Users, Target, TrendingUp, Phone } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, Badge, StatCard } from '@/shared/components/ui'
import { formatCurrency } from '@/lib/utils'

interface SalesRep { id: string; name: string; nameAr: string; role: string; branch: string; stats: { deals: number; won: number; revenue: number; calls: number; conversionRate: number } }

const demoTeam: SalesRep[] = [
  { id: '1', name: 'Ahmed Al-Salem', nameAr: 'أحمد السالم', role: 'Sales Manager', branch: 'Riyadh', stats: { deals: 25, won: 18, revenue: 2850000, calls: 120, conversionRate: 72 } },
  { id: '2', name: 'Fahad Al-Dosari', nameAr: 'فهد الدوسري', role: 'Sales Rep', branch: 'Riyadh', stats: { deals: 18, won: 12, revenue: 1560000, calls: 85, conversionRate: 67 } },
  { id: '3', name: 'Nora Al-Harbi', nameAr: 'نورة الحربي', role: 'Sales Rep', branch: 'Jeddah', stats: { deals: 15, won: 10, revenue: 1280000, calls: 95, conversionRate: 67 } },
  { id: '4', name: 'Khalid Al-Mutairi', nameAr: 'خالد المطيري', role: 'Sales Rep', branch: 'Dammam', stats: { deals: 12, won: 7, revenue: 890000, calls: 70, conversionRate: 58 } },
]

export function SalesTeamPage() {
  const { t, i18n } = useTranslation()
  const isAr = i18n.language === 'ar'
  const totalRevenue = demoTeam.reduce((s, r) => s + r.stats.revenue, 0)
  const totalDeals = demoTeam.reduce((s, r) => s + r.stats.won, 0)

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{t('nav.salesTeam')}</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard title={isAr ? 'إجمالي الفريق' : 'Team Size'} value={demoTeam.length} icon={Users} />
        <StatCard title={isAr ? 'الصفقات المكتملة' : 'Deals Won'} value={totalDeals} icon={Target} />
        <StatCard title={t('reports.revenue')} value={formatCurrency(totalRevenue)} icon={TrendingUp} />
        <StatCard title={isAr ? 'المكالمات' : 'Total Calls'} value={demoTeam.reduce((s, r) => s + r.stats.calls, 0)} icon={Phone} />
      </div>
      <Card>
        <CardHeader><CardTitle>{t('reports.leaderboard')}</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-3">
            {demoTeam.sort((a, b) => b.stats.revenue - a.stats.revenue).map((rep, idx) => (
              <div key={rep.id} className="flex items-center gap-4 p-4 rounded-xl bg-gray-50">
                <div className={`flex h-10 w-10 items-center justify-center rounded-full text-white font-bold ${idx === 0 ? 'bg-yellow-500' : idx === 1 ? 'bg-gray-400' : idx === 2 ? 'bg-amber-600' : 'bg-gray-300'}`}>{idx + 1}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2"><p className="font-semibold truncate">{isAr ? rep.nameAr : rep.name}</p><Badge variant="secondary">{rep.role}</Badge></div>
                  <p className="text-xs text-gray-500">{rep.branch}</p>
                </div>
                <div className="text-end">
                  <p className="font-bold text-blue-600">{formatCurrency(rep.stats.revenue)}</p>
                  <p className="text-xs text-gray-500">{rep.stats.won} {isAr ? 'صفقة' : 'deals'} - {rep.stats.conversionRate}%</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
