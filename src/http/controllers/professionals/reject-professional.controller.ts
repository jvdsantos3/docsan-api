import { Body, Controller, Param, Patch, UseGuards } from '@nestjs/common'
import { PoliciesGuard } from '@/casl/policies.guard'
import { CheckPolicies } from '@/casl/check-policies.decorator'
import { UpdateProfessionalPolicyHandler } from '@/casl/policies/update-professional.policy'
import { CurrentUser } from '@/auth/current-user-decorator'
import { UserPayload } from '@/auth/jwt.strategy'
import { RejectProfessionalUseCase } from '@/use-cases/reject-professional'
import {
  RejectProfessionalBodySchema,
  rejectProfessionalBodyValidationPipe,
  RejectProfessionalParamsSchema,
  rejectProfessionalParamsValidationPipe,
} from '@/http/schemas/reject-professional-schema'

@Controller('/professionals/:professionalId/reject')
export class RejectProfessionalController {
  constructor(private rejectProfessional: RejectProfessionalUseCase) {}

  @Patch()
  @UseGuards(PoliciesGuard)
  @CheckPolicies(new UpdateProfessionalPolicyHandler())
  async handle(
    @CurrentUser() user: UserPayload,
    @Param(rejectProfessionalParamsValidationPipe)
    { professionalId }: RejectProfessionalParamsSchema,
    @Body(rejectProfessionalBodyValidationPipe)
    { reason }: RejectProfessionalBodySchema,
  ) {
    await this.rejectProfessional.execute({
      user,
      professionalId,
      reason,
    })

    return {
      message: 'Professional rejected successfully',
    }
  }
}
