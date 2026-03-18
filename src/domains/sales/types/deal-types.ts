import { z } from 'zod'
import { SALE_TYPES } from '@/config/constants'

export const dealSchema = z.object({
  customerId: z.string().uuid('validation.required'),
  carUnitId: z.string().uuid().optional(),
  branchId: z.string().uuid('validation.required'),
  saleType: z.enum(SALE_TYPES).default('cash'),
  totalAmount: z.number().min(0).optional(),
  depositAmount: z.number().min(0).optional(),
  notes: z.string().optional(),
  expectedCloseDate: z.string().optional(),
})

export type DealFormData = z.infer<typeof dealSchema>

export interface Deal {
  id: string
  tenantId: string
  customerId: string
  carUnitId: string | null
  branchId: string
  assignedTo: string | null
  stage: string
  saleType: string
  totalAmount: number | null
  depositAmount: number | null
  notes: string | null
  lostReason: string | null
  expectedCloseDate: string | null
  closedAt: string | null
  createdAt: string
  updatedAt: string
}
