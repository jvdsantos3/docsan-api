import { RegistryTypesRepository } from '@/database/repositories/registry-types-repository'
import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { RegistryTypeNotFoundError } from './errors/registry-type-not-found-error'

interface GetRegistryTypeUseCaseRequest {
  registryTypeId: string
}

interface GetRegistryTypeUseCaseResponse {
  registryType: Prisma.RegistryTypeGetPayload<{
    include: {
      actionLogs: true
      professionals: true
    }
  }>
}

@Injectable()
export class GetRegistryTypeUseCase {
  constructor(private registryTypesRepository: RegistryTypesRepository) {}

  async execute({
    registryTypeId,
  }: GetRegistryTypeUseCaseRequest): Promise<GetRegistryTypeUseCaseResponse> {
    const registryType =
      await this.registryTypesRepository.findById(registryTypeId)

    if (!registryType) {
      throw new RegistryTypeNotFoundError()
    }

    return {
      registryType,
    }
  }
}
