import { Injectable } from '@nestjs/common'
import { RegistryType } from '@prisma/client'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { UserPayload } from '@/auth/jwt.strategy'
import { RegistryTypesRepository } from '@/database/repositories/registry-types-repository'
import { RegistryTypeAlreadyExistsError } from './errors/registry-type-already-exists-error'
import { RegistryTypeEvent } from '@/events/registry-type.event'

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
    private registryTypesRepository: RegistryTypesRepository,
    private eventEmitter: EventEmitter2,
  ) {}

  async execute({
    user,
    name,
  }: CreateRegistryTypeUseCaseRequest): Promise<CreateRegistryTypeUseCaseResponse> {
    const registryTypeWithSameName =
      await this.registryTypesRepository.findByName(name)

    if (registryTypeWithSameName) {
      throw new RegistryTypeAlreadyExistsError(name)
    }

    const data = {
      name,
    }

    const registryType = await this.registryTypesRepository.create(data)

    this.eventEmitter.emit(
      'registry-type.created',
      new RegistryTypeEvent(registryType.id, user.sub),
    )

    return {
      registryType,
    }
  }
}
