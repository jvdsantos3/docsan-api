import { BadRequestException } from '@nestjs/common'

export class DocumetTypeFieldsLenghtError extends BadRequestException {
  constructor() {
    super(`Document type needs at least one field.`)
  }
}
