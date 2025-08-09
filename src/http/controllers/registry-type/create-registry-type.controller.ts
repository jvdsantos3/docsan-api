import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common'
import { CurrentUser } from '@/auth/current-user-decorator'
import { UserPayload } from '@/auth/jwt.strategy'
import { CheckPolicies } from '@/casl/check-policies.decorator'
import { PoliciesGuard } from '@/casl/policies.guard'
import {
  CreateRegistryTypeBodySchema,
  createRegistryTypeValidationPipe,
} from '@/http/schemas/create-registry-type-schema'
import { CreateRegistryTypePolicyHandler } from '@/casl/policies/create-registry-type.policy'
import { CreateRegistryTypeUseCase } from '@/use-cases/create-registry-type'

@Controller('/registry-types')
export class CreateRegistryTypeController {
  constructor(private createRegistryType: CreateRegistryTypeUseCase) {}

  @Post()
  @UseGuards(PoliciesGuard)
  @CheckPolicies(new CreateRegistryTypePolicyHandler())
  @HttpCode(201)
  async handle(
    @CurrentUser() user: UserPayload,
    @Body(createRegistryTypeValidationPipe)
    { name }: CreateRegistryTypeBodySchema,
  ) {
    await this.createRegistryType.execute({
      user,
      name,
    })
  }
}
