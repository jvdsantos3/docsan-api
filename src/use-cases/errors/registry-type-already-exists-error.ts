import { BadRequestException } from '@nestjs/common'

export class RegistryTypeAlreadyExistsError extends BadRequestException {
  constructor(identifier: string) {
    super(`Registry Type "${identifier}" already exists.`)
  }
}
