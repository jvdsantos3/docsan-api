import { DocumentTypesRepository } from "@/database/repositories/document-types-repository";
import { Injectable } from "@nestjs/common";

interface FetchDocumentTypesUseCaseRequest {
  documentTypeId: string
}

@Injectable()
export class DeleteDocumentTypeUseCase {
  constructor(private documentTypesRepository: DocumentTypesRepository) {}

  async execute({ documentTypeId }: FetchDocumentTypesUseCaseRequest): Promise<void> {
    const documentType = await this.documentTypesRepository.findByIdWithDocuments(documentTypeId)

    if (!documentType) {
      // TODO
      throw new Error('Document type not found.')
    }

    if (documentType.documents.length) {
      throw new Error('It is not possible to delete a document type with linked documents')
    }

    await this.documentTypesRepository.delete(documentType)
  }
}