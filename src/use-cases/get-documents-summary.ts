import { DocumentsRepository } from '@/database/repositories/documents-repository'
import { DocumentWithComputed } from '@/database/interfaces/document'
import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { differenceInDays, isBefore } from 'date-fns'

interface GetDocumentsSummaryUseCaseRequest {
  companyId: string
}

interface GetDocumentsSummaryUseCaseResponse {
  up_to_date: number
  due_soon: number
  overdue: number
}

@Injectable()
export class GetDocumentsSummaryUseCase {
  constructor(private documentsRepository: DocumentsRepository) {}

  async execute({
    companyId,
  }: GetDocumentsSummaryUseCaseRequest): Promise<GetDocumentsSummaryUseCaseResponse> {
    const documentsBase = await this.documentsRepository.fetch(companyId)

    const documents = documentsBase.map((doc) => {
      if (doc.indexation?.values) {
        const indexation = doc.indexation.values as Prisma.JsonArray

        const duedate = this.getDuedate(indexation)
        const status = this.getStatus(duedate)

        return {
          ...doc,
          duedate,
          status,
        }
      }
    }) as DocumentWithComputed[]

    const inDay = documents.filter(
      (document) => document.status === 'inDay',
    ).length
    const near = documents.filter(
      (document) => document.status === 'near',
    ).length
    const won = documents.filter((document) => document.status === 'won').length

    return {
      up_to_date: inDay,
      due_soon: near,
      overdue: won,
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
