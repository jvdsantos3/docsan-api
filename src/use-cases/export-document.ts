import { DocumentsRepository } from '@/database/repositories/documents-repository'
import { Uploader } from '@/storage/upload'
import { Injectable } from '@nestjs/common'

interface ExportDocumentUseCaseRequest {
  companyId: string
  documentId: string
}

interface ExportDocumentUseCaseResponse {
  file: Buffer
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
      // TODO
      throw new Error('Document not found.')
    }

    const { body } = await this.uploader.get(document.url)

    return {
      file: body,
    }
  }
}
