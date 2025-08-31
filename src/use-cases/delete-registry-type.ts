import { Injectable } from '@nestjs/common'
import { RegistryTypeNotFoundError } from './errors/registry-type-not-found-error'
import { RegistryTypeHasRelationshipsError } from './errors/registry-type-has-relationships-error'
import { RegistryTypesRepository } from '@/database/repositories/registry-types-repository'

interface DeleteRegistryTypeUseCaseRequest {
  registryTypeId: string
}

@Injectable()
export class DeleteRegistryTypeUseCase {
  constructor(private registryTypesRepository: RegistryTypesRepository) {}

  async execute({
    registryTypeId,
  }: DeleteRegistryTypeUseCaseRequest): Promise<void> {
    const registryType =
      await this.registryTypesRepository.findById(registryTypeId)

    if (!registryType) {
      throw new RegistryTypeNotFoundError()
    }

    if (registryType.professionals && registryType.professionals.length > 0) {
      throw new RegistryTypeHasRelationshipsError()
    }

    await this.registryTypesRepository.delete(registryType)
  }
}
