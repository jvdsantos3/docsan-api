import { BadRequestException } from '@nestjs/common'

export class ProfessionalBannedError extends BadRequestException {
  constructor() {
    super(`Your registration is restricted, please contact our team.`)
  }
}
