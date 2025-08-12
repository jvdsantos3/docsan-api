import { BadRequestException } from '@nestjs/common'

export class ProfessionalNotFoundError extends BadRequestException {
  constructor() {
    super('Professional not found.')
  }
}
