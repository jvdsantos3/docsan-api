import { FetchServiceUseCase } from '@/use-cases/fetch-service'
import { Controller, Get, Query } from '@nestjs/common'
import {
  fetchServiceValidationPipe,
  FetchServiceQuerySchema,
} from '@/http/schemas/fetch-service-schema'
import { Public } from '@/auth/public'

@Controller('/services')
@Public()
export class FetchServiceController {
  constructor(private fetchService: FetchServiceUseCase) {}

  @Get()
  async handle(
    @Query(fetchServiceValidationPipe)
    {
      page,
      limit,
      order,
      orderBy,
      status,
      highlight,
      filter,
    }: FetchServiceQuerySchema,
  ) {
    const { services } = await this.fetchService.execute({
      page,
      limit,
      order,
      orderBy,
      status,
      highlight,
      filter,
    })

    return {
      services,
    }
  }
}
