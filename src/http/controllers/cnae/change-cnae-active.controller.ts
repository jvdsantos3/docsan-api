import { Controller, Param, Patch, UseGuards } from '@nestjs/common'
import { ChangeCnaeActiveUseCase } from '@/use-cases/change-cnae-active'
import {
  ChangeCnaeActiveParamsSchema,
  changeCnaeActiveParamsValidationPipe,
} from '@/http/schemas/change-cnae-active-schema'
// import { UpdateDocumentTypePolicyHandler } from '@/casl/policies/update-document-type.policy'
import { PoliciesGuard } from '@/casl/policies.guard'
// import { CheckPolicies } from '@/casl/check-policies.decorator'

@Controller('cnaes/:cnaeId/active')
export class ChangeCnaeActiveController {
  constructor(
    private changeCnaeActive: ChangeCnaeActiveUseCase,
  ) {}

  @Patch()
  @UseGuards(PoliciesGuard)
  // @CheckPolicies(new UpdateCnaePolicyHandler())
  async handle(
    @Param(changeCnaeActiveParamsValidationPipe)
    { cnaeId }: ChangeCnaeActiveParamsSchema,
  ) {
    await this.changeCnaeActive.execute({
      cnaeId,
    })
  }
}
