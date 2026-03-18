import { useParams, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useQuery } from '@tanstack/react-query'
import { Car, Calendar, MessageCircle, Star, ArrowLeft, ArrowRight } from 'lucide-react'
import { Button, Badge, CardSkeleton } from '@/shared/components/ui'
import { fetchPublicCars, fetchTenantBySlug } from '../services/public-catalog-service'
import { formatCurrency } from '@/lib/utils'
import { useLanguage } from '@/shared/hooks/useLanguage'

export function PublicLandingPage() {
  const { companySlug } = useParams<{ companySlug: string }>()
  const { t } = useTranslation()
  const { isRtl } = useLanguage()
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight

  const { data: tenant } = useQuery({
    queryKey: ['tenant', companySlug],
    queryFn: () => fetchTenantBySlug(companySlug || ''),
    enabled: !!companySlug,
  })

  const { data: cars, isLoading } = useQuery({
    queryKey: ['publicCars', companySlug],
    queryFn: () => fetchPublicCars(companySlug || ''),
    enabled: !!companySlug,
  })

  const featuredCars = (cars || []).slice(0, 6)

  return (
    <div>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-blue-600 to-blue-800 text-white py-20 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {tenant?.name_ar && isRtl ? tenant.name_ar : tenant?.name || t('app.name')}
          </h1>
          <p className="text-lg md:text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            {t('app.tagline')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to={`/${companySlug}/cars`}>
              <Button size="xl" className="bg-white text-blue-700 hover:bg-blue-50 w-full sm:w-auto">
                <Car className="h-5 w-5 me-2" />
                {t('public.browseCars')}
              </Button>
            </Link>
            <Link to={`/${companySlug}/book`}>
              <Button size="xl" variant="outline" className="border-white text-white hover:bg-blue-700 w-full sm:w-auto">
                <Calendar className="h-5 w-5 me-2" />
                {t('public.bookAppointment')}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Cars */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-bold">{t('public.featuredCars')}</h2>
            <Link to={`/${companySlug}/cars`} className="flex items-center gap-1 text-blue-600 hover:underline text-sm font-medium">
              {t('public.showMore')} <ArrowIcon className="h-4 w-4" />
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredCars.map((car) => {
                const lowestPrice = car.units.length > 0
                  ? Math.min(...car.units.filter((u) => u.availability === 'in_stock').map((u) => u.sellingPrice))
                  : null
                return (
                  <Link
                    key={car.id}
                    to={`/${companySlug}/cars/${car.id}`}
                    className="rounded-xl border border-gray-200 bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="h-48 bg-gray-200 flex items-center justify-center">
                      {car.media[0] ? (
                        <img src={car.media[0].url} alt={`${car.make} ${car.model}`} className="h-full w-full object-cover" />
                      ) : (
                        <Car className="h-12 w-12 text-gray-400" />
                      )}
                    </div>
                    <div className="p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-lg">{car.make} {car.model}</h3>
                          <p className="text-sm text-gray-500">{car.year} • {car.trim || car.bodyType}</p>
                        </div>
                        <Badge variant={car.condition === 'new' ? 'success' : 'secondary'}>
                          {car.condition === 'new' ? t('inventory.new') : t('inventory.used')}
                        </Badge>
                      </div>
                      {lowestPrice && lowestPrice !== Infinity && (
                        <p className="mt-3 text-lg font-bold text-blue-600">
                          {t('public.startingFrom')} {formatCurrency(lowestPrice)}
                        </p>
                      )}
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </section>

      {/* Services */}
      <section className="py-16 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-8">{t('public.services')}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Car, title: t('public.browseCars'), desc: 'Explore our wide selection of vehicles' },
              { icon: Calendar, title: t('public.bookAppointment'), desc: 'Schedule a test drive or inspection' },
              { icon: MessageCircle, title: t('public.chatWhatsApp'), desc: 'Get instant assistance via WhatsApp' },
              { icon: Star, title: t('public.requestQuote'), desc: 'Get a personalized price quote' },
            ].map((service, i) => (
              <div key={i} className="rounded-xl border border-gray-200 bg-white p-6 text-center hover:shadow-md transition-shadow">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-50">
                  <service.icon className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-semibold mb-2">{service.title}</h3>
                <p className="text-sm text-gray-500">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-blue-600 text-white text-center">
        <div className="container mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">{t('public.bookAppointment')}</h2>
          <p className="text-blue-100 mb-8 max-w-xl mx-auto">Schedule an appointment for inspection, test drive, or financing consultation.</p>
          <Link to={`/${companySlug}/book`}>
            <Button size="xl" className="bg-white text-blue-700 hover:bg-blue-50">
              <Calendar className="h-5 w-5 me-2" />
              {t('public.bookAppointment')}
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
