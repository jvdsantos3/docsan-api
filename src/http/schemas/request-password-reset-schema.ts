import z from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'

const requestPassowordResetBodySchema = z.object({
  email: z.string().email(),
})

export type RequestPasswordResetBodySchema = z.infer<
  typeof requestPassowordResetBodySchema
>

export const requestPassowordResetValidationPipe = new ZodValidationPipe(
  requestPassowordResetBodySchema,
)
