import { differenceInDays, isBefore } from 'date-fns'

export function getDocumentStatus(
  duedate: Date,
  validityPeriod: number,
): 'Up_to_date' | 'Due_soon' | 'Overdue' {
  const today = new Date()

  if (isBefore(duedate, today)) return 'Overdue'

  const days = differenceInDays(duedate, today)

  if (days <= validityPeriod) return 'Due_soon'

  return 'Up_to_date'
}

export function getDocumentStatusUnformated(
  duedate: Date,
  validityPeriod: number,
): 'up_to_date' | 'due_soon' | 'overdue' {
  const today = new Date()

  if (isBefore(duedate, today)) return 'overdue'

  const days = differenceInDays(duedate, today)

  if (days <= validityPeriod) return 'due_soon'

  return 'up_to_date'
}
