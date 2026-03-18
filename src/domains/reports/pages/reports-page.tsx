import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui'

export function ReportsPage() {
  const { t } = useTranslation()

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{t('reports.title')}</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { title: t('reports.pipelineFunnel'), desc: 'Visualize deal stages distribution' },
          { title: t('reports.branchPerformance'), desc: 'Compare branch metrics' },
          { title: t('reports.stockAging'), desc: 'Track inventory age and turnover' },
          { title: t('reports.leaderboard'), desc: 'Sales rep performance ranking' },
          { title: t('reports.conversionRate'), desc: 'Lead-to-deal conversion analysis' },
          { title: t('reports.topModels'), desc: 'Most sold car models' },
        ].map((report, i) => (
          <Card key={i} className="cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="text-base">{report.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">{report.desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
