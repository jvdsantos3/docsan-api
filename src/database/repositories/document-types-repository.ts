import { DocumentType, Prisma } from '@prisma/client'
import { PaginationParams } from './interfaces/pagination-params'

export interface FindManyFilters {
  filter?: string
  active?: boolean
}

export abstract class DocumentTypesRepository {
  abstract findById(id: string): Promise<DocumentType | null>
  abstract findByName(name: string): Promise<DocumentType | null>
  abstract findMany(
    params: PaginationParams & FindManyFilters,
  ): Promise<DocumentType[]>
  abstract create(
    data: Prisma.DocumentTypeUncheckedCreateInput,
    prisma?: Prisma.TransactionClient,
  ): Promise<DocumentType>
  abstract save(documentType: DocumentType): Promise<DocumentType>
}
