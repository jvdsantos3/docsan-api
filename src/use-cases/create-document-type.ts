import { DocumentTypesRepository } from '@/database/repositories/document-types-repository'
import { Injectable } from '@nestjs/common'
import { DocumentType, Prisma } from '@prisma/client'
import { DocumetTypeAlreadyExistsError } from './errors/document-type-already-exists-error'
import { DocumetTypeLimitError } from './errors/document-type-limit-error'
import { Field } from './interfaces/document'
import { User } from './interfaces/use'
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
  constructor(private documentTypesRepository: DocumentTypesRepository) {}

  async execute({
    companyId,
    name,
    fields,
  }: CreateDocumentTypeUseCaseRequest): Promise<CreateDocumentTypeUseCaseResponse> {
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

    return {
      documentType,
    }
  }
}
