import { BadRequestException } from '@nestjs/common'

export class ProfessionalServiceNotFoundError extends BadRequestException {
  constructor() {
    super('Professional service association not found.')
  }
}
