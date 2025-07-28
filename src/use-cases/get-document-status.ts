import { differenceInDays, isBefore } from 'date-fns'

export function getDocumentStatus(
  duedate: Date,
  validityPeriod: number,
): 'Em dia' | 'Próximo do vencimento' | 'Vencido' {
  const today = new Date()

  if (isBefore(duedate, today)) return 'Vencido'

  const days = differenceInDays(duedate, today)

  if (days <= validityPeriod) return 'Próximo do vencimento'

  return 'Em dia'
}

export function getDocumentStatusUnformated(
  duedate: Date,
  validityPeriod: number,
): 'inDay' | 'near' | 'won' {
  const today = new Date()

  if (isBefore(duedate, today)) return 'won'

  const days = differenceInDays(duedate, today)

  if (days <= validityPeriod) return 'near'

  return 'inDay'
}
