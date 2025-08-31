import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common'
import { CheckPolicies } from '@/casl/check-policies.decorator'
import { PoliciesGuard } from '@/casl/policies.guard'
import { CreateProfessionalServicePolicyHandler } from '@/casl/policies/create-professional-service.policy'
import { AssociateProfessionalServiceUseCase } from '@/use-cases/associate-professional-service'
import {
  associateServiceParamValidationPipe,
  AssociateServiceParamSchema,
  associateServiceBodyValidationPipe,
  AssociateServiceBodySchema,
} from '@/http/schemas/associate-service-schema'
import { CurrentUser } from '@/auth/current-user-decorator'
import type { UserPayload } from '@/auth/jwt.strategy'

@Controller('/services/:serviceId/associate')
export class AssociateServiceController {
  constructor(
    private readonly AssociateProfessionalService: AssociateProfessionalServiceUseCase,
  ) {}

  @Post()
  @UseGuards(PoliciesGuard)
  @CheckPolicies(new CreateProfessionalServicePolicyHandler())
  async handle(
    @CurrentUser() payload: UserPayload,
    @Param(associateServiceParamValidationPipe)
    { serviceId }: AssociateServiceParamSchema,
    @Body(associateServiceBodyValidationPipe)
    { price, paymentMethods, maxInstallments }: AssociateServiceBodySchema,
  ) {
    await this.AssociateProfessionalService.execute({
      payload,
      serviceId,
      price,
      paymentMethods,
      maxInstallments,
    })

    return {
      message: 'Serviço associado ao profissional com sucesso.',
    }
  }
}
