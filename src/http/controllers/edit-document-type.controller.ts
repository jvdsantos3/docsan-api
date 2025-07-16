import {
  BadRequestException,
  Body,
  Controller,
  Param,
  Put,
} from '@nestjs/common'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import z from 'zod'
import { EditDocumentTypeUseCase } from '@/use-cases/edit-document-type'

const idRouteParamSchema = z.string()

const paramValidationPipe = new ZodValidationPipe(idRouteParamSchema)

type IdRouteParamSchema = z.infer<typeof idRouteParamSchema>

const editDocumentTypeBodySchema = z.object({
  name: z.string(),
  fields: z.array(
    z.object({
      name: z.string(),
      type: z.string(),
      required: z.boolean(),
    }),
  ),
})

const bodyValidationPipe = new ZodValidationPipe(editDocumentTypeBodySchema)

type EditDocumentTypeBodySchema = z.infer<typeof editDocumentTypeBodySchema>

@Controller('document-types/:id')
export class EditDocumentTypeController {
  constructor(private editDocumentTypeUseCase: EditDocumentTypeUseCase) {}

  @Put()
  async handle(
    @Param('id', paramValidationPipe) id: IdRouteParamSchema,
    @Body(bodyValidationPipe) { name, fields }: EditDocumentTypeBodySchema,
  ) {
    try {
      await this.editDocumentTypeUseCase.execute({
        documentTypeId: id,
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
