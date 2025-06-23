import { BadRequestException, Body, Controller, Post } from '@nestjs/common'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { z } from 'zod'
import { CreateServiceUseCase } from '@/domain/application/use-cases/create-service'

const createServiceBodySchema = z.object({
  title: z.string(),
  content: z.string(),
})

const bodyValidationPipe = new ZodValidationPipe(createServiceBodySchema)

type CreateServiceBodySchema = z.infer<typeof createServiceBodySchema>

@Controller('/services')
export class CreateServiceController {
  constructor(private createService: CreateServiceUseCase) {}

  @Post()
  async handle(
    @Body(bodyValidationPipe) body: CreateServiceBodySchema,
    @CurrentUser() user: UserPayload,
  ) {
    const { title, content } = body

    const userId = user.sub

    const result = await this.createService.execute({
      title,
      content,
      professionalId: userId,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
