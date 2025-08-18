import z from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'

const authenticateGoogleBodySchema = z.object({
  token: z.string(),
})

export type AuthenticateGoogleBodySchema = z.infer<typeof authenticateGoogleBodySchema>

export const authenticateGoogleValidationPipe = new ZodValidationPipe(
  authenticateGoogleBodySchema,
)
