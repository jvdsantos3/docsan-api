import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common'
import { FetchDocumentsUseCase } from '@/use-cases/fetch-documents'
import { PoliciesGuard } from '@/casl/policies.guard'
import { CheckPolicies } from '@/casl/check-policies.decorator'
import { ReadDocumentPolicyHandler } from '@/casl/policies/read-document.policy'
import {
  FetchDocumentsParamsSchema,
  fetchDocumentsQueryValidationPipe,
  fetchDocumentsParamValidationPipe,
  FetchDocumentsQuerySchema,
} from '@/http/schemas/fetch-documents-schema'

@Controller('company/:companyId/documents')
export class FetchDocumentsController {
  constructor(private fetchDocuments: FetchDocumentsUseCase) {}

  @Get()
  @UseGuards(PoliciesGuard)
  @CheckPolicies(new ReadDocumentPolicyHandler())
  async handle(
    @Param(fetchDocumentsParamValidationPipe)
    { companyId }: FetchDocumentsParamsSchema,
    @Query(fetchDocumentsQueryValidationPipe)
    {
      page,
      limit,
      order,
      orderBy,
      status,
      type,
      filter,
    }: FetchDocumentsQuerySchema,
  ) {
    const documents = await this.fetchDocuments.execute({
      companyId,
      page,
      limit,
      order,
      orderBy,
      status,
      type,
      filter,
    })

    return documents
  }
}
