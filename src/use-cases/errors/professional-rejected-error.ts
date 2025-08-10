import { BadRequestException } from '@nestjs/common'

export class ProfessionalRejectedError extends BadRequestException {
  constructor(date: string) {
    super(`Your registration was rejected, you can try again after ${date}.`)
  }
}
