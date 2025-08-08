import z from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'

const getCnaeParamsSchema = z.object({
  cnaeId: z.string(),
})

export type GetCnaeParamsSchema = z.infer<
  typeof getCnaeParamsSchema
>

export const getCnaeParamsValidationPipe = new ZodValidationPipe(
  getCnaeParamsSchema,
)
