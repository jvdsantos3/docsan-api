import { RegistryTypesRepository } from '@/database/repositories/registry-types-repository'
import { PaginationResponse } from '../database/interfaces/pagination-params'
import { Injectable } from '@nestjs/common'
import { RegistryType } from '@prisma/client'

interface FetchRegistryTypesUseCaseRequest {
  page: number
  limit?: number
  order?: 'desc' | 'asc'
  active?: boolean
  filter?: string
  branchActivityId?: string
}

interface FetchRegistryTypesUseCaseResponse {
  registryTypes: PaginationResponse<RegistryType>
}

@Injectable()
export class FetchRegistryTypesUseCase {
  constructor(private registryTypesRepository: RegistryTypesRepository) {}

  async execute({
    page,
    limit,
    order,
    active,
    filter,
    branchActivityId,
  }: FetchRegistryTypesUseCaseRequest): Promise<FetchRegistryTypesUseCaseResponse> {
    const registryTypes = await this.registryTypesRepository.fetchPagination({
      page,
      limit,
      order,
      active,
      filter,
      branchActivityId,
    })

    return {
      registryTypes,
    }
  }
}
