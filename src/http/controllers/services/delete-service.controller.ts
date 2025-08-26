import { CheckPolicies } from '@/casl/check-policies.decorator'
import { PoliciesGuard } from '@/casl/policies.guard'
import { DeleteServicePolicyHandler } from '@/casl/policies/delete-service-policy-handler'
import {
  deleteServiceValidationPipe,
  type DeleteServiceParamsSchema,
} from '@/http/schemas/delete-service-schema'
import { DeleteServiceUseCase } from '@/use-cases/delete-service'
import { Controller, Delete, HttpCode, Param, UseGuards } from '@nestjs/common'

@Controller('/services/:serviceId')
export class DeleteServiceController {
  constructor(private deleteService: DeleteServiceUseCase) {}

  @Delete()
  @UseGuards(PoliciesGuard)
  @CheckPolicies(new DeleteServicePolicyHandler())
  @HttpCode(200)
  async handle(
    @Param(deleteServiceValidationPipe)
    { serviceId }: DeleteServiceParamsSchema,
  ) {
    const { message } = await this.deleteService.execute({
      serviceId,
    })

    return {
      message,
    }
  }
}
