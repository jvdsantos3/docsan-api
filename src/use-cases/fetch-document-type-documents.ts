import { PaginationResponse } from '@/database/interfaces/pagination-params'
import { DocumentsRepository } from '@/database/repositories/documents-repository'
import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'

interface FetchDocumentTypeDocumentsUseCaseRequest {
  documentTypeId: string
  page: number
  limit?: number
  order?: 'desc' | 'asc'
  orderBy?: 'name' | 'createdAt'
  filter?: string
}

interface FetchDocumentTypeDocumentsUseCaseResponse {
  documents: PaginationResponse<
    Prisma.DocumentGetPayload<{
      include: {
        documentType: true
      }
    }> & {
      status: 'inDay' | 'near' | 'won'
    }
  >
}

@Injectable()
export class FetchDocumentTypeDocumentsUseCase {
  constructor(private documentsRepository: DocumentsRepository) {}

  async execute({
    documentTypeId,
    page,
    limit,
    order,
    orderBy,
    filter,
  }: FetchDocumentTypeDocumentsUseCaseRequest): Promise<FetchDocumentTypeDocumentsUseCaseResponse> {
    const documents =
      await this.documentsRepository.fetchByDocumentTypeIdPagination({
        documentTypeId,
        page,
        limit,
        order,
        orderBy,
        filter,
      })

    return {
      documents,
    }
  }
}
