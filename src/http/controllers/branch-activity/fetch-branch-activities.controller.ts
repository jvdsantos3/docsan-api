import { Controller, Get, Query, UseGuards } from '@nestjs/common'
import { FetchBranchesActivityUseCase } from '@/use-cases/fetch-branches-activity'
import {
  FetchBranchesActivityQuerySchema,
  FetchBranchesActivityQueryValidationPipe,
} from '@/http/schemas/fetch-branches-activity-schema'
import { PoliciesGuard } from '@/casl/policies.guard'
// import { CheckPolicies } from '@/casl/check-policies.decorator'
// import { ReadCnaePolicyHandler } from '@/casl/policies/read-cnae-type.policy'

@Controller('branches-activity')
export class FetchBranchesActivityController {
  constructor(private fetchBranchesActivityUseCase: FetchBranchesActivityUseCase) {}

  @Get()
  @UseGuards(PoliciesGuard)
  // @CheckPolicies(new ReadCnaePolicyHandler())
  async handle(
    @Query(FetchBranchesActivityQueryValidationPipe)
    { page, limit, order, active, filter }: FetchBranchesActivityQuerySchema,
  ) {
    const branchesActivity = await this.fetchBranchesActivityUseCase.execute({
      page,
      limit,
      order,
      active,
      filter,
    })

    return branchesActivity
  }
}
