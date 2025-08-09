import { Controller, Get, Param, UseGuards } from '@nestjs/common'
import { GetBranchActivitByIdUseCase } from '@/use-cases/get-branch-activity-by-id'
import {
  GetBranchActivityParamsSchema,
  getBranchActivityParamsValidationPipe,
} from '@/http/schemas/get-branch-activity-schema'
import { PoliciesGuard } from '@/casl/policies.guard'
import { CheckPolicies } from '@/casl/check-policies.decorator'
import { ReadBranchActivityPolicyHandler } from '@/casl/policies/read-branch-activity.policy'

@Controller('branches-activity/:branchActivityId')
export class GetBranchActivitController {
  constructor(private getBranchActivityById: GetBranchActivitByIdUseCase) {}

  @Get()
  @UseGuards(PoliciesGuard)
  @CheckPolicies(new ReadBranchActivityPolicyHandler())
  async handle(
    @Param(getBranchActivityParamsValidationPipe)
    { branchActivityId }: GetBranchActivityParamsSchema,
  ) {
    const { branchActivity } = await this.getBranchActivityById.execute({
      branchActivityId,
    })

    return branchActivity
  }
}
