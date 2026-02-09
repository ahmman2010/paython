import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchDeals, createDeal, updateDealStage, updateDeal } from '../services/deals-service'
import type { DealFormData } from '../types/deal-types'

export function useDeals(tenantId: string, filters?: {
  stage?: string
  saleType?: string
  assignedTo?: string
}) {
  return useQuery({
    queryKey: ['deals', tenantId, filters],
    queryFn: () => fetchDeals(tenantId, filters),
    enabled: !!tenantId,
  })
}

export function useCreateDeal(tenantId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: DealFormData) => createDeal(tenantId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deals', tenantId] })
    },
  })
}

export function useUpdateDealStage(tenantId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ dealId, stage }: { dealId: string; stage: string }) => updateDealStage(dealId, stage),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deals', tenantId] })
    },
  })
}

export function useUpdateDeal(tenantId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ dealId, updates }: { dealId: string; updates: Record<string, unknown> }) => updateDeal(dealId, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deals', tenantId] })
    },
  })
}
