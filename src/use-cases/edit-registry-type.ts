import { UserPayload } from '@/auth/jwt.strategy'
import { RegistryTypesRepository } from '@/database/repositories/registry-types-repository'
import { Injectable } from '@nestjs/common'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { RegistryType } from '@prisma/client'
import { RegistryTypeNotFoundError } from './errors/registry-type-not-found-error'
import { RegistryTypeAlreadyExistsError } from './errors/registry-type-already-exists-error'
import { RegistryTypeHasRelationshipsError } from './errors/registry-type-has-relationships-error'
import { RegistryTypeEvent } from '@/events/registry-type.event'

interface EditRegistryTypeUseCaseRequest {
  user: UserPayload
  registryTypeId: string
  name: string
  fullName: string
}

interface EditRegistryTypeUseCaseResponse {
  registryType: RegistryType
}

@Injectable()
export class EditRegistryTypeUseCase {
  constructor(
    private registryTypesRepository: RegistryTypesRepository,
    private eventEmitter: EventEmitter2,
  ) {}

  async execute({
    user,
    registryTypeId,
    name,
    fullName,
  }: EditRegistryTypeUseCaseRequest): Promise<EditRegistryTypeUseCaseResponse> {
    const currentRegistryType =
      await this.registryTypesRepository.findById(registryTypeId)

    if (!currentRegistryType) {
      throw new RegistryTypeNotFoundError()
    }

    if (currentRegistryType.professionals && currentRegistryType.professionals.length > 0) {
      throw new RegistryTypeHasRelationshipsError()
    }

    const registryTypeWithSameName =
      await this.registryTypesRepository.findByName(
        currentRegistryType.branchActivityId,
        name,
      )

    if (registryTypeWithSameName && currentRegistryType.name !== name) {
      throw new RegistryTypeAlreadyExistsError(name)
    }

    const newRegistryType = await this.registryTypesRepository.save({
      id: registryTypeId,
      name,
      fullName,
    })

    this.eventEmitter.emit(
      'registry-type.updated',
      new RegistryTypeEvent(newRegistryType.id, user.sub),
    )

    return {
      registryType: newRegistryType,
    }
  }
}
