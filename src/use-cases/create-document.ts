import { Injectable } from '@nestjs/common'
import { DocumentTypesRepository } from '@/database/repositories/document-types-repository'
import { Field, Indexation } from './interfaces/document'
import { Document, Prisma } from '@prisma/client'
import { Uploader } from '@/storage/upload'
import { PrismaService } from '@/database/prisma.service'
import { DocumentsRepository } from '@/database/repositories/documents-repository'
import { User } from './interfaces/use'
import { OwnersRepository } from '@/database/repositories/owners-repository'
import { IndexationsRepository } from '@/database/repositories/indexations-repository'
import { randomUUID } from 'node:crypto'

interface CreateDocumentUseCaseRequest {
  user: User
  documentTypeId: string
  fileName: string
  fileType: string
  body: Buffer
  fields: Indexation[]
}

interface CreateDocumentUseCaseResponse {
  document: Document
}

@Injectable()
export class CreateDocumentUseCase {
  constructor(
    private prisma: PrismaService,
    private ownersRepository: OwnersRepository,
    private documentTypesRepository: DocumentTypesRepository,
    private documentsRepository: DocumentsRepository,
    private indexationsRepository: IndexationsRepository,
    private uploader: Uploader,
  ) {}

  async execute({
    user,
    documentTypeId,
    fileName,
    fileType,
    body,
    fields,
  }: CreateDocumentUseCaseRequest): Promise<CreateDocumentUseCaseResponse> {
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

    const documentType =
      await this.documentTypesRepository.findById(documentTypeId)

    if (!documentType) {
      // TODO
      throw new Error('Document type not found.')
    }

    const metadata = documentType.metadata as unknown as Field[]

    const missingRequiredFields = metadata
      .filter((field) => field.required)
      .filter((field) => !fields.some((index) => index.name === field.name))

    if (missingRequiredFields.length > 0) {
      throw new Error(
        `Missing required fields: ${missingRequiredFields
          .map((field) => field.name)
          .join(', ')}`,
      )
    }

    const invalidFields = fields.filter(
      (index) => !metadata.some((field) => field.name === index.name),
    )

    if (invalidFields.length > 0) {
      throw new Error(
        `Invalid fields provided: ${invalidFields
          .map((index) => index.name)
          .join(', ')}`,
      )
    }

    const indexation = metadata.map((field) => ({
      name: field.name,
      value: fields.find((index) => index.name === field.name)?.value || null,
      type: field.type,
      required: field.required,
    })) as Prisma.InputJsonValue

    const { url } = await this.uploader.upload({
      fileName: `documents/${randomUUID()}-${fileName}`,
      fileType,
      body,
    })

    const document = await this.prisma.$transaction(async (prisma) => {
      const lastDocument =
        await this.documentsRepository.findFirstByDocumentId(documentTypeId)

      const version = lastDocument ? lastDocument.version + 1 : 1

      const document = await this.documentsRepository.create(
        {
          companyId,
          documentTypeId,
          name: fileName,
          url,
          version,
        },
        prisma,
      )

      await this.indexationsRepository.create(
        {
          documentId: document.id,
          values: indexation,
        },
        prisma,
      )

      return document
    })

    return {
      document,
    }
  }
}
