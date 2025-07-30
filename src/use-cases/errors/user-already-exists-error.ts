import { ConflictException } from '@nestjs/common'

export class UserAlreadyExistsError extends ConflictException {
  constructor(identifier?: string) {
    const message = identifier
      ? `User "${identifier}" already exists.`
      : `User already exists.`

    super(message)
  }
}
