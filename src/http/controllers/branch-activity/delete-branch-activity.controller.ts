import { CheckPolicies } from '@/casl/check-policies.decorator'
import { PoliciesGuard } from '@/casl/policies.guard'
import { DeleteBranchActivityPolicyHandler } from '@/casl/policies/delete-branch-activity.policy'
import {
  DeleteBranchActivityParamsSchema,
  deleteBranchActivityParamsValidationPipe,
} from '@/http/schemas/delete-branch-activity-schema'
import { DeleteBranchActivityUseCase } from '@/use-cases/delete-branch-activity'
import { Controller, Delete, Param, UseGuards } from '@nestjs/common'

@Controller('branches-activity/:branchActivityId')
export class DeleteBranchActivityController {
  constructor(private deleteBranchActivity: DeleteBranchActivityUseCase) {}

  @Delete()
  @UseGuards(PoliciesGuard)
  @CheckPolicies(new DeleteBranchActivityPolicyHandler())
  async handle(
    @Param(deleteBranchActivityParamsValidationPipe)
    { branchActivityId }: DeleteBranchActivityParamsSchema,
  ) {
    await this.deleteBranchActivity.execute({
      branchActivityId,
    })
  }
}
