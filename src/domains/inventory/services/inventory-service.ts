import { supabase } from '@/lib/supabase'
import type { Car, CarUnit, CarFormData, CarUnitFormData } from '../types/car-types'

function mapCarRow(row: Record<string, unknown>): Car {
  return {
    id: row.id as string,
    tenantId: row.tenant_id as string,
    make: row.make as string,
    model: row.model as string,
    trim: row.trim as string | null,
    year: row.year as number,
    bodyType: row.body_type as string,
    transmission: row.transmission as string,
    fuelType: row.fuel_type as string,
    condition: row.condition as string,
    description: row.description as string | null,
    descriptionAr: row.description_ar as string | null,
    features: row.features as string[] | null,
    isPublished: row.is_published as boolean,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  }
}

function mapCarUnitRow(row: Record<string, unknown>): CarUnit {
  return {
    id: row.id as string,
    carId: row.car_id as string,
    tenantId: row.tenant_id as string,
    branchId: row.branch_id as string,
    vin: row.vin as string | null,
    sku: row.sku as string | null,
    exteriorColor: row.exterior_color as string,
    interiorColor: row.interior_color as string | null,
    mileage: row.mileage as number | null,
    costPrice: row.cost_price as number | null,
    sellingPrice: row.selling_price as number,
    minPrice: row.min_price as number | null,
    availability: row.availability as string,
    warrantyMonths: row.warranty_months as number | null,
    notes: row.notes as string | null,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  }
}

export async function fetchCars(tenantId: string): Promise<Car[]> {
  const { data, error } = await supabase
    .from('cars')
    .select('*')
    .eq('tenant_id', tenantId)
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)
  return (data || []).map(mapCarRow)
}

export async function fetchCarById(carId: string): Promise<Car | null> {
  const { data, error } = await supabase
    .from('cars')
    .select('*')
    .eq('id', carId)
    .single()

  if (error) throw new Error(error.message)
  return data ? mapCarRow(data) : null
}

export async function createCar(tenantId: string, formData: CarFormData): Promise<Car> {
  const { data, error } = await supabase
    .from('cars')
    .insert({
      tenant_id: tenantId,
      make: formData.make,
      model: formData.model,
      trim: formData.trim || null,
      year: formData.year,
      body_type: formData.bodyType,
      transmission: formData.transmission,
      fuel_type: formData.fuelType,
      condition: formData.condition,
      description: formData.description || null,
      description_ar: formData.descriptionAr || null,
      features: formData.features || null,
      is_published: formData.isPublished,
    })
    .select()
    .single()

  if (error) throw new Error(error.message)
  return mapCarRow(data)
}

export async function updateCar(carId: string, formData: Partial<CarFormData>): Promise<Car> {
  const updateData: Record<string, unknown> = {}
  if (formData.make !== undefined) updateData.make = formData.make
  if (formData.model !== undefined) updateData.model = formData.model
  if (formData.trim !== undefined) updateData.trim = formData.trim || null
  if (formData.year !== undefined) updateData.year = formData.year
  if (formData.bodyType !== undefined) updateData.body_type = formData.bodyType
  if (formData.transmission !== undefined) updateData.transmission = formData.transmission
  if (formData.fuelType !== undefined) updateData.fuel_type = formData.fuelType
  if (formData.condition !== undefined) updateData.condition = formData.condition
  if (formData.description !== undefined) updateData.description = formData.description || null
  if (formData.descriptionAr !== undefined) updateData.description_ar = formData.descriptionAr || null
  if (formData.features !== undefined) updateData.features = formData.features || null
  if (formData.isPublished !== undefined) updateData.is_published = formData.isPublished

  const { data, error } = await supabase
    .from('cars')
    .update(updateData)
    .eq('id', carId)
    .select()
    .single()

  if (error) throw new Error(error.message)
  return mapCarRow(data)
}

export async function deleteCar(carId: string): Promise<void> {
  const { error } = await supabase.from('cars').delete().eq('id', carId)
  if (error) throw new Error(error.message)
}

export async function fetchCarUnits(tenantId: string, filters?: {
  branchId?: string
  availability?: string
  carId?: string
}): Promise<CarUnit[]> {
  let query = supabase
    .from('car_units')
    .select('*')
    .eq('tenant_id', tenantId)
    .order('created_at', { ascending: false })

  if (filters?.branchId) query = query.eq('branch_id', filters.branchId)
  if (filters?.availability) query = query.eq('availability', filters.availability)
  if (filters?.carId) query = query.eq('car_id', filters.carId)

  const { data, error } = await query
  if (error) throw new Error(error.message)
  return (data || []).map(mapCarUnitRow)
}

export async function createCarUnit(tenantId: string, formData: CarUnitFormData): Promise<CarUnit> {
  const { data, error } = await supabase
    .from('car_units')
    .insert({
      car_id: formData.carId,
      tenant_id: tenantId,
      branch_id: formData.branchId,
      vin: formData.vin || null,
      sku: formData.sku || null,
      exterior_color: formData.exteriorColor,
      interior_color: formData.interiorColor || null,
      mileage: formData.mileage ?? null,
      cost_price: formData.costPrice ?? null,
      selling_price: formData.sellingPrice,
      min_price: formData.minPrice ?? null,
      availability: formData.availability,
      warranty_months: formData.warrantyMonths ?? null,
      notes: formData.notes || null,
    })
    .select()
    .single()

  if (error) throw new Error(error.message)
  return mapCarUnitRow(data)
}

export async function updateCarUnit(unitId: string, formData: Partial<CarUnitFormData>): Promise<CarUnit> {
  const updateData: Record<string, unknown> = {}
  if (formData.branchId !== undefined) updateData.branch_id = formData.branchId
  if (formData.vin !== undefined) updateData.vin = formData.vin || null
  if (formData.exteriorColor !== undefined) updateData.exterior_color = formData.exteriorColor
  if (formData.interiorColor !== undefined) updateData.interior_color = formData.interiorColor || null
  if (formData.mileage !== undefined) updateData.mileage = formData.mileage ?? null
  if (formData.costPrice !== undefined) updateData.cost_price = formData.costPrice ?? null
  if (formData.sellingPrice !== undefined) updateData.selling_price = formData.sellingPrice
  if (formData.minPrice !== undefined) updateData.min_price = formData.minPrice ?? null
  if (formData.availability !== undefined) updateData.availability = formData.availability
  if (formData.warrantyMonths !== undefined) updateData.warranty_months = formData.warrantyMonths ?? null

  const { data, error } = await supabase
    .from('car_units')
    .update(updateData)
    .eq('id', unitId)
    .select()
    .single()

  if (error) throw new Error(error.message)
  return mapCarUnitRow(data)
}
