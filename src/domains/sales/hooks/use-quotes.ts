import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchQuotes, createQuote, updateQuoteStatus } from '../services/quotes-service'
import type { QuoteFormData } from '../types/quote-types'

export function useQuotes(tenantId: string) {
  return useQuery({
    queryKey: ['quotes', tenantId],
    queryFn: () => fetchQuotes(tenantId),
    enabled: !!tenantId,
  })
}

export function useCreateQuote(tenantId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: QuoteFormData) => createQuote(tenantId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quotes', tenantId] })
    },
  })
}

export function useUpdateQuoteStatus(tenantId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ quoteId, status }: { quoteId: string; status: string }) => updateQuoteStatus(quoteId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quotes', tenantId] })
    },
  })
}
