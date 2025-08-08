import { Controller, Get, Param, UseGuards } from '@nestjs/common'
import { GetCnaeByIdUseCase } from '@/use-cases/get-cnae-by-id'
import {
  GetCnaeParamsSchema,
  getCnaeParamsValidationPipe,
} from '@/http/schemas/get-cnae-schema'
import { PoliciesGuard } from '@/casl/policies.guard'

@Controller('cnaes/:cnaeId')
export class GetCnaeController {
  constructor(private getCnaeById: GetCnaeByIdUseCase) {}

  @Get()
  @UseGuards(PoliciesGuard)
  // @CheckPolicies(new ReadCnaePolicyHandler())
  async handle(
    @Param(getCnaeParamsValidationPipe)
    { cnaeId }: GetCnaeParamsSchema,
  ) {
    const { cnae } = await this.getCnaeById.execute({
      cnaeId,
    })

    return cnae
  }
}
