import { BadRequestException } from '@nestjs/common'

export class NotEditDocumetTypeWithDocumentsError extends BadRequestException {
  constructor() {
    super(`It is not possible to edit a document type with linked documents.`)
  }
}
