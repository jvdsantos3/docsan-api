import z from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'

const FetchBranchesActivityQuerySchema = z.object({
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

export const FetchBranchesActivityQueryValidationPipe = new ZodValidationPipe(
  FetchBranchesActivityQuerySchema,
)

export type FetchBranchesActivityQuerySchema = z.infer<
  typeof FetchBranchesActivityQuerySchema
>