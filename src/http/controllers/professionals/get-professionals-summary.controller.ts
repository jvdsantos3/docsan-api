import { Controller, Get, UseGuards } from '@nestjs/common'
import { PoliciesGuard } from '@/casl/policies.guard'
import { CheckPolicies } from '@/casl/check-policies.decorator'
import { ReadProfessionalPolicyHandler } from '@/casl/policies/read-professional.policy'
import { GetProfessionalsSummaryUseCase } from '@/use-cases/get-professionals-summary'

@Controller('/professionals/summary')
export class GetProfessionalssummaryController {
  constructor(
    private getProfessionalsSummary: GetProfessionalsSummaryUseCase,
  ) {}

  @Get()
  @UseGuards(PoliciesGuard)
  @CheckPolicies(new ReadProfessionalPolicyHandler())
  async handle() {
    const { summary } = await this.getProfessionalsSummary.execute()

    return {
      summary,
    }
  }
}
