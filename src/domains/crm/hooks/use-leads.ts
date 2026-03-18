import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchLeads, createLead, updateLead } from '../services/crm-service'
import type { LeadFormData } from '../types/customer-types'

export function useLeads(tenantId: string, filters?: { status?: string; source?: string }) {
  return useQuery({
    queryKey: ['leads', tenantId, filters],
    queryFn: () => fetchLeads(tenantId, filters),
    enabled: !!tenantId,
  })
}

export function useCreateLead(tenantId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: LeadFormData) => createLead(tenantId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads', tenantId] })
    },
  })
}

export function useUpdateLead(tenantId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Record<string, unknown> }) => updateLead(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads', tenantId] })
    },
  })
}
