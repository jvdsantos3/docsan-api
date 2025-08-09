import { Controller, Get, Param, UseGuards } from '@nestjs/common'
import { PoliciesGuard } from '@/casl/policies.guard'
import { CheckPolicies } from '@/casl/check-policies.decorator'
import { ChangeRegistryTypeActiveUseCase } from '@/use-cases/change-registry-type-active'
import { ReadRegistryTypePolicyHandler } from '@/casl/policies/read-registry-type.policy'
import {
  GetRegistryTypeParamsSchema,
  getRegistryTypeParamsValidationPipe,
} from '@/http/schemas/get-registry-type-schema'
import { GetRegistryTypeUseCase } from '@/use-cases/get-registry-type-active'

@Controller('registry-types/:registryTypeId')
export class GetRegistryTypeController {
  constructor(private getRegistryType: GetRegistryTypeUseCase) {}

  @Get()
  @UseGuards(PoliciesGuard)
  @CheckPolicies(new ReadRegistryTypePolicyHandler())
  async handle(
    @Param(getRegistryTypeParamsValidationPipe)
    { registryTypeId }: GetRegistryTypeParamsSchema,
  ) {
    const { registryType } = await this.getRegistryType.execute({
      registryTypeId,
    })

    return registryType
  }
}
