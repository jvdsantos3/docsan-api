import { Controller, Get, Param } from '@nestjs/common'
import { GetCnaeByIdUseCase } from '@/use-cases/get-cnae-by-id'
import {
  GetCnaeParamsSchema,
  getCnaeParamsValidationPipe,
} from '@/http/schemas/get-cnae-schema'
import { Public } from '@/auth/public'

@Controller('cnaes/:cnaeId')
export class GetCnaeController {
  constructor(private getCnaeById: GetCnaeByIdUseCase) {}

  @Get()
  @Public()
  async handle(
    @Param(getCnaeParamsValidationPipe)
    { cnaeId }: GetCnaeParamsSchema,
  ) {
    const { cnae } = await this.getCnaeById.execute({
      cnaeId,
    })

    return cnae
  }
}
