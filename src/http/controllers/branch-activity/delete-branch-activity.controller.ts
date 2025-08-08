// import { CheckPolicies } from '@/casl/check-policies.decorator'
import { PoliciesGuard } from '@/casl/policies.guard'
import { 
  DeleteBranchActivityParamsSchema,
  deleteBranchActivityParamsValidationPipe 
} from '@/http/schemas/delete-branch-activity-schema'
// import { DeleteCnaePolicyHandler } from '@/casl/policies/delete-cnae.policy'
import { DeleteBranchActivityUseCase } from '@/use-cases/delete-branch-activity'
import { Controller, Delete, Param, UseGuards } from '@nestjs/common'

@Controller('branches-activity/:branchActivityId')
export class DeleteBranchActivityController {
  constructor(private deleteBranchActivity: DeleteBranchActivityUseCase) {}

  @Delete()
  @UseGuards(PoliciesGuard)
  // @CheckPolicies(new DeletebranchActivityPolicyHandler())
  async handle(
    @Param(deleteBranchActivityParamsValidationPipe)
    { branchActivityId }: DeleteBranchActivityParamsSchema,
  ) {
    await this.deleteBranchActivity.execute({
      branchActivityId,
    })
  }
}
