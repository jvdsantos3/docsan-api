import { Injectable } from '@nestjs/common'
import { Field } from './interfaces/document-type'
import { DocumentType, Prisma } from '@prisma/client'
import { DocumentTypesRepository } from '@/database/repositories/document-types-repository'
import { DocumetTypeAlreadyExistsError } from './errors/document-type-already-exists-error'

interface EditDocumentTypeUseCaseRequest {
  documentTypeId: string
  name: string
  fields?: Field[] | Prisma.JsonArray
}

interface EditDocumentTypeUseCaseResponse {
  documentType: DocumentType
}

@Injectable()
export class EditDocumentTypeUseCase {
  constructor(private documentTypesRepository: DocumentTypesRepository) {}

  async execute({
    documentTypeId,
    name,
    fields,
  }: EditDocumentTypeUseCaseRequest): Promise<EditDocumentTypeUseCaseResponse> {
    const documentType =
      await this.documentTypesRepository.findByIdWithDocuments(documentTypeId)

    if (!documentType) {
      // TODO
      throw new Error('Document type not found.')
    }

    const documentTypeWithSameName =
      await this.documentTypesRepository.findByName(name)

    if (
      documentTypeWithSameName &&
      documentTypeWithSameName.id !== documentType?.id
    ) {
      throw new DocumetTypeAlreadyExistsError(name)
    }

    if (documentType.documents.length && fields) {
      // TODO
      throw new Error(
        'It is not possible to delete a document type with linked documents',
      )
    }

    documentType.name = name

    if (fields) {
      documentType.metadata = fields as Prisma.JsonValue
    }

    const newDocumentType =
      await this.documentTypesRepository.save(documentType)

    return {
      documentType: newDocumentType,
    }
  }
}
