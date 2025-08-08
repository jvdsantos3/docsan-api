import { Body, Controller, Param, Put, UseGuards } from '@nestjs/common'
// import { CheckPolicies } from '@/casl/check-policies.decorator'
import { PoliciesGuard } from '@/casl/policies.guard'
import { 
  EditBranchActivityBodySchema,
  editBranchActivityBodyValidationPipe,
  EditBranchActivityParamsSchema,
  editBranchActivityParamsValidationPipe 
} from '@/http/schemas/edit-branch-activity-schema'
import { EditBranchActivityUseCase } from '@/use-cases/edit-branch-activity'
// import { UpdateCnaePolicyHandler } from '@/casl/policies/update-cnae.policy'
// import { UserPayload } from '@/auth/jwt.strategy'
// import { CurrentUser } from '@/auth/current-user-decorator'

@Controller('branches-activity/:branchActivityId')
export class EditBranchActivityController {
  constructor(private editBranchActivityUseCase: EditBranchActivityUseCase) {}

  @Put()
  @UseGuards(PoliciesGuard)
  // @CheckPolicies(new UpdateBranchActivityPolicyHandler())
  async handle(
    // @CurrentUser() user: UserPayload,
    @Param(editBranchActivityParamsValidationPipe)
    { branchActivityId }: EditBranchActivityParamsSchema,
    @Body(editBranchActivityBodyValidationPipe)
    { name }: EditBranchActivityBodySchema,
  ) {
    await this.editBranchActivityUseCase.execute({
      // user,
      name,
      branchActivityId
    })
  }
}
