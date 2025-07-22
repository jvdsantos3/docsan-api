import { DocumentTypesRepository } from '@/database/repositories/document-types-repository'
import { Injectable } from '@nestjs/common'
import { DocumentType, Prisma } from '@prisma/client'
import { DocumetTypeAlreadyExistsError } from './errors/document-type-already-exists-error'
import { DocumetTypeLimitError } from './errors/document-type-limit-error'
import { Field } from './interfaces/document'
import { User } from './interfaces/use'
import { AuthzService } from '@/authz/authz.service'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { DocumentTypeCreatedEvent } from '@/events/document-type-created.event'
interface CreateDocumentTypeUseCaseRequest {
  user: User
  companyId: string
  name: string
  fields: Field[] | Prisma.JsonArray
}

interface CreateDocumentTypeUseCaseResponse {
  documentType: DocumentType
}

@Injectable()
export class CreateDocumentTypeUseCase {
  constructor(
    private documentTypesRepository: DocumentTypesRepository,
    private authzService: AuthzService,
    private eventEmitter: EventEmitter2,
  ) {}

  async execute({
    user,
    companyId,
    name,
    fields,
  }: CreateDocumentTypeUseCaseRequest): Promise<CreateDocumentTypeUseCaseResponse> {
    await this.authzService.checkPermission(
      user,
      companyId,
      'document-type.create',
    )

    const documentTypeWithSameName =
      await this.documentTypesRepository.findByName(name)

    if (documentTypeWithSameName) {
      throw new DocumetTypeAlreadyExistsError(name)
    }

    if (fields.length > 7) {
      throw new DocumetTypeLimitError(7)
    }

    const data = {
      name,
      metadata: fields as Prisma.InputJsonValue,
      companyId,
    }

    const documentType = await this.documentTypesRepository.create(data)

    this.eventEmitter.emit(
      'document-type.created',
      new DocumentTypeCreatedEvent(user, companyId, documentType.id),
    )

    return {
      documentType,
    }
  }
}
