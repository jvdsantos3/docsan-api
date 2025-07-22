import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common'
import { CurrentUser } from '@/auth/current-user-decorator'
import { UserPayload } from '@/auth/jwt.strategy'
import z from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { CreateDocumentTypeUseCase } from '@/use-cases/create-document-type'
import { AuthzGuard } from '@/authz/authz.guard'
import { JwtAuthGuard } from '@/auth/jwt-auth.guard'
import { RequiredPermission } from '@/authz/permission'
import { Company } from '@/authz/company'

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

  @Post(':companyId')
  @HttpCode(201)
  @RequiredPermission('document-type.create')
  @Company('companyId')
  @UseGuards(JwtAuthGuard, AuthzGuard)
  async handle(
    @CurrentUser() user: UserPayload,
    @Param('companyId') companyId: string,
    @Body(bodyValidationPipe) { name, fields }: CreateDocumentTypeBodySchema,
  ) {
    try {
      await this.createDocumentTypeUseCase.execute({
        user,
        companyId,
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
