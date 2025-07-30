import { BadRequestException } from '@nestjs/common'

export class DocumentWonError extends BadRequestException {
  constructor() {
    super('Expired document.')
  }
}
