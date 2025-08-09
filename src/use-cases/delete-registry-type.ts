import { Injectable } from '@nestjs/common'
import { RegistryTypeNotFoundError } from './errors/registry-type-not-found-error'
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

    await this.registryTypesRepository.delete(registryType)
  }
}
