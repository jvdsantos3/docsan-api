import z from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'

const resetPasswordBodySchema = z.object({
  token: z.string(),
  newPassword: z
    .string()
    .min(8, { message: 'A senha deve ter pelo menos 8 caracteres' })
    .regex(/[A-Z]/, {
      message: 'A senha deve conter pelo menos uma letra maiúscula',
    })
    .regex(/[!@#$%^&*(),.?":{}|<>]/, {
      message: 'A senha deve conter pelo menos um caractere especial',
    }),
})

export type ResetPasswordBodySchema = z.infer<typeof resetPasswordBodySchema>

export const resetPasswordValidationPipe = new ZodValidationPipe(
  resetPasswordBodySchema,
)
