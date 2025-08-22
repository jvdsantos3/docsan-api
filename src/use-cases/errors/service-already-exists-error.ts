import { BadRequestException } from '@nestjs/common'

export class ServiceAlreadyExistsError extends BadRequestException {
  constructor(identifier: string) {
    super(`Service "${identifier}" already exists.`)
  }
}
