import { DocumentsRepository } from '@/database/repositories/documents-repository'
import { Injectable } from '@nestjs/common'
import { DocumentType, Prisma } from '@prisma/client'

interface FetchDocumentTypeDocumentsUseCaseRequest {
  documentTypeId: string
}

interface FetchDocumentTypeDocumentsUseCaseResponse {
  documents: Prisma.DocumentGetPayload<{
    include: {
      documentType: true
    }
  }>[]
}

@Injectable()
export class FetchDocumentTypeDocumentsUseCase {
  constructor(private documentsRepository: DocumentsRepository) {}

  async execute({
    documentTypeId,
  }: FetchDocumentTypeDocumentsUseCaseRequest): Promise<FetchDocumentTypeDocumentsUseCaseResponse> {
    const documents =
      await this.documentsRepository.findManyByDocumentId(documentTypeId)

    return {
      documents,
    }
  }
}
