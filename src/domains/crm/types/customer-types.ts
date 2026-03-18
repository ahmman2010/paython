import { z } from 'zod'

export const customerSchema = z.object({
  firstName: z.string().min(1, 'validation.required'),
  lastName: z.string().min(1, 'validation.required'),
  firstNameAr: z.string().optional(),
  lastNameAr: z.string().optional(),
  email: z.string().email('validation.email').optional().or(z.literal('')),
  phone: z.string().min(9, 'validation.phone'),
  nationalId: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  preferredLanguage: z.enum(['ar', 'en']).default('ar'),
  preferredContact: z.enum(['whatsapp', 'phone', 'email', 'sms']).default('whatsapp'),
  notes: z.string().optional(),
  marketingConsent: z.boolean().default(false),
})

export type CustomerFormData = z.infer<typeof customerSchema>

export interface Customer {
  id: string
  tenantId: string
  firstName: string
  lastName: string
  firstNameAr: string | null
  lastNameAr: string | null
  email: string | null
  phone: string
  nationalId: string | null
  address: string | null
  city: string | null
  preferredLanguage: string
  preferredContact: string
  notes: string | null
  marketingConsent: boolean
  createdAt: string
  updatedAt: string
}

export const leadSchema = z.object({
  name: z.string().min(1, 'validation.required'),
  phone: z.string().min(9, 'validation.phone'),
  email: z.string().email('validation.email').optional().or(z.literal('')),
  source: z.string().default('website'),
  notes: z.string().optional(),
  preferredBranchId: z.string().optional(),
  preferredContact: z.enum(['whatsapp', 'phone', 'email', 'sms']).default('whatsapp'),
})

export type LeadFormData = z.infer<typeof leadSchema>

export interface Lead {
  id: string
  tenantId: string
  customerId: string | null
  branchId: string | null
  assignedTo: string | null
  source: string
  status: string
  name: string
  phone: string
  email: string | null
  notes: string | null
  preferredBranchId: string | null
  preferredContact: string
  createdAt: string
  updatedAt: string
}
