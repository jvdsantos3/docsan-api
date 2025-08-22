import { FetchServiceUseCase } from '@/use-cases/fetch-service'
import { CheckPolicies } from '@/casl/check-policies.decorator'
import { PoliciesGuard } from '@/casl/policies.guard'
import { Controller, Get, Query, UseGuards } from '@nestjs/common'
import { ReadServicePolicyHandler } from '@/casl/policies/read-service.policy'
import {
  fetchServiceValidationPipe,
  FetchServiceQuerySchema,
} from '@/http/schemas/fetch-service-schema'

@Controller('/services')
export class FetchServiceController {
  constructor(private fetchService: FetchServiceUseCase) {}

  @Get()
  @UseGuards(PoliciesGuard)
  @CheckPolicies(new ReadServicePolicyHandler())
  async handle(
    @Query(fetchServiceValidationPipe)
    {
      page,
      limit,
      order,
      orderBy,
      status,
      highlight,
      filter,
    }: FetchServiceQuerySchema,
  ) {
    const { services } = await this.fetchService.execute({
      page,
      limit,
      order,
      orderBy,
      status,
      highlight,
      filter,
    })

    return {
      services,
    }
  }
}
