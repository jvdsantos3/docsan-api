import z from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'

const fetchDocumentsParamsSchema = z.object({
  companyId: z.string(),
})

export type FetchDocumentsParamsSchema = z.infer<
  typeof fetchDocumentsParamsSchema
>

export const fetchDocumentsParamValidationPipe = new ZodValidationPipe(
  fetchDocumentsParamsSchema,
)

const fetchDocumentsQuerySchema = z.object({
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
  orderBy: z
    .enum(['name', 'type', 'status', 'duedate', 'createdAt'])
    .optional(),
  type: z.string().optional(),
  status: z.enum(['inDay', 'near', 'won']).optional(),
  filter: z.string().optional(),
})

export const fetchDocumentsQueryValidationPipe = new ZodValidationPipe(fetchDocumentsQuerySchema)

export type FetchDocumentsQuerySchema = z.infer<typeof fetchDocumentsQuerySchema>
