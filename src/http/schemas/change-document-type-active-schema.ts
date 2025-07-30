import z from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'

const changeDocumentTypeActiveParamsSchema = z.object({
  documentTypeId: z.string(),
})

export type ChangeDocumentTypeActiveParamsSchema = z.infer<
  typeof changeDocumentTypeActiveParamsSchema
>

export const changeDocumentTypeActiveParamsValidationPipe =
  new ZodValidationPipe(changeDocumentTypeActiveParamsSchema)
