import { BadRequestException } from '@nestjs/common'

export class InvalidResetPasswordTokenError extends BadRequestException {
  constructor() {
    super(`Invalid or expired password reset token.`)
  }
}
