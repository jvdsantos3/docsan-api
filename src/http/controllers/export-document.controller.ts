import { CheckPolicies } from '@/casl/check-policies.decorator'
import { PoliciesGuard } from '@/casl/policies.guard'
import { ReadDocumentPolicyHandler } from '@/casl/policies/read-document.policy'
import {
  BadRequestException,
  Controller,
  Get,
  Param,
  UseGuards,
  UsePipes,
} from '@nestjs/common'
import z from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { ExportDocumentUseCase } from '@/use-cases/export-document'

const exportDocumentParamsSchema = z.object({
  companyId: z.string(),
  documentId: z.string(),
})

type ExportDocumentBodySchema = z.infer<typeof exportDocumentParamsSchema>

@Controller('/company/:companyId/documents/:documentId/export')
export class ExportDocumentController {
  constructor(private exportDocument: ExportDocumentUseCase) {}

  @Get()
  @UseGuards(PoliciesGuard)
  @CheckPolicies(new ReadDocumentPolicyHandler())
  @UsePipes(new ZodValidationPipe(exportDocumentParamsSchema))
  async handle(@Param() { companyId, documentId }: ExportDocumentBodySchema) {
    try {
      const file = await this.exportDocument.execute({
        companyId,
        documentId,
      })

      return file
    } catch (err: any) {
      switch (err.constructor) {
        default:
          throw new BadRequestException(err.message)
      }
    }
  }
}
