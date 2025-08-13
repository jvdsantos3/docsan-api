import { BadRequestException } from '@nestjs/common'

export class ProfessionalCannotRejectedError extends BadRequestException {
  constructor() {
    super(`This professional cannot rejected.`)
  }
}
