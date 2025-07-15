import { DocumentTypesRepository } from '@/database/repositories/document-types-repository'
import { Injectable } from '@nestjs/common'
import { DocumentType } from '@prisma/client'

interface ChangeDocumentTypeUseCaseRequest {
  documentTypeId: string
}

interface ChangeDocumentTypeUseCaseResponse {
  documentType: DocumentType
}

@Injectable()
export class ChangeDocumentTypeActiveUseCase {
  constructor(private documentTypesRepository: DocumentTypesRepository) {}

  async execute({
    documentTypeId,
  }: ChangeDocumentTypeUseCaseRequest): Promise<ChangeDocumentTypeUseCaseResponse> {
    const documentType =
      await this.documentTypesRepository.findById(documentTypeId)

    if (!documentType) {
      // TODO
      throw new Error('Document type not found.')
    }

    documentType.isActive = !documentType.isActive

    const newDocumentType =
      await this.documentTypesRepository.save(documentType)

    return {
      documentType: newDocumentType,
    }
  }
}
