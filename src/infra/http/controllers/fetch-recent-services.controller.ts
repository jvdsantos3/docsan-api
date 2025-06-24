import { BadRequestException, Controller, Get, Query } from '@nestjs/common'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { z } from 'zod'
import { FetchRecentServicesUseCase } from '@/domain/application/use-cases/fetch-recent-services'
import { ServicePresenter } from '../presenters/service-presenter'
import { Public } from '@/infra/auth/public'

const pageQueryParamSchema = z
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(z.number().min(1))

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema)

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>

@Controller('/services')
@Public()
export class FetchRecentServicesController {
  constructor(private fetchRecentServices: FetchRecentServicesUseCase) {}

  @Get()
  async handle(@Query('page', queryValidationPipe) page: PageQueryParamSchema) {
    const result = await this.fetchRecentServices.execute({
      page,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    const services = result.value.services

    return { services: services.map(ServicePresenter.toHTTP) }
  }
}
