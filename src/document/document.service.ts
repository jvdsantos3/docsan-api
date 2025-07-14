import { BadRequestException, Injectable } from '@nestjs/common'
import { promises as fs } from 'fs'
import * as pdfParse from 'pdf-parse'

interface UploadFileRequest {
  file: Express.Multer.File
}

interface UploadFileResponse {
  filePath: string
}

@Injectable()
export class DocumentService {
  async uploadFile({ file }: UploadFileRequest): Promise<UploadFileResponse> {
    if (!file) {
      throw new BadRequestException('No file uploaded.')
    }

    return { filePath: file.path }
  }

  async extractData(
    filePath: string,
    keys: string[],
  ): Promise<Record<string, string | null>> {
    if (
      !filePath ||
      !(await fs
        .access(filePath)
        .then(() => true)
        .catch(() => false))
    ) {
      throw new BadRequestException(
        'Caminho do arquivo inválido ou arquivo não encontrado',
      )
    }
    if (!Array.isArray(keys) || !keys.includes('Data de vencimento')) {
      throw new BadRequestException(
        'O array de chaves deve conter "Data de vencimento"',
      )
    }

    try {
      const dataBuffer = await fs.readFile(filePath)
      const pdfData = await pdfParse(dataBuffer)

      const extractedData = this.extractDataFromPDF(pdfData.text, keys)

      await fs.unlink(filePath)

      return extractedData
    } catch (error: any) {
      throw new BadRequestException(
        `Erro ao extrair dados do PDF: ${error.message}`,
      )
    }
  }

  private extractDataFromPDF(
    text: string,
    keys: string[],
  ): Record<string, string | null> {
    const result: Record<string, string | null> = {}

    keys.forEach((key) => {
      if (key === 'Data de vencimento') {
        const dateRegex = /\b(\d{2}[-/]\d{2}[-/]\d{4})\b/
        const match = text.match(dateRegex)
        result[key] = match ? match[1] : null
      } else {
        const regex = new RegExp(`${key}\\s*[:=]\\s*(.+?)(\\n|$)`, 'i')
        const match = text.match(regex)
        result[key] = match ? match[1].trim() : null
      }
    })

    return result
  }
}
