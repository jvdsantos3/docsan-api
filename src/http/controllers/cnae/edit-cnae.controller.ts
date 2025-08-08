import { Body, Controller, Param, Put, UseGuards } from '@nestjs/common'
// import { CheckPolicies } from '@/casl/check-policies.decorator'
import { PoliciesGuard } from '@/casl/policies.guard'
import { EditCnaeUseCase } from '@/use-cases/edit-cnae'
import { 
  EditCnaeBodySchema,
  editCnaeBodyValidationPipe,
  EditCnaeParamsSchema,
  editCnaeParamsValidationPipe 
} from '@/http/schemas/edit-cnae-schema'
// import { UpdateCnaePolicyHandler } from '@/casl/policies/update-cnae.policy'
// import { UserPayload } from '@/auth/jwt.strategy'
// import { CurrentUser } from '@/auth/current-user-decorator'

@Controller('cnaes/:cnaeId')
export class EditCnaeController {
  constructor(private editCnaeUseCase: EditCnaeUseCase) {}

  @Put()
  @UseGuards(PoliciesGuard)
  // @CheckPolicies(new UpdateCnaePolicyHandler())
  async handle(
    // @CurrentUser() user: UserPayload,
    @Param(editCnaeParamsValidationPipe)
    { cnaeId }: EditCnaeParamsSchema,
    @Body(editCnaeBodyValidationPipe)
    { code, description }: EditCnaeBodySchema,
  ) {
    await this.editCnaeUseCase.execute({
      // user,
      code,
      description,
      cnaeId
    })
  }
}
