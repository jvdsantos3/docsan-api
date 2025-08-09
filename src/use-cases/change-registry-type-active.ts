import { RegistryTypesRepository } from '@/database/repositories/registry-types-repository'
import { Injectable } from '@nestjs/common'
import { RegistryType } from '@prisma/client'
import { RegistryTypeNotFoundError } from './errors/registry-type-not-found-error'

interface ChangeRegistryTypeUseCaseRequest {
  registryTypeId: string
}

interface ChangeRegistryTypeUseCaseResponse {
  registryType: RegistryType
}

@Injectable()
export class ChangeRegistryTypeActiveUseCase {
  constructor(private registrytypesRepository: RegistryTypesRepository) {}

  async execute({
    registryTypeId,
  }: ChangeRegistryTypeUseCaseRequest): Promise<ChangeRegistryTypeUseCaseResponse> {
    const registryType =
      await this.registrytypesRepository.findById(registryTypeId)

    if (!registryType) {
      throw new RegistryTypeNotFoundError()
    }

    const newRegistryType = await this.registrytypesRepository.save({
      id: registryType.id,
      isActive: !registryType.isActive,
    })

    return {
      registryType: newRegistryType,
    }
  }
}
