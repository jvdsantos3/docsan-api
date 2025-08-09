import {
  Body,
  Controller,
  HttpCode,
  Post,
  UseGuards,
} from '@nestjs/common'
import { CreateBranchActivityUseCase } from '@/use-cases/create-branch-activity'
import { PoliciesGuard } from '@/casl/policies.guard'
import {
  CreateBranchActivityBodySchema,
  createBranchActivityValidationPipe,
} from '@/http/schemas/create-branch-activity-schema'
import { CreateBranchActivityPolicyHandler } from '@/casl/policies/create-branch-activity.policy'
import { CheckPolicies } from '@/casl/check-policies.decorator'
import { CurrentUser } from '@/auth/current-user-decorator'
import { UserPayload } from '@/auth/jwt.strategy'

@Controller('/branches-activity')
export class CreateBranchActivityController {
  constructor(private createBranchActivity: CreateBranchActivityUseCase) {}

  @Post()
  @UseGuards(PoliciesGuard)
  @CheckPolicies(new CreateBranchActivityPolicyHandler())
  @HttpCode(201)
  async handle(
    @CurrentUser() user: UserPayload,
    @Body(createBranchActivityValidationPipe)
    { name }: CreateBranchActivityBodySchema,
  ) {
    await this.createBranchActivity.execute({
      user,
      name
    })
  }
}
