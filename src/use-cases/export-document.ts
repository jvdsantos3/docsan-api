import { DocumentsRepository } from '@/database/repositories/documents-repository'
import { Uploader } from '@/storage/upload'
import { Injectable } from '@nestjs/common'
import { DocumentNotFoundError } from './errors/document-not-found-error'

interface ExportDocumentUseCaseRequest {
  companyId: string
  documentId: string
}

interface ExportDocumentUseCaseResponse {
  file: Buffer
  contentType: string
}

@Injectable()
export class ExportDocumentUseCase {
  constructor(
    private documentsRepository: DocumentsRepository,
    private uploader: Uploader,
  ) {}

  async execute({
    companyId,
    documentId,
  }: ExportDocumentUseCaseRequest): Promise<ExportDocumentUseCaseResponse> {
    const document = await this.documentsRepository.findById(
      documentId,
      companyId,
    )

    if (!document) {
      throw new DocumentNotFoundError()
    }

    const { body, contentType } = await this.uploader.get(document.url)

    return {
      file: body,
      contentType,
    }
  }
}
