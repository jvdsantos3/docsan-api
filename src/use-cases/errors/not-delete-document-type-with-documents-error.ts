import { BadRequestException } from '@nestjs/common'

export class NotDeleteDocumetTypeWithDocumentsError extends BadRequestException {
  constructor() {
    super(`It is not possible to delete a document type with linked documents.`)
  }
}
