import { Controller, Param, Patch, UseGuards } from '@nestjs/common'
import { PoliciesGuard } from '@/casl/policies.guard'
import { CheckPolicies } from '@/casl/check-policies.decorator'
import { UpdateProfessionalPolicyHandler } from '@/casl/policies/update-professional.policy'
import {
  ApproveProfessionalParamsSchema,
  approveProfessionalParamsValidationPipe,
} from '@/http/schemas/approve-professional-schema'
import { ApproveProfessionalUseCase } from '@/use-cases/approve-professional'

@Controller('/professionals/:professionalId/approve')
export class ApproveProfessionalController {
  constructor(private approveProfessional: ApproveProfessionalUseCase) {}

  @Patch()
  @UseGuards(PoliciesGuard)
  @CheckPolicies(new UpdateProfessionalPolicyHandler())
  async handle(
    @Param(approveProfessionalParamsValidationPipe)
    { professionalId }: ApproveProfessionalParamsSchema,
  ) {
    await this.approveProfessional.execute({
      professionalId,
    })

    return {
      message: 'Professional approved successfully',
    }
  }
}
