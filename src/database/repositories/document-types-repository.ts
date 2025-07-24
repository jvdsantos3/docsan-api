import { Document, DocumentType, Prisma } from '@prisma/client'
import {
  PaginationParams,
  PaginationResponse,
} from './interfaces/pagination-params'

export interface FindManyFilters {
  filter?: string
  active?: boolean
}

export abstract class DocumentTypesRepository {
  abstract findById(id: string): Promise<DocumentType | null>
  abstract findByIdWithDocuments(
    id: string,
  ): Promise<(DocumentType & { documents: Document[] }) | null>
  abstract findByName(name: string): Promise<DocumentType | null>
  abstract findMany(
    params: PaginationParams & FindManyFilters,
  ): Promise<PaginationResponse<DocumentType>>
  abstract create(
    data: Prisma.DocumentTypeUncheckedCreateInput,
    prisma?: Prisma.TransactionClient,
  ): Promise<DocumentType>
  abstract save(
    documentType: DocumentType,
    prisma?: Prisma.TransactionClient,
  ): Promise<DocumentType>
  abstract delete(documentType: DocumentType): Promise<void>
}
