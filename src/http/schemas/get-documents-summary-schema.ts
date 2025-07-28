import z from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'

const getDocumentsSummaryParamsSchema = z.object({
  companyId: z.string(),
})

export type GetDocumentsSummarySchema = z.infer<
  typeof getDocumentsSummaryParamsSchema
>

export const getDocumentsSummaryValidationPipe = new ZodValidationPipe(
  getDocumentsSummaryParamsSchema,
)
