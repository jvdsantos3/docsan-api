import z from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'

const createDocumentParamsSchema = z.object({
  companyId: z.string(),
})

export type CreateDocumentParamsSchema = z.infer<
  typeof createDocumentParamsSchema
>

export const createDocumentParamsValidationPipe = new ZodValidationPipe(
  createDocumentParamsSchema,
)

const createDocumentBodySchema = z.object({
  documentTypeId: z.string(),
  fields: z
    .string()
    .transform((val) => {
      const parsed = JSON.parse(val)
      if (!Array.isArray(parsed)) {
        throw new Error('Fields must be a JSON array')
      }
      return parsed
    })
    .pipe(
      z
        .array(
          z.object({
            name: z.string(),
            value: z.string(),
          }),
        )
        .nonempty(),
    ),
})

export const createDocumentBodyValidationPipe = new ZodValidationPipe(
  createDocumentBodySchema,
)

export type CreateDocumentBodySchema = z.infer<typeof createDocumentBodySchema>
