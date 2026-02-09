import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchAppointments, createAppointment, updateAppointment } from '../services/appointment-service'
import type { AppointmentFormData } from '../types/appointment-types'

export function useAppointments(tenantId: string, filters?: {
  branchId?: string
  date?: string
  status?: string
}) {
  return useQuery({
    queryKey: ['appointments', tenantId, filters],
    queryFn: () => fetchAppointments(tenantId, filters),
    enabled: !!tenantId,
  })
}

export function useCreateAppointment(tenantId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: AppointmentFormData) => createAppointment(tenantId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments', tenantId] })
    },
  })
}

export function useUpdateAppointment(tenantId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Record<string, unknown> }) => updateAppointment(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments', tenantId] })
    },
  })
}
