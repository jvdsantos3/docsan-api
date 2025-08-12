import { Controller, Get, Param, UseGuards } from '@nestjs/common'
import { PoliciesGuard } from '@/casl/policies.guard'
import { CheckPolicies } from '@/casl/check-policies.decorator'
import { ReadProfessionalPolicyHandler } from '@/casl/policies/read-professional.policy'
import {
  GetProfessionalParamsSchema,
  getProfessionalParamsValidationPipe,
} from '@/http/schemas/get-professional-schema'
import { GetProfessionalUseCase } from '@/use-cases/get-professional'

@Controller('/professionals/:professionalId')
export class GetProfessionalController {
  constructor(private getProfessional: GetProfessionalUseCase) {}

  @Get()
  @UseGuards(PoliciesGuard)
  @CheckPolicies(new ReadProfessionalPolicyHandler())
  async handle(
    @Param(getProfessionalParamsValidationPipe)
    { professionalId }: GetProfessionalParamsSchema,
  ) {
    const { professional } = await this.getProfessional.execute({
      professionalId,
    })

    return {
      professional,
    }
  }
}
