import { BadRequestException, Controller, Param, Patch } from '@nestjs/common'
import z from 'zod'
import { ChangeDocumentTypeActiveUseCase } from '@/use-cases/change-document-type-active'
import { ZodValidationPipe } from '@/http/pipes/zod-validation-pipe'

const idRouteParamSchema = z.string()

const paramValidationPipe = new ZodValidationPipe(idRouteParamSchema)

type IdRouteParamSchema = z.infer<typeof idRouteParamSchema>

@Controller('/document-types/:id/active')
export class ChangeDocumentTypeActiveController {
  constructor(
    private changeDocumentTypeActiveUseCase: ChangeDocumentTypeActiveUseCase,
  ) {}

  @Patch()
  async handle(@Param('id', paramValidationPipe) id: IdRouteParamSchema) {
    try {
      await this.changeDocumentTypeActiveUseCase.execute({
        documentTypeId: id,
      })
    } catch (err: any) {
      switch (err.constructor) {
        default:
          throw new BadRequestException(err.message)
      }
    }
  }
}
