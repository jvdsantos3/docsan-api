import { Controller, Param, Patch, UseGuards } from '@nestjs/common'
import { ToggleServiceActiveUseCase } from '@/use-cases/toggle-service-active'
import {
  toggleServiceActiveValidationPipe,
  type ToggleServiceActiveSchema,
} from '../../schemas/toggle-service-active-schema'
import { UpdateServicePolicyHandler } from '@/casl/policies/update-service.policy'
import { CheckPolicies } from '@/casl/check-policies.decorator'
import { PoliciesGuard } from '@/casl/policies.guard'

@Controller('/services/:serviceId/toggle-active')
export class ToggleServiceActiveController {
  constructor(
    private readonly toggleServiceActive: ToggleServiceActiveUseCase,
  ) {}

  @Patch()
  @UseGuards(PoliciesGuard)
  @CheckPolicies(new UpdateServicePolicyHandler())
  async handle(
    @Param(toggleServiceActiveValidationPipe)
    { serviceId }: ToggleServiceActiveSchema,
  ) {
    await this.toggleServiceActive.execute({
      serviceId,
    })

    return {
      message: 'Serviço ativado/desativado com sucesso',
    }
  }
}
