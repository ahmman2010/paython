import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'
import { Car, Plus } from 'lucide-react'
import { Button, Badge, SearchInput, EmptyState } from '@/shared/components/ui'
import { useCars } from '../hooks/use-cars'
import { useState } from 'react'
import { useAuthStore } from '@/shared/hooks/useAuth'

export function CarList() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { tenant } = useParams<{ tenant: string }>()
  const { tenantId } = useAuthStore()
  const [search, setSearch] = useState('')

  const { data: cars, isLoading } = useCars(tenantId || '')

  const filteredCars = (cars || []).filter((car) =>
    `${car.make} ${car.model} ${car.year}`.toLowerCase().includes(search.toLowerCase())
  )

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-20 animate-pulse rounded-xl bg-gray-100" />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold">{t('inventory.title')}</h1>
        <Button onClick={() => navigate(`/app/${tenant}/inventory/add`)}>
          <Plus className="h-4 w-4 me-2" />
          {t('inventory.addCar')}
        </Button>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder={t('common.search')}
          className="sm:w-72"
        />
      </div>

      {filteredCars.length === 0 ? (
        <EmptyState
          icon={Car}
          title={t('common.noData')}
          description={t('inventory.addCar')}
          actionLabel={t('inventory.addCar')}
          onAction={() => navigate(`/app/${tenant}/inventory/add`)}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredCars.map((car) => (
            <div
              key={car.id}
              onClick={() => navigate(`/app/${tenant}/inventory/${car.id}`)}
              className="cursor-pointer rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {car.make} {car.model}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {car.year} • {car.trim || car.bodyType}
                  </p>
                </div>
                <Badge variant={car.condition === 'new' ? 'success' : 'secondary'}>
                  {car.condition === 'new' ? t('inventory.new') : t('inventory.used')}
                </Badge>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span>{car.transmission}</span>
                <span>•</span>
                <span>{car.fuelType}</span>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <Badge variant={car.isPublished ? 'default' : 'outline'}>
                  {car.isPublished ? t('inventory.publish') : t('inventory.unpublish')}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
