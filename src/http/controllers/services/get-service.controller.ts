import { Public } from '@/auth/public'
import {
  getServiceValidationPipe,
  GetServiceParamsSchema,
} from '@/http/schemas/get-service-schema'
import { GetServiceUseCase } from '@/use-cases/get-service'
import { Controller, Get, Param } from '@nestjs/common'

@Controller('/services/:serviceId')
@Public()
export class GetServiceController {
  constructor(private getService: GetServiceUseCase) {}

  @Get()
  async handle(
    @Param(getServiceValidationPipe)
    { serviceId }: GetServiceParamsSchema,
  ) {
    const { service } = await this.getService.execute({
      serviceId,
    })

    return {
      service,
    }
  }
}
