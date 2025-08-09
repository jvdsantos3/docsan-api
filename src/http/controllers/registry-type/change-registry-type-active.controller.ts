import { Controller, Param, Patch, UseGuards } from '@nestjs/common'
import { PoliciesGuard } from '@/casl/policies.guard'
import { CheckPolicies } from '@/casl/check-policies.decorator'
import { UpdateRegistryTypePolicyHandler } from '@/casl/policies/update-registry-type.policy'
import {
  ChangeRegistryTypeActiveParamsSchema,
  changeRegistryTypeActiveParamsValidationPipe,
} from '@/http/schemas/change-registry-type-active-schema'
import { ChangeRegistryTypeActiveUseCase } from '@/use-cases/change-registry-type-active'

@Controller('registry-types/:registryTypeId/active')
export class ChangeRegistryTypeActiveController {
  constructor(
    private changeRegistryTypeActive: ChangeRegistryTypeActiveUseCase,
  ) {}

  @Patch()
  @UseGuards(PoliciesGuard)
  @CheckPolicies(new UpdateRegistryTypePolicyHandler())
  async handle(
    @Param(changeRegistryTypeActiveParamsValidationPipe)
    { registryTypeId }: ChangeRegistryTypeActiveParamsSchema,
  ) {
    await this.changeRegistryTypeActive.execute({
      registryTypeId,
    })
  }
}
