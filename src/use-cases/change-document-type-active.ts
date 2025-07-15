import { DocumentTypesRepository } from '@/database/repositories/document-types-repository'
import { Injectable } from '@nestjs/common'
import { DocumentType } from '@prisma/client'

interface FetchDocumentTypesUseCaseRequest {
  documentTypeId: string
}

interface FetchDocumentTypesUseCaseResponse {
  documentType: DocumentType
}

@Injectable()
export class ChangeDocumentTypeActiveUseCase {
  constructor(private documentTypesRepository: DocumentTypesRepository) {}

  async execute({
    documentTypeId,
  }: FetchDocumentTypesUseCaseRequest): Promise<FetchDocumentTypesUseCaseResponse> {
    const documentType =
      await this.documentTypesRepository.findById(documentTypeId)

    if (!documentType) {
      // TODO
      throw new Error('Document type not found.')
    }

    documentType.active = !documentType.active

    const newDocumentType =
      await this.documentTypesRepository.save(documentType)

    return {
      documentType: newDocumentType,
    }
  }
}
