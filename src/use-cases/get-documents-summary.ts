import { DocumentsRepository } from '@/database/repositories/documents-repository'
import { DocumentWithComputed } from '@/database/interfaces/document'
import { Injectable } from '@nestjs/common'
import { getDocumentStatus } from './get-document-status'

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
    const documentsBase = await this.documentsRepository.findMany(companyId)

    const documents = documentsBase.map((doc) => {
      const status = getDocumentStatus(
        doc.duedate,
        doc.documentType.validityPeriod,
      )

      return {
        ...doc,
        status,
      }
    }) as DocumentWithComputed[]

    const up_to_date = documents.filter(
      (document) => document.status === 'Up_to_date',
    ).length
    const due_soon = documents.filter(
      (document) => document.status === 'Due_soon',
    ).length
    const overdue = documents.filter(
      (document) => document.status === 'Overdue',
    ).length

    return {
      up_to_date: up_to_date,
      due_soon: due_soon,
      overdue: overdue,
    }
  }
}
