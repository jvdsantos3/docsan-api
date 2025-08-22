import z from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'

const createServiceBodySchema = z.object({
  name: z.string(),
  summary: z.string(),
  description: z.string(),
})

export const createServiceValidationPipe = new ZodValidationPipe(
  createServiceBodySchema,
)

export type CreateServiceBodySchema = z.infer<typeof createServiceBodySchema>
