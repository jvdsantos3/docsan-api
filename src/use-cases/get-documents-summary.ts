import { DocumentsRepository } from '@/database/repositories/documents-repository'
import { DocumentWithComputed } from '@/database/interfaces/document'
import { Injectable } from '@nestjs/common'
import { getDocumentStatus } from './get-document-status'

interface GetDocumentsSummaryUseCaseRequest {
  companyId: string
}

interface GetDocumentsSummaryUseCaseResponse {
  inDay: number
  near: number
  won: number
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

    const inDay = documents.filter(
      (document) => document.status === 'Em dia',
    ).length
    const near = documents.filter(
      (document) => document.status === 'Próximo do vencimento',
    ).length
    const won = documents.filter(
      (document) => document.status === 'Vencido',
    ).length

    return {
      inDay: inDay,
      near: near,
      won: won,
    }
  }
}
