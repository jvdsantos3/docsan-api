import { Prisma } from '@prisma/client'

export type DocumentBase = Prisma.DocumentGetPayload<{
  include: {
    indexation: true
    documentType: true
  }
}>

export interface DocumentWithDuedate {
  duedate: Date | null
  status: 'inDay' | 'near' | 'won' | null
}

export type DocumentWithComputed = DocumentBase & DocumentWithDuedate
