import { z } from 'zod'
import {
  CAR_CONDITIONS, CAR_BODY_TYPES, FUEL_TYPES,
  TRANSMISSION_TYPES, CAR_AVAILABILITY,
} from '@/config/constants'

export const carSchema = z.object({
  make: z.string().min(1, 'validation.required'),
  model: z.string().min(1, 'validation.required'),
  trim: z.string().optional(),
  year: z.number().min(2000).max(2030),
  bodyType: z.enum(CAR_BODY_TYPES),
  transmission: z.enum(TRANSMISSION_TYPES),
  fuelType: z.enum(FUEL_TYPES),
  condition: z.enum(CAR_CONDITIONS),
  description: z.string().optional(),
  descriptionAr: z.string().optional(),
  features: z.array(z.string()).optional(),
  isPublished: z.boolean().default(false),
})

export const carUnitSchema = z.object({
  carId: z.string().uuid(),
  branchId: z.string().uuid(),
  vin: z.string().optional(),
  sku: z.string().optional(),
  exteriorColor: z.string().min(1, 'validation.required'),
  interiorColor: z.string().optional(),
  mileage: z.number().min(0).optional(),
  costPrice: z.number().min(0).optional(),
  sellingPrice: z.number().min(1, 'validation.positiveNumber'),
  minPrice: z.number().min(0).optional(),
  availability: z.enum(CAR_AVAILABILITY).default('in_stock'),
  warrantyMonths: z.number().min(0).optional(),
  notes: z.string().optional(),
})

export type CarFormData = z.infer<typeof carSchema>
export type CarUnitFormData = z.infer<typeof carUnitSchema>

export interface Car {
  id: string
  tenantId: string
  make: string
  model: string
  trim: string | null
  year: number
  bodyType: string
  transmission: string
  fuelType: string
  condition: string
  description: string | null
  descriptionAr: string | null
  features: string[] | null
  isPublished: boolean
  createdAt: string
  updatedAt: string
}

export interface CarUnit {
  id: string
  carId: string
  tenantId: string
  branchId: string
  vin: string | null
  sku: string | null
  exteriorColor: string
  interiorColor: string | null
  mileage: number | null
  costPrice: number | null
  sellingPrice: number
  minPrice: number | null
  availability: string
  warrantyMonths: number | null
  notes: string | null
  createdAt: string
  updatedAt: string
  car?: Car
}

export interface CarWithUnits extends Car {
  units: CarUnit[]
  media: CarMedia[]
}

export interface CarMedia {
  id: string
  carId: string
  url: string
  type: string
  sortOrder: number
}
