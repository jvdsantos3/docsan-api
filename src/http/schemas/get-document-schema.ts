import z from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'

const getDocumentParamsSchema = z.object({
  companyId: z.string(),
  documentId: z.string(),
})

export type GetDocumentParamsSchema = z.infer<typeof getDocumentParamsSchema>

export const getDocumentValidationPipe = new ZodValidationPipe(
  getDocumentParamsSchema,
)
