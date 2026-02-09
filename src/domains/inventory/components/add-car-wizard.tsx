import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'
import {
  Button, Input, SelectField, Textarea, Card, CardContent,
} from '@/shared/components/ui'
import { Stepper } from '@/shared/components/ui/stepper'
import { carSchema, type CarFormData } from '../types/car-types'
import { useCreateCar } from '../hooks/use-cars'
import { useAuthStore } from '@/shared/hooks/useAuth'
import {
  CAR_BODY_TYPES, CAR_CONDITIONS, FUEL_TYPES, TRANSMISSION_TYPES,
} from '@/config/constants'

const steps = [
  { label: 'Basic Info', labelAr: 'المعلومات الأساسية' },
  { label: 'Specs & Features', labelAr: 'المواصفات والمميزات' },
  { label: 'Pricing', labelAr: 'التسعير' },
  { label: 'Media', labelAr: 'الوسائط' },
  { label: 'Branch', labelAr: 'الفرع' },
  { label: 'Publish', labelAr: 'النشر' },
]

export function AddCarWizard() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { tenant } = useParams<{ tenant: string }>()
  const { tenantId } = useAuthStore()
  const [currentStep, setCurrentStep] = useState(0)
  const [error, setError] = useState('')

  const createCar = useCreateCar(tenantId || '')

  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
    getValues,
  } = useForm<CarFormData>({
    resolver: zodResolver(carSchema),
    defaultValues: {
      year: new Date().getFullYear(),
      condition: 'new',
      bodyType: 'sedan',
      transmission: 'automatic',
      fuelType: 'petrol',
      isPublished: false,
      features: [],
    },
  })

  const handleNext = async () => {
    const fieldsPerStep: (keyof CarFormData)[][] = [
      ['make', 'model', 'year', 'condition'],
      ['bodyType', 'transmission', 'fuelType'],
      [],
      [],
      [],
      ['isPublished'],
    ]
    const valid = await trigger(fieldsPerStep[currentStep])
    if (valid) setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1))
  }

  const handleBack = () => setCurrentStep((prev) => Math.max(prev - 1, 0))

  const onSubmit = async (data: CarFormData) => {
    try {
      setError('')
      await createCar.mutateAsync(data)
      navigate(`/app/${tenant}/inventory`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create car')
    }
  }

  const bodyTypeOptions = CAR_BODY_TYPES.map((v) => ({ value: v, label: v }))
  const conditionOptions = CAR_CONDITIONS.map((v) => ({ value: v, label: t(`inventory.${v}`) }))
  const fuelOptions = FUEL_TYPES.map((v) => ({ value: v, label: v }))
  const transmissionOptions = TRANSMISSION_TYPES.map((v) => ({ value: v, label: v }))

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">{t('inventory.addCar')}</h1>
      <Stepper steps={steps} currentStep={currentStep} />

      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700">{error}</div>
      )}

      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Step 0: Basic Info */}
            {currentStep === 0 && (
              <>
                <Input label={t('inventory.make')} required error={errors.make?.message ? t(errors.make.message) : undefined} {...register('make')} />
                <Input label={t('inventory.model')} required error={errors.model?.message ? t(errors.model.message) : undefined} {...register('model')} />
                <Input label={t('inventory.trim')} {...register('trim')} />
                <Input label={t('inventory.year')} type="number" required error={errors.year?.message} {...register('year', { valueAsNumber: true })} />
                <SelectField label={t('inventory.condition')} options={conditionOptions} required {...register('condition')} />
              </>
            )}

            {/* Step 1: Specs */}
            {currentStep === 1 && (
              <>
                <SelectField label={t('inventory.bodyType')} options={bodyTypeOptions} required {...register('bodyType')} />
                <SelectField label={t('inventory.transmission')} options={transmissionOptions} required {...register('transmission')} />
                <SelectField label={t('inventory.fuelType')} options={fuelOptions} required {...register('fuelType')} />
                <Textarea label={t('inventory.description')} {...register('description')} />
                <Textarea label={`${t('inventory.description')} (عربي)`} {...register('descriptionAr')} />
              </>
            )}

            {/* Step 2: Pricing (placeholder, units added separately) */}
            {currentStep === 2 && (
              <div className="text-center py-8 text-gray-500">
                <p>{t('inventory.pricing')}</p>
                <p className="text-sm mt-2">Unit pricing is set when adding car units to specific branches.</p>
              </div>
            )}

            {/* Step 3: Media (placeholder) */}
            {currentStep === 3 && (
              <div className="text-center py-8 text-gray-500">
                <p>{t('inventory.media')}</p>
                <p className="text-sm mt-2">Media upload will be available after creating the car listing.</p>
              </div>
            )}

            {/* Step 4: Branch */}
            {currentStep === 4 && (
              <div className="text-center py-8 text-gray-500">
                <p>{t('inventory.branchAllocation')}</p>
                <p className="text-sm mt-2">Branch allocation is done when adding individual car units.</p>
              </div>
            )}

            {/* Step 5: Publish */}
            {currentStep === 5 && (
              <div className="space-y-4">
                <div className="rounded-lg bg-gray-50 p-4">
                  <h3 className="font-medium mb-2">Review</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <span className="text-gray-500">{t('inventory.make')}:</span>
                    <span>{getValues('make')}</span>
                    <span className="text-gray-500">{t('inventory.model')}:</span>
                    <span>{getValues('model')}</span>
                    <span className="text-gray-500">{t('inventory.year')}:</span>
                    <span>{getValues('year')}</span>
                    <span className="text-gray-500">{t('inventory.condition')}:</span>
                    <span>{getValues('condition')}</span>
                    <span className="text-gray-500">{t('inventory.bodyType')}:</span>
                    <span>{getValues('bodyType')}</span>
                  </div>
                </div>
                <label className="flex items-center gap-2">
                  <input type="checkbox" {...register('isPublished')} className="rounded" />
                  <span className="text-sm">{t('inventory.publish')}</span>
                </label>
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between pt-4 border-t">
              <Button type="button" variant="outline" onClick={currentStep === 0 ? () => navigate(-1) : handleBack}>
                {currentStep === 0 ? t('common.cancel') : t('common.back')}
              </Button>
              {currentStep < steps.length - 1 ? (
                <Button type="button" onClick={handleNext}>
                  {t('common.next')}
                </Button>
              ) : (
                <Button type="submit" loading={createCar.isPending}>
                  {t('common.save')}
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
