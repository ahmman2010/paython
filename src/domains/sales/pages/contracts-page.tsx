import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FileSignature, Plus, Eye } from 'lucide-react'
import { Button, SearchInput, DataTable, Badge, EmptyState, Modal } from '@/shared/components/ui'
import type { Column } from '@/shared/components/ui'

interface Contract {
  id: string
  contractNumber: string
  customerName: string
  status: string
  signedAt: string | null
  createdAt: string
}

const demoContracts: Contract[] = [
  { id: '1', contractNumber: 'CNT-001', customerName: 'محمد الراشد', status: 'signed', signedAt: '2024-03-20', createdAt: '2024-03-18' },
  { id: '2', contractNumber: 'CNT-002', customerName: 'عمر حسن', status: 'draft', signedAt: null, createdAt: '2024-03-25' },
  { id: '3', contractNumber: 'CNT-003', customerName: 'سارة العتيبي', status: 'sent', signedAt: null, createdAt: '2024-03-28' },
]

const statusVariant: Record<string, 'default' | 'success' | 'warning' | 'secondary'> = {
  draft: 'secondary', sent: 'default', signed: 'success', expired: 'warning',
}

export function ContractsPage() {
  const { t, i18n } = useTranslation()
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<Contract | null>(null)
  const isAr = i18n.language === 'ar'

  const filtered = demoContracts.filter((c) => `${c.contractNumber} ${c.customerName}`.toLowerCase().includes(search.toLowerCase()))

  const columns: Column<Contract>[] = [
    { key: 'contractNumber', header: isAr ? 'رقم العقد' : 'Contract #', render: (c) => <span className="font-mono text-sm font-medium">{c.contractNumber}</span> },
    { key: 'customer', header: t('deals.customer'), headerAr: 'العميل', render: (c) => c.customerName },
    { key: 'status', header: t('common.status'), headerAr: 'الحالة', render: (c) => <Badge variant={statusVariant[c.status] || 'secondary'}>{isAr ? (c.status === 'signed' ? 'موقّع' : c.status === 'sent' ? 'مرسل' : 'مسودة') : c.status}</Badge> },
    { key: 'signedAt', header: isAr ? 'تاريخ التوقيع' : 'Signed', render: (c) => c.signedAt || '-' },
    { key: 'actions', header: t('common.actions'), render: (c) => <Button variant="ghost" size="sm" onClick={() => setSelected(c)}><Eye className="h-3.5 w-3.5 me-1" />{t('common.view')}</Button> },
  ]

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold">{t('nav.contracts')}</h1>
        <Button><Plus className="h-4 w-4 me-2" />{isAr ? 'إنشاء عقد' : 'Create Contract'}</Button>
      </div>
      <SearchInput value={search} onChange={setSearch} placeholder={t('common.search')} className="sm:w-72" />
      {filtered.length === 0 ? <EmptyState icon={FileSignature} title={t('common.noData')} /> : (
        <div className="rounded-xl border border-gray-200 bg-white"><DataTable columns={columns} data={filtered} keyExtractor={(c) => c.id} /></div>
      )}
      {selected && (
        <Modal open={!!selected} onOpenChange={() => setSelected(null)} title={`${isAr ? 'عقد' : 'Contract'} ${selected.contractNumber}`} size="lg">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-lg bg-gray-50 p-3"><p className="text-xs text-gray-500">{t('deals.customer')}</p><p className="font-medium">{selected.customerName}</p></div>
              <div className="rounded-lg bg-gray-50 p-3"><p className="text-xs text-gray-500">{t('common.status')}</p><Badge variant={statusVariant[selected.status]}>{selected.status}</Badge></div>
            </div>
            <div className="rounded-lg border border-dashed border-gray-300 p-8 text-center text-gray-400">
              <FileSignature className="h-12 w-12 mx-auto mb-3" />
              <p>{isAr ? 'محتوى العقد سيظهر هنا' : 'Contract content will appear here'}</p>
              <p className="text-xs mt-1">{isAr ? 'قالب مع بيانات العميل والسيارة وشروط التمويل' : 'Template with customer, car, and financing terms'}</p>
            </div>
            <div className="flex justify-end gap-3">
              {selected.status === 'draft' && <Button>{isAr ? 'إرسال للعميل' : 'Send to Customer'}</Button>}
              {selected.status === 'sent' && <Button variant="success">{isAr ? 'تأكيد التوقيع' : 'Confirm Signature'}</Button>}
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
