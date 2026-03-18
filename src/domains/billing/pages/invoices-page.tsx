import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FileText, Plus, Send, CheckCircle } from 'lucide-react'
import { Button, SearchInput, DataTable, Badge, EmptyState, Modal, Input, SelectField } from '@/shared/components/ui'
import type { Column } from '@/shared/components/ui'
import { useInvoices, useCreateInvoice, useUpdateInvoiceStatus } from '../hooks/use-billing'
import { useCustomers } from '@/domains/crm/hooks/use-customers'
import { useAuthStore } from '@/shared/hooks/useAuth'
import { formatCurrency, formatDate } from '@/lib/utils'
import type { Invoice } from '../types/billing-types'

const statusVariant: Record<string, 'default' | 'success' | 'warning' | 'danger' | 'secondary'> = {
  draft: 'secondary', sent: 'default', paid: 'success', overdue: 'danger', cancelled: 'danger',
}

export function InvoicesPage() {
  const { t, i18n } = useTranslation()
  const { tenantId } = useAuthStore()
  const [search, setSearch] = useState('')
  const [showCreate, setShowCreate] = useState(false)
  const isAr = i18n.language === 'ar'

  const { data: invoices, isLoading } = useInvoices(tenantId || '')
  const { data: customers } = useCustomers(tenantId || '')
  const createInvoice = useCreateInvoice(tenantId || '')
  const updateStatus = useUpdateInvoiceStatus(tenantId || '')

  const [formCustomer, setFormCustomer] = useState('')
  const [formDueDate, setFormDueDate] = useState('')
  const [formItems, setFormItems] = useState([{ description: '', descriptionAr: '', quantity: 1, unitPrice: 0 }])

  const addItem = () => setFormItems([...formItems, { description: '', descriptionAr: '', quantity: 1, unitPrice: 0 }])
  const updateItem = (idx: number, field: string, value: string | number) => {
    const updated = [...formItems]
    updated[idx] = { ...updated[idx], [field]: value }
    setFormItems(updated)
  }

  const handleCreate = async () => {
    if (!formCustomer || formItems.length === 0) return
    await createInvoice.mutateAsync({
      customerId: formCustomer, dueDate: formDueDate || undefined,
      items: formItems.map((i) => ({ description: i.description, descriptionAr: i.descriptionAr || undefined, quantity: i.quantity, unitPrice: i.unitPrice })),
    })
    setShowCreate(false)
    setFormCustomer('')
    setFormDueDate('')
    setFormItems([{ description: '', descriptionAr: '', quantity: 1, unitPrice: 0 }])
  }

  const filtered = (invoices || []).filter((inv) =>
    `${inv.invoiceNumber} ${inv.customerName || ''}`.toLowerCase().includes(search.toLowerCase())
  )
  const subtotal = formItems.reduce((s, i) => s + i.quantity * i.unitPrice, 0)
  const vatAmount = subtotal * 0.15
  const total = subtotal + vatAmount

  const customerOptions = (customers || []).map((c) => ({ value: c.id, label: `${c.firstName} ${c.lastName} - ${c.phone}` }))

  const columns: Column<Invoice>[] = [
    { key: 'invoiceNumber', header: isAr ? 'رقم الفاتورة' : 'Invoice #', render: (inv) => <span className="font-mono text-sm font-medium">{inv.invoiceNumber}</span> },
    { key: 'customer', header: t('deals.customer'), headerAr: 'العميل', render: (inv) => inv.customerName || '-' },
    { key: 'total', header: t('quotes.total'), headerAr: 'الإجمالي', render: (inv) => (
      <div><p className="font-semibold">{formatCurrency(inv.total)}</p><p className="text-xs text-gray-400">{t('quotes.vat')}: {formatCurrency(inv.vatAmount)}</p></div>
    )},
    { key: 'status', header: t('common.status'), headerAr: 'الحالة', render: (inv) => <Badge variant={statusVariant[inv.status] || 'secondary'}>{inv.status}</Badge> },
    { key: 'dueDate', header: isAr ? 'الاستحقاق' : 'Due', render: (inv) => inv.dueDate ? formatDate(inv.dueDate, isAr ? 'ar-SA' : 'en-US') : '-' },
    { key: 'actions', header: t('common.actions'), render: (inv) => (
      <div className="flex gap-1">
        {inv.status === 'draft' && <Button variant="ghost" size="sm" onClick={() => updateStatus.mutate({ id: inv.id, status: 'sent' })}><Send className="h-3.5 w-3.5 me-1" />{isAr ? 'إرسال' : 'Send'}</Button>}
        {inv.status === 'sent' && <Button variant="ghost" size="sm" className="text-green-600" onClick={() => updateStatus.mutate({ id: inv.id, status: 'paid' })}><CheckCircle className="h-3.5 w-3.5 me-1" />{isAr ? 'تم الدفع' : 'Paid'}</Button>}
      </div>
    )},
  ]

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold">{t('nav.invoices')}</h1>
        <Button onClick={() => setShowCreate(true)}><Plus className="h-4 w-4 me-2" />{isAr ? 'إنشاء فاتورة' : 'Create Invoice'}</Button>
      </div>
      <SearchInput value={search} onChange={setSearch} placeholder={t('common.search')} className="sm:w-72" />
      {filtered.length === 0 && !isLoading ? (
        <EmptyState icon={FileText} title={t('common.noData')} actionLabel={isAr ? 'إنشاء فاتورة' : 'Create Invoice'} onAction={() => setShowCreate(true)} />
      ) : (
        <div className="rounded-xl border border-gray-200 bg-white"><DataTable columns={columns} data={filtered} loading={isLoading} keyExtractor={(inv) => inv.id} /></div>
      )}
      <Modal open={showCreate} onOpenChange={setShowCreate} title={isAr ? 'إنشاء فاتورة' : 'Create Invoice'} size="xl">
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <SelectField label={t('deals.customer')} required options={customerOptions} value={formCustomer} onChange={(e) => setFormCustomer(e.target.value)} placeholder={t('common.search')} />
            <Input label={isAr ? 'تاريخ الاستحقاق' : 'Due Date'} type="date" value={formDueDate} onChange={(e) => setFormDueDate(e.target.value)} />
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between"><h3 className="font-medium">{isAr ? 'البنود' : 'Items'}</h3><Button variant="outline" size="sm" onClick={addItem}><Plus className="h-3.5 w-3.5 me-1" />{t('quotes.addItem')}</Button></div>
            {formItems.map((item, idx) => (
              <div key={idx} className="grid grid-cols-12 gap-2 items-end">
                <div className="col-span-5"><Input label={idx === 0 ? t('quotes.item') : undefined} value={item.description} onChange={(e) => updateItem(idx, 'description', e.target.value)} placeholder={t('quotes.item')} /></div>
                <div className="col-span-2"><Input label={idx === 0 ? t('quotes.quantity') : undefined} type="number" min={1} value={item.quantity} onChange={(e) => updateItem(idx, 'quantity', parseInt(e.target.value) || 0)} /></div>
                <div className="col-span-3"><Input label={idx === 0 ? t('quotes.unitPrice') : undefined} type="number" min={0} value={item.unitPrice} onChange={(e) => updateItem(idx, 'unitPrice', parseFloat(e.target.value) || 0)} /></div>
                <div className="col-span-2 text-end"><p className="text-sm font-medium pb-2">{formatCurrency(item.quantity * item.unitPrice)}</p></div>
              </div>
            ))}
          </div>
          <div className="rounded-lg bg-gray-50 p-4 space-y-1 text-sm">
            <div className="flex justify-between"><span>{t('quotes.subtotal')}</span><span>{formatCurrency(subtotal)}</span></div>
            <div className="flex justify-between text-gray-500"><span>{t('quotes.vat')}</span><span>{formatCurrency(vatAmount)}</span></div>
            <div className="flex justify-between font-bold text-lg border-t pt-2 mt-2"><span>{t('quotes.total')}</span><span className="text-blue-600">{formatCurrency(total)}</span></div>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={() => setShowCreate(false)}>{t('common.cancel')}</Button>
            <Button onClick={handleCreate} loading={createInvoice.isPending}>{t('common.save')}</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
