import { Controller, Get, Param } from '@nestjs/common'
import {
  GetRegistryTypeParamsSchema,
  getRegistryTypeParamsValidationPipe,
} from '@/http/schemas/get-registry-type-schema'
import { GetRegistryTypeUseCase } from '@/use-cases/get-registry-type-active'
import { Public } from '@/auth/public'

@Controller('registry-types/:registryTypeId')
export class GetRegistryTypeController {
  constructor(private getRegistryType: GetRegistryTypeUseCase) {}

  @Get()
  @Public()
  async handle(
    @Param(getRegistryTypeParamsValidationPipe)
    { registryTypeId }: GetRegistryTypeParamsSchema,
  ) {
    const { registryType } = await this.getRegistryType.execute({
      registryTypeId,
    })

    return registryType
  }
}
