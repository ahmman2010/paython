import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('validation.email'),
  password: z.string().min(6, 'validation.minLength'),
})

export const signUpSchema = z.object({
  email: z.string().email('validation.email'),
  password: z.string().min(8, 'validation.minLength'),
  fullName: z.string().min(2, 'validation.minLength'),
  fullNameAr: z.string().optional(),
  phone: z.string().optional(),
})

export type LoginFormData = z.infer<typeof loginSchema>
export type SignUpFormData = z.infer<typeof signUpSchema>
