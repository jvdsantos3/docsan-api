import { CheckPolicies } from '@/casl/check-policies.decorator'
import { PoliciesGuard } from '@/casl/policies.guard'
import { ReadDocumentPolicyHandler } from '@/casl/policies/read-document.policy'
import { Controller, Get, Param, UseGuards } from '@nestjs/common'
import { GetDocumentsSummaryUseCase } from '@/use-cases/get-documents-summary'
import {
  GetDocumentsSummarySchema,
  getDocumentsSummaryValidationPipe,
} from '@/http/schemas/get-documents-summary-schema'

@Controller('/company/:companyId/documents/summary')
export class GetDocumentsSummaryController {
  constructor(private getDocumentsSummary: GetDocumentsSummaryUseCase) {}

  @Get()
  @UseGuards(PoliciesGuard)
  @CheckPolicies(new ReadDocumentPolicyHandler())
  async handle(
    @Param(getDocumentsSummaryValidationPipe)
    { companyId }: GetDocumentsSummarySchema,
  ) {
    const summary = await this.getDocumentsSummary.execute({
      companyId,
    })

    return {
      summary,
    }
  }
}
