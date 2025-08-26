import { Injectable } from '@nestjs/common'
import { RegistryType, type BranchActivity } from '@prisma/client'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { UserPayload } from '@/auth/jwt.strategy'
import { RegistryTypesRepository } from '@/database/repositories/registry-types-repository'
import { RegistryTypeAlreadyExistsError } from './errors/registry-type-already-exists-error'
import { RegistryTypeEvent } from '@/events/registry-type.event'
import { BranchesActivityRepository } from '@/database/repositories/branches-activity-repository'
import { BranchActivityNotFoundError } from './errors/branch-activity-not-found-error'

interface CreateRegistryTypeUseCaseRequest {
  user: UserPayload
  branchActivityId: string
  name: string
  fullName: string
}

interface CreateRegistryTypeUseCaseResponse {
  registryType: RegistryType
}

@Injectable()
export class CreateRegistryTypeUseCase {
  constructor(
    private branchesActivityRepository: BranchesActivityRepository,
    private registryTypesRepository: RegistryTypesRepository,
    private eventEmitter: EventEmitter2,
  ) {}

  async execute({
    user,
    branchActivityId,
    name,
    fullName,
  }: CreateRegistryTypeUseCaseRequest): Promise<CreateRegistryTypeUseCaseResponse> {
    const branchActivity =
      await this.branchesActivityRepository.findById(branchActivityId)

    if (!branchActivity) {
      throw new BranchActivityNotFoundError()
    }

    const registryTypeWithSameName =
      await this.registryTypesRepository.findByName(branchActivityId, name)

    if (registryTypeWithSameName) {
      throw new RegistryTypeAlreadyExistsError(name)
    }

    const data = {
      branchActivityId,
      name,
      fullName,
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
