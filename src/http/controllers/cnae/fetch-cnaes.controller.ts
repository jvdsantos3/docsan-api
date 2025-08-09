import { Controller, Get, Query } from '@nestjs/common'
import { FetchCnaesUseCase } from '@/use-cases/fetch-cnaes'
import {
  FetchCnaesQuerySchema,
  FetchCnaesQueryValidationPipe,
} from '@/http/schemas/fetch-cnaes-schema'
import { Public } from '@/auth/public'

@Controller('cnaes')
export class FetchCnaesController {
  constructor(private fetchCnaesUseCase: FetchCnaesUseCase) {}

  @Get()
  @Public()
  async handle(
    @Query(FetchCnaesQueryValidationPipe)
    { page, limit, order, active, filter }: FetchCnaesQuerySchema,
  ) {
    const cnaes = await this.fetchCnaesUseCase.execute({
      page,
      limit,
      order,
      active,
      filter,
    })

    return cnaes
  }
}
