import { BadRequestException } from '@nestjs/common'

export class ProfessionalRejectedError extends BadRequestException {
  constructor() {
    super(
      `Your registration was rejected, please try again or contact our team.`,
    )
  }
}
