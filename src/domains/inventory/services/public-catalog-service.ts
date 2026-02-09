import { supabase } from '@/lib/supabase'

export interface PublicCar {
  id: string
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
  media: { url: string; type: string }[]
  units: {
    id: string
    exteriorColor: string
    sellingPrice: number
    availability: string
    branchId: string
  }[]
}

export async function fetchPublicCars(tenantSlug: string): Promise<PublicCar[]> {
  const { data: tenant } = await supabase
    .from('tenants')
    .select('id')
    .eq('slug', tenantSlug)
    .eq('is_active', true)
    .single()

  if (!tenant) return []

  const { data, error } = await supabase
    .from('cars')
    .select(`
      *,
      car_media(url, type, sort_order),
      car_units(id, exterior_color, selling_price, availability, branch_id)
    `)
    .eq('tenant_id', tenant.id)
    .eq('is_published', true)
    .order('created_at', { ascending: false })

  if (error) return []

  return (data || []).map((row: Record<string, unknown>) => ({
    id: row.id as string,
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
    media: ((row.car_media as Record<string, unknown>[]) || []).map((m) => ({
      url: m.url as string,
      type: m.type as string,
    })),
    units: ((row.car_units as Record<string, unknown>[]) || []).map((u) => ({
      id: u.id as string,
      exteriorColor: u.exterior_color as string,
      sellingPrice: u.selling_price as number,
      availability: u.availability as string,
      branchId: u.branch_id as string,
    })),
  }))
}

export async function fetchTenantBySlug(slug: string) {
  const { data } = await supabase
    .from('tenants')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .single()
  return data
}
