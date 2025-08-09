import { CheckPolicies } from '@/casl/check-policies.decorator'
import { PoliciesGuard } from '@/casl/policies.guard'
import { DeleteRegistryTypePolicyHandler } from '@/casl/policies/delete-registry-type.policy'
import {
  DeleteRegistryTypeParamsSchema,
  deleteRegistryTypeParamsValidationPipe,
} from '@/http/schemas/delete-registry-type-schema'
import { DeleteRegistryTypeUseCase } from '@/use-cases/delete-registry-type'
import { Controller, Delete, Param, UseGuards } from '@nestjs/common'

@Controller('registry-types/:registryTypeId')
export class DeleteRegistryTypeController {
  constructor(private deleteRegistryType: DeleteRegistryTypeUseCase) {}

  @Delete()
  @UseGuards(PoliciesGuard)
  @CheckPolicies(new DeleteRegistryTypePolicyHandler())
  async handle(
    @Param(deleteRegistryTypeParamsValidationPipe)
    { registryTypeId }: DeleteRegistryTypeParamsSchema,
  ) {
    await this.deleteRegistryType.execute({
      registryTypeId,
    })
  }
}
