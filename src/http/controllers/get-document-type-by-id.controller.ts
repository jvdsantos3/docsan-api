import { BadRequestException, Controller, Get, Param } from '@nestjs/common'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import z from 'zod'
import { GetDocumentTypeByIdUseCase } from '@/use-cases/get-document-type-by-id'

const idRouteParamSchema = z.string()

const paramValidationPipe = new ZodValidationPipe(idRouteParamSchema)

type IdRouteParamSchema = z.infer<typeof idRouteParamSchema>

@Controller('document-types/:id')
export class GetDocumentTypeByIdController {
  constructor(private getDocumentTypeByIdUseCase: GetDocumentTypeByIdUseCase) {}

  @Get()
  async handle(@Param('id', paramValidationPipe) id: IdRouteParamSchema) {
    try {
      const { documentType } = await this.getDocumentTypeByIdUseCase.execute({
        documentTypeId: id,
      })

      return documentType
    } catch (err: any) {
      switch (err.constructor) {
        default:
          throw new BadRequestException(err.message)
      }
    }
  }
}
