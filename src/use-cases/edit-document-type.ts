import { Injectable } from '@nestjs/common'
import { DocumentType, Prisma } from '@prisma/client'
import { DocumentTypesRepository } from '@/database/repositories/document-types-repository'
import { DocumetTypeAlreadyExistsError } from './errors/document-type-already-exists-error'
import { Field } from './interfaces/document'
import { DocumentTypeNotFoundError } from './errors/document-type-not-found-error'
import { UserPayload } from '@/auth/jwt.strategy'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { DocumetTypeFieldsLenghtError } from './errors/document-type-fields-length-error'
import { DocumetTypeLimitError } from './errors/document-type-limit-error'
import { NotEditDocumetTypeWithDocumentsError } from './errors/not-edit-document-type-with-documents-error'
import { DocumentTypeEvent } from '@/events/document-type.event'

interface EditDocumentTypeUseCaseRequest {
  user: UserPayload
  companyId: string
  documentTypeId: string
  name: string
  fields: Field[] | Prisma.JsonArray
}

interface EditDocumentTypeUseCaseResponse {
  documentType: DocumentType
}

@Injectable()
export class EditDocumentTypeUseCase {
  constructor(
    private documentTypesRepository: DocumentTypesRepository,
    private eventEmitter: EventEmitter2,
  ) {}

  async execute({
    user,
    companyId,
    documentTypeId,
    name,
    fields,
  }: EditDocumentTypeUseCaseRequest): Promise<EditDocumentTypeUseCaseResponse> {
    const currentDocumentType =
      await this.documentTypesRepository.findById(documentTypeId)

    if (!currentDocumentType) {
      throw new DocumentTypeNotFoundError()
    }

    const documentTypeWithSameName =
      await this.documentTypesRepository.findByName(name, companyId)

    if (documentTypeWithSameName) {
      throw new DocumetTypeAlreadyExistsError(name)
    }

    if (fields.length === 0) {
      throw new DocumetTypeFieldsLenghtError()
    }

    if (fields.length > 7) {
      throw new DocumetTypeLimitError(7)
    }

    const fieldsChanged =
      JSON.stringify(currentDocumentType.metadata) !== JSON.stringify(fields)

    if (fieldsChanged && currentDocumentType._count.documents) {
      throw new NotEditDocumetTypeWithDocumentsError()
    }

    const newDocumentType = await this.documentTypesRepository.save({
      id: documentTypeId,
      name,
      metadata: fields as Prisma.JsonArray,
    })

    this.eventEmitter.emit(
      'document-type.updated',
      new DocumentTypeEvent(newDocumentType.id, companyId, user.sub),
    )

    return {
      documentType: newDocumentType,
    }
  }
}
