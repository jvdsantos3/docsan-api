import { BadRequestException } from '@nestjs/common'

export class BranchActivityNotFoundError extends BadRequestException {
  constructor() {
    super('Branch Activity not found.')
  }
}
