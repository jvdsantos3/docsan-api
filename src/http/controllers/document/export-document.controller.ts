import { CheckPolicies } from '@/casl/check-policies.decorator'
import { PoliciesGuard } from '@/casl/policies.guard'
import { ReadDocumentPolicyHandler } from '@/casl/policies/read-document.policy'
import { Controller, Get, Param, UseGuards } from '@nestjs/common'
import { ExportDocumentUseCase } from '@/use-cases/export-document'
import {
  ExportDocumentParamsSchema,
  exportDocumentValidationPipe,
} from '@/http/schemas/export-document-schema'

@Controller('/company/:companyId/documents/:documentId/export')
export class ExportDocumentController {
  constructor(private exportDocument: ExportDocumentUseCase) {}

  @Get()
  @UseGuards(PoliciesGuard)
  @CheckPolicies(new ReadDocumentPolicyHandler())
  async handle(
    @Param(exportDocumentValidationPipe)
    { companyId, documentId }: ExportDocumentParamsSchema,
  ) {
    const file = await this.exportDocument.execute({
      companyId,
      documentId,
    })

    return file
  }
}
