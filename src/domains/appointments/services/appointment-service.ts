import { supabase } from '@/lib/supabase'
import type { Appointment, AppointmentFormData } from '../types/appointment-types'

function mapRow(row: Record<string, unknown>): Appointment {
  return {
    id: row.id as string,
    tenantId: row.tenant_id as string,
    branchId: row.branch_id as string,
    customerId: row.customer_id as string | null,
    leadId: row.lead_id as string | null,
    dealId: row.deal_id as string | null,
    assignedTo: row.assigned_to as string | null,
    type: row.type as string,
    date: row.date as string,
    timeSlot: row.time_slot as string,
    status: row.status as string,
    notes: row.notes as string | null,
    noShow: row.no_show as boolean,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  }
}

export async function fetchAppointments(tenantId: string, filters?: {
  branchId?: string
  date?: string
  status?: string
}): Promise<Appointment[]> {
  let query = supabase
    .from('appointments')
    .select('*')
    .eq('tenant_id', tenantId)
    .order('date', { ascending: true })

  if (filters?.branchId) query = query.eq('branch_id', filters.branchId)
  if (filters?.date) query = query.eq('date', filters.date)
  if (filters?.status) query = query.eq('status', filters.status)

  const { data, error } = await query
  if (error) throw new Error(error.message)
  return (data || []).map(mapRow)
}

export async function createAppointment(tenantId: string, formData: AppointmentFormData): Promise<Appointment> {
  const { data, error } = await supabase
    .from('appointments')
    .insert({
      tenant_id: tenantId,
      branch_id: formData.branchId,
      customer_id: formData.customerId || null,
      lead_id: formData.leadId || null,
      type: formData.type,
      date: formData.date,
      time_slot: formData.timeSlot,
      notes: formData.notes || null,
      status: 'scheduled',
    })
    .select()
    .single()

  if (error) throw new Error(error.message)
  return mapRow(data)
}

export async function updateAppointment(id: string, updates: Record<string, unknown>): Promise<Appointment> {
  const { data, error } = await supabase
    .from('appointments')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw new Error(error.message)
  return mapRow(data)
}
