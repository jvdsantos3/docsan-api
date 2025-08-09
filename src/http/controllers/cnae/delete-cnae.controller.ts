// import { CheckPolicies } from '@/casl/check-policies.decorator'
import { CheckPolicies } from '@/casl/check-policies.decorator'
import { PoliciesGuard } from '@/casl/policies.guard'
import { DeleteCnaePolicyHandler } from '@/casl/policies/delete-cnae.policy'
import {
  DeleteCnaeParamsSchema,
  deleteCnaeParamsValidationPipe,
} from '@/http/schemas/delete-cnae-schema'
import { DeleteCnaeUseCase } from '@/use-cases/delete-cnae'
import { Controller, Delete, Param, UseGuards } from '@nestjs/common'

@Controller('/cnaes/:cnaeId')
export class DeleteCnaeController {
  constructor(private deleteCnae: DeleteCnaeUseCase) {}

  @Delete()
  @UseGuards(PoliciesGuard)
  @CheckPolicies(new DeleteCnaePolicyHandler())
  async handle(
    @Param(deleteCnaeParamsValidationPipe)
    { cnaeId }: DeleteCnaeParamsSchema,
  ) {
    await this.deleteCnae.execute({
      cnaeId,
    })
  }
}
