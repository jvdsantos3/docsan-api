import {
  Body,
  Controller,
  HttpCode,
  Post,
  UseGuards,
} from '@nestjs/common'
import { CreateCnaeUseCase } from '@/use-cases/create-cnae'
import { PoliciesGuard } from '@/casl/policies.guard'
import {
  CreateCnaeBodySchema,
  createCnaeValidationPipe,
} from '@/http/schemas/create-cnae-schema'
import { CheckPolicies } from '@/casl/check-policies.decorator'
import { CreateCnaePolicyHandler } from '@/casl/policies/create-cnae.policy'
import { UserPayload } from '@/auth/jwt.strategy'
import { CurrentUser } from '@/auth/current-user-decorator'

@Controller('/cnaes')
export class CreateCnaeController {
  constructor(private createCnae: CreateCnaeUseCase) {}

  @Post()
  @UseGuards(PoliciesGuard)
  @CheckPolicies(new CreateCnaePolicyHandler())
  @HttpCode(201)
  async handle(
    @CurrentUser() user: UserPayload,
    @Body(createCnaeValidationPipe)
    { code, description }: CreateCnaeBodySchema,
  ) {
    await this.createCnae.execute({
      user,
      code,
      description,
    })
  }
}
