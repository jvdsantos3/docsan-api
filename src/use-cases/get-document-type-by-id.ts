import { DocumentTypesRepository } from '@/database/repositories/document-types-repository'
import { Injectable } from '@nestjs/common'
import { DocumentType } from '@prisma/client'
import { DocumentTypeNotFoundError } from './errors/document-type-not-found-error'

interface GetDocumentTypeByIdUseCaseRequest {
  documentTypeId: string
}

interface GetDocumentTypeByIdUseCaseResponse {
  documentType: DocumentType
}

@Injectable()
export class GetDocumentTypeByIdUseCase {
  constructor(private documentTypesRepository: DocumentTypesRepository) {}

  async execute({
    documentTypeId,
  }: GetDocumentTypeByIdUseCaseRequest): Promise<GetDocumentTypeByIdUseCaseResponse> {
    const documentType =
      await this.documentTypesRepository.findById(documentTypeId)

    if (!documentType) {
      throw new DocumentTypeNotFoundError()
    }

    return {
      documentType,
    }
  }
}
