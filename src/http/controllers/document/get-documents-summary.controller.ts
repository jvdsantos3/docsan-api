import { CheckPolicies } from '@/casl/check-policies.decorator'
import { PoliciesGuard } from '@/casl/policies.guard'
import { ReadDocumentPolicyHandler } from '@/casl/policies/read-document.policy'
import {
  BadRequestException,
  Controller,
  Get,
  Param,
  UseGuards,
} from '@nestjs/common'
import z from 'zod'
import { GetDocumentsSummaryUseCase } from '@/use-cases/get-documents-summary'
import { ZodValidationPipe } from '@/http/pipes/zod-validation-pipe'

const companyIdRouteParamSchema = z.string()

const paramValidationPipe = new ZodValidationPipe(companyIdRouteParamSchema)

type CompanyIdRouteParamSchema = z.infer<typeof companyIdRouteParamSchema>

@Controller('/company/:companyId/documents/summary')
export class GetDocumentsSummaryController {
  constructor(private getDocumentsSummary: GetDocumentsSummaryUseCase) {}

  @Get()
  @UseGuards(PoliciesGuard)
  @CheckPolicies(new ReadDocumentPolicyHandler())
  async handle(
    @Param('companyId', paramValidationPipe)
    companyId: CompanyIdRouteParamSchema,
  ) {
    try {
      const summary = await this.getDocumentsSummary.execute({
        companyId,
      })

      return {
        summary,
      }
    } catch (err: any) {
      switch (err.constructor) {
        default:
          throw new BadRequestException(err.message)
      }
    }
  }
}
