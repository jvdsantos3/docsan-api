import { z } from 'zod'
import { ZodValidationPipe } from '@/http/pipes/zod-validation-pipe'

const fetchServiceQuerySchema = z.object({
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
    .enum(['name', 'isActive', 'isHighlighted', 'createdAt'])
    .optional(),
  status: z.preprocess((val) => {
    if (val === 'true') return true
    if (val === 'false') return false
    return val
  }, z.boolean().optional()),
  highlight: z.preprocess((val) => {
    if (val === 'true') return true
    if (val === 'false') return false
    return val
  }, z.boolean().optional()),
  filter: z.string().optional(),
})

export const fetchServiceValidationPipe = new ZodValidationPipe(
  fetchServiceQuerySchema,
)

export type FetchServiceQuerySchema = z.infer<typeof fetchServiceQuerySchema>
