import { DocumentTypesRepository } from '@/database/repositories/document-types-repository'
import { Injectable } from '@nestjs/common'
import { DocumentTypeNotFoundError } from './errors/document-type-not-found-error'
import { NotDeleteDocumetTypeWithDocumentsError } from './errors/not-delete-document-type-with-documents-error'

interface DeleteDocumentTypeUseCaseRequest {
  documentTypeId: string
}

@Injectable()
export class DeleteDocumentTypeUseCase {
  constructor(private documentTypesRepository: DocumentTypesRepository) {}

  async execute({
    documentTypeId,
  }: DeleteDocumentTypeUseCaseRequest): Promise<void> {
    const documentType =
      await this.documentTypesRepository.findById(documentTypeId)

    if (!documentType) {
      throw new DocumentTypeNotFoundError()
    }

    if (documentType._count.documents) {
      throw new NotDeleteDocumetTypeWithDocumentsError()
    }

    await this.documentTypesRepository.delete(documentType)
  }
}
