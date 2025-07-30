import { DocumentTypesRepository } from '@/database/repositories/document-types-repository'
import { Injectable } from '@nestjs/common'
import { DocumentType } from '@prisma/client'
import { DocumentTypeNotFoundError } from './errors/document-type-not-found-error'

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
      throw new DocumentTypeNotFoundError()
    }

    const newDocumentType = await this.documentTypesRepository.save({
      id: documentType.id,
      isActive: !documentType.isActive,
    })

    return {
      documentType: newDocumentType,
    }
  }
}
