import { BadRequestException } from '@nestjs/common'

export class CnaeNotFoundError extends BadRequestException {
  constructor() {
    super('Cnae not found.')
  }
}
