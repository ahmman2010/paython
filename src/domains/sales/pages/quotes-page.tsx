import { useTranslation } from 'react-i18next'
import { FileText } from 'lucide-react'
import { Badge, EmptyState, DataTable } from '@/shared/components/ui'
import type { Column } from '@/shared/components/ui'
import { useQuotes } from '../hooks/use-quotes'
import { useAuthStore } from '@/shared/hooks/useAuth'
import { formatCurrency } from '@/lib/utils'
import type { Quote } from '../types/quote-types'

const statusColors: Record<string, 'default' | 'success' | 'warning' | 'danger' | 'secondary'> = {
  draft: 'secondary',
  sent: 'default',
  accepted: 'success',
  expired: 'danger',
}

export function QuotesPage() {
  const { t } = useTranslation()
  const { tenantId } = useAuthStore()
  const { data: quotes, isLoading } = useQuotes(tenantId || '')

  const columns: Column<Quote>[] = [
    { key: 'quoteNumber', header: 'Quote #', headerAr: 'رقم العرض', render: (q) => q.quoteNumber },
    {
      key: 'status',
      header: 'Status',
      headerAr: 'الحالة',
      render: (q) => <Badge variant={statusColors[q.status] || 'secondary'}>{t(`quotes.${q.status}`)}</Badge>,
    },
    { key: 'subtotal', header: 'Subtotal', headerAr: 'المجموع الفرعي', render: (q) => formatCurrency(q.subtotal) },
    { key: 'vatAmount', header: 'VAT', headerAr: 'الضريبة', render: (q) => formatCurrency(q.vatAmount) },
    { key: 'total', header: 'Total', headerAr: 'الإجمالي', render: (q) => <span className="font-semibold">{formatCurrency(q.total)}</span> },
    { key: 'validUntil', header: 'Valid Until', headerAr: 'صالح حتى', render: (q) => q.validUntil || '-' },
  ]

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">{t('quotes.title')}</h1>
      {(quotes || []).length === 0 && !isLoading ? (
        <EmptyState icon={FileText} title={t('common.noData')} />
      ) : (
        <div className="rounded-xl border border-gray-200 bg-white">
          <DataTable columns={columns} data={quotes || []} loading={isLoading} keyExtractor={(q) => q.id} />
        </div>
      )}
    </div>
  )
}
