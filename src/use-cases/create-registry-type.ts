import { Injectable } from '@nestjs/common'
import { RegistryType } from '@prisma/client'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { UserPayload } from '@/auth/jwt.strategy'

interface CreateRegistryTypeUseCaseRequest {
  user: UserPayload
  name: string
}

interface CreateRegistryTypeUseCaseResponse {
  registryType: RegistryType
}

@Injectable()
export class CreateRegistryTypeUseCase {
  constructor(
    private eventEmitter: EventEmitter2,
  ) {}

  async execute({
    user,
    name,
  }: CreateRegistryTypeUseCaseRequest): Promise<void> {

    // this.eventEmitter.emit(
    //   'document-type.created',
    //   new DocumentTypeEvent(documentType.id, companyId, user.sub),
    // )
  }
}
