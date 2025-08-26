import {
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common'
import { JwtAuthGuard } from '@/auth/jwt-auth.guard'
import { PoliciesGuard } from '@/casl/policies.guard'
import { CheckPolicies } from '@/casl/check-policies.decorator'
import { UpdateServicePolicyHandler } from '@/casl/policies/update-service.policy'
import { ToggleServiceHighlightUseCase } from '@/use-cases/toggle-service-highlighted'
import {
  toggleServiceHighlightedValidationPipe,
  ToggleServiceHighlightedSchema,
} from '@/http/schemas/toggle-service-highlighted-schema'

@Controller('/services/:serviceId/toggle-highlight')
export class ToggleServiceHighlightController {
  constructor(
    private readonly toggleServiceHighlight: ToggleServiceHighlightUseCase,
  ) {}

  @Patch()
  @UseGuards(PoliciesGuard)
  @CheckPolicies(new UpdateServicePolicyHandler())
  async handle(
    @Param(toggleServiceHighlightedValidationPipe)
    { serviceId }: ToggleServiceHighlightedSchema,
  ) {
    await this.toggleServiceHighlight.execute({
      serviceId,
    })

    return {
      message: 'Serviço destacado/desmarcado com sucesso.',
    }
  }
}
