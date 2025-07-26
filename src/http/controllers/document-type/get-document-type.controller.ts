import { Controller, Get, Param } from '@nestjs/common'
import { GetDocumentTypeByIdUseCase } from '@/use-cases/get-document-type-by-id'
import {
  GetDocumentTypeParamsSchema,
  getDocumentTypeParamsValidationPipe,
} from '@/http/schemas/get-document-type-schema'

@Controller('company/:companyId/document-types/:documentTypeId')
export class GetDocumentTypeController {
  constructor(private getDocumentTypeById: GetDocumentTypeByIdUseCase) {}

  @Get()
  async handle(
    @Param(getDocumentTypeParamsValidationPipe)
    { documentTypeId }: GetDocumentTypeParamsSchema,
  ) {
    const { documentType } = await this.getDocumentTypeById.execute({
      documentTypeId,
    })

    return documentType
  }
}
