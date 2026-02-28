import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  fetchInvoices,
  createInvoice,
  updateInvoiceStatus,
  fetchPayments,
  recordPayment,
} from '../services/billing-service'
import type { InvoiceFormData, PaymentFormData } from '../types/billing-types'

export function useInvoices(tenantId: string) {
  return useQuery({
    queryKey: ['invoices', tenantId],
    queryFn: () => fetchInvoices(tenantId),
    enabled: !!tenantId,
  })
}

export function useCreateInvoice(tenantId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: InvoiceFormData) => createInvoice(tenantId, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['invoices', tenantId] }),
  })
}

export function useUpdateInvoiceStatus(tenantId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => updateInvoiceStatus(id, status),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['invoices', tenantId] }),
  })
}

export function usePayments(tenantId: string) {
  return useQuery({
    queryKey: ['payments', tenantId],
    queryFn: () => fetchPayments(tenantId),
    enabled: !!tenantId,
  })
}

export function useRecordPayment(tenantId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: PaymentFormData) => recordPayment(tenantId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments', tenantId] })
      queryClient.invalidateQueries({ queryKey: ['invoices', tenantId] })
    },
  })
}
