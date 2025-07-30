import { BadRequestException } from '@nestjs/common'

export class DocumentOverdueError extends BadRequestException {
  constructor() {
    super('Expired document.')
  }
}
