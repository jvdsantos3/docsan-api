import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common'
import { PoliciesGuard } from '@/casl/policies.guard'
import { CheckPolicies } from '@/casl/check-policies.decorator'
import { ReadDocumentPolicyHandler } from '@/casl/policies/read-document.policy'
import {
  FetchDocumentTypeDocumentsParamsSchema,
  fetchDocumentTypeDocumentsParamsValidationPipe,
  fetchDocumentTypeDocumentsQueryValidationPipe,
  FetchDocumentTypyDocumentsQuerySchema,
} from '@/http/schemas/fetch-document-type-documents-schema'
import { FetchDocumentTypeDocumentsUseCase } from '@/use-cases/fetch-document-type-documents'

@Controller('company/:companyId/document-types/:documentTypeId/documents')
export class FetchDocumentTypeDocumentsController {
  constructor(
    private fetchDocumentTypeDocuments: FetchDocumentTypeDocumentsUseCase,
  ) {}

  @Get()
  @UseGuards(PoliciesGuard)
  @CheckPolicies(new ReadDocumentPolicyHandler())
  async handle(
    @Param(fetchDocumentTypeDocumentsParamsValidationPipe)
    { documentTypeId }: FetchDocumentTypeDocumentsParamsSchema,
    @Query(fetchDocumentTypeDocumentsQueryValidationPipe)
    {
      page,
      limit,
      order,
      orderBy,
      filter,
    }: FetchDocumentTypyDocumentsQuerySchema,
  ) {
    const { documents } = await this.fetchDocumentTypeDocuments.execute({
      documentTypeId,
      page,
      limit,
      order,
      orderBy,
      filter,
    })

    return documents
  }
}
