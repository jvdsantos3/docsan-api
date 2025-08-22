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
    .enum(['name', 'isActive', 'isHighlighted', 'status', 'createdAt'])
    .optional(),
  status: z.boolean().optional(),
  highlight: z.boolean().optional(),
  filter: z.string().optional(),
})

export const fetchServiceValidationPipe = new ZodValidationPipe(
  fetchServiceQuerySchema,
)

export type FetchServiceQuerySchema = z.infer<typeof fetchServiceQuerySchema>
