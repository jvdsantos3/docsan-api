interface PaginateParams<T> {
  data: T
  total: number
  page: number
  limit?: number
}

export function paginate<T>({
  data,
  total,
  page,
  limit = 15,
}: PaginateParams<T>) {
  const current = page
  const first = total > 0 ? 1 : null
  const last = Math.ceil(total / limit)
  const next = page < last ? page + 1 : null
  const prev = page > 1 ? page - 1 : null

  return {
    data,
    first,
    last,
    current,
    next,
    prev,
    total,
  }
}
