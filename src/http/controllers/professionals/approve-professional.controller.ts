import { Controller, Param, Patch, UseGuards } from '@nestjs/common'
import { PoliciesGuard } from '@/casl/policies.guard'
import { CheckPolicies } from '@/casl/check-policies.decorator'
import { UpdateProfessionalPolicyHandler } from '@/casl/policies/update-professional.policy'
import {
  ApproveProfessionalParamsSchema,
  approveProfessionalParamsValidationPipe,
} from '@/http/schemas/approve-professional-schema'
import { ApproveProfessionalUseCase } from '@/use-cases/approve-professional'
import { CurrentUser } from '@/auth/current-user-decorator'
import { UserPayload } from '@/auth/jwt.strategy'

@Controller('/professionals/:professionalId/approve')
export class ApproveProfessionalController {
  constructor(private approveProfessional: ApproveProfessionalUseCase) {}

  @Patch()
  @UseGuards(PoliciesGuard)
  @CheckPolicies(new UpdateProfessionalPolicyHandler())
  async handle(
    @CurrentUser() user: UserPayload,
    @Param(approveProfessionalParamsValidationPipe)
    { professionalId }: ApproveProfessionalParamsSchema,
  ) {
    await this.approveProfessional.execute({
      user,
      professionalId,
    })

    return {
      message: 'Professional approved successfully',
    }
  }
}
