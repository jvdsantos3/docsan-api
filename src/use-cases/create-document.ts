import { BadRequestException, Injectable } from '@nestjs/common'
import { DocumentTypesRepository } from '@/database/repositories/document-types-repository'
import { Field, Indexation } from './interfaces/document'
import { Document, Prisma } from '@prisma/client'
import { Uploader } from '@/storage/upload'
import { PrismaService } from '@/database/prisma.service'
import { DocumentsRepository } from '@/database/repositories/documents-repository'
import { IndexationsRepository } from '@/database/repositories/indexations-repository'
import { randomUUID } from 'node:crypto'
import { UserPayload } from '@/auth/jwt.strategy'
import { UsersRepository } from '@/database/repositories/users-repository'
import { DocumentTypeNotFoundError } from './errors/document-type-not-found-error'
import { UserNotFoundError } from './errors/user-not-found-error'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { DocumentEvent } from '@/events/document.event'

interface CreateDocumentUseCaseRequest {
  payload: UserPayload
  companyId: string
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
    private usersRepository: UsersRepository,
    private documentTypesRepository: DocumentTypesRepository,
    private documentsRepository: DocumentsRepository,
    private indexationsRepository: IndexationsRepository,
    private uploader: Uploader,
    private eventEmitter: EventEmitter2,
  ) {}

  async execute({
    payload,
    companyId,
    documentTypeId,
    fileName,
    fileType,
    body,
    fields,
  }: CreateDocumentUseCaseRequest): Promise<CreateDocumentUseCaseResponse> {
    const user = await this.usersRepository.findById(payload.sub)

    if (!user) {
      throw new UserNotFoundError()
    }

    const documentType =
      await this.documentTypesRepository.findById(documentTypeId)

    if (!documentType) {
      throw new DocumentTypeNotFoundError()
    }

    const metadata = documentType.metadata as unknown as Field[]

    const parsedFields: Indexation[] = []

    const missingRequiredFields = metadata.filter((data) => {
      const rawValue = fields.find((field) => field.name === data.name)

      if (!rawValue || (rawValue && !rawValue.value)) {
        return data.required
      }

      switch (data.type) {
        case 'text': {
          parsedFields.push({
            name: data.name,
            value: rawValue.value.trim(),
          })

          return false
        }
        case 'number': {
          const parsedNumber = Number(rawValue.value)

          if (isNaN(parsedNumber)) return true

          parsedFields.push({
            name: data.name,
            value: parsedNumber,
          })

          return false
        }
        case 'date': {
          let parsedDate: Date | null = null

          const value = rawValue.value

          if (value instanceof Date) {
            parsedDate = value
          } else if (typeof value === 'string') {
            const parts = value.split('/')

            if (parts.length === 3) {
              const [day, month, year] = parts.map(Number)

              if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
                parsedDate = new Date(year, month - 1, day)
              }
            } else {
              const fallbackDate = new Date(value)
              if (!isNaN(fallbackDate.getTime())) {
                parsedDate = fallbackDate
              }
            }
          }

          if (!parsedDate || isNaN(parsedDate.getTime())) return true

          parsedFields.push({
            name: data.name,
            value: parsedDate,
          })

          return false
        }
        default:
          return true
      }
    })

    if (missingRequiredFields.length > 0) {
      throw new BadRequestException(
        `Missing required fields: ${missingRequiredFields
          .map((field) => field.name)
          .join(', ')}`,
      )
    }

    const { url } = await this.uploader.upload({
      fileName: `companies/${companyId}/documents/${randomUUID()}-${fileName}`,
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
          duedate: parsedFields[0].value,
          url,
          version,
        },
        prisma,
      )

      await this.indexationsRepository.create(
        {
          documentId: document.id,
          values: parsedFields as unknown as Prisma.JsonArray,
        },
        prisma,
      )

      return document
    })

    this.eventEmitter.emit(
      'document.created',
      new DocumentEvent(document.id, companyId, payload.sub),
    )

    return {
      document,
    }
  }
}
