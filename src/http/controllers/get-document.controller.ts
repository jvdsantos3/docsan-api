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
import { GetDocumentUseCase } from '@/use-cases/get-document'

const getDocumentParamsSchema = z.object({
  companyId: z.string(),
  documentId: z.string(),
})

type GetDocumentBodySchema = z.infer<typeof getDocumentParamsSchema>

@Controller('/company/:companyId/documents/:documentId')
export class GetDocumentController {
  constructor(private getDocument: GetDocumentUseCase) {}

  @Get()
  @UseGuards(PoliciesGuard)
  @CheckPolicies(new ReadDocumentPolicyHandler())
  @UsePipes(new ZodValidationPipe(getDocumentParamsSchema))
  async handle(@Param() { companyId, documentId }: GetDocumentBodySchema) {
    try {
      const document = await this.getDocument.execute({
        companyId,
        documentId,
      })

      return document
    } catch (err: any) {
      switch (err.constructor) {
        default:
          throw new BadRequestException(err.message)
      }
    }
  }
}
