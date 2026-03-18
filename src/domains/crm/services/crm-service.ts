import { supabase } from '@/lib/supabase'
import type { Customer, CustomerFormData, Lead, LeadFormData } from '../types/customer-types'

function mapCustomerRow(row: Record<string, unknown>): Customer {
  return {
    id: row.id as string,
    tenantId: row.tenant_id as string,
    firstName: row.first_name as string,
    lastName: row.last_name as string,
    firstNameAr: row.first_name_ar as string | null,
    lastNameAr: row.last_name_ar as string | null,
    email: row.email as string | null,
    phone: row.phone as string,
    nationalId: row.national_id as string | null,
    address: row.address as string | null,
    city: row.city as string | null,
    preferredLanguage: row.preferred_language as string,
    preferredContact: row.preferred_contact as string,
    notes: row.notes as string | null,
    marketingConsent: row.marketing_consent as boolean,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  }
}

function mapLeadRow(row: Record<string, unknown>): Lead {
  return {
    id: row.id as string,
    tenantId: row.tenant_id as string,
    customerId: row.customer_id as string | null,
    branchId: row.branch_id as string | null,
    assignedTo: row.assigned_to as string | null,
    source: row.source as string,
    status: row.status as string,
    name: row.name as string,
    phone: row.phone as string,
    email: row.email as string | null,
    notes: row.notes as string | null,
    preferredBranchId: row.preferred_branch_id as string | null,
    preferredContact: row.preferred_contact as string,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  }
}

export async function fetchCustomers(tenantId: string): Promise<Customer[]> {
  const { data, error } = await supabase
    .from('customers')
    .select('*')
    .eq('tenant_id', tenantId)
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)
  return (data || []).map(mapCustomerRow)
}

export async function createCustomer(tenantId: string, formData: CustomerFormData): Promise<Customer> {
  const { data, error } = await supabase
    .from('customers')
    .insert({
      tenant_id: tenantId,
      first_name: formData.firstName,
      last_name: formData.lastName,
      first_name_ar: formData.firstNameAr || null,
      last_name_ar: formData.lastNameAr || null,
      email: formData.email || null,
      phone: formData.phone,
      national_id: formData.nationalId || null,
      address: formData.address || null,
      city: formData.city || null,
      preferred_language: formData.preferredLanguage,
      preferred_contact: formData.preferredContact,
      notes: formData.notes || null,
      marketing_consent: formData.marketingConsent,
    })
    .select()
    .single()

  if (error) throw new Error(error.message)
  return mapCustomerRow(data)
}

export async function updateCustomer(customerId: string, formData: Partial<CustomerFormData>): Promise<Customer> {
  const updateData: Record<string, unknown> = {}
  if (formData.firstName !== undefined) updateData.first_name = formData.firstName
  if (formData.lastName !== undefined) updateData.last_name = formData.lastName
  if (formData.firstNameAr !== undefined) updateData.first_name_ar = formData.firstNameAr || null
  if (formData.lastNameAr !== undefined) updateData.last_name_ar = formData.lastNameAr || null
  if (formData.email !== undefined) updateData.email = formData.email || null
  if (formData.phone !== undefined) updateData.phone = formData.phone
  if (formData.nationalId !== undefined) updateData.national_id = formData.nationalId || null
  if (formData.address !== undefined) updateData.address = formData.address || null
  if (formData.city !== undefined) updateData.city = formData.city || null
  if (formData.preferredLanguage !== undefined) updateData.preferred_language = formData.preferredLanguage
  if (formData.preferredContact !== undefined) updateData.preferred_contact = formData.preferredContact
  if (formData.notes !== undefined) updateData.notes = formData.notes || null
  if (formData.marketingConsent !== undefined) updateData.marketing_consent = formData.marketingConsent

  const { data, error } = await supabase.from('customers').update(updateData).eq('id', customerId).select().single()
  if (error) throw new Error(error.message)
  return mapCustomerRow(data)
}

export async function fetchLeads(tenantId: string, filters?: { status?: string; source?: string }): Promise<Lead[]> {
  let query = supabase
    .from('leads')
    .select('*')
    .eq('tenant_id', tenantId)
    .order('created_at', { ascending: false })

  if (filters?.status) query = query.eq('status', filters.status)
  if (filters?.source) query = query.eq('source', filters.source)

  const { data, error } = await query
  if (error) throw new Error(error.message)
  return (data || []).map(mapLeadRow)
}

export async function createLead(tenantId: string, formData: LeadFormData): Promise<Lead> {
  const { data, error } = await supabase
    .from('leads')
    .insert({
      tenant_id: tenantId,
      name: formData.name,
      phone: formData.phone,
      email: formData.email || null,
      source: formData.source,
      notes: formData.notes || null,
      preferred_branch_id: formData.preferredBranchId || null,
      preferred_contact: formData.preferredContact,
      status: 'new',
    })
    .select()
    .single()

  if (error) throw new Error(error.message)
  return mapLeadRow(data)
}

export async function updateLead(leadId: string, updates: Partial<Record<string, unknown>>): Promise<Lead> {
  const { data, error } = await supabase.from('leads').update(updates).eq('id', leadId).select().single()
  if (error) throw new Error(error.message)
  return mapLeadRow(data)
}
