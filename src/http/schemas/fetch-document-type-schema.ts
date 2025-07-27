import z from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'

const fetchDocumentTypesQuerySchema = z.object({
  page: z
    .string()
    .optional()
    .default('1')
    .transform(Number)
    .pipe(z.number().min(1)),
  limit: z
    .string()
    .optional()
    .default('15')
    .transform(Number)
    .pipe(z.number().min(1)),
  order: z.enum(['desc', 'asc']).optional(),
  active: z.preprocess((val) => {
    if (val === 'true') return true
    if (val === 'false') return false
    return val
  }, z.boolean().optional()),
  filter: z.string().optional(),
})

export const FetchDocumentTypesQueryValidationPipe = new ZodValidationPipe(
  fetchDocumentTypesQuerySchema,
)

export type FetchDocumentTypesQuerySchema = z.infer<
  typeof fetchDocumentTypesQuerySchema
>

const fetchDocumentTypesParamSchema = z.object({
  companyId: z.string(),
})

export type FetchDocumentTypesParamSchema = z.infer<
  typeof fetchDocumentTypesParamSchema
>

export const fetchDocumentTypesParamsValidationPipe = new ZodValidationPipe(
  fetchDocumentTypesParamSchema,
)
