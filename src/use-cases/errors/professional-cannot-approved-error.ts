import { BadRequestException } from '@nestjs/common'

export class ProfessionalCannotApprovedError extends BadRequestException {
  constructor() {
    super(`This professional cannot approved.`)
  }
}
