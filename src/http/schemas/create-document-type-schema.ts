import z from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'

const createDocumentTypeBodySchema = z.object({
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

export const createDocumentTypeValidationPipe = new ZodValidationPipe(
  createDocumentTypeBodySchema,
)

export type CreateDocumentTypeBodySchema = z.infer<
  typeof createDocumentTypeBodySchema
>

const createDocumentTypeParamsSchema = z.object({
  companyId: z.string(),
})

export type CreateDocumentTypeParamsSchema = z.infer<
  typeof createDocumentTypeParamsSchema
>

export const createDocumentTypeParamsValidationPipe = new ZodValidationPipe(
  createDocumentTypeParamsSchema,
)
