import { Document, Prisma } from '@prisma/client'
import {
  PaginationParams,
  PaginationResponse,
} from './interfaces/pagination-params'

export interface FindManyFilters {
  companyId?: string
  status?: 'inDay' | 'near' | 'won'
  type?: string
  filter?: string
}

export abstract class DocumentsRepository {
  abstract findById(id: string): Promise<Document | null>
  abstract findFirstByDocumentId(id: string): Promise<Document | null>
  abstract findMany(
    params: PaginationParams & FindManyFilters,
  ): Promise<PaginationResponse<Document>>
  abstract fetchByDocumentTypeId(id: string): Promise<Document[]>
  abstract create(
    data: Prisma.DocumentUncheckedCreateInput,
    prisma?: Prisma.TransactionClient,
  ): Promise<Document>
  abstract calculateStatus(dueDateStr: string): 'inDay' | 'near' | 'won'
}
