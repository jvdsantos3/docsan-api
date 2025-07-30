export interface PaginationParams<T> {
  page: number
  limit?: number
  order?: 'desc' | 'asc'
  orderBy?: T
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
