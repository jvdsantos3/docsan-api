import { DocumentTypesRepository } from '@/database/repositories/document-types-repository'
import { Injectable } from '@nestjs/common'
import { DocumentType } from '@prisma/client'

interface FetchDocumentTypesUseCaseRequest {
  page: number
  limit?: number
  order?: 'desc' | 'asc'
}

interface FetchDocumentTypesUseCaseResponse {
  documentTypes: DocumentType[]
}

@Injectable()
export class FetchDocumentTypesUseCase {
  constructor(private documentTypesRepository: DocumentTypesRepository) {}

  async execute({
    page,
    limit,
    order,
  }: FetchDocumentTypesUseCaseRequest): Promise<FetchDocumentTypesUseCaseResponse> {
    const documentTypes = await this.documentTypesRepository.findMany({
      page,
      limit,
      order,
    })

    return {
      documentTypes,
    }
  }
}
