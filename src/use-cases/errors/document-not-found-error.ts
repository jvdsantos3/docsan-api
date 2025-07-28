import { BadRequestException } from '@nestjs/common'

export class DocumentNotFoundError extends BadRequestException {
  constructor() {
    super('Document not found.')
  }
}
