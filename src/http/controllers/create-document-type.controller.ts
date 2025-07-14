import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Post,
} from '@nestjs/common'
import { CurrentUser } from '@/auth/current-user-decorator'
import { UserPayload } from '@/auth/jwt.strategy'
import z from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { CreateDocumentTypeUseCase } from '@/use-cases/create-document-type'

const createDocumentTypeBodySchema = z.object({
  name: z.string(),
  fields: z
    .array(
      z.object({
        name: z.string(),
        type: z.string(),
        required: z.boolean(),
      }),
    )
    .nonempty(),
})

const bodyValidationPipe = new ZodValidationPipe(createDocumentTypeBodySchema)

type CreateDocumentTypeBodySchema = z.infer<typeof createDocumentTypeBodySchema>

@Controller('/document-types')
export class CreateDocumentTypeController {
  constructor(private createDocumentTypeUseCase: CreateDocumentTypeUseCase) {}

  @Post()
  @HttpCode(201)
  async handle(
    @CurrentUser() user: UserPayload,
    @Body(bodyValidationPipe) { name, fields }: CreateDocumentTypeBodySchema,
  ) {
    try {
      await this.createDocumentTypeUseCase.execute({
        user,
        name,
        fields,
      })
    } catch (err: any) {
      switch (err.constructor) {
        default:
          throw new BadRequestException(err.message)
      }
    }
  }
}
