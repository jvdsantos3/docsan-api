import { PaginationResponse } from './../database/repositories/interfaces/pagination-params'
import { DocumentTypesRepository } from '@/database/repositories/document-types-repository'
import { Injectable } from '@nestjs/common'
import { DocumentType } from '@prisma/client'

interface FetchDocumentTypesUseCaseRequest {
  page: number
  limit?: number
  order?: 'desc' | 'asc'
  active?: boolean
  filter?: string
}

interface FetchDocumentTypesUseCaseResponse extends PaginationResponse {
  data: DocumentType[]
}

@Injectable()
export class FetchDocumentTypesUseCase {
  constructor(private documentTypesRepository: DocumentTypesRepository) {}

  async execute({
    page,
    limit,
    order,
    active,
    filter,
  }: FetchDocumentTypesUseCaseRequest): Promise<FetchDocumentTypesUseCaseResponse> {
    const documentTypes = await this.documentTypesRepository.findMany({
      page,
      limit,
      order,
      active,
      filter,
    })

    return documentTypes
  }
}
