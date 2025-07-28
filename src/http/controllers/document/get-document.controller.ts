import { CheckPolicies } from '@/casl/check-policies.decorator'
import { PoliciesGuard } from '@/casl/policies.guard'
import { ReadDocumentPolicyHandler } from '@/casl/policies/read-document.policy'
import { Controller, Get, Param, UseGuards } from '@nestjs/common'
import { GetDocumentUseCase } from '@/use-cases/get-document'
import {
  GetDocumentParamsSchema,
  getDocumentValidationPipe,
} from '@/http/schemas/get-document-schema'

@Controller('/company/:companyId/documents/:documentId')
export class GetDocumentController {
  constructor(private getDocument: GetDocumentUseCase) {}

  @Get()
  @UseGuards(PoliciesGuard)
  @CheckPolicies(new ReadDocumentPolicyHandler())
  async handle(
    @Param(getDocumentValidationPipe)
    { companyId, documentId }: GetDocumentParamsSchema,
  ) {
    const { document } = await this.getDocument.execute({
      companyId,
      documentId,
    })

    return document
  }
}
