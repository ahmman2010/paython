import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Truck, MapPin, CheckSquare, Clock, Check } from 'lucide-react'
import { Button, DataTable, Badge, EmptyState, Modal } from '@/shared/components/ui'
import type { Column } from '@/shared/components/ui'

interface DeliveryOrder {
  id: string
  customerName: string
  carName: string
  scheduledDate: string | null
  scheduledTime: string | null
  location: string | null
  status: string
  checklist: { item: string; done: boolean }[]
}

const demoDeliveries: DeliveryOrder[] = [
  { id: '1', customerName: 'محمد الراشد', carName: 'Toyota Land Cruiser VXR 2024', scheduledDate: '2024-04-15', scheduledTime: '10:00', location: 'Riyadh Main Showroom', status: 'scheduled',
    checklist: [{ item: 'Vehicle inspection', done: true }, { item: 'Documents prepared', done: true }, { item: 'Insurance confirmed', done: false }, { item: 'Plates installed', done: false }, { item: 'Customer notified', done: true }] },
  { id: '2', customerName: 'عمر حسن', carName: 'Toyota Camry GLE 2024', scheduledDate: '2024-04-10', scheduledTime: '14:00', location: 'Riyadh Main Showroom', status: 'delivered',
    checklist: [{ item: 'Vehicle inspection', done: true }, { item: 'Documents prepared', done: true }, { item: 'Insurance confirmed', done: true }, { item: 'Plates installed', done: true }, { item: 'Customer notified', done: true }] },
]

const statusVariant: Record<string, 'default' | 'success' | 'warning' | 'secondary'> = { pending: 'secondary', scheduled: 'default', in_progress: 'warning', delivered: 'success' }

export function DeliveryPage() {
  const { t, i18n } = useTranslation()
  const [selected, setSelected] = useState<DeliveryOrder | null>(null)
  const isAr = i18n.language === 'ar'
  const statusLabel = (s: string) => {
    const labels: Record<string, string> = isAr ? { pending: 'معلّق', scheduled: 'مجدول', in_progress: 'قيد التنفيذ', delivered: 'تم التسليم' } : { pending: 'Pending', scheduled: 'Scheduled', in_progress: 'In Progress', delivered: 'Delivered' }
    return labels[s] || s
  }

  const columns: Column<DeliveryOrder>[] = [
    { key: 'customer', header: t('deals.customer'), headerAr: 'العميل', render: (d) => <div><p className="font-medium">{d.customerName}</p><p className="text-xs text-gray-500">{d.carName}</p></div> },
    { key: 'date', header: t('common.date'), headerAr: 'التاريخ', render: (d) => d.scheduledDate ? `${d.scheduledDate} ${d.scheduledTime || ''}` : '-' },
    { key: 'location', header: isAr ? 'الموقع' : 'Location', render: (d) => d.location || '-' },
    { key: 'progress', header: isAr ? 'التقدم' : 'Progress', render: (d) => {
      const done = d.checklist.filter((c) => c.done).length
      const pct = Math.round((done / d.checklist.length) * 100)
      return <div className="flex items-center gap-2"><div className="h-2 w-20 rounded-full bg-gray-200"><div className="h-2 rounded-full bg-blue-600 transition-all" style={{ width: `${pct}%` }} /></div><span className="text-xs text-gray-500">{done}/{d.checklist.length}</span></div>
    }},
    { key: 'status', header: t('common.status'), render: (d) => <Badge variant={statusVariant[d.status] || 'secondary'}>{statusLabel(d.status)}</Badge> },
    { key: 'actions', header: '', render: (d) => <Button variant="ghost" size="sm" onClick={() => setSelected(d)}>{t('common.view')}</Button> },
  ]

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">{t('nav.delivery')}</h1>
      {demoDeliveries.length === 0 ? <EmptyState icon={Truck} title={t('common.noData')} /> : (
        <div className="rounded-xl border border-gray-200 bg-white"><DataTable columns={columns} data={demoDeliveries} keyExtractor={(d) => d.id} /></div>
      )}
      {selected && (
        <Modal open={!!selected} onOpenChange={() => setSelected(null)} title={`${isAr ? 'أمر تسليم' : 'Delivery'} - ${selected.customerName}`} size="lg">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-lg bg-gray-50 p-3"><p className="text-xs text-gray-500"><Truck className="inline h-3.5 w-3.5 me-1" />{isAr ? 'السيارة' : 'Vehicle'}</p><p className="font-medium mt-1">{selected.carName}</p></div>
              <div className="rounded-lg bg-gray-50 p-3"><p className="text-xs text-gray-500"><MapPin className="inline h-3.5 w-3.5 me-1" />{isAr ? 'الموقع' : 'Location'}</p><p className="font-medium mt-1">{selected.location || '-'}</p></div>
              <div className="rounded-lg bg-gray-50 p-3"><p className="text-xs text-gray-500"><Clock className="inline h-3.5 w-3.5 me-1" />{isAr ? 'الموعد' : 'Schedule'}</p><p className="font-medium mt-1">{selected.scheduledDate} {selected.scheduledTime}</p></div>
              <div className="rounded-lg bg-gray-50 p-3"><p className="text-xs text-gray-500">{t('common.status')}</p><Badge variant={statusVariant[selected.status]} className="mt-1">{statusLabel(selected.status)}</Badge></div>
            </div>
            <div>
              <h3 className="font-medium mb-3"><CheckSquare className="inline h-4 w-4 me-1" />{isAr ? 'قائمة التحقق' : 'Checklist'}</h3>
              <div className="space-y-2">
                {selected.checklist.map((item, i) => (
                  <label key={i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <div className={`flex h-5 w-5 items-center justify-center rounded border-2 ${item.done ? 'bg-green-600 border-green-600 text-white' : 'border-gray-300'}`}>{item.done && <Check className="h-3 w-3" />}</div>
                    <span className={item.done ? 'line-through text-gray-400' : ''}>{item.item}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
