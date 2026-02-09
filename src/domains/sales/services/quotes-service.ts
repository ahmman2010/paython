import { supabase } from '@/lib/supabase'
import { VAT_RATE } from '@/config/constants'
import type { Quote, QuoteFormData } from '../types/quote-types'

function mapQuoteRow(row: Record<string, unknown>): Quote {
  return {
    id: row.id as string,
    tenantId: row.tenant_id as string,
    dealId: row.deal_id as string | null,
    customerId: row.customer_id as string,
    quoteNumber: row.quote_number as string,
    status: row.status as string,
    subtotal: row.subtotal as number,
    vatAmount: row.vat_amount as number,
    total: row.total as number,
    discountAmount: row.discount_amount as number,
    notes: row.notes as string | null,
    validUntil: row.valid_until as string | null,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  }
}

export async function fetchQuotes(tenantId: string): Promise<Quote[]> {
  const { data, error } = await supabase
    .from('quotes')
    .select('*')
    .eq('tenant_id', tenantId)
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)
  return (data || []).map(mapQuoteRow)
}

export async function createQuote(tenantId: string, formData: QuoteFormData): Promise<Quote> {
  const subtotal = formData.items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0)
  const afterDiscount = subtotal - (formData.discountAmount || 0)
  const vatAmount = afterDiscount * VAT_RATE
  const total = afterDiscount + vatAmount

  const quoteNumber = `QT-${Date.now().toString(36).toUpperCase()}`

  const { data: quote, error } = await supabase
    .from('quotes')
    .insert({
      tenant_id: tenantId,
      customer_id: formData.customerId,
      deal_id: formData.dealId || null,
      quote_number: quoteNumber,
      status: 'draft',
      subtotal,
      vat_amount: vatAmount,
      total,
      discount_amount: formData.discountAmount || 0,
      notes: formData.notes || null,
      valid_until: formData.validUntil || null,
    })
    .select()
    .single()

  if (error) throw new Error(error.message)

  const items = formData.items.map((item) => ({
    quote_id: quote.id,
    description: item.description,
    description_ar: item.descriptionAr || null,
    quantity: item.quantity,
    unit_price: item.unitPrice,
    total: item.quantity * item.unitPrice,
  }))

  await supabase.from('quote_items').insert(items)

  return mapQuoteRow(quote)
}

export async function updateQuoteStatus(quoteId: string, status: string): Promise<Quote> {
  const { data, error } = await supabase
    .from('quotes')
    .update({ status })
    .eq('id', quoteId)
    .select()
    .single()

  if (error) throw new Error(error.message)
  return mapQuoteRow(data)
}
