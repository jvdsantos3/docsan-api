import { BadRequestException } from '@nestjs/common'

export class ProfessionalPendingError extends BadRequestException {
  constructor() {
    super(
      'Your profile is being analyzed by our administrators, you will soon receive feedback on the analysis.',
    )
  }
}
