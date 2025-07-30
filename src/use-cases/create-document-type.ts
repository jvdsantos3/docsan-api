import { DocumentTypesRepository } from '@/database/repositories/document-types-repository'
import { Injectable } from '@nestjs/common'
import { DocumentType, Prisma } from '@prisma/client'
import { DocumetTypeAlreadyExistsError } from './errors/document-type-already-exists-error'
import { DocumetTypeLimitError } from './errors/document-type-limit-error'
import { Field } from './interfaces/document'
import { DocumetTypeFieldsLenghtError } from './errors/document-type-fields-length-error'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { DocumentTypeEvent } from '@/events/document-type.event'
import { UserPayload } from '@/auth/jwt.strategy'
interface CreateDocumentTypeUseCaseRequest {
  user: UserPayload
  companyId: string
  name: string
  validityPeriod: number
  prompt: string
  fields: Field[] | Prisma.JsonArray
}

interface CreateDocumentTypeUseCaseResponse {
  documentType: DocumentType
}

@Injectable()
export class CreateDocumentTypeUseCase {
  constructor(
    private documentTypesRepository: DocumentTypesRepository,
    private eventEmitter: EventEmitter2,
  ) {}

  async execute({
    user,
    companyId,
    name,
    validityPeriod,
    prompt,
    fields,
  }: CreateDocumentTypeUseCaseRequest): Promise<CreateDocumentTypeUseCaseResponse> {
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

    const data = {
      name,
      validityPeriod,
      prompt,
      metadata: fields as Prisma.JsonArray,
      companyId,
    }

    const documentType = await this.documentTypesRepository.create(data)

    this.eventEmitter.emit(
      'document-type.created',
      new DocumentTypeEvent(documentType.id, companyId, user.sub),
    )

    return {
      documentType,
    }
  }
}
