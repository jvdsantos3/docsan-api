import { Controller, Get, Param, UseGuards } from '@nestjs/common'
import { GetDocumentTypeByIdUseCase } from '@/use-cases/get-document-type-by-id'
import {
  GetDocumentTypeParamsSchema,
  getDocumentTypeParamsValidationPipe,
} from '@/http/schemas/get-document-type-schema'
import { PoliciesGuard } from '@/casl/policies.guard'
import { CheckPolicies } from '@/casl/check-policies.decorator'
import { ReadDocumentTypePolicyHandler } from '@/casl/policies/read-document-type.policy'

@Controller('company/:companyId/document-types/:documentTypeId')
export class GetDocumentTypeController {
  constructor(private getDocumentTypeById: GetDocumentTypeByIdUseCase) {}

  @Get()
  @UseGuards(PoliciesGuard)
  @CheckPolicies(new ReadDocumentTypePolicyHandler())
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
