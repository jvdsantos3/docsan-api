export interface PaginationParams {
  page: number
  limit?: number
  order?: 'desc' | 'asc'
  orderBy?: string
}

export interface PaginationResponse<T> {
  data: T[]
  first: number | null
  last: number
  current: number
  next: number | null
  prev: number | null
  total: number
}
