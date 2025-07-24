import { Prisma } from '@prisma/client'

export type DocumentBase = Prisma.DocumentGetPayload<{
  include: {
    documentType: true
    indexation: true
  }
}>

export type DocumentWithExtras = DocumentBase & {
  status: 'inDay' | 'near' | 'won'
  duedate: string | null
}
