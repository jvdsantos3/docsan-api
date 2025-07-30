import { DocumentsRepository } from '@/database/repositories/documents-repository'
import { DocumentWithComputed } from '@/database/interfaces/document'
import { Injectable } from '@nestjs/common'
import { DocumentNotFoundError } from './errors/document-not-found-error'
import { getDocumentStatus } from './get-document-status'

interface GetDocumentsSummaryUseCaseRequest {
  companyId: string
  documentId: string
}

interface GetDocumentsSummaryUseCaseResponse {
  document: DocumentWithComputed
}

@Injectable()
export class GetDocumentUseCase {
  constructor(private documentsRepository: DocumentsRepository) {}

  async execute({
    companyId,
    documentId,
  }: GetDocumentsSummaryUseCaseRequest): Promise<GetDocumentsSummaryUseCaseResponse> {
    const documentBase = await this.documentsRepository.findById(
      documentId,
      companyId,
    )

    if (!documentBase) {
      throw new DocumentNotFoundError()
    }

    const status = getDocumentStatus(
      documentBase.duedate,
      documentBase.documentType.validityPeriod,
    )

    const document = {
      ...documentBase,
      status,
    } as DocumentWithComputed

    return {
      document,
    }
  }
}
