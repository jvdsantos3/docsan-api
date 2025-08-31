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
  validityPeriod: z.coerce
    .number()
    .int({ message: 'validityPeriod deve ser um número inteiro' })
    .min(7, { message: 'validityPeriod deve ser no mínimo 7' }),
  fields: z
    .array(
      z.object({
        name: z.string(),
        type: z.enum(['date', 'text', 'number']),
        required: z.boolean(),
      }),
    )
    .nonempty(),
  prompt: z.string(),
})

export const editDocumentTypeBodyValidationPipe = new ZodValidationPipe(
  editDocumentTypeBodySchema,
)

export type EditDocumentTypeBodySchema = z.infer<
  typeof editDocumentTypeBodySchema
>
