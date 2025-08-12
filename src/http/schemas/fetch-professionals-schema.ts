import z from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'

const fetchProfessionalsQuerySchema = z.object({
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
  orderBy: z.enum(['name', 'cpf', 'status', 'email', 'createdAt']).optional(),
  status: z.enum(['APPROVED', 'REJECTED', 'PENDING', 'BANNED']).optional(),
  filter: z.string().optional(),
})

export const fetchProfessionalsQueryValidationPipe =
  new ZodValidationPipe(fetchProfessionalsQuerySchema)

export type FetchProfessionalsQuerySchema = z.infer<
  typeof fetchProfessionalsQuerySchema
>
