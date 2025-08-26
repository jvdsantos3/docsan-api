import { Body, Controller, Param, Put, UseGuards } from '@nestjs/common'
import { PoliciesGuard } from '@/casl/policies.guard'
import { CheckPolicies } from '@/casl/check-policies.decorator'
import { UpdateRegistryTypePolicyHandler } from '@/casl/policies/update-registry-type.policy'
import { CurrentUser } from '@/auth/current-user-decorator'
import { UserPayload } from '@/auth/jwt.strategy'
import {
  EditRegistryTypeBodySchema,
  editRegistryTypeBodyValidationPipe,
  EditRegistryTypeParamsSchema,
  editRegistryTypeParamsValidationPipe,
} from '@/http/schemas/edit-registry-type-schema'
import { EditRegistryTypeUseCase } from '@/use-cases/edit-registry-type'

@Controller('registry-types/:registryTypeId')
export class EditRegistryTypeController {
  constructor(private editRegistry: EditRegistryTypeUseCase) {}

  @Put()
  @UseGuards(PoliciesGuard)
  @CheckPolicies(new UpdateRegistryTypePolicyHandler())
  async handle(
    @CurrentUser() user: UserPayload,
    @Param(editRegistryTypeParamsValidationPipe)
    { registryTypeId }: EditRegistryTypeParamsSchema,
    @Body(editRegistryTypeBodyValidationPipe)
    { name, fullName }: EditRegistryTypeBodySchema,
  ) {
    await this.editRegistry.execute({
      user,
      registryTypeId,
      name,
      fullName,
    })
  }
}
