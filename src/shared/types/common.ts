export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export interface PaginationParams {
  page: number
  pageSize: number
}

export interface SortParams {
  field: string
  direction: 'asc' | 'desc'
}

export interface FilterParams {
  [key: string]: string | number | boolean | string[] | undefined
}

export interface ApiError {
  message: string
  messageAr?: string
  code?: string
  status?: number
}

export interface SelectOption {
  value: string
  label: string
  labelAr?: string
}

export interface BreadcrumbItem {
  label: string
  labelAr?: string
  href?: string
}

export type LoadingState = 'idle' | 'loading' | 'success' | 'error'

export interface EntityTimestamps {
  createdAt: string
  updatedAt: string
}
