import { z } from 'zod'

export const quoteItemSchema = z.object({
  description: z.string().min(1, 'validation.required'),
  descriptionAr: z.string().optional(),
  quantity: z.number().min(1),
  unitPrice: z.number().min(0),
})

export const quoteSchema = z.object({
  customerId: z.string().uuid('validation.required'),
  dealId: z.string().uuid().optional(),
  notes: z.string().optional(),
  validUntil: z.string().optional(),
  items: z.array(quoteItemSchema).min(1),
  discountAmount: z.number().min(0).default(0),
})

export type QuoteFormData = z.infer<typeof quoteSchema>
export type QuoteItemFormData = z.infer<typeof quoteItemSchema>

export interface Quote {
  id: string
  tenantId: string
  dealId: string | null
  customerId: string
  quoteNumber: string
  status: string
  subtotal: number
  vatAmount: number
  total: number
  discountAmount: number
  notes: string | null
  validUntil: string | null
  createdAt: string
  updatedAt: string
}

export interface QuoteItem {
  id: string
  quoteId: string
  description: string
  descriptionAr: string | null
  quantity: number
  unitPrice: number
  total: number
}
