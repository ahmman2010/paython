import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Users, Plus } from 'lucide-react'
import {
  Button, Input, SelectField, Textarea, SearchInput,
  DataTable, Modal, EmptyState,
} from '@/shared/components/ui'
import type { Column } from '@/shared/components/ui'
import { useCustomers, useCreateCustomer } from '../hooks/use-customers'
import { customerSchema, type CustomerFormData, type Customer } from '../types/customer-types'
import { useAuthStore } from '@/shared/hooks/useAuth'
import { formatDate } from '@/lib/utils'

export function CustomersPage() {
  const { t, i18n } = useTranslation()
  const { tenantId } = useAuthStore()
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)

  const { data: customers, isLoading } = useCustomers(tenantId || '')
  const createCustomer = useCreateCustomer(tenantId || '')

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CustomerFormData>({
    resolver: zodResolver(customerSchema),
    defaultValues: { preferredLanguage: 'ar', preferredContact: 'whatsapp', marketingConsent: false },
  })

  const onSubmit = async (data: CustomerFormData) => {
    await createCustomer.mutateAsync(data)
    setShowModal(false)
    reset()
  }

  const filteredCustomers = (customers || []).filter((c) =>
    `${c.firstName} ${c.lastName} ${c.phone}`.toLowerCase().includes(search.toLowerCase())
  )

  const columns: Column<Customer>[] = [
    {
      key: 'name',
      header: 'Name',
      headerAr: 'الاسم',
      render: (c) => `${c.firstName} ${c.lastName}`,
    },
    { key: 'phone', header: 'Phone', headerAr: 'الهاتف', render: (c) => c.phone },
    { key: 'email', header: 'Email', headerAr: 'البريد', render: (c) => c.email || '-' },
    { key: 'city', header: 'City', headerAr: 'المدينة', render: (c) => c.city || '-' },
    {
      key: 'createdAt',
      header: 'Created',
      headerAr: 'تاريخ الإنشاء',
      render: (c) => formatDate(c.createdAt, i18n.language === 'ar' ? 'ar-SA' : 'en-US'),
    },
  ]

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold">{t('nav.customers')}</h1>
        <Button onClick={() => setShowModal(true)}>
          <Plus className="h-4 w-4 me-2" />
          {t('crm.addCustomer')}
        </Button>
      </div>

      <SearchInput value={search} onChange={setSearch} placeholder={t('common.search')} className="sm:w-72" />

      {filteredCustomers.length === 0 && !isLoading ? (
        <EmptyState
          icon={Users}
          title={t('common.noData')}
          actionLabel={t('crm.addCustomer')}
          onAction={() => setShowModal(true)}
        />
      ) : (
        <div className="rounded-xl border border-gray-200 bg-white">
          <DataTable columns={columns} data={filteredCustomers} loading={isLoading} keyExtractor={(c) => c.id} />
        </div>
      )}

      <Modal open={showModal} onOpenChange={setShowModal} title={t('crm.addCustomer')} size="lg">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label={t('crm.firstName')} required error={errors.firstName?.message ? t(errors.firstName.message) : undefined} {...register('firstName')} />
            <Input label={t('crm.lastName')} required error={errors.lastName?.message ? t(errors.lastName.message) : undefined} {...register('lastName')} />
            <Input label={`${t('crm.firstName')} (عربي)`} {...register('firstNameAr')} />
            <Input label={`${t('crm.lastName')} (عربي)`} {...register('lastNameAr')} />
            <Input label={t('common.phone')} required error={errors.phone?.message ? t(errors.phone.message) : undefined} {...register('phone')} />
            <Input label={t('common.email')} type="email" {...register('email')} />
            <Input label={t('crm.nationalId')} {...register('nationalId')} />
            <Input label={t('crm.city')} {...register('city')} />
          </div>
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
          <label className="flex items-center gap-2">
            <input type="checkbox" {...register('marketingConsent')} className="rounded" />
            <span className="text-sm">{t('crm.marketingConsent')}</span>
          </label>
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => setShowModal(false)}>
              {t('common.cancel')}
            </Button>
            <Button type="submit" loading={createCustomer.isPending}>
              {t('common.save')}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
