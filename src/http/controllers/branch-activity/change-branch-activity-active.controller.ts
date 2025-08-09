import { Controller, Param, Patch, UseGuards } from '@nestjs/common'
import { ChangeBranchActivityActiveUseCase } from '@/use-cases/change-branch-activity-active'
import {
  ChangeBranchActivityActiveParamsSchema,
  changeBranchActivityActiveParamsValidationPipe,
} from '@/http/schemas/change-branch-activity-active-schema'
import { PoliciesGuard } from '@/casl/policies.guard'
import { CheckPolicies } from '@/casl/check-policies.decorator'
import { UpdateBranchActivityPolicyHandler } from '@/casl/policies/update-branch-activity.policy'

@Controller('branches-activity/:branchActivityId/active')
export class ChangeBranchActivityActiveController {
  constructor(
    private changeBranchActivityActive: ChangeBranchActivityActiveUseCase,
  ) {}

  @Patch()
  @UseGuards(PoliciesGuard)
  @CheckPolicies(new UpdateBranchActivityPolicyHandler())
  async handle(
    @Param(changeBranchActivityActiveParamsValidationPipe)
    { branchActivityId }: ChangeBranchActivityActiveParamsSchema,
  ) {
    await this.changeBranchActivityActive.execute({
      branchActivityId,
    })
  }
}
