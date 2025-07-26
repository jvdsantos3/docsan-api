import { BadRequestException } from '@nestjs/common'

export class DocumetTypeLimitError extends BadRequestException {
  constructor(limit: number) {
    super(`Document type limit of ${limit} fields reached.`)
  }
}
