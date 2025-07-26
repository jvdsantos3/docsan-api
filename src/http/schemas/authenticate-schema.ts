import z from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'

const authenticateBodySchema = z.object({
  email: z.string().email(),
  password: z.string(),
})

export type AuthenticateBodySchema = z.infer<typeof authenticateBodySchema>

export function authenticateValidationPipe() {
  return new ZodValidationPipe(authenticateBodySchema)
}
