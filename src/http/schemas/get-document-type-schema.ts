import z from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'

const getDocumentTypeParamsSchema = z.object({
  documentTypeId: z.string(),
})

export type GetDocumentTypeParamsSchema = z.infer<
  typeof getDocumentTypeParamsSchema
>

export const getDocumentTypeParamsValidationPipe = new ZodValidationPipe(
  getDocumentTypeParamsSchema,
)
