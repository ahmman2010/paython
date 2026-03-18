import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Calendar, Plus } from 'lucide-react'
import {
  Button, Input, SelectField, Textarea,
  DataTable, Modal, EmptyState, Badge,
} from '@/shared/components/ui'
import type { Column } from '@/shared/components/ui'
import { useAppointments, useCreateAppointment } from '../hooks/use-appointments'
import { appointmentSchema, type AppointmentFormData, type Appointment } from '../types/appointment-types'
import { useAuthStore } from '@/shared/hooks/useAuth'
import { APPOINTMENT_TYPES } from '@/config/constants'

const statusColors: Record<string, 'default' | 'success' | 'warning' | 'danger' | 'secondary'> = {
  scheduled: 'default',
  confirmed: 'success',
  completed: 'success',
  cancelled: 'danger',
  no_show: 'warning',
}

const TIME_SLOTS = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
  '15:00', '15:30', '16:00', '16:30', '17:00',
]

export function AppointmentsPage() {
  const { t } = useTranslation()
  const { tenantId } = useAuthStore()
  const [showModal, setShowModal] = useState(false)

  const { data: appointments, isLoading } = useAppointments(tenantId || '')
  const createAppointment = useCreateAppointment(tenantId || '')

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AppointmentFormData>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: { type: 'test_drive' },
  })

  const onSubmit = async (data: AppointmentFormData) => {
    await createAppointment.mutateAsync(data)
    setShowModal(false)
    reset()
  }

  const typeOptions = APPOINTMENT_TYPES.map((t_key) => ({ value: t_key, label: t(`appointments.${t_key.replace('_', '')}`) || t_key }))
  const timeOptions = TIME_SLOTS.map((s) => ({ value: s, label: s }))

  const columns: Column<Appointment>[] = [
    { key: 'date', header: 'Date', headerAr: 'التاريخ', render: (a) => a.date },
    { key: 'timeSlot', header: 'Time', headerAr: 'الوقت', render: (a) => a.timeSlot },
    {
      key: 'type',
      header: 'Type',
      headerAr: 'النوع',
      render: (a) => <Badge variant="secondary">{a.type}</Badge>,
    },
    {
      key: 'status',
      header: 'Status',
      headerAr: 'الحالة',
      render: (a) => <Badge variant={statusColors[a.status] || 'secondary'}>{a.status}</Badge>,
    },
  ]

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold">{t('appointments.title')}</h1>
        <Button onClick={() => setShowModal(true)}>
          <Plus className="h-4 w-4 me-2" />
          {t('appointments.book')}
        </Button>
      </div>

      {(appointments || []).length === 0 && !isLoading ? (
        <EmptyState icon={Calendar} title={t('common.noData')} actionLabel={t('appointments.book')} onAction={() => setShowModal(true)} />
      ) : (
        <div className="rounded-xl border border-gray-200 bg-white">
          <DataTable columns={columns} data={appointments || []} loading={isLoading} keyExtractor={(a) => a.id} />
        </div>
      )}

      <Modal open={showModal} onOpenChange={setShowModal} title={t('appointments.book')} size="lg">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input label="Branch ID" required error={errors.branchId?.message ? t(errors.branchId.message) : undefined} {...register('branchId')} />
          <SelectField label={t('common.type')} options={typeOptions} required {...register('type')} />
          <Input label={t('appointments.date')} type="date" required error={errors.date?.message ? t(errors.date.message) : undefined} {...register('date')} />
          <SelectField label={t('appointments.timeSlot')} options={timeOptions} required {...register('timeSlot')} />
          <Textarea label={t('common.notes')} {...register('notes')} />
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => setShowModal(false)}>{t('common.cancel')}</Button>
            <Button type="submit" loading={createAppointment.isPending}>{t('common.save')}</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
