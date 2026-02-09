import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Calendar, Check } from 'lucide-react'
import { Button, Input, SelectField, Textarea, Card, CardContent } from '@/shared/components/ui'
import { Stepper } from '@/shared/components/ui/stepper'
import { APPOINTMENT_TYPES } from '@/config/constants'

const bookingSchema = z.object({
  name: z.string().min(1, 'validation.required'),
  phone: z.string().min(9, 'validation.phone'),
  email: z.string().email().optional().or(z.literal('')),
  type: z.string().min(1, 'validation.required'),
  date: z.string().min(1, 'validation.required'),
  timeSlot: z.string().min(1, 'validation.required'),
  notes: z.string().optional(),
})

type BookingFormData = z.infer<typeof bookingSchema>

const steps = [
  { label: 'Your Info', labelAr: 'بياناتك' },
  { label: 'Appointment', labelAr: 'الموعد' },
  { label: 'Confirm', labelAr: 'التأكيد' },
]

const TIME_SLOTS = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
  '15:00', '15:30', '16:00', '16:30', '17:00',
]

export function PublicBookingPage() {
  const { t } = useTranslation()
  const [currentStep, setCurrentStep] = useState(0)
  const [submitted, setSubmitted] = useState(false)

  const {
    register,
    handleSubmit,
    trigger,
    getValues,
    formState: { errors },
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: { type: 'test_drive' },
  })

  const handleNext = async () => {
    const fieldsPerStep: (keyof BookingFormData)[][] = [
      ['name', 'phone'],
      ['type', 'date', 'timeSlot'],
      [],
    ]
    const valid = await trigger(fieldsPerStep[currentStep])
    if (valid) setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1))
  }

  const onSubmit = async (_data: BookingFormData) => {
    setSubmitted(true)
  }

  const typeOptions = APPOINTMENT_TYPES.map((t_key) => ({
    value: t_key,
    label: t(`appointments.${t_key.replace(/_/g, '')}`) || t_key.replace(/_/g, ' '),
  }))
  const timeOptions = TIME_SLOTS.map((s) => ({ value: s, label: s }))

  if (submitted) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <Check className="h-8 w-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Appointment Booked!</h2>
        <p className="text-gray-500">We'll contact you to confirm your appointment.</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-lg">
      <div className="text-center mb-8">
        <Calendar className="h-12 w-12 text-blue-600 mx-auto mb-3" />
        <h1 className="text-2xl font-bold">{t('public.bookAppointment')}</h1>
      </div>

      <Stepper steps={steps} currentStep={currentStep} className="mb-8" />

      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {currentStep === 0 && (
              <>
                <Input label={t('common.name')} required error={errors.name?.message ? t(errors.name.message) : undefined} {...register('name')} />
                <Input label={t('common.phone')} required error={errors.phone?.message ? t(errors.phone.message) : undefined} {...register('phone')} />
                <Input label={t('common.email')} type="email" {...register('email')} />
              </>
            )}

            {currentStep === 1 && (
              <>
                <SelectField label={t('common.type')} options={typeOptions} required {...register('type')} />
                <Input label={t('appointments.date')} type="date" required error={errors.date?.message ? t(errors.date.message) : undefined} {...register('date')} />
                <SelectField label={t('appointments.timeSlot')} options={timeOptions} required {...register('timeSlot')} />
                <Textarea label={t('common.notes')} {...register('notes')} />
              </>
            )}

            {currentStep === 2 && (
              <div className="space-y-3">
                <h3 className="font-medium">{t('common.confirm')}</h3>
                <div className="rounded-lg bg-gray-50 p-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">{t('common.name')}:</span>
                    <span>{getValues('name')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">{t('common.phone')}:</span>
                    <span>{getValues('phone')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">{t('common.type')}:</span>
                    <span>{getValues('type')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">{t('appointments.date')}:</span>
                    <span>{getValues('date')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">{t('appointments.timeSlot')}:</span>
                    <span>{getValues('timeSlot')}</span>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-between pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => currentStep > 0 ? setCurrentStep((p) => p - 1) : undefined}
                disabled={currentStep === 0}
              >
                {t('common.back')}
              </Button>
              {currentStep < steps.length - 1 ? (
                <Button type="button" onClick={handleNext}>
                  {t('common.next')}
                </Button>
              ) : (
                <Button type="submit">
                  {t('common.confirm')}
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
