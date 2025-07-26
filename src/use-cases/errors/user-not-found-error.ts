import { BadRequestException } from '@nestjs/common'

export class UserNotFoundError extends BadRequestException {
  constructor() {
    super('User not found.')
  }
}
