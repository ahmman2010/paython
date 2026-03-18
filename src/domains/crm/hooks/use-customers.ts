import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchCustomers, createCustomer, updateCustomer } from '../services/crm-service'
import type { CustomerFormData } from '../types/customer-types'

export function useCustomers(tenantId: string) {
  return useQuery({
    queryKey: ['customers', tenantId],
    queryFn: () => fetchCustomers(tenantId),
    enabled: !!tenantId,
  })
}

export function useCreateCustomer(tenantId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CustomerFormData) => createCustomer(tenantId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers', tenantId] })
    },
  })
}

export function useUpdateCustomer(tenantId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CustomerFormData> }) => updateCustomer(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers', tenantId] })
    },
  })
}
