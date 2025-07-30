import { Prisma } from '@prisma/client'

export type DocumentBase = Prisma.DocumentGetPayload<{
  include: {
    indexation: true
    documentType: true
    documentNotification: true
  }
}>

export interface DocumentComputedProps {
  status: 'Up_to_date' | 'Due_soon' | 'Overdue'
}

export type DocumentWithComputed = DocumentBase & DocumentComputedProps
