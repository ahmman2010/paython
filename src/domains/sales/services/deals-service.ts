import { supabase } from '@/lib/supabase'
import type { Deal, DealFormData } from '../types/deal-types'

function mapDealRow(row: Record<string, unknown>): Deal {
  return {
    id: row.id as string,
    tenantId: row.tenant_id as string,
    customerId: row.customer_id as string,
    carUnitId: row.car_unit_id as string | null,
    branchId: row.branch_id as string,
    assignedTo: row.assigned_to as string | null,
    stage: row.stage as string,
    saleType: row.sale_type as string,
    totalAmount: row.total_amount as number | null,
    depositAmount: row.deposit_amount as number | null,
    notes: row.notes as string | null,
    lostReason: row.lost_reason as string | null,
    expectedCloseDate: row.expected_close_date as string | null,
    closedAt: row.closed_at as string | null,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  }
}

export async function fetchDeals(tenantId: string, filters?: {
  stage?: string
  saleType?: string
  assignedTo?: string
}): Promise<Deal[]> {
  let query = supabase
    .from('deals')
    .select('*')
    .eq('tenant_id', tenantId)
    .order('created_at', { ascending: false })

  if (filters?.stage) query = query.eq('stage', filters.stage)
  if (filters?.saleType) query = query.eq('sale_type', filters.saleType)
  if (filters?.assignedTo) query = query.eq('assigned_to', filters.assignedTo)

  const { data, error } = await query
  if (error) throw new Error(error.message)
  return (data || []).map(mapDealRow)
}

export async function createDeal(tenantId: string, formData: DealFormData): Promise<Deal> {
  const { data, error } = await supabase
    .from('deals')
    .insert({
      tenant_id: tenantId,
      customer_id: formData.customerId,
      car_unit_id: formData.carUnitId || null,
      branch_id: formData.branchId,
      sale_type: formData.saleType,
      total_amount: formData.totalAmount ?? null,
      deposit_amount: formData.depositAmount ?? null,
      notes: formData.notes || null,
      expected_close_date: formData.expectedCloseDate || null,
      stage: 'new_lead',
    })
    .select()
    .single()

  if (error) throw new Error(error.message)
  return mapDealRow(data)
}

export async function updateDealStage(dealId: string, stage: string): Promise<Deal> {
  const updates: Record<string, unknown> = { stage }
  if (stage === 'delivered') updates.closed_at = new Date().toISOString()

  const { data, error } = await supabase
    .from('deals')
    .update(updates)
    .eq('id', dealId)
    .select()
    .single()

  if (error) throw new Error(error.message)
  return mapDealRow(data)
}

export async function updateDeal(dealId: string, updates: Record<string, unknown>): Promise<Deal> {
  const { data, error } = await supabase
    .from('deals')
    .update(updates)
    .eq('id', dealId)
    .select()
    .single()

  if (error) throw new Error(error.message)
  return mapDealRow(data)
}
