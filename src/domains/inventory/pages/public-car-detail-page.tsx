import { useParams, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useQuery } from '@tanstack/react-query'
import { Car, Calendar, MessageCircle, FileText, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button, Badge, Card, CardContent } from '@/shared/components/ui'
import { fetchPublicCars } from '../services/public-catalog-service'
import { formatCurrency } from '@/lib/utils'
import { useLanguage } from '@/shared/hooks/useLanguage'

export function PublicCarDetailPage() {
  const { companySlug, carId } = useParams<{ companySlug: string; carId: string }>()
  const { t } = useTranslation()
  const { isRtl } = useLanguage()
  const BackIcon = isRtl ? ChevronRight : ChevronLeft

  const { data: cars, isLoading } = useQuery({
    queryKey: ['publicCars', companySlug],
    queryFn: () => fetchPublicCars(companySlug || ''),
    enabled: !!companySlug,
  })

  const car = (cars || []).find((c) => c.id === carId)

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-64 rounded-xl bg-gray-200" />
          <div className="h-8 w-1/3 rounded bg-gray-200" />
          <div className="h-4 w-1/2 rounded bg-gray-200" />
        </div>
      </div>
    )
  }

  if (!car) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <Car className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500">{t('common.noData')}</p>
      </div>
    )
  }

  const lowestPrice = car.units.length > 0
    ? Math.min(...car.units.filter((u) => u.availability === 'in_stock').map((u) => u.sellingPrice))
    : null

  const specs = [
    { label: t('inventory.year'), value: car.year },
    { label: t('inventory.bodyType'), value: car.bodyType },
    { label: t('inventory.transmission'), value: car.transmission },
    { label: t('inventory.fuelType'), value: car.fuelType },
    { label: t('inventory.condition'), value: car.condition === 'new' ? t('inventory.new') : t('inventory.used') },
    ...(car.trim ? [{ label: t('inventory.trim'), value: car.trim }] : []),
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <Link to={`/${companySlug}/cars`} className="inline-flex items-center gap-1 text-sm text-blue-600 hover:underline mb-6">
        <BackIcon className="h-4 w-4" />
        {t('common.back')}
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Gallery */}
        <div className="lg:col-span-2">
          <div className="h-64 md:h-96 rounded-xl bg-gray-200 flex items-center justify-center overflow-hidden">
            {car.media[0] ? (
              <img src={car.media[0].url} alt={`${car.make} ${car.model}`} className="h-full w-full object-cover" />
            ) : (
              <Car className="h-20 w-20 text-gray-400" />
            )}
          </div>
          {car.media.length > 1 && (
            <div className="flex gap-2 mt-4 overflow-x-auto">
              {car.media.map((m, i) => (
                <div key={i} className="h-20 w-20 flex-shrink-0 rounded-lg bg-gray-200 overflow-hidden">
                  <img src={m.url} alt="" className="h-full w-full object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Details & Actions */}
        <div className="space-y-4">
          <div>
            <Badge variant={car.condition === 'new' ? 'success' : 'secondary'} className="mb-2">
              {car.condition === 'new' ? t('inventory.new') : t('inventory.used')}
            </Badge>
            <h1 className="text-2xl md:text-3xl font-bold">{car.make} {car.model}</h1>
            <p className="text-gray-500">{car.year} • {car.trim || car.bodyType}</p>
          </div>

          {lowestPrice && lowestPrice !== Infinity && (
            <div className="rounded-xl bg-blue-50 p-4">
              <p className="text-sm text-gray-600">{t('public.cashPrice')}</p>
              <p className="text-3xl font-bold text-blue-600">{formatCurrency(lowestPrice)}</p>
              <p className="text-sm text-gray-500 mt-1">
                {t('public.monthlyInstallment')}: ~{formatCurrency(lowestPrice / 60)}/mo
              </p>
            </div>
          )}

          <div className="space-y-2">
            <Link to={`/${companySlug}/book`}>
              <Button className="w-full" size="lg">
                <Calendar className="h-4 w-4 me-2" />
                {t('public.bookAppointment')}
              </Button>
            </Link>
            <Button variant="outline" className="w-full" size="lg">
              <FileText className="h-4 w-4 me-2" />
              {t('public.requestQuote')}
            </Button>
            <Button variant="success" className="w-full" size="lg">
              <MessageCircle className="h-4 w-4 me-2" />
              {t('public.chatWhatsApp')}
            </Button>
          </div>
        </div>
      </div>

      {/* Specifications */}
      <Card className="mt-8">
        <CardContent className="pt-6">
          <h2 className="text-xl font-semibold mb-4">{t('public.specifications')}</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {specs.map((spec, i) => (
              <div key={i} className="rounded-lg bg-gray-50 p-3">
                <p className="text-xs text-gray-500">{spec.label}</p>
                <p className="font-medium capitalize">{spec.value}</p>
              </div>
            ))}
          </div>
          {car.features && car.features.length > 0 && (
            <div className="mt-6">
              <h3 className="font-medium mb-3">{t('inventory.features')}</h3>
              <div className="flex flex-wrap gap-2">
                {car.features.map((f, i) => (
                  <Badge key={i} variant="secondary">{f}</Badge>
                ))}
              </div>
            </div>
          )}
          {(car.description || car.descriptionAr) && (
            <div className="mt-6">
              <h3 className="font-medium mb-2">{t('inventory.description')}</h3>
              <p className="text-gray-600 text-sm">{car.descriptionAr || car.description}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Available Units */}
      {car.units.length > 0 && (
        <Card className="mt-6">
          <CardContent className="pt-6">
            <h2 className="text-xl font-semibold mb-4">{t('inventory.availability')}</h2>
            <div className="grid gap-3">
              {car.units.filter((u) => u.availability === 'in_stock').map((unit) => (
                <div key={unit.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                  <div className="flex items-center gap-3">
                    <div className="h-6 w-6 rounded-full border-2 border-gray-300" style={{ backgroundColor: unit.exteriorColor }} />
                    <span className="text-sm capitalize">{unit.exteriorColor}</span>
                  </div>
                  <span className="font-semibold text-blue-600">{formatCurrency(unit.sellingPrice)}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
