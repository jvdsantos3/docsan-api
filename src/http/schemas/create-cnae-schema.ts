import z from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'

const createCnaeBodySchema = z.object({
  code: z.string(),
  description: z.string(),
})

export const createCnaeValidationPipe = new ZodValidationPipe(
  createCnaeBodySchema,
)

export type CreateCnaeBodySchema = z.infer<
  typeof createCnaeBodySchema
>
