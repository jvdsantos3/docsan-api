import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common'
import { PoliciesGuard } from '@/casl/policies.guard'
import { CheckPolicies } from '@/casl/check-policies.decorator'
import {
  FetchProfessionalsQuerySchema,
  fetchProfessionalsQueryValidationPipe,
} from '@/http/schemas/fetch-professionals-schema'
import { FetchProfessionalsUseCase } from '@/use-cases/fetch-professionals'
import { ReadProfessionalPolicyHandler } from '@/casl/policies/read-professional.policy'

@Controller('/professionals')
export class FetchProfessionalsController {
  constructor(private fetchProfessionals: FetchProfessionalsUseCase) {}

  @Get()
  @UseGuards(PoliciesGuard)
  @CheckPolicies(new ReadProfessionalPolicyHandler())
  async handle(
    @Query(fetchProfessionalsQueryValidationPipe)
    {
      page,
      limit,
      order,
      orderBy,
      status,
      filter,
    }: FetchProfessionalsQuerySchema,
  ) {
    const { professionals } = await this.fetchProfessionals.execute({
      page,
      limit,
      order,
      orderBy,
      status,
      filter,
    })

    return {
      professionals,
    }
  }
}
