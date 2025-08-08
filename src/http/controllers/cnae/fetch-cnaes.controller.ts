import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common'
import { FetchCnaesUseCase } from '@/use-cases/fetch-cnaes'
import {
  FetchCnaesQuerySchema,
  FetchCnaesQueryValidationPipe,
} from '@/http/schemas/fetch-cnaes-schema'
import { PoliciesGuard } from '@/casl/policies.guard'
// import { CheckPolicies } from '@/casl/check-policies.decorator'
// import { ReadCnaePolicyHandler } from '@/casl/policies/read-cnae-type.policy'

@Controller('cnaes')
export class FetchCnaesController {
  constructor(private fetchCnaesUseCase: FetchCnaesUseCase) {}

  @Get()
  @UseGuards(PoliciesGuard)
  // @CheckPolicies(new ReadCnaePolicyHandler())
  async handle(
    @Query(FetchCnaesQueryValidationPipe)
    { page, limit, order, filter }: FetchCnaesQuerySchema,
  ) {
    const cnaes = await this.fetchCnaesUseCase.execute({
      page,
      limit,
      order,
      filter,
    })

    return cnaes
  }
}
