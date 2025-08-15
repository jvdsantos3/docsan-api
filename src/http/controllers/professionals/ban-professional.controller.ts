import { Body, Controller, Param, Patch, UseGuards } from '@nestjs/common'
import { PoliciesGuard } from '@/casl/policies.guard'
import { CheckPolicies } from '@/casl/check-policies.decorator'
import { UpdateProfessionalPolicyHandler } from '@/casl/policies/update-professional.policy'
import {
  BanProfessionalBodySchema,
  banProfessionalBodyValidationPipe,
  BanProfessionalParamsSchema,
  banProfessionalParamsValidationPipe,
} from '@/http/schemas/ban-professional-schema'
import { ChangeBanProfessionalUseCase } from '@/use-cases/ban-professional'
import { CurrentUser } from '@/auth/current-user-decorator'
import { UserPayload } from '@/auth/jwt.strategy'

@Controller('/professionals/:professionalId/change-ban')
export class ChangeBanProfessionalController {
  constructor(private changeBanProfessional: ChangeBanProfessionalUseCase) {}

  @Patch()
  @UseGuards(PoliciesGuard)
  @CheckPolicies(new UpdateProfessionalPolicyHandler())
  async handle(
    @CurrentUser() user: UserPayload,
    @Param(banProfessionalParamsValidationPipe)
    { professionalId }: BanProfessionalParamsSchema,
    @Body(banProfessionalBodyValidationPipe)
    { reason }: BanProfessionalBodySchema,
  ) {
    await this.changeBanProfessional.execute({
      user,
      professionalId,
      reason,
    })

    return {
      message: 'Professional banned successfully',
    }
  }
}
