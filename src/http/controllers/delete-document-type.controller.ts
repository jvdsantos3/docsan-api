import { DeleteDocumentTypeUseCase } from '@/use-cases/delete-document-type'
import { BadRequestException, Controller, Delete, Param } from '@nestjs/common'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import z from 'zod'

const idRouteParamSchema = z.string()

const paramValidationPipe = new ZodValidationPipe(idRouteParamSchema)

type IdRouteParamSchema = z.infer<typeof idRouteParamSchema>

@Controller('document-types/:id')
export class DeleteDocumentTypeController {
  constructor(private deleteDocumentTypeUseCase: DeleteDocumentTypeUseCase) {}

  @Delete()
  async handle(@Param('id', paramValidationPipe) id: IdRouteParamSchema) {
    try {
      await this.deleteDocumentTypeUseCase.execute({
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
