import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Handshake, ArrowRight, ArrowLeft } from 'lucide-react'
import { Button, Badge, EmptyState, Card, SearchInput } from '@/shared/components/ui'
import { useDeals, useUpdateDealStage } from '../hooks/use-deals'
import { useAuthStore } from '@/shared/hooks/useAuth'
import { DEAL_STAGES } from '@/config/constants'
import { formatCurrency } from '@/lib/utils'
import { useLanguage } from '@/shared/hooks/useLanguage'
import type { Deal } from '../types/deal-types'

const stageColors: Record<string, 'default' | 'success' | 'warning' | 'danger' | 'secondary'> = {
  new_lead: 'default',
  qualified: 'default',
  car_selected: 'warning',
  quote_sent: 'warning',
  documents_collected: 'warning',
  financing_approval: 'warning',
  contract_signed: 'success',
  payment_completed: 'success',
  registration: 'success',
  delivery_scheduled: 'success',
  delivered: 'success',
  lost: 'danger',
}

export function DealsPage() {
  const { t } = useTranslation()
  const { tenantId } = useAuthStore()
  const { isRtl } = useLanguage()
  const [search, setSearch] = useState('')
  const [viewMode, setViewMode] = useState<'pipeline' | 'list'>('pipeline')

  const { data: deals, isLoading } = useDeals(tenantId || '')
  const updateStage = useUpdateDealStage(tenantId || '')

  const dealsByStage = DEAL_STAGES.reduce((acc, stage) => {
    acc[stage] = (deals || []).filter((d) => d.stage === stage)
    return acc
  }, {} as Record<string, Deal[]>)

  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight

  const handleAdvanceStage = (deal: Deal) => {
    const currentIndex = DEAL_STAGES.indexOf(deal.stage as typeof DEAL_STAGES[number])
    if (currentIndex < DEAL_STAGES.length - 2) {
      updateStage.mutate({ dealId: deal.id, stage: DEAL_STAGES[currentIndex + 1] })
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-24 animate-pulse rounded-xl bg-gray-100" />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold">{t('deals.title')}</h1>
        <div className="flex gap-2">
          <Button variant={viewMode === 'pipeline' ? 'default' : 'outline'} size="sm" onClick={() => setViewMode('pipeline')}>
            {t('deals.pipeline')}
          </Button>
          <Button variant={viewMode === 'list' ? 'default' : 'outline'} size="sm" onClick={() => setViewMode('list')}>
            List
          </Button>
        </div>
      </div>

      <SearchInput value={search} onChange={setSearch} placeholder={t('common.search')} className="sm:w-72" />

      {(deals || []).length === 0 ? (
        <EmptyState icon={Handshake} title={t('common.noData')} />
      ) : viewMode === 'pipeline' ? (
        <div className="flex gap-4 overflow-x-auto pb-4">
          {DEAL_STAGES.filter((s) => s !== 'lost').map((stage) => (
            <div key={stage} className="flex-shrink-0 w-72">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-gray-700 capitalize">
                  {t(`deals.${stage.replace(/_/g, '').replace(/([A-Z])/g, (m) => m.toLowerCase())}`) || stage.replace(/_/g, ' ')}
                </h3>
                <Badge variant="secondary">{dealsByStage[stage]?.length || 0}</Badge>
              </div>
              <div className="space-y-3">
                {(dealsByStage[stage] || []).map((deal) => (
                  <Card key={deal.id} className="p-3">
                    <div className="flex items-start justify-between mb-2">
                      <Badge variant={stageColors[deal.stage] || 'secondary'}>{deal.saleType}</Badge>
                      {deal.totalAmount && (
                        <span className="text-sm font-semibold text-blue-600">
                          {formatCurrency(deal.totalAmount)}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mb-2">ID: {deal.id.slice(0, 8)}...</p>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="w-full text-xs"
                      onClick={() => handleAdvanceStage(deal)}
                    >
                      {t('common.next')} <ArrowIcon className="h-3 w-3 ms-1" />
                    </Button>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {(deals || []).map((deal) => (
            <Card key={deal.id} className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Deal #{deal.id.slice(0, 8)}</p>
                  <p className="text-sm text-gray-500">{deal.saleType} • {deal.stage.replace(/_/g, ' ')}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={stageColors[deal.stage] || 'secondary'}>{deal.stage.replace(/_/g, ' ')}</Badge>
                  {deal.totalAmount && (
                    <span className="font-semibold text-blue-600">{formatCurrency(deal.totalAmount)}</span>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
