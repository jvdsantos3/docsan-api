import z from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'

const deleteDocumentTypeParamsSchema = z.object({
  documentTypeId: z.string(),
})

export type DeleteDocumentTypeParamsSchema = z.infer<
  typeof deleteDocumentTypeParamsSchema
>

export const deleteDocumentTypeParamsValidationPipe = new ZodValidationPipe(
  deleteDocumentTypeParamsSchema,
)
