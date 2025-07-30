import z from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'

const exportDocumentParamsSchema = z.object({
  companyId: z.string(),
  documentId: z.string(),
})

export type ExportDocumentParamsSchema = z.infer<typeof exportDocumentParamsSchema>

export const exportDocumentValidationPipe = new ZodValidationPipe(
  exportDocumentParamsSchema,
)
