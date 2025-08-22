import { ConflictException } from '@nestjs/common'

export class ServiceHasProfessionalsError extends ConflictException {
  constructor() {
    super('This service has professionals associated and cannot be updated.')
  }
}
