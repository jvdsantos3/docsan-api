import { DocumentTypesRepository } from '@/database/repositories/document-types-repository'
import { Injectable } from '@nestjs/common'
import { DocumentType, Prisma } from '@prisma/client'
import { DocumetTypeAlreadyExistsError } from './errors/document-type-already-exists-error'
import { DocumetTypeLimitError } from './errors/document-type-limit-error'
import { OwnersRepository } from '@/database/repositories/owners-repository'
import { Field } from './interfaces/document-type'

interface User {
  sub: string
  role: 'PROFESSIONAL' | 'OWNER'
}

interface CreateDocumentTypeUseCaseRequest {
  user: User
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
    private ownersRepository: OwnersRepository,
  ) {}

  async execute({
    user,
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

    const userId = user.sub
    let companyId: string

    if (user.role === 'OWNER') {
      const owner = await this.ownersRepository.findById(userId)

      // TODO
      if (!owner) {
        throw new Error('User not found')
      }

      companyId = owner?.companyId
    } else {
      companyId = '1'
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
