import { supabase } from '@/lib/supabase'
import type { Invoice, InvoiceFormData, Payment, PaymentFormData } from '../types/billing-types'

function mapInvoiceRow(row: Record<string, unknown>): Invoice {
  return {
    id: row.id as string,
    tenantId: row.tenant_id as string,
    dealId: row.deal_id as string | null,
    customerId: row.customer_id as string,
    invoiceNumber: row.invoice_number as string,
    status: row.status as string,
    subtotal: Number(row.subtotal),
    vatAmount: Number(row.vat_amount),
    total: Number(row.total),
    dueDate: row.due_date as string | null,
    paidAt: row.paid_at as string | null,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  }
}

function mapPaymentRow(row: Record<string, unknown>): Payment {
  return {
    id: row.id as string,
    tenantId: row.tenant_id as string,
    invoiceId: row.invoice_id as string,
    amount: Number(row.amount),
    method: row.method as string,
    reference: row.reference as string | null,
    status: row.status as string,
    paidAt: row.paid_at as string | null,
    createdAt: row.created_at as string,
  }
}

export async function fetchInvoices(tenantId: string): Promise<Invoice[]> {
  const { data, error } = await supabase
    .from('invoices')
    .select('*, customers(first_name, last_name)')
    .eq('tenant_id', tenantId)
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)
  return (data || []).map((row: Record<string, unknown>) => {
    const invoice = mapInvoiceRow(row)
    const customer = row.customers as Record<string, unknown> | null
    if (customer) {
      invoice.customerName = `${customer.first_name} ${customer.last_name}`
    }
    return invoice
  })
}

export async function createInvoice(tenantId: string, formData: InvoiceFormData): Promise<Invoice> {
  const subtotal = formData.items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0)
  const vatAmount = subtotal * 0.15
  const total = subtotal + vatAmount

  const count = await supabase.from('invoices').select('id', { count: 'exact', head: true }).eq('tenant_id', tenantId)
  const invoiceNumber = `INV-${String((count.count || 0) + 1).padStart(4, '0')}`

  const { data, error } = await supabase
    .from('invoices')
    .insert({
      tenant_id: tenantId,
      customer_id: formData.customerId,
      deal_id: formData.dealId || null,
      invoice_number: invoiceNumber,
      status: 'draft',
      subtotal,
      vat_amount: vatAmount,
      total,
      due_date: formData.dueDate || null,
    })
    .select()
    .single()

  if (error) throw new Error(error.message)

  const items = formData.items.map((item) => ({
    invoice_id: data.id,
    description: item.description,
    description_ar: item.descriptionAr || null,
    quantity: item.quantity,
    unit_price: item.unitPrice,
    total: item.quantity * item.unitPrice,
  }))

  const { error: itemsError } = await supabase.from('invoice_items').insert(items)
  if (itemsError) throw new Error(itemsError.message)

  return mapInvoiceRow(data)
}

export async function updateInvoiceStatus(invoiceId: string, status: string): Promise<void> {
  const updates: Record<string, unknown> = { status }
  if (status === 'paid') updates.paid_at = new Date().toISOString()
  const { error } = await supabase.from('invoices').update(updates).eq('id', invoiceId)
  if (error) throw new Error(error.message)
}

export async function fetchPayments(tenantId: string): Promise<Payment[]> {
  const { data, error } = await supabase
    .from('payments')
    .select('*, invoices(invoice_number, customers(first_name, last_name))')
    .eq('tenant_id', tenantId)
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)
  return (data || []).map((row: Record<string, unknown>) => {
    const payment = mapPaymentRow(row)
    const invoice = row.invoices as Record<string, unknown> | null
    if (invoice) {
      payment.invoiceNumber = invoice.invoice_number as string
      const customer = invoice.customers as Record<string, unknown> | null
      if (customer) payment.customerName = `${customer.first_name} ${customer.last_name}`
    }
    return payment
  })
}

export async function recordPayment(tenantId: string, formData: PaymentFormData): Promise<Payment> {
  const { data, error } = await supabase
    .from('payments')
    .insert({
      tenant_id: tenantId,
      invoice_id: formData.invoiceId,
      amount: formData.amount,
      method: formData.method,
      reference: formData.reference || null,
      status: 'completed',
      paid_at: new Date().toISOString(),
    })
    .select()
    .single()

  if (error) throw new Error(error.message)
  return mapPaymentRow(data)
}
