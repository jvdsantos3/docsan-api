import z from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'

const editDocumentTypeParamsSchema = z.object({
  companyId: z.string(),
  documentTypeId: z.string(),
})

export type EditDocumentTypeParamsSchema = z.infer<
  typeof editDocumentTypeParamsSchema
>

export const editDocumentTypeParamsValidationPipe = new ZodValidationPipe(
  editDocumentTypeParamsSchema,
)

const editDocumentTypeBodySchema = z.object({
  name: z.string(),
  fields: z
    .array(
      z.object({
        name: z.string(),
        type: z.enum(['date', 'text', 'number']),
        required: z.boolean(),
      }),
    )
    .nonempty(),
})

export const editDocumentTypeBodyValidationPipe = new ZodValidationPipe(
  editDocumentTypeBodySchema,
)

export type EditDocumentTypeBodySchema = z.infer<
  typeof editDocumentTypeBodySchema
>
