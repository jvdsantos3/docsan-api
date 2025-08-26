import { Controller, Get, Query, UseGuards } from '@nestjs/common'
import {
  FetchRegistryTypesQuerySchema,
  fetchRegistryTypesQueryValidationPipe,
} from '@/http/schemas/fetch-registry-types-schema'
import { FetchRegistryTypesUseCase } from '@/use-cases/fetch-registry-types'
import { Public } from '@/auth/public'

@Controller('registry-types')
export class FetchRegistryTypesController {
  constructor(private fetchRegistryTypes: FetchRegistryTypesUseCase) {}

  @Get()
  @Public()
  async handle(
    @Query(fetchRegistryTypesQueryValidationPipe)
    { page, limit, order, active, branchActivityId, filter }: FetchRegistryTypesQuerySchema,
  ) {
    const { registryTypes } = await this.fetchRegistryTypes.execute({
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
