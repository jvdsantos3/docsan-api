import { Injectable } from '@nestjs/common'
import { InvalidDocumentTypeError } from './errors/invalid-document-type-error'
import { DocumentTypesRepository } from '@/database/repositories/document-types-repository'
import { Field } from './interfaces/document'
import * as pdfParse from 'pdf-parse'

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
  constructor(private documentTypesRepository: DocumentTypesRepository) {}

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
      // TODO
      throw new Error('Document type not found.')
    }

    const metadata = documentType.metadata as unknown as Field[]

    let text: string
    try {
      const pdfData = await pdfParse(body)
      text = pdfData.text
    } catch (error: any) {
      throw new Error('Failed to parse PDF: ' + error.message)
    }

    // Mapeia os valores com base nas chaves do metadata
    const extractedData: ExtractedField[] = metadata.map((field) => {
      const key = field.name
      const value = this.extractValueForKey(text, key)
      return { name: key, value }
    })

    return { fields: extractedData }
  }

  private extractValueForKey(text: string, key: string): string | null {
    const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const regex = new RegExp(`${escapedKey}\\s*[:=]\\s*([^\\n\\r]+)`, 'i')
    const match = text.match(regex)

    return match ? match[1].trim() : null
  }
}
