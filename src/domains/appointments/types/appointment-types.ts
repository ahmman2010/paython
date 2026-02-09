import { z } from 'zod'
import { APPOINTMENT_TYPES } from '@/config/constants'

export const appointmentSchema = z.object({
  branchId: z.string().uuid('validation.required'),
  customerId: z.string().uuid().optional(),
  leadId: z.string().uuid().optional(),
  type: z.enum(APPOINTMENT_TYPES),
  date: z.string().min(1, 'validation.required'),
  timeSlot: z.string().min(1, 'validation.required'),
  notes: z.string().optional(),
})

export type AppointmentFormData = z.infer<typeof appointmentSchema>

export interface Appointment {
  id: string
  tenantId: string
  branchId: string
  customerId: string | null
  leadId: string | null
  dealId: string | null
  assignedTo: string | null
  type: string
  date: string
  timeSlot: string
  status: string
  notes: string | null
  noShow: boolean
  createdAt: string
  updatedAt: string
}
