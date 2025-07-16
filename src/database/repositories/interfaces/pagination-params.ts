export interface PaginationParams {
  page: number
  limit?: number
  order?: 'desc' | 'asc'
}

export interface PaginationResponse {
  first: number | null
  last: number
  current: number
  next: number | null
  prev: number | null
  total: number
}
