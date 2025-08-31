import { PaginationResponse } from '../database/interfaces/pagination-params'
import { DocumentTypesRepository } from '@/database/repositories/document-types-repository'
import { Injectable } from '@nestjs/common'
import { DocumentType } from '@prisma/client'

interface FetchDocumentTypesUseCaseRequest {
  companyId: string
  page: number
  limit?: number
  order?: 'desc' | 'asc'
  active?: boolean
  filter?: string
}

interface FetchDocumentTypesUseCaseResponse {
  documentTypes: PaginationResponse<DocumentType>
}

@Injectable()
export class FetchDocumentTypesUseCase {
  constructor(private documentTypesRepository: DocumentTypesRepository) {}

  async execute({
    companyId,
    page,
    limit,
    order,
    active,
    filter,
  }: FetchDocumentTypesUseCaseRequest): Promise<FetchDocumentTypesUseCaseResponse> {
    const documentTypes = await this.documentTypesRepository.fetchPagination({
      companyId,
      page,
      limit,
      order,
      active,
      filter,
    })

    return {
      documentTypes,
    }
  }
}
