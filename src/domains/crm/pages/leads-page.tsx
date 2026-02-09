import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { UserPlus, Plus } from 'lucide-react'
import {
  Button, Input, SelectField, Textarea, SearchInput,
  DataTable, Modal, EmptyState, Badge,
} from '@/shared/components/ui'
import type { Column } from '@/shared/components/ui'
import { useLeads, useCreateLead } from '../hooks/use-leads'
import { leadSchema, type LeadFormData, type Lead } from '../types/customer-types'
import { useAuthStore } from '@/shared/hooks/useAuth'
import { LEAD_SOURCES } from '@/config/constants'

const statusColors: Record<string, 'default' | 'success' | 'warning' | 'danger' | 'secondary'> = {
  new: 'default',
  contacted: 'warning',
  qualified: 'success',
  converted: 'success',
  lost: 'danger',
}

export function LeadsPage() {
  const { t } = useTranslation()
  const { tenantId } = useAuthStore()
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)

  const { data: leads, isLoading } = useLeads(tenantId || '')
  const createLead = useCreateLead(tenantId || '')

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LeadFormData>({
    resolver: zodResolver(leadSchema),
    defaultValues: { source: 'website', preferredContact: 'whatsapp' },
  })

  const onSubmit = async (data: LeadFormData) => {
    await createLead.mutateAsync(data)
    setShowModal(false)
    reset()
  }

  const filteredLeads = (leads || []).filter((l) =>
    `${l.name} ${l.phone}`.toLowerCase().includes(search.toLowerCase())
  )

  const sourceOptions = LEAD_SOURCES.map((s) => ({ value: s, label: t(`leads.${s}`) || s }))

  const columns: Column<Lead>[] = [
    { key: 'name', header: 'Name', headerAr: 'الاسم', render: (l) => l.name },
    { key: 'phone', header: 'Phone', headerAr: 'الهاتف', render: (l) => l.phone },
    {
      key: 'source',
      header: 'Source',
      headerAr: 'المصدر',
      render: (l) => <Badge variant="secondary">{l.source}</Badge>,
    },
    {
      key: 'status',
      header: 'Status',
      headerAr: 'الحالة',
      render: (l) => <Badge variant={statusColors[l.status] || 'secondary'}>{l.status}</Badge>,
    },
  ]

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold">{t('leads.title')}</h1>
        <Button onClick={() => setShowModal(true)}>
          <Plus className="h-4 w-4 me-2" />
          {t('leads.addLead')}
        </Button>
      </div>

      <SearchInput value={search} onChange={setSearch} placeholder={t('common.search')} className="sm:w-72" />

      {filteredLeads.length === 0 && !isLoading ? (
        <EmptyState
          icon={UserPlus}
          title={t('common.noData')}
          actionLabel={t('leads.addLead')}
          onAction={() => setShowModal(true)}
        />
      ) : (
        <div className="rounded-xl border border-gray-200 bg-white">
          <DataTable columns={columns} data={filteredLeads} loading={isLoading} keyExtractor={(l) => l.id} />
        </div>
      )}

      <Modal open={showModal} onOpenChange={setShowModal} title={t('leads.addLead')} size="lg">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input label={t('common.name')} required error={errors.name?.message ? t(errors.name.message) : undefined} {...register('name')} />
          <Input label={t('common.phone')} required error={errors.phone?.message ? t(errors.phone.message) : undefined} {...register('phone')} />
          <Input label={t('common.email')} type="email" {...register('email')} />
          <SelectField label={t('leads.source')} options={sourceOptions} {...register('source')} />
          <SelectField
            label={t('crm.preferredContact')}
            options={[
              { value: 'whatsapp', label: 'WhatsApp' },
              { value: 'phone', label: t('common.phone') },
              { value: 'email', label: t('common.email') },
              { value: 'sms', label: 'SMS' },
            ]}
            {...register('preferredContact')}
          />
          <Textarea label={t('common.notes')} {...register('notes')} />
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => setShowModal(false)}>
              {t('common.cancel')}
            </Button>
            <Button type="submit" loading={createLead.isPending}>
              {t('common.save')}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
