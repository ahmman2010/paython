import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useQuery } from '@tanstack/react-query'
import { Car, SlidersHorizontal } from 'lucide-react'
import { Button, Badge, SearchInput, SelectField, EmptyState, CardSkeleton } from '@/shared/components/ui'
import { fetchPublicCars } from '../services/public-catalog-service'
import { formatCurrency } from '@/lib/utils'
import { CAR_BODY_TYPES, CAR_CONDITIONS } from '@/config/constants'

export function PublicCatalogPage() {
  const { companySlug } = useParams<{ companySlug: string }>()
  const { t } = useTranslation()
  const [search, setSearch] = useState('')
  const [filterCondition, setFilterCondition] = useState('')
  const [filterBodyType, setFilterBodyType] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  const { data: cars, isLoading } = useQuery({
    queryKey: ['publicCars', companySlug],
    queryFn: () => fetchPublicCars(companySlug || ''),
    enabled: !!companySlug,
  })

  const filtered = (cars || []).filter((car) => {
    const matchSearch = `${car.make} ${car.model} ${car.year}`.toLowerCase().includes(search.toLowerCase())
    const matchCondition = !filterCondition || car.condition === filterCondition
    const matchBody = !filterBodyType || car.bodyType === filterBodyType
    return matchSearch && matchCondition && matchBody
  })

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">{t('public.browseCars')}</h1>

      {/* Search and Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center mb-6">
        <SearchInput value={search} onChange={setSearch} placeholder={t('common.search')} className="flex-1" />
        <Button variant="outline" onClick={() => setShowFilters(!showFilters)}>
          <SlidersHorizontal className="h-4 w-4 me-2" />
          {t('common.filter')}
        </Button>
      </div>

      {showFilters && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 p-4 rounded-xl bg-gray-50 border border-gray-200">
          <SelectField
            label={t('inventory.condition')}
            placeholder={t('common.all')}
            value={filterCondition}
            onChange={(e) => setFilterCondition(e.target.value)}
            options={[{ value: '', label: t('common.all') }, ...CAR_CONDITIONS.map((c) => ({ value: c, label: t(`inventory.${c}`) }))]}
          />
          <SelectField
            label={t('inventory.bodyType')}
            placeholder={t('common.all')}
            value={filterBodyType}
            onChange={(e) => setFilterBodyType(e.target.value)}
            options={[{ value: '', label: t('common.all') }, ...CAR_BODY_TYPES.map((b) => ({ value: b, label: b }))]}
          />
        </div>
      )}

      {/* Results */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState icon={Car} title={t('common.noData')} />
      ) : (
        <>
          <p className="text-sm text-gray-500 mb-4">{filtered.length} {t('nav.cars')}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((car) => {
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
                        <h3 className="font-semibold">{car.make} {car.model}</h3>
                        <p className="text-sm text-gray-500">{car.year} • {car.trim || car.bodyType}</p>
                      </div>
                      <Badge variant={car.condition === 'new' ? 'success' : 'secondary'}>
                        {car.condition === 'new' ? t('inventory.new') : t('inventory.used')}
                      </Badge>
                    </div>
                    <div className="flex gap-2 mt-2 text-xs text-gray-500">
                      <span>{car.transmission}</span>
                      <span>•</span>
                      <span>{car.fuelType}</span>
                    </div>
                    {lowestPrice && lowestPrice !== Infinity && (
                      <p className="mt-3 text-lg font-bold text-blue-600">
                        {t('public.startingFrom')} {formatCurrency(lowestPrice)}
                      </p>
                    )}
                    <Button variant="outline" size="sm" className="w-full mt-3">
                      {t('public.viewDetails')}
                    </Button>
                  </div>
                </Link>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}
