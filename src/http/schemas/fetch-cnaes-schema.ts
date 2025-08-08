import z from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'

const FetchCnaesQuerySchema = z.object({
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
  filter: z.string().optional(),
})

export const FetchCnaesQueryValidationPipe = new ZodValidationPipe(
  FetchCnaesQuerySchema,
)

export type FetchCnaesQuerySchema = z.infer<
  typeof FetchCnaesQuerySchema
>