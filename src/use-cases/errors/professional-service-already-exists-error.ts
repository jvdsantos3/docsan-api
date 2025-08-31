import { BadRequestException } from '@nestjs/common'

export class ProfessionalServiceAlreadyExistsError extends BadRequestException {
  constructor() {
    super('Professional service association already exists.')
  }
}
