import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { CreditCard, Plus } from 'lucide-react'
import { Button, SearchInput, DataTable, Badge, EmptyState, Modal, Input, SelectField } from '@/shared/components/ui'
import type { Column } from '@/shared/components/ui'
import { usePayments, useRecordPayment, useInvoices } from '../hooks/use-billing'
import { useAuthStore } from '@/shared/hooks/useAuth'
import { formatCurrency, formatDate } from '@/lib/utils'
import type { Payment } from '../types/billing-types'

const methodLabels: Record<string, Record<string, string>> = {
  en: { cash: 'Cash', bank_transfer: 'Bank Transfer', card: 'Card', cheque: 'Cheque' },
  ar: { cash: 'نقدي', bank_transfer: 'تحويل بنكي', card: 'بطاقة', cheque: 'شيك' },
}

export function PaymentsPage() {
  const { t, i18n } = useTranslation()
  const { tenantId } = useAuthStore()
  const [search, setSearch] = useState('')
  const [showCreate, setShowCreate] = useState(false)
  const isAr = i18n.language === 'ar'
  const lang = isAr ? 'ar' : 'en'

  const { data: payments, isLoading } = usePayments(tenantId || '')
  const { data: invoices } = useInvoices(tenantId || '')
  const recordPayment = useRecordPayment(tenantId || '')

  const [formInvoice, setFormInvoice] = useState('')
  const [formAmount, setFormAmount] = useState('')
  const [formMethod, setFormMethod] = useState('cash')
  const [formReference, setFormReference] = useState('')

  const handleCreate = async () => {
    if (!formInvoice || !formAmount) return
    await recordPayment.mutateAsync({
      invoiceId: formInvoice, amount: parseFloat(formAmount),
      method: formMethod as 'cash' | 'bank_transfer' | 'card' | 'cheque',
      reference: formReference || undefined,
    })
    setShowCreate(false)
    setFormInvoice('')
    setFormAmount('')
    setFormMethod('cash')
    setFormReference('')
  }

  const filtered = (payments || []).filter((p) =>
    `${p.invoiceNumber || ''} ${p.customerName || ''} ${p.reference || ''}`.toLowerCase().includes(search.toLowerCase())
  )
  const unpaidInvoices = (invoices || []).filter((inv) => inv.status !== 'paid' && inv.status !== 'cancelled')
  const invoiceOptions = unpaidInvoices.map((inv) => ({ value: inv.id, label: `${inv.invoiceNumber} - ${inv.customerName || ''} (${formatCurrency(inv.total)})` }))

  const columns: Column<Payment>[] = [
    { key: 'invoiceNumber', header: isAr ? 'رقم الفاتورة' : 'Invoice', render: (p) => <span className="font-mono text-sm">{p.invoiceNumber || '-'}</span> },
    { key: 'customer', header: t('deals.customer'), headerAr: 'العميل', render: (p) => p.customerName || '-' },
    { key: 'amount', header: t('common.amount'), headerAr: 'المبلغ', render: (p) => <span className="font-semibold text-green-600">{formatCurrency(p.amount)}</span> },
    { key: 'method', header: isAr ? 'طريقة الدفع' : 'Method', render: (p) => <Badge variant="secondary">{methodLabels[lang][p.method] || p.method}</Badge> },
    { key: 'reference', header: isAr ? 'المرجع' : 'Reference', render: (p) => p.reference || '-' },
    { key: 'date', header: t('common.date'), headerAr: 'التاريخ', render: (p) => p.paidAt ? formatDate(p.paidAt, isAr ? 'ar-SA' : 'en-US') : '-' },
  ]

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold">{t('nav.payments')}</h1>
        <Button onClick={() => setShowCreate(true)}><Plus className="h-4 w-4 me-2" />{isAr ? 'تسجيل دفعة' : 'Record Payment'}</Button>
      </div>
      <SearchInput value={search} onChange={setSearch} placeholder={t('common.search')} className="sm:w-72" />
      {filtered.length === 0 && !isLoading ? (
        <EmptyState icon={CreditCard} title={t('common.noData')} />
      ) : (
        <div className="rounded-xl border border-gray-200 bg-white"><DataTable columns={columns} data={filtered} loading={isLoading} keyExtractor={(p) => p.id} /></div>
      )}
      <Modal open={showCreate} onOpenChange={setShowCreate} title={isAr ? 'تسجيل دفعة' : 'Record Payment'} size="md">
        <div className="space-y-4">
          <SelectField label={isAr ? 'الفاتورة' : 'Invoice'} required options={invoiceOptions} value={formInvoice} onChange={(e) => setFormInvoice(e.target.value)} placeholder={isAr ? 'اختر فاتورة' : 'Select invoice'} />
          <Input label={t('common.amount')} type="number" required value={formAmount} onChange={(e) => setFormAmount(e.target.value)} />
          <SelectField label={isAr ? 'طريقة الدفع' : 'Payment Method'} required value={formMethod} onChange={(e) => setFormMethod(e.target.value)} options={[
            { value: 'cash', label: methodLabels[lang].cash },
            { value: 'bank_transfer', label: methodLabels[lang].bank_transfer },
            { value: 'card', label: methodLabels[lang].card },
            { value: 'cheque', label: methodLabels[lang].cheque },
          ]} />
          <Input label={isAr ? 'رقم المرجع' : 'Reference'} value={formReference} onChange={(e) => setFormReference(e.target.value)} />
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={() => setShowCreate(false)}>{t('common.cancel')}</Button>
            <Button onClick={handleCreate} loading={recordPayment.isPending}>{t('common.save')}</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
