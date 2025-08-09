import { BadRequestException } from '@nestjs/common'

export class RegistryTypeNotFoundError extends BadRequestException {
  constructor() {
    super('RegistryType not found.')
  }
}
