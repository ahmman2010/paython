import { z } from 'zod'

export interface Invoice {
  id: string
  tenantId: string
  dealId: string | null
  customerId: string
  invoiceNumber: string
  status: string
  subtotal: number
  vatAmount: number
  total: number
  dueDate: string | null
  paidAt: string | null
  createdAt: string
  updatedAt: string
  customerName?: string
}

export interface InvoiceItem {
  id: string
  invoiceId: string
  description: string
  descriptionAr: string | null
  quantity: number
  unitPrice: number
  total: number
}

export interface Payment {
  id: string
  tenantId: string
  invoiceId: string
  amount: number
  method: string
  reference: string | null
  status: string
  paidAt: string | null
  createdAt: string
  invoiceNumber?: string
  customerName?: string
}

export const invoiceItemSchema = z.object({
  description: z.string().min(1, 'validation.required'),
  descriptionAr: z.string().optional(),
  quantity: z.number().min(1),
  unitPrice: z.number().min(0),
})

export const invoiceSchema = z.object({
  customerId: z.string().min(1, 'validation.required'),
  dealId: z.string().optional(),
  dueDate: z.string().optional(),
  notes: z.string().optional(),
  items: z.array(invoiceItemSchema).min(1),
})

export type InvoiceFormData = z.infer<typeof invoiceSchema>

export const paymentSchema = z.object({
  invoiceId: z.string().min(1, 'validation.required'),
  amount: z.number().min(0.01, 'validation.positiveNumber'),
  method: z.enum(['cash', 'bank_transfer', 'card', 'cheque']),
  reference: z.string().optional(),
})

export type PaymentFormData = z.infer<typeof paymentSchema>
