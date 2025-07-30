import { Injectable } from '@nestjs/common'
import { InvalidDocumentTypeError } from './errors/invalid-document-type-error'
import { DocumentTypesRepository } from '@/database/repositories/document-types-repository'
import { DocumentTypeNotFoundError } from './errors/document-type-not-found-error'
import { GeminiService } from '@/gemini/gemini.service'

interface ExtractDataUseCaseRequest {
  documentTypeId: string
  fileType: string
  body: Buffer
}

interface ExtractedField {
  name: string
  value: string | null
}

interface ExtractDataUseCaseResponse {
  fields: ExtractedField[]
}

@Injectable()
export class ExtractDataUseCase {
  constructor(
    private geminiService: GeminiService,
    private documentTypesRepository: DocumentTypesRepository,
  ) {}

  async execute({
    documentTypeId,
    fileType,
    body,
  }: ExtractDataUseCaseRequest): Promise<ExtractDataUseCaseResponse> {
    if (!/^application\/pdf$/.test(fileType)) {
      throw new InvalidDocumentTypeError(fileType)
    }

    const documentType =
      await this.documentTypesRepository.findById(documentTypeId)

    if (!documentType) {
      throw new DocumentTypeNotFoundError()
    }

    const response = await this.geminiService.generate(documentType.prompt, fileType, body)

    const extractData = JSON.parse(response) as ExtractedField[]

    return { fields: extractData }
  }
}
