import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common'
import { FetchDocumentTypesUseCase } from '@/use-cases/fetch-document-types'
import {
  FetchDocumentTypesParamSchema,
  fetchDocumentTypesParamsValidationPipe,
  FetchDocumentTypesQuerySchema,
  FetchDocumentTypesQueryValidationPipe,
} from '@/http/schemas/fetch-document-type-schema'
import { PoliciesGuard } from '@/casl/policies.guard'
import { CheckPolicies } from '@/casl/check-policies.decorator'
import { ReadDocumentTypePolicyHandler } from '@/casl/policies/read-document-type.policy'

@Controller('company/:companyId/document-types')
export class FetchDocumentTypesController {
  constructor(private fetchDocumentTypesUseCase: FetchDocumentTypesUseCase) {}

  @Get()
  @UseGuards(PoliciesGuard)
  @CheckPolicies(new ReadDocumentTypePolicyHandler())
  async handle(
    @Param(fetchDocumentTypesParamsValidationPipe)
    { companyId }: FetchDocumentTypesParamSchema,
    @Query(FetchDocumentTypesQueryValidationPipe)
    { page, limit, order, active, filter }: FetchDocumentTypesQuerySchema,
  ) {
    const documentTypes = await this.fetchDocumentTypesUseCase.execute({
      companyId,
      page,
      limit,
      order,
      active,
      filter,
    })

    return documentTypes
  }
}
