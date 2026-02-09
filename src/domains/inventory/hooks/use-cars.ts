import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchCars, fetchCarById, createCar, updateCar, deleteCar } from '../services/inventory-service'
import type { CarFormData } from '../types/car-types'

export function useCars(tenantId: string) {
  return useQuery({
    queryKey: ['cars', tenantId],
    queryFn: () => fetchCars(tenantId),
    enabled: !!tenantId,
  })
}

export function useCar(carId: string) {
  return useQuery({
    queryKey: ['car', carId],
    queryFn: () => fetchCarById(carId),
    enabled: !!carId,
  })
}

export function useCreateCar(tenantId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CarFormData) => createCar(tenantId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cars', tenantId] })
    },
  })
}

export function useUpdateCar(tenantId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ carId, data }: { carId: string; data: Partial<CarFormData> }) => updateCar(carId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cars', tenantId] })
    },
  })
}

export function useDeleteCar(tenantId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (carId: string) => deleteCar(carId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cars', tenantId] })
    },
  })
}
