import { Controller, Get, Query, UseGuards } from '@nestjs/common'
import { PoliciesGuard } from '@/casl/policies.guard'
import { CheckPolicies } from '@/casl/check-policies.decorator'
import { ReadRegistryTypePolicyHandler } from '@/casl/policies/read-registry-type.policy'
import {
  FetchRegistryTypesQuerySchema,
  fetchRegistryTypesQueryValidationPipe,
} from '@/http/schemas/fetch-registry-types-schema'
import { FetchRegistryTypesUseCase } from '@/use-cases/fetch-registry-types'

@Controller('registry-types')
export class FetchRegistryTypesController {
  constructor(private fetchRegistryTypes: FetchRegistryTypesUseCase) {}

  @Get()
  @UseGuards(PoliciesGuard)
  @CheckPolicies(new ReadRegistryTypePolicyHandler())
  async handle(
    @Query(fetchRegistryTypesQueryValidationPipe)
    { page, limit, order, active, filter }: FetchRegistryTypesQuerySchema,
  ) {
    const { registryTypes } = await this.fetchRegistryTypes.execute({
      page,
      limit,
      order,
      active,
      filter,
    })

    return registryTypes
  }
}
