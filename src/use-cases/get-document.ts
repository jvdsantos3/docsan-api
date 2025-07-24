import { DocumentsRepository } from '@/database/repositories/documents-repository'
import { DocumentWithComputed } from '@/database/repositories/interfaces/document'
import { Uploader } from '@/storage/upload'
import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { differenceInDays, isBefore } from 'date-fns'

interface GetDocumentsSummaryUseCaseRequest {
  companyId: string
  documentId: string
}

interface GetDocumentsSummaryUseCaseResponse {
  document: DocumentWithComputed
}

@Injectable()
export class GetDocumentUseCase {
  constructor(
    private documentsRepository: DocumentsRepository,
    private uploader: Uploader,
  ) {}

  async execute({
    companyId,
    documentId,
  }: GetDocumentsSummaryUseCaseRequest): Promise<GetDocumentsSummaryUseCaseResponse> {
    const documentBase = await this.documentsRepository.findByIdWithComputed(
      documentId,
      companyId,
    )

    if (!documentBase) {
      // TODO
      throw new Error('Document not found.')
    }

    let duedate: Date | null = null
    let status: 'inDay' | 'near' | 'won' | null = null

    if (documentBase.indexation?.values) {
      const indexation = documentBase.indexation.values as Prisma.JsonArray

      duedate = this.getDuedate(indexation)
      status = this.getStatus(duedate)
    }

    const file = await this.uploader.get(documentBase.url)

    const document = {
      ...documentBase,
      duedate,
      status,
      file,
    } as DocumentWithComputed & {
      file: {
        body: Buffer
        contentType: string
      }
    }

    return {
      document,
    }
  }

  private getDuedate(values: Prisma.JsonArray): Date | null {
    const dueDateEntry = values.find(
      (value): value is { name: string; value: any } =>
        typeof value === 'object' &&
        value !== null &&
        'name' in value &&
        'value' in value &&
        (value as any).name === 'Data de vencimento',
    )
    const dueDate = dueDateEntry ? dueDateEntry.value : null

    const [day, month, year] = dueDate.split('/')

    if (!day || !month || !year) return null

    const parsedDate = new Date(Number(year), Number(month) - 1, Number(day))

    return isNaN(parsedDate.getTime()) ? null : parsedDate
  }

  private getStatus(duedate: Date | null): 'inDay' | 'near' | 'won' | null {
    if (!duedate) return null

    const today = new Date()

    if (isBefore(duedate, today)) return 'won'

    const days = differenceInDays(duedate, today)

    if (days <= 90) return 'near'

    return 'inDay'
  }
}
