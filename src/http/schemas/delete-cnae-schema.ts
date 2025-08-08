import z from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'

const deleteCnaeParamsSchema = z.object({
  cnaeId: z.string(),
})

export type DeleteCnaeParamsSchema = z.infer<
  typeof deleteCnaeParamsSchema
>

export const deleteCnaeParamsValidationPipe = new ZodValidationPipe(
  deleteCnaeParamsSchema,
)
