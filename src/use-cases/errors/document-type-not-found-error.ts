import { BadRequestException } from '@nestjs/common'

export class DocumentTypeNotFoundError extends BadRequestException {
  constructor() {
    super('Document type not found.')
  }
}
