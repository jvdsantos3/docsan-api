import { BadRequestException } from '@nestjs/common'

export class ServiceNotFoundError extends BadRequestException {
  constructor() {
    super('Service not found.')
  }
}
