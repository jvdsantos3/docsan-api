import { Injectable } from '@nestjs/common'
import { Field } from './interfaces/document-type'
import { DocumentType, Prisma } from '@prisma/client'
import { DocumentTypesRepository } from '@/database/repositories/document-types-repository'

interface EditDocumentTypeUseCaseRequest {
  name: string
  fields: Field[] | Prisma.JsonArray
}

interface EditDocumentTypeUseCaseResponse {
  documentType: DocumentType
}

@Injectable()
export class EditQuestionUseCase {
  constructor(private documentTypesRepository: DocumentTypesRepository) {}

  async execute({ name, fields }: EditDocumentTypeUseCaseRequest) {}
}
