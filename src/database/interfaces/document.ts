import { Prisma } from '@prisma/client'

export type DocumentBase = Prisma.DocumentGetPayload<{
  include: {
    indexation: true
    documentType: true
  }
}>

export interface DocumentComputedProps {
  status: 'Em dia' | 'Próximo do vencimento' | 'Vencido'
}

export type DocumentWithComputed = DocumentBase & DocumentComputedProps
